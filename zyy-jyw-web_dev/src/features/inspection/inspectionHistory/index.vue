<template>
  <el-container class="inspectionHistoryIndex">
    <el-aside
      class="aside"
      width="320"
    >
      <el-tabs
        v-model="currentFilterTab"
        type="card"
        @tab-click="handleFilterTabChange"
      >
        <el-tab-pane
          label="资产类型"
          name="0"
        >
          <dic-tree
            dic-key="ast_asset_type"
            @node-click="handleAssetTypeNodeClick"
          />
        </el-tab-pane>
        <el-tab-pane
          label="科室"
          name="1"
        >

          <department-tree @node-click="handleDeptNodeClick" />
        </el-tab-pane>
        <el-tab-pane
          label="巡检单元"
          name="2"
        >
          <dic-tree
            dic-key="ins_unit_directory"
            @node-click="handleInsUnitClick"
          />

        </el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main class="main">
      <pure-table
        ref="pureTable"
        :current-row-key="currentFilterTab"
        :list-api="listApi"
        :query-condition="queryData"
        :row-key="currentFilterTab"
      >
        <template #header>
          <query-panel
            @query="onQuery"
            @reset="onReset"
          >
            <el-form-item>
              <el-input
                v-model="queryData.keyword"
                :placeholder="placeholder"
              />
            </el-form-item>
            <el-form-item>
              <user-select
                v-model="queryData.inspectUserIdList"
                :multiple="true"
                collapse-tags
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="queryData.result"
                placeholder="巡检结果"
              >
                <el-option
                  v-for="(item,index) in InspectionResult"
                  :key="index"
                  :label="item.label"
                  :value="item.state"
                />

              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryData.inspectionTime"
                end-placeholder="巡检结束时间"
                format="yyyy-MM-dd"
                start-placeholder="巡检开始时间"
                type="daterange"
                value-format="yyyy-MM-dd"
                @change="onInspectionTimeChange"
              />
            </el-form-item>

          </query-panel>
        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          v-for="item in tableColumn "
          :key="item.prop"
          :column-key="item.prop"
          :fixed="item.fixed"
          :formatter="item.formatter"
          :label="item.label "
          :prop="item.prop"
          :width="item.width"
        />

      </pure-table>
    </el-main>

  </el-container>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import InspectionApi from '../api.js';

import { debounce, } from 'lodash-es';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import InspectionDetailPanel from './panel/detail/index.vue';
import {
  INSPECTION_HANDLE_METHOD_MAP,
  INSPECTION_RESULT_MAP,
  INSPECTION_RESULT,
} from '../inspection.config';

