<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 10:18:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-31 11:47:19
 * @Description:模板关联
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right space-between">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <div>
              <pure-button
                v-if="currentFilterTab==='inspUnit'"
                label="新增单元"
                @click="handleAssociatedInspUnit"
              />
              <pure-button
                v-if="currentFilterTab==='inspUnit'"
                label="打印"
                @click="onPrintQrCode"
              />
            </div>

          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              selection
              @selection-change="onSelectionChange"
            >
              <el-table-column
                v-if="currentFilterTab==='inspUnit'"
                key="selection"
                type="selection"
                align="left"
              />
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
                fixed
              />
              <el-table-column
                v-for="(item,index) in columnConfig"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :width="item.width"
                :fixed="item.fixed"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <span v-if="item.prop === 'isInspection'">
                    {{ row[item.prop]?'是':'否' }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" fixed="right" width="200px">

                <template v-if="currentFilterTab==='propType'" #default="{row}">
                  <el-button
                    v-if="row.bindId"
                    size="medium"
                    type="text"
                    @click="handleViewAssociatedProperty(row)"
                  >查看</el-button>
                  <el-button
                    v-if="row.bindId"
                    size="medium"
                    type="text"
                    @click="handleEditAssociatedProperty(row)"
                  >编辑</el-button>
                  <el-button
                    v-if="!row.bindId"
                    size="medium"
                    type="text"
                    @click="handleAssociatedProperty(row)"
                  >绑定</el-button>

                </template>
                <template v-else #default="{row}">
                  <el-button
                    v-if="row.bindId"
                    size="medium"
                    type="text"
                    @click="handleViewAssociatedInspUnit(row)"
                  >查看</el-button>
                  <el-button
                    v-if="row.bindId"
                    size="medium"
                    type="text"
                    @click="handleEditAssociatedInspUnit(row)"
                  >编辑</el-button>
                  <el-button
                    v-if="!row.bindId"
                    size="medium"
                    type="text"
                    @click="handleInspUnitBindTemp(row)"
                  >绑定</el-button>
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
    <el-aside style="width: 288px; height: 100%" class="right-side">
      <el-tabs v-model="currentFilterTab" type="border-card" @tab-click="handleFilterTabChange">
        <el-tab-pane label="资产类型" name="propType">
          <tree-dic-tree dic-key="assetsType" @node-click="onAssetTypeNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="巡检单元" name="inspUnit">
          <pure-button label="目录维护" type="wire-frame" @click="huanleUnitMaintain" />
          <pure-inspection-unit-tree ref="unitTree" @node-click="handleUnitNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>
<script>
import PaginationTable from '@/minxins/common/paginationTable';
import InspectionTempApi from '@/apis/inspection/template';
import AssociatedProperty from './dialog/associatedProperty.vue';
import UnitMaintain from './dialog/unitMaintain.vue';
import InspectionUnitApi from '@/apis/inspection/unit';
import InspectionUnit from '@/views/components/inspection/inspectionUnit.vue';
import InspUnitBindTemp from './dialog/inspUnitBindTemp.vue';
import PrintDialog from '@/feat/inspection/template/associated/dialog/print.vue';
import TreeDicTree from '@/feat/system/dictionary/tree/component/treeDicTree';
export default {
  name: 'XjXjmbszMbgl',
  components: {
    TreeDicTree,
    PureInspectionUnitTree: () => import('@/views/components/inspection/unitTree.vue'),
  },
  mixins: [PaginationTable],
  data() {
    return {
      // 当前左侧选中tab, 资产类型 propType 巡检单元inspUnit
      currentFilterTab: 'propType',
      frequencyUnitMap: {},
      multipleSelection: [],
      // 资产类型表头
      proTypeColumn: [
        {
          label: '名称',
          prop: 'name',
          fixed: true,
          width: 200,
        }, {
          label: '资产编号',
          prop: 'assetsCode',
          fixed: false,
          width: 200,
        }, {
          label: '资产类型',
          prop: 'assetsTypeToName',
          fixed: false,
          width: 200,
        }, {
          label: '规格型号',
          prop: 'model',
          fixed: false,
          width: 200,
        },
        {
          label: '是否巡检',
          prop: 'isInspection',
          fixed: false,
          width: 100,
        },
        {
          label: '巡检模板',
          prop: 'tempToName',
          fixed: false,
          width: 200,
        },
        {
          label: '制作商',
          prop: 'manufacturerToName',
          fixed: false,
          width: 200,
        }, {
          label: '维护科室',
          prop: 'patrolDeptToName',
          fixed: false,
          width: 200,
        }, {
          label: '使用科室',
          prop: 'useDeptToName',
          fixed: false,
          width: 200,
        }],
      // 巡检单元表头
      inspUnitColumn: [
        {
          label: '名称',
          prop: 'name',
          fixed: true,
          width: 200,

        }, {
          label: '编号',
          prop: 'code',
          fixed: false,
          width: 200,
        }, {
          label: '是否巡检',
          prop: 'isInspection',
          fixed: false,
          width: 100,
        }, {
          label: '巡检模板',
          prop: 'tempToName',
          fixed: false,
          width: 200,

        }, {
          label: '使用科室',
          prop: 'useDeptToName',
          fixed: false,
          width: 200,
        }, {
          label: '使用责任人',
          prop: 'useUserToName',
          fixed: false,
          width: 200,
        }, {
          label: '维护科室',
          prop: 'maintainDeptToName',
          fixed: false,
          width: 200,
        }, {
          label: '维保责任人',
          prop: 'maintainUserToName',
          fixed: false,
          width: 200,
        }],
    };
  },
  computed: {
    columnConfig() {
      let data = [];
      switch (this.currentFilterTab) {
        case 'propType':
          data = [...this.proTypeColumn];
          break;
        case 'inspUnit':
          data = [...this.inspUnitColumn];
          break;
      }
      return data;
    },
    listApi() {
      let api = '';
      if (this.currentFilterTab === 'propType') {
        api = 'relatedListByPropType';
      } else {
        api = 'relatedListByInspUnit';
      }
      return InspectionTempApi[api];
    },
  },

  async created() {
    this.fetchData();
  },
  methods: {

    // 资产设置模板
    async handleAssociatedProperty(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <AssociatedProperty onDone={this.fetchData} propertyId={row.id}/>,
      });
    },
    // 资产关联模板修改
    async handleEditAssociatedProperty(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <AssociatedProperty onDone={this.fetchData} propertyId={row.id} actionType='update' relatedId={row.bindId}/>,
      });
    },
    // 资产关联模板查看
    async handleViewAssociatedProperty(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <AssociatedProperty onDone={this.fetchData} propertyId={row.id} actionType='view' relatedId={row.bindId}/>,
      });
    },
    onAssetTypeNodeClick(node) {
      this.resetQueryCondition();
      this.queryCondition.assetsType = node.id;
      this.fetchData();
    },
    resetQueryCondition() {
      this.currentPage = 0;
      this.queryCondition.pageNum = 0;
      this.queryCondition.assetsType = null;
      this.queryCondition.deptId = null;
      this.queryCondition.pertainUnit = null;
    },
    // 左侧tab切换触发
    handleFilterTabChange(val) {
      this.currentPage = 0;
      this.queryCondition.unit = null;
      this.queryCondition.unitFolder = null;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
    },
    /**
     * 巡检单元
     */
    // 巡检单元绑定巡检模板
    async handleInspUnitBindTemp(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspUnitBindTemp operatorType='CREATE' inspUnitId={row.id} onDone={this.fetchData}/>,
      });
    },
    // 单元目录维护
    async huanleUnitMaintain() {
      this.$drawer({
        width: '580px',
        position: 'right-bottom',
        component: () => <UnitMaintain onDataChange={this.handleUnitDataChange}/>,
      });
    },
    // 对单元维护进行数据变更操作后触发
    async handleUnitDataChange() {
      this.$refs.unitTree.fetchData();
    },
    // 巡检单元设置模板
    async handleAssociatedInspUnit() {
      this.$drawer({
        width: '580px',
        position: 'right-bottom',
        component: () => <InspectionUnit onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    // 巡检单元查看
    async handleViewAssociatedInspUnit(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspUnitBindTemp onDone={this.fetchData} operatorType='VIEW' inspUnitId={row.id}/>,
      });
    },
    // 巡检单元编辑
    async handleEditAssociatedInspUnit(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspUnitBindTemp onDone={this.fetchData} operatorType='UPDATE'inspUnitId={row.id} bindId={row.bindId}/>,
      });
    },
    // 巡检单元删除
    async handleDelAssociatedInspUnit(row) {
      try {
        await InspectionUnitApi.deleleUnit(row.id);
        this.$message({
          type: 'success',
          message: '删除单元成功！',
        });
        this.fetchData();
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 点击左侧巡检单元触发
    async handleUnitNodeClick(nodeData) {
      this.currentPage = 0;
      if (nodeData.isChild) {
        this.queryCondition.unitFolder = null;
        this.queryCondition.unit = nodeData.id;
      } else {
        this.queryCondition.unit = null;
        this.queryCondition.unitFolder = nodeData.id;
      }
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
    },
    onSelectionChange(val) {
      this.multipleSelection = val;
    },
    onPrintQrCode() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要打印的巡检单元',
        });
        return;
      }
      const ids = this.multipleSelection.map(item => item.id);
      this.$dialog({
        title: '巡检单元二维码',
        component: () => <PrintDialog ids={ids}/>,
      });
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
