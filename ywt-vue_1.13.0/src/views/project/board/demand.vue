<!--
  需求看板
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
          >
            <el-form-item prop="query">
              <el-input v-model="queryParams.query" placeholder="需求名称" />
            </el-form-item>
            <el-form-item prop="organizer">
              <div class="w-200">
                <CascaderDepartment v-model="queryParams.organizer" placeholder="来源科室" />

              </div>

            </el-form-item>
            <el-form-item prop="itemType">
              <div class="w-200">

                <DicSelect
                  v-model="queryParams.itemType"
                  dic-key="itemType"
                  placeholder="需求来源方式"
                />
              </div>
            </el-form-item>
            <el-form-item prop="level">
              <div class="w-200">

                <DicSelect
                  v-model="queryParams.level"
                  dic-key="itemPriority"
                  placeholder="项目优先级"
                />
              </div>
            </el-form-item>
            <el-form-item prop="isProjectApproval">
              <div class="w-200">
                <el-select v-model="queryParams.isProjectApproval" placeholder="是否已立项">
                  <el-option
                    label="已立项"
                    :value="1"
                  />
                  <el-option
                    label="尚未立项"
                    :value="0"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item prop="processState">
              <div class="w-200">
                <DicSelect
                  v-model="queryParams.processState"
                  type="string"
                  dic-key="itemProcessShow"
                  placeholder="需求进度"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <pure-button label="查询" @click="onSearch" />
            </el-form-item>
            <el-form-item>
              <pure-button label="清空查询条件" type="text" @click="onClear" />
            </el-form-item>
            <el-form-item>
              <pure-button label="导出" type="wire-frame-auto" @click="onExport" />
            </el-form-item>
          </el-form>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper" style="margin-top:16px">
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
                  :show-overflow-tooltip="item.prop === 'organizer' ? false : true"
                  :formatter="columnConfigFormatter[item.prop]"
                />
              </template>
              <el-table-column label="操作" align="left" width="200px" fixed="right">
                <template #default="{row}">
                  <el-button type="text" @click="onCheck(row)">
                    查看
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
import { dicValueToKey, needStatus, needWhere, projectLevel, } from '@/filters';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import { mapActions, mapGetters, mapMutations, } from 'vuex';
import _ from 'lodash';
import drawerWidth from '@/views/project/common/width/drawer';
import AddNewPanel from '../components/panelsGroup/addNew.vue';
import Research from '../components/panelsGroup/research.vue';
import DemandAnalysisGroup from '../components/panelsGroup/demandAnalysisGroup.vue';
import TechnicalAnalysisGroup from '../components/panelsGroup/technicalAnalysisGroup.vue';
import DemandAssessGroup from '../components/panelsGroup/demandAssessGroup.vue';
import DemandReviewGroup from '../components/panelsGroup/demandReviewGroup.vue';
import ProjectGroup from '../components/panelsGroup/itemSet.vue';
// import DemandAllPanelGroup from './drawer/panelGroup.vue';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';
import OrganizerToolTip from '@/views/project/needSetting/components/organizerToolTip.vue';

