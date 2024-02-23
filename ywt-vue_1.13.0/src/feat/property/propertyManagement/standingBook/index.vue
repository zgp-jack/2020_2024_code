<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 15:48:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 17:41:44
 * @Description:台账管理
-->
<template>
  <el-container class="no-padding-right">
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right space-between">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <input ref="inputFile" type="file" style="display:none" @change="changeSelectFile">

            <div>
              <pure-button type="wire-frame" label="资产导出" @click="onAssetExport" />
              <pure-button type="wire-frame" label="下载导入模版" @click="onDownTempalte" />
              <pure-button type="wire-frame" label="资产导入" @click="onAssetImport" />

              <pure-button label="资产登记" @click="onCreateAsset" />
              <pure-button label="打印" @click="onPrintQrCode" />

            </div>
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              border
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              selection
              @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" align="left" />
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
                fixed
              />
              <el-table-column
                v-for="(item,index) in tableHeader"
                :key="index"
                :label="item.name"
                :prop="item.prop"
                align="left"
                width="140px"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <span v-if="item.prop === 'patrolTemp'">
                    {{ convertInspectionTemId(row[item.prop]) }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="177" fixed="right">
                <template slot-scope="{row}">
                  <el-button
                    size="mini"
                    type="text"
                    @click="onViewAsset(row.id)"
                  >查看</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="onUpdateAsset(row.id)"
                  >编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>
    </el-main>
    <el-aside style="width:288px;height:100%" class="right-side">
      <el-tabs type="border-card">
        <el-tab-pane label="资产类型">
          <tree-dic-tree dic-key="assetsType" @node-click="onAssetTypeNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="使用科室">
          <department-tree @node-click="onDepartmentNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="巡检单元">
          <pure-inspection-unit-tree ref="unitTree" @node-click="onInspectUnitNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>
<script>
import StandingBookApi from './api';
import AssetInfoDrawer from './drawer/asset.vue';
import InspectionTemplateApi from '@/apis/inspection/template';
import {
  find,
} from 'lodash';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import PaginationTable from '@/minxins/common/paginationTable';
import PrintDialog from '@/feat/property/propertyManagement/standingBook/dialog/print.vue';
import TreeDicTree from '@/feat/system/dictionary/tree/component/treeDicTree';
import DepartmentTree from '@/feat/system/department/component/departmentTree';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'ZcZcglTzgl',
  components: {
    TreeDicTree,
    DepartmentTree,
    PureInspectionUnitTree: () => import('@/views/components/inspection/unitTree.vue'),
  },
  mixins: [PaginationTable],
  data() {
    return {
      tableHeader: [],
      inspectionTemplateList: [],
      maintainPopoverVisible: false,
      meteringPopoverVisible: false,
      listApi: StandingBookApi.list,
      popoverFormData: {
        month: 0,
      },
      popoverFormRule: {
        month: [{
          required: true, message: '请输入临期月数', trigger: 'blur',
        }],
      },
      multipleSelection: [],
    };
  },

  async created() {
    this.$store.dispatch('property/UPDATE_MANUFACTURER_LIST');
    this.queryCondition.maintainMonth = this.getMaintainMonth();
    this.queryCondition.meteringMonth = this.getMeteringMonth();
    this.tableHeader = this.$store.state['property/propertyManagement'].ledgerTableColumn;
    this.inspectionTemplateList = await InspectionTemplateApi.tempListForSelect();
    await this.fetchData();
  },
  methods: {
    // 资产导出
    async onAssetExport() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择导出资产');
        return;
      }
      const assetIds = this.multipleSelection.map(item => item.id);
      const ids = assetIds.toString();
      const res = await StandingBookApi.assetsExport(ids);
      const fileName = `资产文件-${this.$options.filters.date(Date.now(), 'YYYY-MM-DD')}.xlsx`;
      downLoadFile(res, fileName);
    },
    // 下载导入模版
    async onDownTempalte() {
      const res = await StandingBookApi.assetsExcelTemplate();
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(res);
      link.download = '资产导入模版.zip';
      link.click();
    },
    // 资产导入
    async onAssetImport() {
      this.$refs.inputFile.click();
    },
    // 监听文件选择
    async changeSelectFile(event) {
      const { files, } = event.srcElement;
      if (files.length) {
        // 判断上传文件的后缀是否是 xlsx类型
        const file = files[0];
        const isExcel = /\.(xlsx|xls|csv)$/.test(file.name);
        if (isExcel) {
          await StandingBookApi.assetsImport(file);
          this.$message.success('上传成功');
          await this.fetchData();
        } else {
          this.$message.error('上传文件类型错误,仅支持【xlsx,xls,csv】类型文件');
        }
      }
    },

    /**
     * 更新资产
     * @param {Number} assetId 资产Id
     */
    async onUpdateAsset(assetId) {
      this.$drawer({
        width: '87.917%',
        component: () => <AssetInfoDrawer
          operatorType='UPDATE'
          id={assetId}
          onDone={this.onPerformedOpertion}
        />,
      });
    },
    /**
     * 查看资产
     * @param {Number} assetId 资产Id
     */
    async onViewAsset(assetId) {
      this.$drawer({
        width: '87.917%',
        component: () => <AssetInfoDrawer
          operatorType='VIEW'
          id={assetId}
        />,
      });
    },
    /**
     * 登记资产
     */
    async onCreateAsset() {
      this.$drawer({
        width: '1688px',
        component: () => <AssetInfoDrawer
          operatorType='CREATE'
          onDone={this.onPerformedOpertion}
        />,
      });
    },
    // 获取维保临期
    getMaintainMonth() {
      return getJSON(`${this.name}-maintainMonth`) || null;
    },
    // 设置维保临期
    setMaintainMonth(value) {
      this.queryCondition.maintainMonth = value;
      setJSON(`${this.name}-maintainMonth`, value);
    },
    // 获取计量临期
    getMeteringMonth() {
      return getJSON(`${this.name}-meteringMonth`) || null;
    },
    // 设置计量临期
    setMeteringMonth(value) {
      this.queryCondition.meteringMonth = value;
      setJSON(`${this.name}-meteringMonth`, value);
    },
    // 修改计量临期
    async handleUpdateMetering() {
      try {
        await this.$refs.meteringPopoverForm.validate();
        this.setMeteringMonth(this.popoverFormData.month);
        this.meteringPopoverVisible = false;
        this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 修改维保临期
    async handleUpdateMaintain() {
      try {
        await this.$refs.meteringPopoverForm.validate();
        this.setMaintainMonth(this.popoverFormData.month);
        this.maintainPopoverVisible = false;
        this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 打开维保临期修改弹窗时处理
    async handleMaintainPopoverShow() {
      this.popoverFormData.month = this.queryCondition.maintainMonth;
    },
    // 打开计量临期修改弹窗时处理
    async handleMeteringPopoverShow() {
      this.popoverFormData.month = this.queryCondition.meteringMonth;
    },
    // 巡检模板id转名字
    convertInspectionTemId(id) {
      return find(this.inspectionTemplateList, { id, })?.name;
    },
    onSelectionChange(val) {
      this.multipleSelection = val;
    },
    onPrintQrCode() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要打印的资产',
        });
        return;
      }
      const assetIds = this.multipleSelection.map(item => item.id);
      this.$dialog({
        title: '资产二维码',
        component: () => <PrintDialog ids={assetIds}/>,
      });
    },
    resetQueryCondition() {
      this.currentPage = 0;
      this.queryCondition.pageNum = 0;
      this.queryCondition.assetsType = null;
      this.queryCondition.deptId = null;
      this.queryCondition.pertainUnit = null;
    },
    onAssetTypeNodeClick(node) {
      this.resetQueryCondition();
      this.queryCondition.assetsType = node.id;
      this.fetchData();
    },
    onDepartmentNodeClick(deptId) {
      this.resetQueryCondition();
      this.queryCondition.deptId = deptId;
      this.fetchData();
    },
    onInspectUnitNodeClick(node) {
      this.resetQueryCondition();
      this.queryCondition.pertainUnit = node.id;
      this.fetchData();
    },
  },

};
</script>

<style lang="scss" scoped>
.right-side {
  ::v-deep .el-tabs {
    height:100%;
    border: unset;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      flex: 1;
      overflow:scroll;
      padding: unset;
      margin: 5px;
      margin-left: 24px;
      &::-webkit-scrollbar{
        width:6px;
        height:50%;
      }
      &::-webkit-scrollbar-thumb{
        background-color: #DEE2EE;
        border-radius: 3px;
      }
    }
  }
}
</style>
