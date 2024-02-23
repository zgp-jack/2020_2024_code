<template>
  <hyy-view-layout>
    <template #aside>
      <el-tabs
        v-model="currentTab"
        type="card"
        @tab-click="tabChange"
      >
        <el-tab-pane
          label="资产类型"
          name="0"
        >
          <dic-tree
            dic-key="ast_asset_type"
            @node-click="astNodeClick"
          />
        </el-tab-pane>

        <el-tab-pane
          label="巡检单元"
          name="1"
        >
          <dic-tree
            dic-key="ins_unit_directory"
            @node-click="unitNodeClick"
          />

        </el-tab-pane>
      </el-tabs>
    </template>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onReset"
      >
        <el-form-item>
          <el-input
            v-model="queryData.keyword"
            :placeholder="placeholder"
            prefix-icon="el-icon-search"
          />

        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.planStatus"
            placeholder="巡检计划状态"
          >
            <el-option
              disabled
              label="请选择"
              value=""
            />
            <el-option
              v-for="item in inspectionPlanStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.state"
            />
          </el-select>
        </el-form-item>
        <template #right>
          <pure-button
            icon="add"
            label="添加巡检计划"
            type="special"
            @click="onAdd"
          />

        </template>
      </query-panel>
    </template>
    <pure-table
      ref="pureTable"
      :current-row-key="currentTab"
      :list-api="listApi"
      :query-condition="queryData"
      :row-key="currentTab"
      height="100%"
    >
      <template #indexColumn>
        序号
      </template>

      <el-table-column
        v-for="item in tableColumn "
        :key="item.prop"
        :column-key="item.prop"
        :label="item.label "
        :prop="item.prop"
        :width="item.width"
      >

        <template
          v-if="item.prop==='planStatus' || item.prop==='unitName' || item.prop==='name'"
          #default="{row}"
        >
          <template v-if="item.prop === 'unitName'">
            <pure-button
              type="text"
              @click="onDetails(row)"
            >
              {{ row.unitName }}
            </pure-button>

          </template>
          <template v-if="item.prop === 'name'">
            <pure-button
              type="text"
              @click="onDetails(row)"
            >
              {{ row.name }}
            </pure-button>
          </template>
          <template v-if="item.prop === 'planStatus'">
            <pure-type-text
              :config="INSPECTION_PLAN_STATUS_MAP"
              :type="row.planStatus"
            />

          </template>
        </template>

      </el-table-column>
      <template #operationColumn="{row}">
        <template v-if="row.planStatus ===4 ">
          <pure-button
            type="text"

            @click="onConfig(row)"
          >去配置
          </pure-button>

        </template>
        <template v-if="row.planStatus ===3">
          <pure-button
            type="text"

            @click="onEdit(row)"
          >去配置
          </pure-button>

        </template>
        <template v-if="row.planStatus ===2">
          <pure-button
            type="text"

            @click="onEdit(row)"
          >编辑
          </pure-button>

          <pure-button
            type="text"

            @click="onChangeStatus(row)"
          >启用
          </pure-button>

        </template>
        <template v-if="row.planStatus ===1">
          <pure-button
            type="text"
            @click="onEdit(row)"
          >编辑
          </pure-button>

          <pure-button
            type="text"

            @click="onChangeStatus(row)"
          >停用
          </pure-button>

        </template>
      </template>
    </pure-table>
    <custom-drawer
      :title="detailsTitle"
      :visible.sync="showDetailsDialog"
      :wrapper-closable="true"
      size="45%"
    >
      <CompDetails
        ref="compDetailsRef"
        :current-data="detailsData"
      />
    </custom-drawer>
    <custom-drawer
      :title="dialogTitle"
      :visible.sync="showAddEditDialog"
      :wrapper-closable="false"
      size="45%"
      @closed="onDialogClosed"
    >
      <CompAddEdit
        ref="compAddEditRef"
        :current-data="currentData"
        :current-tab="currentTab"
        :operate-type="operateType"
      />
      <template v-slot:footer>
        <div>
          <pure-button
            label="保存"
            @click="onSave"
          />
          <pure-button
            v-if="operateType === 'add'"
            label="保存并继续新增"
            type="major"
            @click="onSaveThenAdd"
          />
          <pure-button
            label="取消"
            type="patch"
            @click="onCancel"
          />
        </div>
      </template>
    </custom-drawer>
  </hyy-view-layout>

