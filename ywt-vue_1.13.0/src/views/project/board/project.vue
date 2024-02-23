<!--
  项目看板
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <el-form
            ref="form"
            inline
            size="small"
            class="formStyle"
            :model="queryParams"
            :rules="queryParamsRules"
          >
            <el-form-item prop="projectName">
              <el-input
                v-model="queryParams.projectName"
                placeholder="项目名称"
              />

            </el-form-item>
            <el-form-item prop="projectLevel">
              <DicSelect
                v-model="queryParams.projectLevel"
                dic-key="itemProjectLevel"
                placeholder="项目级别"
              />
            </el-form-item>
            <el-form-item prop="projectPriority">
              <DicSelect
                v-model="queryParams.projectPriority"
                dic-key="itemPriority"
                placeholder="项目优先级"
              />
            </el-form-item>
            <el-form-item prop="showState">
              <DicSelect
                v-model="queryParams.showState"
                type="string"
                dic-key="itemProcessShow"
                placeholder="项目状态"
              />
            </el-form-item>
            <el-form-item prop="principal">
              <UserSelect
                v-model="queryParams.principal"
                placeholder="项目负责人"
              />
            </el-form-item>
            <el-form-item prop="gradingTime">
              <el-date-picker
                v-model="queryParams.gradingTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="初定级日期"
                end-placeholder="初定级日期"
              />
            </el-form-item>
            <el-row>
              <el-col :span="16">
                <el-form-item prop="projectStartTime">
                  <el-date-picker
                    v-model="queryParams.projectStartTime"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="项目开始日期"
                    end-placeholder="项目开始日期"
                  />
                </el-form-item>
                <el-form-item prop="projectEndTime">
                  <el-date-picker
                    v-model="queryParams.projectEndTime"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="项目结束日期"
                    end-placeholder="项目结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" class="t-r">
                <el-form-item>
                  <pure-button label="查询" @click="onSearch" />
                  <pure-button label="清空查询条件" type="text" @click="onClear" />
                  <pure-button label="导出" type="wire-frame-auto" @click="onExport" />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :data="data"
              border
              :cell-style="tableStyle.cellStyle"
              :cell-class-name="tableStyle.cellClassName"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              @header-dragend="dragendHeader"
            >
              <el-table-column
                label="序号"
                type="index"
                width="85px"
                :fixed="true"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template #header>
                  <HeaderSet
                    :column-list="ColumnConfig"
                    @change="changeColumn"
                  />序号
                </template>
              </el-table-column>

              <template v-for="(item, index) in ColumnConfig">
                <el-table-column
                  v-if="item.show"
                  :key="index + item.prop"
                  :label="item.label"
                  :prop="item.prop"
                  :width="item.width"
                  :min-width="item.minWidth"
                  :fixed="item.fixed"
                  :column-key="item.prop"
                  align="left"
                  :show-overflow-tooltip="true"
                  :formatter="columnConfigFormatter[item.prop]"
                />
              </template>
              <el-table-column
                label="操作"
                align="left"
                width="200px"
                fixed="right"
              >
                <template #default="{row}">
                  <el-button type="text" @click="onCheck(row)">
                    查看
                  </el-button>
                  <el-button
                    v-if="IsEdit && row.editStatus"
                    type="text"
                    @click="onEdit(row)"
                  >
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template #footer>
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
  </el-container>
</template>

<script>
import HeaderSet from '../components/setting/tableHeader.vue';
import ProjectAPI from '@/apis/project';
import PaginationTable from '@/minxins/common/paginationTable';
import tableStyle from '../style/table';
import { dicValueToKey, } from '@/filters';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import { mapActions, mapGetters, mapMutations, } from 'vuex';
import _ from 'lodash';
import drawerWidth from '@/views/project/common/width/drawer';
import DemandAllPanel from '@/views/project/components/panelsGroup/hxey_demandAll.vue';
import EditProjectGroup from '@/views/project/components/panelsGroup/editProjectGroup.vue';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';

import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import downLoadFile from '@/utils/downLoad';
import UserSelect from '@/views/project/components/userSelect/index';

