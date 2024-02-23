/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description  资产-资产管理-台账管理
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <hyy-view-layout aside-width="340px">
    <template #aside>
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="资产类型"
          name="1"
        >
          <dic-tree
            dic-key="ast_asset_type"
            @node-click="clickTree($event,'assetsType')"
          />
        </el-tab-pane>
        <el-tab-pane
          label="使用科室"
          name="0"
        >
          <dept-tree
            @node-click="clickTree($event,'useDept')"
          />
        </el-tab-pane>
        <el-tab-pane
          label="巡检单元"
          name="2"
        >
          <dic-tree
            dic-key="ins_unit_directory"
            @node-click="clickTree($event,'pertainUnit')"
          />
        </el-tab-pane>

      </el-tabs>
    </template>

    <template #header>
      <query-panel
        @query="onQuery"
        @reset="OnReset"
      >
        <template #otherButton>
          <pure-button
            label="导出"
            :disabled="exportButtonDisabled"
            @click="onExport"
          />
        </template>
        <el-form-item>
          <el-input
            v-model="queryData.keyword"
            placeholder="资产名称/规格型号/编号"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.useState"
            placeholder="剩余年限"
            clearable
          >
            <el-option
              :value="0"
              label="正常"
            />
            <el-option
              :value="1"
              label="到期"
            />

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="queryData.meteringState"
            clearable
            placeholder="保养周期"
          >
            <el-option
              :value="0"
              label="正常"
            />
            <el-option
              :value="1"
              label="到期"
            />

          </el-select>
        </el-form-item>
        <el-form-item>
          <dic-select
            v-model="queryData.equipmentState"
            dic-key="ast_asset_state"
            placeholder="设备状态"
          />
        </el-form-item>
        <template #right>
          <el-dropdown
            @command=" handleCommand"
          >

            <pure-button
              icon="arrow-down"
              icon-position="right"
              label="添加资产"
            />

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="single">单个资产登记</el-dropdown-item>
              <el-dropdown-item command="multiple">多个资产登记</el-dropdown-item>
              <el-dropdown-item command="import">导入资产</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template #extra>
          <pure-button :type="'patch'" :disabled="!selectionValues.length" @click="onDel">
            删除
          </pure-button>
          <pure-button :type="'minor'" :disabled="!selectionValues.length" @click="onPrint">
            打印
          </pure-button>
        </template>
      </query-panel>
    </template>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryData"
      selection
      @selection-change="selectionChange"
    >
      <template #indexColumn>
        序号
      </template>
      <el-table-column
        label="名称"
        prop="name"
      >
        <template #default="{row}">
          <pure-button
            :label="row.name"
            type="text"
            @click="onDetail(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="规格型号"
        prop="model"
      />
      <el-table-column
        label="编号"
        prop="assetsCode"
      />
      <el-table-column
        label="剩余年限"
        prop="useOverDate"
      >
        <template #default="{row}">
          <el-tag :type="row.useOverDate | diffTime | setDayLabel | getObjAttr('type')">
            {{ row.useOverDate | diffTime | setDayLabel | getObjAttr('label') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="保养周期"
        prop="nextMeteringDate"
      >
        <template #default="{row}">
          <el-tag :type="row.nextMeteringDate | diffTime | setDayLabel | getObjAttr('type')">
            {{ row.nextMeteringDate | diffTime | setMaintainStatus | getObjAttr('label') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="equipmentStateToName"
      >
        <template #default="{row}">
          <pure-type-text
            :config="stateConfig"
            :type="row.equipmentState"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop=""
      >
        <template #default="{row}">
          <pure-button
            label="编辑"
            type="text"
            @click="onEdit(row)"
          />
        </template>
      </el-table-column>

    </pure-table>

  </hyy-view-layout>

</template>
<script>
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import DeptTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import PureButton from '@/common/components/button/index.vue';
import DrawerAddAsset from './drawer/addAsset.vue';
import DrawerDetailAsset from './drawer/detailAsset.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import LedgerManagementApi from './api';
import { GRAY_COLOR, STATUS_SUCCESS_COLOR, } from '@/common/utils/color';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import DialogUpload from '@/common/components/dialog/upload.vue';
import { downloadFile, } from '@/common/utils/download';
import DialogPrint from './dialog/print.vue';
import { map, } from 'lodash-es';
export default {
  components: {
    PureButton,
    QueryPanel,
    DicTree,
    DeptTree,
    DicSelect,
  },
  data() {
    return {
      exportButtonDisabled: false,
      activeName: '1',
      listApi: LedgerManagementApi.getAssetList,
      oldType: '',
      selectionValues: [],
      queryData: {
        // 资产类型
        assetsType: '',
        // 设备状态
        equipmentState: '',
        // 关键字
        keyword: '',
        // 保养周期状态 0正常 1待保养
        meteringState: '',
        // 巡检单元
        pertainUnit: '',
        // 使用科室
        useDept: '',
        // 剩余年限状态 0正常 1到期
        useState: '',
      },
    };
  },
  computed: {
    stateConfig() {
      return {
        '1': {
          label: '正常',
          color: STATUS_SUCCESS_COLOR,
        },
        '2': {
          label: '报废',
          color: GRAY_COLOR,
        },
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    onDel() {
      if (this.selectionValues.length === 0) {
        this.$notify.error('请选择要删除的资产');
        return;
      }
      this.$confirm('是否删除所选资产', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          const ids = map(this.selectionValues, 'id');
          await LedgerManagementApi.deleteAsset(ids);
          this.init();
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch(() => {});
    },
    selectionChange(val) {
      this.selectionValues = val;
    },
    // 打印
    onPrint() {
      if (this.selectionValues.length === 0) {
        this.$notify.error('请选择要打印的资产');
        return;
      }
      const assetIds = this.selectionValues.map(item => item.id);
      this.$dialog({
        component: () => <DialogPrint ids={assetIds}/>,
      });
    },
    OnReset() {
      this.queryData = {
        // 资产类型
        assetsType: '',
        // 设备状态
        equipmentState: '',
        // 关键字
        keyword: '',
        // 保养周期状态 0正常 1待保养
        meteringState: '',
        // 巡检单元
        pertainUnit: '',
        // 使用科室
        useDept: '',
        // 剩余年限状态 0正常 1到期
        useState: '',
      };
      this.$nextTick(() => {
        this.init();
      });
    },
    onQuery() {
      this.init();
    },
    handleClick() {

    },
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    // 详情
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(816),
        component: () => <DrawerDetailAsset data={row}
        />,
      });
    },
    // 单个资产登记
    openSingle() {
      this.$drawer({
        width: pxToPercentage(816),
        component: () => <DrawerAddAsset onDone={this.init}
        />,
      });
    },
    //  点击下拉菜单
    handleCommand(command) {
      if (command === 'single') {
        this.openSingle();
      } else if (command === 'multiple') {
        this.openMultiple();
      } else {
        this.importDataTemplate();
      }
    },
    // 导入
    importDataTemplate() {
      this.$dialog({
        width: pxToPercentage(816),
        component: () => <DialogUpload title={'导入资产'} downloadTemplateApi={LedgerManagementApi.downloadAssetTemplate}
          importApi={LedgerManagementApi.importAsset}
          onDone={this.init}
        />,
      });
    },
    //   多个资产登记
    openMultiple() {
      this.$drawer({
        width: pxToPercentage(816),
        component: () => <DrawerAddAsset isMultiple={true}
          onDone={this.init}
        />,
      });
    },
    //   编辑
    onEdit(row) {
      this.$drawer({
        width: pxToPercentage(816),
        component: () => <DrawerAddAsset data={row}
          onDone={this.init}
        />,
      });
    },
    //   导出
    async   onExport() {
      try {
        this.exportButtonDisabled = true;
        const res = await LedgerManagementApi.assetExport(this.queryData);
        downloadFile(res, '台账管理导出.xlsx');
      } catch (err) {
        this.$notify.error(err);
      } finally {
        this.exportButtonDisabled = false;
      }
    },
    //   点击树状
    clickTree(node, type) {
      console.log(node);
      if (type) {
        this.queryData[this.oldType] = '';
        this.queryData[type] = node?.dictValue || node?.deptId || '';
        this.init();
        this.oldType = type;
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>
::v-deep .el-tabs__item {
  border-color: #DDE9E8 !important;
  background-color: #f0f7f7;

}

::v-deep .is-active {
  background-color: #fff !important;

}

.aside {
  padding: 16px;
  box-shadow: inset -1px 0px 0 #F0F7F7;
}

.main {
  background-color: #fff;
  padding: 0 16px;
}
</style>