export default {
  name: 'InspectionHistory',
  components: {
    QueryPanel,
    DicTree,
    DepartmentTree,
    UserSelect,
  },
  data() {
    return {
      currentFilterTab: '0',
      listApi: InspectionApi.getInspectionRecordAssetsList,
      queryCondition: {},
      placeholder: '请输入资产名称/编号',
      // 资产查询参数
      queryData: {
        // 资产类型
        assetsType: '',

        inspectionTime: [],
        // 单元目录
        directory: null,
        // 巡检结束时间
        inspectionEndTime: '',
        // 巡检开始时间
        inspectionStartTime: '',
        // 巡检人
        inspectUserIdList: [],
        // 关键字
        keyword: '',
        // 巡检结果（1正常 2异常）
        result: null,
        // 使用科室
        useDept: '',
      },
      tableColumn: [],
      // 资产类型和科室表头
      proTypeColumn: [

        {
          label: '资产名称',
          prop: 'name',
          fixed: true,
          width: 200,
        },

        {
          label: '资产编号',
          prop: 'assetsCode',
          fixed: false,
          width: 200,
        }, {
          label: '规格型号',
          prop: 'model',
          fixed: false,
          width: 200,
        }, {
          label: '巡检人',
          prop: 'inspectUserName',
          fixed: false,
          width: 200,
        },
        {
          label: '异常处理办法',
          prop: 'handleMethod',
          fixed: false,
          width: 200,
          formatter: (row) => {
            return INSPECTION_HANDLE_METHOD_MAP[row['handleMethod']]?.label || '-';
          },
        },
        {
          label: '巡检时间',
          prop: 'inspectionTime',
          fixed: false,
          width: 200,
        },
        {
          label: '资产所在位置',
          prop: 'place',
          fixed: false,
          width: 200,
        }, {
          label: '巡检结果',
          prop: 'result',
          fixed: 'right',
          width: 200,
          formatter: (row) => {
            return (<pure-type-text config={INSPECTION_RESULT_MAP}
              type={row.result}
            />);
          },
        },
      ],
      // 巡检单元表头
      inspUnitColumn: [
        {
          label: '单元名称',
          prop: 'unitName',
          fixed: true,
          width: 200,
          formatter: (row) => {
            return (<span onClick={() => this.handleMethodClick(row)}>{row.unitName}</span>);
          },
        },
        {
          label: '编号',
          prop: 'unitCode',
          fixed: false,
          width: 200,

        }, {
          label: '巡检人',
          prop: 'inspectUserName',
          fixed: false,
          width: 200,
        }, {
          label: '异常处理办法',
          prop: 'handleMethod',
          fixed: false,
          width: 200,
          formatter: (row) => {
            return INSPECTION_HANDLE_METHOD_MAP[row['handleMethod']]?.label || '-';
          },
        }, {
          label: '巡检时间',
          prop: 'inspectionTime',
          fixed: false,
          width: 200,
        }, {
          label: '巡检结果',
          prop: 'result',
          fixed: false,
          formatter: (row) => {
            return (<PureTypeText type={row.result}
              config={INSPECTION_RESULT_MAP}
            />);
          },
        },
      ],
    };
  },
  computed: {
    InspectionResult() {
      return INSPECTION_RESULT;
    },
  },
  mounted() {
    this.tableColumn = this.proTypeColumn;
    this.$nextTick(() => {
      this.$refs.pureTable.beforeFetchData = this.beforeFetchData;
      this.init();
    });
  },
  methods: {
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    //  点击行
    async handleMethodClick(row) {
      try {
        const res = await InspectionApi.getInspectionRecordDetail(row.id);
        this.$drawer({
          title: '巡检',
          component: () => <InspectionDetailPanel data={res}/>,
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err,
        });
      }
    },
    onInspectionTimeChange(time) {
      this.queryData.inspectionStartTime = time ? time[0] : '';
      this.queryData.inspectionEndTime = time ? time[1] : '';
    },
    onQuery() {
      this.init();
    },
    onReset() {
      // 资产查询参数
      this.queryData.result = null;
      this.queryData.keyword = '';
      this.queryData.inspectUserIdList = [];
      this.queryData.inspectionTime = [];
      this.queryData.inspectionStartTime = '';
      this.queryData.inspectionEndTime = '';

      this.init();
    },
    handleDeptNodeClick: debounce(function ({ deptId, }) {
      this.queryData.directory = null;
      this.queryData.assetsType = null;
      this.queryData.useDept = deptId;
      this.init();
    }, 300),
    handleInsUnitClick: debounce(function ({ dictValue, }) {
      this.queryData.useDept = null;
      this.queryData.assetsType = null;
      this.queryData.directory = dictValue;
      this.init();
    }, 300),
    beforeFetchData() {
      if (this.currentFilterTab !== '2') {
        this.listApi = InspectionApi.getInspectionRecordAssetsList;
      } else {
        // 巡检单元
        this.listApi = InspectionApi.getInspectionRecordUnitList;
      }
    },
    // 左侧tab切换触发
    handleFilterTabChange({ index, }) {
      if (index !== '2') {
        this.tableColumn = this.proTypeColumn;
      } else {
        this.placeholder = '单元名称/编号';
        this.tableColumn = this.inspUnitColumn;
      }
      this.queryData.useDept = null;
      this.queryData.assetsType = null;
      this.queryData.directory = null;
      this.init();
    },
    // 资产类型节点点击
    handleAssetTypeNodeClick: debounce(function (target) {
      this.queryData.assetsType = target.dictValue;
      this.queryData.useDept = null;
      this.queryData.assetsType = null;
      this.init();
    }, 300),
  },
};
</script>

<style lang='scss'
  scoped
>
.inspectionHistoryIndex {
  // background-color: #fff;
}

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