const rules = (rule, value, callback) => {
  if (value) {
    callback();
  }
};
export default {
  name: 'XmXqkb',
  components: {
    HeaderSet,
    DicSelect,
    UserSelect,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: ProjectAPI.demandBoard.searchProjectBoardList,
      queryParamsRules: {
        projectName: [{ require: false, }],
        projectLevel: [{ require: false, type: 'number', validator: rules, }],
        projectPriority: [{ require: false, type: 'number', validator: rules, }],
        projectState: [{ require: false, type: 'number', validator: rules, }],
        showState: [{ require: false, type: 'number', validator: rules, }],
        gradingTime: [{ require: false, type: 'number', validator: rules, }],
        projectStartTime: [{ require: false, type: 'number', validator: rules, }],
        projectEndTime: [{ require: false, type: 'number', validator: rules, }],
        principal: [{ require: false, type: 'number', validator: rules, }],

      },
      queryParams: {
        projectName: '',
        projectLevel: null,
        projectPriority: null,
        projectState: null,
        showState: null,
        gradingTime: [],
        projectStartTime: [],
        projectEndTime: [],
        principal: null,
      },
      tableStyle,
      loading: false,
      columnConfigFormatter: {
        //   需求名称
        title: item => {
          return this.$createElement(DemandOrProjectName, { props: {
            data: item,
          }, });
        },
        realDate: item => {
          if (item.realDate) {
            return this.$options.filters.date(item.realDate, 'YYYY-MM-DD');
          }
          return '-';
        },
        // 需求来源方式
        itemType: item => {
          return item.itemTypeToName;
        },
        // 需求进度
        totalProgress: item => {
          if (item.totalProgress != null) {
            return item.totalProgress + '%';
          } else {
            return '-';
          }
        },
        //  优先级
        priority: item => {
          return dicValueToKey(item.priority, 'itemPriority');
        },
        // 附件
        enclosure: item => {
          return this.$createElement(TableCellAttachment, {
            props: {
              data: item.enclosure,
            },
          });
        },

        // 预计工时
        planUse: item => {
          return item.planUse || '-';
        },
        // 参与人员
        usersToName: item => {
          return item.usersToName || '-';
        },
        startTime: item => {
          if (item.startTime) {
            return this.$options.filters.date(item.startTime, 'YYYY-MM-DD');
          }
          return '-';
        },
        // 结束日期
        endTime: item => {
          if (item.endTime) {
            return this.$options.filters.date(item.endTime, 'YYYY-MM-DD');
          }
          return '-';
        },
        showState: item => {
          return dicValueToKey(item.showState, 'itemProcessShow');
        },
      },
      columnConfig: [
        {
          label: '项目名称',
          prop: 'title',
          fixed: true,
          show: true,
          width: '240px',
          minWidth: '240px',
        },
        {
          label: '负责人',
          prop: 'principalToName',
          fixed: false,
          show: true,
          width: '200px',
          minWidth: '200px',
        },

        {
          label: '参与人员',
          prop: 'usersToName',
          fixed: false,
          show: true,
          width: '175px',
          minWidth: '175px',
        },
        {
          label: '项目类型',
          prop: 'itemType',
          fixed: false,
          show: true,
          width: '130px',
          minWidth: '130px',
        },
        {
          label: '附件',
          prop: 'enclosure',
          fixed: false,
          show: true,
          width: '200px',
          minWidth: '200px',
        },

        {
          label: '创建人',
          prop: 'createUserToName',
          fixed: false,
          show: true,
          width: '115px',
          minWidth: '115px',
        },
        {
          label: '开始日期',
          prop: 'startTime',
          fixed: false,
          show: true,
          width: '96px',
          minWidth: '96px',
        },
        {
          label: '结束日期',
          prop: 'endTime',
          fixed: false,
          show: true,
          width: '178px',
          minWidth: '178px',
        },
        {
          label: '实际完成日期',
          prop: 'realDate',
          fixed: false,
          show: true,
          width: '178px',
          minWidth: '178px',
        },
        {
          label: '预计工时',
          prop: 'planUse',
          fixed: false,
          show: true,
          width: '125px',
          minWidth: '125px',
        },
        {
          label: '状态',
          prop: 'showState',
          fixed: false,
          show: true,
          width: '125px',
          minWidth: '125px',
        },
        {
          label: '进度',
          prop: 'totalProgress',
          fixed: 'right',
          show: true,
          width: '125px',
          minWidth: '125px',
        }
      ],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    UserID() {
      return this.userInfo.id;
    },
    ColumnConfig() {
      return this.columnConfig;
    },
    MyPermissions() {
      return this.userInfo.permissions || [];
    },
    IsITBP() {
      return this.MyPermissions.includes('ITBP_MANAGER');
    },
    IsEdit() {
      return this.MyPermissions.includes('ITEM_BOARD_EDIT');
    },
  },
  created() {
    this.DISPATCHT_GET_USER_LIST();
    this.initTableColumnConfig();
  },

  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    ...mapMutations('project/index', [
      'SET_PANCEL_DISABLED',
      'SET_PERVIEW',
      'SET_ITEM_CODE',
      'SET_RESEARCH_INFO',
      'SET_LOOK_TASK'
    ]),
    ...mapActions('project/index', [
      'FETCEH_RESET_PANCEL_DISABLED_OPTIONS',
      'FETCH_PANEL_DATA'
    ]),
    // 导出
    async onExport() {
      const res = await ProjectAPI.demandBoard.exportProject(this.queryCondition);
      const { url, oldName, } = res;
      downLoadFile(url, oldName);
    },

    dragendHeader(newWidth, oldWidth, column, event) {
      const index = this.columnConfig.findIndex(item => {
        return item.prop === column.property;
      });
      this.$set(this.columnConfig[index], 'width', `${newWidth}px`);
      this.setTableColumn();
    },
    async onEdit(row) {
      this.SET_LOOK_TASK(false);

      await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const result = await ProjectAPI.base.getAllProjectData(row.itemCode);

      await this.FETCH_PANEL_DATA(result);
      this.SET_ITEM_CODE(row.itemCode);
      this.SET_RESEARCH_INFO(row);
      loading.close();
      this.renderPanelFn(EditProjectGroup, drawerWidth.small_px, {
        itemCode: row.itemCode,
      });
    },
    changeColumn(column) {
      this.columnConfig = column;
      this.$refs.table.doLayout();
      this.setTableColumn();
    },
    setTableColumn: _.debounce(async function () {
      await ProjectAPI.demandBoard.updateTableColumnConfig(
        JSON.stringify(this.ColumnConfig),
        2
      );
    }, 3000),
    async initTableColumnConfig() {
      const result = await ProjectAPI.demandBoard.searchRoleTableColumnConfig(
        this.UserID,
        2
      );
      if (result?.permission) {
        this.columnConfig = JSON.parse(result.permission);
      }
      this.fetchData();
    },
    initData() {
      this.fetchData();
    },
    onDone() {
      this.fetchData();
    },
    renderPanelFn(componentName, width, props) {
      const self = this;
      this.$drawer({
        width: width,
        component: () => {
          return self.$createElement(componentName, {
            props: props,
            on: {
              done: () => {
                self.onDone();
              },
            },
          });
        },
      });
    },
    onSearch() {
      this.queryCondition.query = this.queryParams.projectName;
      this.queryCondition.projectLevel = this.queryParams.projectLevel;
      this.queryCondition.priority = this.queryParams.projectPriority;
      this.queryCondition.showState = this.queryParams.showState;
      this.queryCondition.gradingStartTime = this.queryParams.gradingTime[0];
      this.queryCondition.gradingEndTime = this.queryParams.gradingTime[1];
      this.queryCondition.projectEndBeginTime = this.queryParams.projectEndTime[0];
      this.queryCondition.projectEndEndTime = this.queryParams.projectEndTime[1];
      this.queryCondition.projectStartBeginTime = this.queryParams.projectStartTime[0];
      this.queryCondition.projectStartEndTime = this.queryParams.projectStartTime[1];
      this.queryCondition.principal = this.queryParams.principal;
      this.fetchData();
    },
    onClear() {
      this.$refs.form.resetFields();
      this.queryCondition.query = this.queryParams.projectName;
      this.queryCondition.projectLevel = this.queryParams.projectLevel;
      this.queryCondition.priority = this.queryParams.projectPriority;
      this.queryCondition.showState = this.queryParams.showState;
      this.queryCondition.gradingEndTime = '';
      this.queryCondition.gradingStartTime = '';
      this.queryCondition.projectEndBeginTime = '';
      this.queryCondition.projectEndEndTime = '';
      this.queryCondition.projectStartBeginTime = '';
      this.queryCondition.projectStartEndTime = '';
      this.queryCondition.principal = null;

      this.queryCondition.pageNum = 1;

      this.fetchData();
    },

    async onCheck(item) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.SET_PERVIEW(false);
      this.SET_LOOK_TASK(true);
      await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
      const result = await ProjectAPI.base.getAllProjectData(item.itemCode);

      await this.FETCH_PANEL_DATA(result);
      loading.close();
      this.SET_ITEM_CODE(item.itemCode);
      this.SET_RESEARCH_INFO(item);

      let width = '';
      if (result.demand) {
        width = drawerWidth.larger_pr;
      } else {
        width = drawerWidth.small_px;
      }

      this.renderPanelFn(DemandAllPanel, width, {
        where: 'project',
        width,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep  .base-margin-bottom{
  margin-bottom: 0 !important;

}
.t-r{
  text-align: right;
}
::v-deep .pure-text .label {
  color: #334266;
  opacity: 0.4;
}
.w-100{
  width: 100%;
}
.formStyle {
  margin: 16px 16px 0 16px;
}
</style>
