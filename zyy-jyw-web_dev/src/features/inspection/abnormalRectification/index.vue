/**
* @file index.vue
* @author huang
* @date 2023/10/12
* @description  异常整改
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container class="inspectionHistoryIndex">
    <el-aside
      class="aside"
      width="320px"
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
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
        >
          <template #default="{row}">
            <template v-if="row.isRectify !== 1">
              <pure-button
                label="去处理"
                type="text"
                @click="handleRectify(row)"
              />
              <pure-button
                label="转交"
                type="text"
                @click="transferTo(row)"
              />
            </template>

          </template>
        </el-table-column>
      </pure-table>
    </el-main>

  </el-container>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import InspectionApi from '../api.js';
import {
  INSPECTION_RECTIFY_STATUS_MAP,
  INSPECTION_RESULT,
} from '@/features/inspection/inspection.config';
import { debounce, } from 'lodash-es';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import PureButton from '@/common/components/button/index.vue';
import DrawerInspectionDetail from './drawer/detail.vue';
import DrawerHandle from './drawer/handle.vue';
import transfer from 'element-ui/packages/transfer';
import TeamUserSelect from '@/features/system/user/components/panel/teamUserSelect.vue';

export default {
  name: 'InspectionHistory',
  components: {
    PureButton,
    QueryPanel,
    DicTree,
    DepartmentTree,
    UserSelect,
  },
  data() {
    return {
      currentFilterTab: '0',
      listApi: InspectionApi.getAbnormalRectificationAssetsList,
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
          width: 220,
          formatter: (row) => {
            return (<pure-button label={row.name}
              type={'text'}
              onClick={() => this.handleMethodClick(row)}
            />);
          },
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
          label: '限期整改结束时间',
          prop: 'rectifyEndDate',
          fixed: false,
          width: 172,
        },
        {
          label: '资产所在位置',
          prop: 'place',
          fixed: false,
          width: 200,
        },
        {
          label: '使用科室',
          prop: 'useDeptName',
          fixed: false,
          width: 200,
        },
        {
          label: '整改人',
          prop: 'rectifyUserName',
          fixed: false,
          width: 200,
        }, {
          label: '整改时间',
          prop: 'rectifyTime',
          fixed: false,
          width: 200,
        }, {
          label: '巡检人',
          prop: 'inspectUserName',
          fixed: false,
          width: 200,
        }, {
          label: '整改状态',
          prop: 'isRectify',
          fixed: 'right',
          width: 120,
          formatter: (row) => {
            return (<pure-type-text config={INSPECTION_RECTIFY_STATUS_MAP}
              type={row.isRectify}
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
            return (<pure-button label={row.unitName}
              type={'text'}
              onClick={() => this.handleMethodClick(row)}
            />);
          },
        },
        {
          label: '编号',
          prop: 'unitCode',
          fixed: false,
          width: 200,

        }, {
          label: '限期整改结束时间',
          prop: 'rectifyEndDate',
          fixed: false,
          width: 200,
        }, {
          label: '单元所在位置',
          prop: 'unitAddress',
          fixed: false,
          width: 200,
        }, {
          label: '使用科室',
          prop: 'useDepartName',
          fixed: false,
          width: 200,
        }, {
          label: '整改人',
          prop: 'rectifyUserName',
          fixed: false,
          width: 200,

        },
        {
          label: '整改时间',
          prop: 'rectifyTime',
          fixed: false,
          width: 240,

        },
        {
          label: '巡检人',
          prop: 'inspectUserName',
          fixed: false,
        }, {
          label: '整改状态',
          prop: 'isRectify',
          fixed: 'right',
          width: 200,
          formatter: (row) => {
            return (
              <PureTypeText
                type={row.isRectify}
                config={INSPECTION_RECTIFY_STATUS_MAP}
              />
            );
          },
        },
      ],
    };
  },
  computed: {
    transfer() {
      return transfer;
    },
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
    // 转交
    transferTo(row) {
      this.$drawer({
        component: () => <TeamUserSelect onDone={(userId) => {
          InspectionApi.abnormalRectificationTransfer({
            id: row.id,
            userId,
          }).then(() => {
            this.$notify.success('转交成功!');
            this.init();
          }).catch((err) => {
            this.$notify.error(err);
          });
        }}
        />,
      });
    },
    // 去处理
    handleRectify(row) {
      this.$drawer({
        component: () => <DrawerHandle data={row}
          onDone={this.init}
        />,
      });
    },
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    //  点击行
    async handleMethodClick(row) {
      console.log(row);
      try {
        this.$drawer({
          component: () => <DrawerInspectionDetail data={row}/>,
        });
      } catch (err) {
        this.$notify({
          type: 'error',
          message: err,
        });
      }
    },
    onInspectionTimeChange(time) {
      console.log(time);
      this.queryData.inspectionStartTime = time ? time[0] : '';
      this.queryData.inspectionEndTime = time ? time[1] : '';
    },
    onQuery() {
      this.init();
    },
    onReset() {
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
        this.listApi = InspectionApi.getAbnormalRectificationAssetsList;
      } else {
        // 巡检单元
        this.listApi = InspectionApi.getAbnormalRectificationUnitList;
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