import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import CascaderDepartment from '@/feat/system/department/component/departmentCascader';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'XmXqkb',
  components: {
    HeaderSet,
    DicSelect,
    CascaderDepartment,
  },
  mixins: [PaginationTable],
  computed: {
    ...mapGetters(['userInfo']),
    UserID() {
      return this.userInfo.id;
    },
    ColumnConfig() {
      return this.columnConfig;
    },
  },
  data() {
    return {
      listApi: ProjectAPI.demandBoard.searchList,
      queryParamsRules: {
        query: [{ require: false, }],
        organizer: [{ require: false, }],
        itemType: [{ require: false, }],
        level: [{ require: false, }],
        isProjectApproval: [{ require: false, }],
        processState: [{ require: false, }],
      },
      queryParams: {
        query: '',
        organizer: null,
        itemType: null,
        level: null,
        isProjectApproval: null,
        processState: null,
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
        // 来源科室
        organizer: item => {
          return (<OrganizerToolTip data={item} />);
        },
        // 需求来源方式
        itemType: item => {
          return needWhere(item.itemType);
        },
        // 需求进度
        processState: item => {
          if (item.showState) {
            return needStatus(item.showState);
          } else {
            return '-';
          }
        },
        // 紧急程度
        level: item => {
          return dicValueToKey(item.level, 'itemPriority');
        },
        // 附件沟通记录表
        enclosure: item => {
          return this.$createElement(TableCellAttachment, {
            props: {
              data: item.enclosure,
            },
          });
        },
        // 附件需求分析报告
        demandEnclosure: item => {
          return this.$createElement(TableCellAttachment, {
            props: {
              data: item.demandEnclosure,
            },
          });
        },
        // 项目级别
        projectLevel: item => {
          // TODO
          return projectLevel(item.projectLevel);
        },
      },
      columnConfig: [
        {
          label: '需求流程编号',
          prop: 'itemCode',
          fixed: true,
          show: true,
          width: '240px',
          minWidth: '240px',
        },
        {
          label: '需求名称',
          prop: 'title',
          fixed: true,
          show: true,
          width: '240px',
          minWidth: '240px',
        },
        {
          label: '来源科室',
          prop: 'organizer',
          fixed: false,
          show: true,
          width: '200px',
          minWidth: '200px',
        },

        {
          label: '需求科室对接人',
          prop: 'sponsor',
          fixed: false,
          show: true,
          width: '175px',
          minWidth: '175px',
        },
        {
          label: '前期对接人',
          prop: 'createUserName',
          fixed: false,
          show: true,
          width: '130px',
          minWidth: '130px',
        },
        {
          label: '需求来源方式',
          prop: 'itemType',
          fixed: false,
          show: true,
          width: '170px',
          minWidth: '170px',
        },

        {
          label: '需求价值',
          prop: 'demandValue',
          fixed: false,
          show: true,
          width: '240px',
          minWidth: '240px',
        },
        {
          label: '期望完成日期',
          prop: 'endTime',
          fixed: false,
          show: true,
          width: '200px',
          minWidth: '200px',
        },

        {
          label: 'ITBP',
          prop: 'itbpUserName',
          fixed: false,
          show: true,
          width: '96px',
          minWidth: '96px',
        },
        {
          label: '附件沟通记录表',
          prop: 'enclosure',
          fixed: false,
          show: true,
          width: '178px',
          minWidth: '178px',
        },
        {
          label: '附件需求分析报告',
          prop: 'demandEnclosure',
          fixed: false,
          show: true,
          width: '178px',
          minWidth: '178px',
        },
        {
          label: '技术评估人',
          prop: 'analystName',
          fixed: false,
          show: true,
          width: '125px',
          minWidth: '125px',
        },

        {
          label: '项目负责人',
          prop: 'principalName',
          fixed: false,
          show: true,
          width: '132px',
          minWidth: '132px',
        },
        {
          label: '项目参与人',
          prop: 'aboutUserName',
          fixed: false,
          show: true,
          width: '130px',
          minWidth: '130px',
        },
        {
          label: '是否已立项',
          prop: 'isProjectApproval',
          fixed: 'right',
          show: true,
          width: '126px',
          minWidth: '126px',
        },
        {
          label: '需求进度',
          prop: 'processState',
          fixed: 'right',
          show: true,
          width: '200px',
          minWidth: '200px',
        }
      ],
    };
  },
  created() {
    this.DISPATCHT_GET_USER_LIST();
    this.initTableColumnConfig();
  },

  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    ...mapMutations('project/index', ['SET_PANCEL_DISABLED', 'SET_PERVIEW', 'SET_ITEM_CODE', 'SET_RESEARCH_INFO', 'SET_LOOK_TASK']),
    ...mapActions('project/index', ['FETCEH_RESET_PANCEL_DISABLED_OPTIONS', 'FETCH_PANEL_DATA']),
    async onExport() {
      const res = await ProjectAPI.demandBoard.demandExport(this.queryCondition);
      const { url, oldName, } = res;
      downLoadFile(url, oldName);
    },
    onSearch() {
      this.queryCondition.query = this.queryParams.query;
      this.queryCondition.organizer = this.queryParams.organizer;
      this.queryCondition.itemType = this.queryParams.itemType;
      this.queryCondition.level = this.queryParams.level;
      this.queryCondition.isProjectApproval = this.queryParams.isProjectApproval;
      this.queryCondition.processState = this.queryParams.processState;
      this.fetchData();
    },
    onClear() {
      this.$refs.form.resetFields();
      this.queryCondition.query = this.queryParams.query;
      this.queryCondition.organizer = this.queryParams.organizer;
      this.queryCondition.itemType = this.queryParams.itemType;
      this.queryCondition.level = this.queryParams.level;
      this.queryCondition.isProjectApproval = this.queryParams.isProjectApproval;
      this.queryCondition.processState = this.queryParams.processState;
      this.queryCondition.pageNum = 1;
      this.fetchData();
    },

    dragendHeader(newWidth, oldWidth, column, event) {
      const index = this.columnConfig.findIndex(item => {
        return item.prop === column.property;
      });
      this.$set(this.columnConfig[index], 'width', `${newWidth}px`);
      this.setTableColumn();
    },
    changeColumn(column) {
      this.columnConfig = column;
      this.$refs.table.doLayout();
      this.setTableColumn();
    },
    setTableColumn: _.debounce(async function () {
      await ProjectAPI.demandBoard.updateTableColumnConfig(
        JSON.stringify(this.ColumnConfig)
      );
    }, 3000),
    async initTableColumnConfig() {
      const result = await ProjectAPI.demandBoard.searchRoleTableColumnConfig(
        this.UserID
      );
      if (result?.permission) {
        this.columnConfig = JSON.parse(result.permission);
      }
      this.fetchData();
    },
    initData() {
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
      const state = item.beforePauseState;
      const panelArguments = {
        demand: {
          width: drawerWidth.small_px,
          props: {
            title: '需求信息',
            hiddenSaveButton: true,
            showFooter: false,
            showTimeLine: true,
          },
        },
        research: {
          width: drawerWidth.larger_pr,
          props: {
            title: '评审信息',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        review: {
          width: drawerWidth.larger_pr,
          props: {
            title: '评审',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        demandAnalysis: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求分析',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        technicalAnalysis: {
          width: drawerWidth.larger_pr,
          props: {
            title: '技术分析',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        demandAssess: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求评估',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        demandReview: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求评审',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
        projectGroup: {
          width: drawerWidth.small_px,
          props: {
            title: '项目信息',
            hiddenSaveButton: true,
            showFooter: false,
          },
        },
      };
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchView', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });

      this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });

      const state1 = ['demand_init', 'demand_inv', 'end_termination', null];
      const state2 = ['demand_inv_review_next', 'end_project_order', 'end_inv_reject', 'demand_analysis'];
      const state3 = ['technical_analysis'];
      const state4 = ['demand_assess'];
      const state5 = ['demand_inv_review', ''];
      const state6 = ['item_establish'];
      const state7 = ['item_program_review', 'program_review_reject', 'implement_start', 'implement_over', 'item_before_project', 'end_project'];

      if (state1.includes(state)) {
        panelArguments.demand.props.showTimeLine = true;
        panelArguments.demand.width = drawerWidth.small_px;
        this.renderPanelFn(
          AddNewPanel,
          panelArguments.demand.width,
          panelArguments.demand.props
        );
      } else if (state2.includes(state)) {
        this.renderPanelFn(
          Research,
          panelArguments.research.width,
          panelArguments.research.props
        );
      } else if (state3.includes(state)) {
        this.renderPanelFn(DemandAnalysisGroup, panelArguments.demandAnalysis.width, panelArguments.demandAnalysis.props);
      } else if (state4.includes(state)) {
        this.renderPanelFn(TechnicalAnalysisGroup, panelArguments.technicalAnalysis.width, panelArguments.technicalAnalysis.props);
      } else if (state5.includes(state)) {
        this.renderPanelFn(DemandAssessGroup, panelArguments.demandAssess.width, panelArguments.demandAssess.props);
      } else if (state6.includes(state)) {
        this.renderPanelFn(DemandReviewGroup, panelArguments.demandReview.width, panelArguments.demandReview.props);
      } else if (state7.includes(state)) {
        let width = drawerWidth.small_px;
        if (result.demand) {
          width = drawerWidth.larger_pr;
        }
        this.renderPanelFn(ProjectGroup, width, panelArguments.projectGroup.props);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

::v-deep  .base-margin-bottom{
  margin-bottom: 0 !important;

}
::v-deep .pure-text .label {
  color: #334266;
  opacity: 0.4;
}
.formStyle {
  margin: 16px 16px 0 16px;
}
.w{
  &-200{
    width: 200px;
  }
}
</style>
