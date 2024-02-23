<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-17 18:04:37
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 11:00:36
 * @Description: 巡检任务
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              :data="data"
              :max-height="tableMaxHeight"
              :empty-text="emptyText"
              :row-style="{height:'64px'}"
            >
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
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
                  <span v-if="item.prop === 'assetsType'">
                    {{ row[item.prop]|dicValueToKey('assetsType') }}
                  </span>
                  <span v-else-if="item.prop === 'manufacturer'">
                    {{ row[item.prop]|dicValueToKey('manufacturer') }}
                  </span>
                  <span v-else-if="item.prop === 'state'">
                    {{ row[item.prop]?'是':'否' }}
                  </span>
                  <span v-else-if="item.prop==='inspectionFrequency'">
                    {{ convertInspectionFrequency(row) }}
                  </span>
                  <span v-else-if="item.prop==='frequencyUnit'">
                    <period-tag :period="convertFrequenceyUnit(row)" />
                  </span>
                  <span v-else-if="item.prop==='completedProgress'">
                    {{ convertCompletedProgress(row) }}
                  </span>
                  <span v-else-if="item.prop==='type'" :class="'inspection-type--'+getInspectionType(row)">
                    {{ convertInspectionType(row) }}
                  </span>
                  <span v-else-if="item.prop==='endTime'">
                    {{ row[item.prop] }}
                  </span>
                  <span v-else-if="item.prop==='inspectionUser'">
                    {{ row.sendUserToName||row.sendTeamToName }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" fixed="right" width="179px">
                <template #default="{row}">
                  <el-button
                    v-if="row.frequencyNow>1"
                    size="medium"
                    type="text"
                    @click="handleViewTask(row)"
                  >查看</el-button>
                  <el-button
                    v-if="$store.getters.userInfo.id === row.sendUser || teamIds.includes(row.sendTeam) "
                    size="medium"
                    type="text"
                    @click="handleInspection(row)"
                  >巡检</el-button>

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
        <el-tab-pane label="资产类型" :name="propertyTypeTabName">
          <tree-dic-tree dic-key="assetsType" @node-click="onAssetTypeNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="科室" :name="departmentTabName">

          <department-tree @node-click="handleDeptNodeClick" />
        </el-tab-pane>
        <el-tab-pane label="巡检单元" :name="inspectionUnitTabName">
          <pure-inspection-unit-tree @node-click="handleUnitNodeClick" />
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>
<script>
import PaginationTable from '@/minxins/common/paginationTable';
import InspectionTaskApi from '@/apis/inspection/task';
import Inspection from './dialog/inspection.vue';
import InspectionDetail from './dialog/inspectionDetail.vue';
import TreeDicTree from '@/feat/system/dictionary/tree/component/treeDicTree';
import GroupAPI from '@/apis/system/group/index';
import { mapState, } from 'vuex';

const TAB_TYPES = {
  propertyType: '0',
  department: '1',
  inspectionUnit: '2',
};
const PERIOD_MAP = {
  1: 'day',
  2: 'week',
  3: 'month',
  5: 'halfYear',
  4: 'quarter',
  6: 'year',
};
export default {
  name: 'XjXjrw',
  components: {
    TreeDicTree,
    PureInspectionUnitTree: () => import('@/views/components/inspection/unitTree.vue'),
    PeriodTag: () => import('../component/tag/periodTag.vue'),
    DepartmentTree: () => import('@/feat/system/department/component/departmentTree.vue'),
  },
  mixins: [PaginationTable],
  data() {
    return {
      propertyTypeTabName: TAB_TYPES.propertyType,
      departmentTabName: TAB_TYPES.department,
      inspectionUnitTabName: TAB_TYPES.inspectionUnit,
      // 当前左侧选中tab, 资产类型 propType 巡检单元inspUnit 科室 department
      currentFilterTab: TAB_TYPES.propertyType,
      teamIds: [],
      frequencyUnitMap: {},
      // 资产类型和科室表头
      proTypeColumn: [
        {
          label: '周期单位',
          prop: 'frequencyUnit',
          fixed: false,
          width: 100,
        },
        {
          label: '名称',
          prop: 'name',
          fixed: false,
          width: 150,
        },
        {
          label: '完成进度',
          prop: 'completedProgress',
          fixed: false,
          width: 100,
        },
        // {
        //   label: '资产编号',
        //   prop: 'assetsCode',
        //   fixed: false,
        //   width: 200,
        // }, {
        //   label: '资产类型',
        //   prop: 'assetsType',
        //   fixed: false,
        //   width: 200,
        // },
        {
          label: '巡检频次',
          prop: 'inspectionFrequency',
          fixed: false,
          width: 100,
        },
        // {
        //   label: '规格型号',
        //   prop: 'model',
        //   fixed: false,
        //   width: 200,
        // },
        {
          label: '使用科室',
          prop: 'useDeptToName',
          fixed: false,
          width: 150,
        },
        {
          label: '巡检到期时间',
          fixed: false,
          width: 150,
          prop: 'endTime',
        },
        {
          label: '巡检人',
          prop: 'inspectionUser',
          fixed: false,
          width: 100,
        }, {
          label: '巡检类型',
          prop: 'type',
          fixed: false,
          width: 100,
        }, {
          label: '所在位置',
          prop: 'place',
          fixed: false,
          width: 150,
        }],
      // 巡检单元表头
      inspUnitColumn: [{
        label: '周期单位',
        prop: 'frequencyUnit',
        fixed: false,
        width: 100,
      },
      {
        label: '巡检单元名称',
        prop: 'name',
        fixed: false,
        width: 250,
      },
      {
        label: '完成进度',
        prop: 'completedProgress',
        fixed: false,
        width: 100,
      },
      {
        label: '巡检频次',
        prop: 'inspectionFrequency',
        fixed: false,
        width: 100,

      }, {
        label: '巡检人',
        prop: 'inspectionUser',
        fixed: false,
        width: 150,
      }, {
        label: '巡检类型',
        prop: 'type',
        fixed: false,
        width: 200,
      }, {
        label: '巡检到期时间',
        prop: 'endTime',
        fixed: false,
        width: 200,
      }],
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),

    columnConfig() {
      let data = [];
      switch (this.currentFilterTab) {
        case this.propertyTypeTabName:
        case this.departmentTabName:
          data = [...this.proTypeColumn];
          break;
        case this.inspectionUnitTabName:
          data = [...this.inspUnitColumn];
          break;
      }
      return data;
    },
    listApi() {
      let api = '';
      if (this.currentFilterTab === this.inspectionUnitTabName) {
        api = 'listByinspectionUnit';
      } else {
        api = 'listByPropOrDept';
      }
      return InspectionTaskApi[api];
    },
  },
  created() {
    const frequencyUnitData = this.$store.state['dictionary']['dicList']['frequencyUnit'] || [];
    frequencyUnitData.map(item => {
      this.frequencyUnitMap[item.value] = item.name;
    });
    this.fetchData();
    this.fetchGroup();
  },
  methods: {
    // 获取当前登陆用户所在小组
    async fetchGroup() {
      const res = await GroupAPI.userByGroupInfo(this.userInfo.id);
      if (res?.length) {
        this.teamIds = res.map(item => item.id);
      }
    },
    // 点击科室树触发
    async handleDeptNodeClick(deptId) {
      try {
        this.currentPage = 0;
        this.queryCondition.deptId = deptId;
        this.queryCondition.pageNum = this.currentPage;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    onAssetTypeNodeClick(node) {
      this.resetQueryCondition();
      this.queryCondition.assetsType = node.id;
      this.fetchData();
    },
    // 查看
    async handleViewTask(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspectionDetail taskId={row.executeId} actionType='view' propertyName={row.name}/>,
      });
    },
    // 巡检
    async handleInspection(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <Inspection actionType='update' taskId={row.executeId} propertyName={row.name} onDone={this.fetchData}/>,
      });
    },

    // 左侧tab切换触发
    handleFilterTabChange(val) {
      this.currentPage = 0;
      this.queryCondition.unit = null;
      this.queryCondition.unitFolder = null;
      this.queryCondition.deptId = null;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
    },
    resetQueryCondition() {
      this.currentPage = 0;
      this.queryCondition.pageNum = 0;
      this.queryCondition.assetsType = null;
      this.queryCondition.deptId = null;
      this.queryCondition.pertainUnit = null;
    },

    /**
     * 巡检单元
     */
    // 单元维护

    // 巡检单元查看
    async handleViewAssociatedInspUnit(row) {

    },
    // 巡检单元编辑
    async handleEditAssociatedInspUnit(row) {

    },
    // 巡检单元删除
    async handleDelAssociatedInspUnit(row) {

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
    // 转换巡检频次
    convertInspectionFrequency(row) {
      return `${row.frequencyTimer}次/${row.frequencyInterval}${this.frequencyUnitMap[row.frequencyUnit]}`;
    },
    // 转换完成进度
    convertCompletedProgress(row) {
      return `${row.frequencyNow - 1}/${row.frequencyTimer}`;
    },
    // 转换巡检类型
    convertInspectionType(row) {
      const typeMap = {
        1: '计划巡检',
        2: '临时巡检',
      };
      let result = typeMap[row.type] || '未知类型';
      if (row.lastResult === 2 && row.lastErrorMake === 1) {
        result = '限期整改';
      }
      return result;
    },
    getInspectionType(row) {
      let result = 'plan';
      if (row.lastResult === 2 && row.lastErrorMake === 1) {
        result = 'rectification';
      }
      return result;
    },
    // 周期单位转换
    convertFrequenceyUnit(row) {
      return PERIOD_MAP[row.frequencyUnit];
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

.inspection-type {
  font-size: 14px;
  font-weight: 400;
  &--rectification {
    color: #F56C6C;
  }
  &--plan {
  color:#2D405E
  }
}
</style>