</template>

<script>
import CompAddEdit from './components/add-edit.vue';
import PlanApi from './api';
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import pageMixin from '@/mixins/page';
import CompDetails from './components/details.vue';
import HyyViewLayout from '@/common/layout/viewLayout.vue';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import PureButton from '@/common/components/button/index.vue';
import { INSPECTION_PLAN_STATUS, INSPECTION_PLAN_STATUS_MAP, } from '@/features/inspection/inspection.config';

export default {
  components: {
    PureButton,
    QueryPanel,
    HyyViewLayout,
    CompDetails,
    DicTree,
    CompAddEdit,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      INSPECTION_PLAN_STATUS_MAP,
      inspectionPlanStatusList: INSPECTION_PLAN_STATUS,
      selection: true,
      currentTab: '0', // 选项卡
      tableColumn: [], // 表头
      placeholder: '资产名称/资产编号',
      listApi: PlanApi.planAstList,
      queryData: {},
      planAstColumn: [
        {
          label: '资产名称',
          prop: 'name',
        },
        {
          label: '资产编号',
          prop: 'assetsCode',
          width: 200,
        },
        {
          label: '规格型号',
          prop: 'model',
          width: 120,
        },
        {
          label: '巡检周期',
          prop: 'inspectionCycleName',
          width: 100,
        },
        {
          label: '生效日期',
          prop: 'effectiveStartDate',
          width: 120,
        },
        {
          label: '失效日期',
          prop: 'effectiveEndDate',
          width: 120,
        },
        {
          label: '巡检计划状态',
          prop: 'planStatus',
          width: 140,
        },
      ],
      planUnitColumn: [
        {
          label: '单元名称',
          prop: 'unitName',
        },
        {
          label: '单元编号',
          prop: 'unitCode',
          width: 200,
        },
        {
          label: '巡检周期',
          prop: 'inspectionCycleName',
          width: 100,
        },
        {
          label: '生效日期',
          prop: 'effectiveStartDate',
          width: 120,
        },
        {
          label: '失效日期',
          prop: 'effectiveEndDate',
          width: 120,
        },
        {
          label: '巡检计划状态',
          prop: 'planStatus',
          width: 140,
        },
      ],
      config: {
        children: 'children',
        label: 'dictLabel',
        id: 'id',
      },
      assetsType: '', // 资产类型
      directory: '', // 单元目录
      activeValue: 1,
      inactiveValue: 0,
      tableData: [],
      checkedNum: 0,
      allChecked: false,
      allCheckedIndeterminate: false,
      operateType: 'add',
      showAddEditDialog: false,
      currentData: {},
      detailsData: {},
      detailsTitle: '查看',
      showDetailsDialog: false,
      loading: false,
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '添加巡检计划',
        edit: '编辑巡检计划',
        config: '配置巡检计划',
      };
      return titles[this.operateType];
    },
  },
  mounted() {
    this.tableColumn = this.planAstColumn;
    this.$nextTick(() => {
      this.$refs.pureTable.beforeFetchData = this.beforeFetchData;
      this.init();
    });
  },
  created() {
  },
  methods: {
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    beforeFetchData() {
      if (this.currentTab === '0') {
        this.listApi = PlanApi.planAstList;
      } else {
        // 巡检单元
        this.listApi = PlanApi.planUnitList;
      }
    },
    tabChange(tab) {
      const tabIndex = tab.name;
      if (tabIndex === '0') {
        this.placeholder = '资产名称/资产编号';
        this.tableColumn = this.planAstColumn;
      } else {
        this.placeholder = '单元名称/单元编号';
        this.tableColumn = this.planUnitColumn;
      }
      this.$refs.pureTable.fetchData(1);
    },
    /* 资产节点点击 */
    astNodeClick(row) {
      this.queryData.assetsType = row.dictValue;
      this.onQuery();
    },
    /* 单元节点点击 */
    unitNodeClick(row) {
      this.queryData.directory = row.dictValue;
      this.onQuery();
    },
    /* 查询 */
    onQuery() {
      this.init();
    },
    /* 重置 */
    onReset() {
      this.queryData = {};
      this.init();
    },
    /* 详情 */
    onDetails(data) {
      if (data.planId) {
        PlanApi.getInfo(data.planId).then((res) => {
          const resData = res.data;
          this.detailsData = {
            ...resData,
          };
          this.showDetailsDialog = true;
        });
      } else {
        this.$message.error('未配置巡检计划');
      }
    },
    /* 添加计划 */
    onAdd() {
      this.operateType = 'add';
      this.currentData = {
        currentTab: this.currentTab,
        uploadPhoto: false,
        isEnable: true,
      };
      this.showAddEditDialog = true;
    },
    /* 去配置 */
    onConfig(data) {
      this.operateType = 'config';
      this.currentData = {
        currentTab: this.currentTab,
        businessId: data.id,
        uploadPhoto: false,
        isEnable: true,
      };
      this.showAddEditDialog = true;
    },
    onEdit(data) {
      this.operateType = 'edit';
      if (data.planId) {
        PlanApi.getInfo(data.planId).then((res) => {
          const resData = res.data;
          this.currentData = {
            currentTab: this.currentTab,
            ...resData,
          };
        });
      }
      this.showAddEditDialog = true;
    },
    onCancel() {
      this.showAddEditDialog = false;
    },
    onDialogClosed() {
      this.$refs.compAddEditRef.reset();
    },
    /* 修改启用停用 */
    onChangeStatus(data) {
      const { planId, isEnable, } = data;
      const newStatus = isEnable === true ? 0 : 1;
      const params = {
        id: planId,
        isEnable: newStatus,
      };
      PlanApi.editState(params).then(() => {
        this.$message.success('操作成功');
        this.$refs.pureTable.fetchData(1);
      });
    },
    submitData() {
      this.loading = true;
      const { valid, data, } = this.$refs.compAddEditRef.validate();
      if (valid) {
        const request = this.operateType === 'edit' ? PlanApi.editPlan : PlanApi.addPlan;
        request(data).then(() => {
          this.$message.success('操作成功');
          this.$refs.pureTable.fetchData(1);
          if (this.continueAdd) {
            this.$refs.compAddEditRef.reset();
          } else {
            this.showAddEditDialog = false;
          }
        });
      } else {
        this.loading = false;
        this.$message.error('请正确填写');
      }
    },
    /* 保存 */
    onSave() {
      this.continueAdd = false;
      this.submitData();
    },
    /* 保存继续添加 */
    onSaveThenAdd() {
      this.continueAdd = true;
      this.submitData();
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

.row-detail {
  color: #006666;
  cursor: pointer;
}

::v-deep .el-table {
  height: 100%;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  padding: 10px;
  background: #fff;

  .tree {
    flex: 0 0 260px;
    border-right: 1px solid #dde9e8;
  }

  .main-content {
    padding-left: 10px;
    flex: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .top-box {
      flex: none;
      display: flex;
      justify-content: space-between;

      .search-box {
        flex: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;

        .search-item {
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }

      .operate-box {
        flex: none;
        margin-left: 20px;
      }
    }

    .table-box {
      flex: auto;
      overflow: hidden;
      min-height: 100px;

      .operate-btn {
        margin-right: 16px;
        font-size: 14px;
        color: #006666;
        cursor: pointer;

        &.delete {
          color: #ff836b;
        }
      }
    }
  }
}
</style>
