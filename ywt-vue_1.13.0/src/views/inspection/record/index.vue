<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-17 18:04:37
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 10:43:44
 * @Description: 巡检任务
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <el-form size="mini" label-width="0" :inline="true">
              <el-form-item>
                <el-input v-model="searchForm.query" class="border" placeholder="关键字" />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchForm.sort"
                  placeholder="列表排序"
                >
                  <el-option
                    v-for="(item,index) in sortList"
                    :key="index"
                    :value="item.value"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="searchForm.frequencyUnit"
                  placeholder="周期单位"
                  clearable
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="(item,index) in cycleUnitList"
                    :key="index"
                    :value="item.value"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <BigDataSelect v-model="searchForm.sendUser" :options="userList" clearable placeholder="巡检人" />
              </el-form-item>
              <el-form-item>
                <pure-button label="查询" @click="onSearch" />
                <pure-button type="wire-frame-auto" label="重置" @click="onReset" />
                <pure-button type="wire-frame-auto" label="导出" @click="onExport" />
              </el-form-item>
            </el-form>
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
                  <span v-else-if="item.prop==='type'">
                    {{ convertInspectionType(row) }}
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
                    v-if="(row.frequencyNow+row.state)>1"
                    size="medium"
                    type="text"
                    @click="handleViewTask(row)"
                  >查看</el-button>

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
import InspectionRecordApi from '@/apis/inspection/record';
import InspectionDetail from './dialog/inspectionDetail.vue';
import TreeDicTree from '@/feat/system/dictionary/tree/component/treeDicTree';
import userApi from '@/feat/system/user/api';
import BigDataSelect from '@/components/select/bigDataSelect.vue';
import downLoadFile from '@/utils/downLoad';

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
  name: 'XjXjjl',
  components: {
    TreeDicTree,
    PureInspectionUnitTree: () => import('@/views/components/inspection/unitTree.vue'),
    PeriodTag: () => import('../component/tag/periodTag.vue'),
    DepartmentTree: () => import('@/feat/system/department/component/departmentTree.vue'),
    BigDataSelect,
  },
  mixins: [PaginationTable],
  data() {
    return {

      propertyTypeTabName: TAB_TYPES.propertyType,
      departmentTabName: TAB_TYPES.department,
      inspectionUnitTabName: TAB_TYPES.inspectionUnit,
      // 当前左侧选中tab, 资产类型 propType 巡检单元inspUnit 科室 department
      currentFilterTab: TAB_TYPES.propertyType,
      frequencyUnitMap: {},
      // 资产类型和科室表头
      proTypeColumn: [
        {
          label: '周期单位',
          prop: 'frequencyUnit',
          fixed: true,
          width: 100,
        },
        {
          label: '名称',
          prop: 'name',
          fixed: true,
          width: 200,
        },
        {
          label: '完成进度',
          prop: 'completedProgress',
          fixed: true,
          width: 100,
        },
        {
          label: '资产编号',
          prop: 'assetsCode',
          fixed: false,
          width: 200,
        }, {
          label: '资产类型',
          prop: 'assetsTypeToName',
          fixed: false,
          width: 200,
        },
        {
          label: '巡检频次',
          prop: 'inspectionFrequency',
          fixed: false,
          width: 200,
        },
        {
          label: '规格型号',
          prop: 'model',
          fixed: false,
          width: 200,
        }, {
          label: '使用科室',
          prop: 'useDeptToName',
          fixed: false,
          width: 200,
        }, {
          label: '所在位置',
          prop: 'place',
          fixed: false,
          width: 200,
        }, {
          label: '巡检人',
          prop: 'inspectionUser',
          fixed: false,
          width: 200,
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
      // 巡检单元表头
      inspUnitColumn: [{
        label: '周期单位',
        prop: 'frequencyUnit',
        fixed: true,
        width: 100,
      },
      {
        label: '巡检单元名称',
        prop: 'name',
        fixed: true,
        width: 200,
      },
      {
        label: '完成进度',
        prop: 'completedProgress',
        fixed: true,
        width: 100,
      }, {
        label: '编号',
        prop: 'code',
        fixed: false,
        width: 200,

      }, {
        label: '巡检频次',
        prop: 'inspectionFrequency',
        fixed: false,
        width: 200,

      }, {
        label: '巡检人',
        prop: 'inspectionUser',
        fixed: false,
        width: 200,
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
      // 查询条件
      searchForm: {
        query: '',
        sort: '3',
        frequencyUnit: [],
        sendUser: '',
      },
      // 列表排序列表
      sortList: [
        /* {
          name: '巡检时间顺序',
          value: '1',
        },
        {
          name: '巡检时间倒序',
          value: '2',
        }, */
        {
          name: '巡检到期时间顺序',
          value: '3',
        },
        {
          name: '巡检到期时间倒序',
          value: '4',
        },
        {
          name: '名称顺序',
          value: '5',
        },
        {
          name: '名称倒序',
          value: '6',
        }
      ],
      userList: [],
    };
  },
  computed: {
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
      return InspectionRecordApi[api];
    },
    cycleUnitList() {
      return this.$store.state.dictionary?.dicList?.frequencyUnit ?? [];
    },
  },

  created() {
    this.getUserList();
    const frequencyUnitData = this.$store.state['dictionary']['dicList']['frequencyUnit'] || [];
    frequencyUnitData.map(item => {
      this.frequencyUnitMap[item.value] = item.name;
    });
    Object.assign(this.queryCondition, {
      query: '',
      frequencyUnit: '',
      sendUser: '',
      sortField: 'endTime',
      sort: 0,
    });
    // eslint-disable-next-line no-unused-vars
    const { frequencyUnit, ...restQuery } = this.queryCondition;
    this.queryCondition = restQuery;
    this.fetchData();
  },
  methods: {
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
    onAssetTypeNodeClick(node) {
      this.resetQueryCondition();
      this.queryCondition.assetsType = node.id;
      this.fetchData();
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
    resetQueryCondition() {
      this.currentPage = 0;
      this.queryCondition.pageNum = 0;
      this.queryCondition.assetsType = null;
      this.queryCondition.deptId = null;
      this.queryCondition.pertainUnit = null;
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

    // 转换巡检频次
    convertInspectionFrequency(row) {
      return `${row.frequencyTimer}次/${row.frequencyInterval}${this.frequencyUnitMap[row.frequencyUnit]}`;
    },
    // 转换完成进度
    convertCompletedProgress(row) {
      return `${row.frequencyNow - 1 + row.state}/${row.frequencyTimer}`;
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
    // 周期单位转换
    convertFrequenceyUnit(row) {
      return PERIOD_MAP[row.frequencyUnit];
    },
    // 获取用户列表
    getUserList() {
      userApi.simpleList().then(res => {
        if (res) {
          this.userList = res.map(({ id, name, }) => ({ label: name, value: id, }));
        }
      });
    },
    onSearch() {
      const { sort, frequencyUnit, ...rest } = this.searchForm;
      const data = { ...rest, };
      if (sort === '1') {
        data.sortField = 'time';
        data.sort = 0;
      } else if (sort === '2') {
        data.sortField = 'time';
        data.sort = 1;
      } else if (sort === '3') {
        data.sortField = 'endTime';
        data.sort = 0;
      } else if (sort === '4') {
        data.sortField = 'endTime';
        data.sort = 1;
      } else if (sort === '5') {
        data.sortField = 'name';
        data.sort = 0;
      } else if (sort === '6') {
        data.sortField = 'name';
        data.sort = 1;
      }
      Object.assign(this.queryCondition, data);
      if (!frequencyUnit || !frequencyUnit.length) {
        // eslint-disable-next-line no-unused-vars
        const { frequencyUnit, ...restQuery } = this.queryCondition;
        this.queryCondition = restQuery;
      } else {
        this.queryCondition.frequencyUnit = frequencyUnit.join();
      }
      this.fetchData();
    },
    onReset() {
      this.searchForm = {
        query: '',
        sort: '3',
        frequencyUnit: [],
        sendUser: '',
      };
      Object.assign(this.queryCondition, {
        query: '',
        frequencyUnit: '',
        sendUser: '',
        sortField: 'endTime',
        sort: 0,
      });
      // eslint-disable-next-line no-unused-vars
      const { frequencyUnit, ...restQuery } = this.queryCondition;
      this.queryCondition = restQuery;
      this.fetchData();
    },
    async onExport() {
      const { sort, frequencyUnit, ...rest } = this.searchForm;
      const data = { ...rest, };
      if (sort === '1') {
        data.sortField = 'time';
        data.sort = 0;
      } else if (sort === '2') {
        data.sortField = 'time';
        data.sort = 1;
      } else if (sort === '3') {
        data.sortField = 'endTime';
        data.sort = 0;
      } else if (sort === '4') {
        data.sortField = 'endTime';
        data.sort = 1;
      } else if (sort === '5') {
        data.sortField = 'name';
        data.sort = 0;
      } else if (sort === '6') {
        data.sortField = 'name';
        data.sort = 1;
      }
      if (frequencyUnit) {
        data.frequencyUnit = frequencyUnit.join();
      }
      const res = await InspectionRecordApi.exportList(data);
      const { url, oldName, } = res;
      downLoadFile(url, oldName);
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
    }
  }
}
</style>
