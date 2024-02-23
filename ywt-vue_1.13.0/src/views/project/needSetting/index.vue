
<template>
  <el-container class="needSetting">
    <el-main>
      <pure-table-area>
        <template #header>
          <div class="flex ">
            <ProcessPanel
              :key="'demand'"
              :active-button="defaultCode"
              active-panel-name="demand"
              :show-header="showDeamndPanel"
              @click="changeProcess"
            >
              <el-row class="demand-main-header p-16">
                <el-col :span="1">
                  <JYWCaretButton @click="showDeamndPanel = !showDeamndPanel" />
                </el-col>
                <el-col :span="11">
                  <search
                    v-model="searchValue"
                    class="base-margin-right"
                    style="width:200px"
                  />
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <pure-button type="wire-frame" :disabled="exportButtonDisabled" label="导出" @click="onExport" />

                  <pure-button
                    size="mini"
                    label="新增需求"
                    @click="addNew"
                  />
                </el-col>
              </el-row>
            </ProcessPanel>
          </div>
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
              @filter-change="filterChange"
            >
              <el-table-column label="序号" :fixed="true" align="left" width="85px" type="index">
                <template #header>
                  <HeaderSet
                    :column-list="tableColumns"
                    @change="changeColumn"
                  />序号
                </template>
              </el-table-column>
              <el-table-column v-for="(item, index) in showColumnList" :key="item.prop + index" align="left" :column-key="item.prop" v-bind="item" :filters="getTableColumnFilters(item.prop)">
                <template #default="{ row }">
                  <DemandOrProjectName v-if="item.prop === 'title'" :data="row" />
                  <OrganizerToolTip v-else-if="item.prop === 'organizers'" :data="row" />
                  <span v-else-if="item.prop === 'sponsor'">{{ row.sponsor || '-' }}</span>
                  <span v-else-if="item.prop === 'principal'">{{ row.principal | member }}</span>
                  <span v-else-if="item.prop === 'users'">{{ row.users | member }}</span>
                  <template v-else-if="item.prop === 'startTime'">
                    <span v-if="row.startTime">{{ row.startTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <template v-else-if="item.prop === 'endTime'">
                    <span v-if="row.endTime">{{ row.endTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <span v-else-if="item.prop === 'itemType'">{{ row.itemType | needWhere }}</span>
                  <TableCellAttachment v-else-if="item.prop === 'enclosure'" :data="row.enclosure" />
                  <template v-else-if="item.prop === 'showState'">
                    <span v-if="!row.showState">
                      待提交
                    </span>
                    <span v-else-if="row.state" :style="row.showState | color">
                      {{ row.showState | needStatus }}
                    </span>
                    <span v-else>
                      未提交
                    </span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="false" align="left" label="操作" prop="" min-width="247px" :fixed="'right'">
                <template #default="{row}">
                  <TableOptionsMenu
                    :data="row"
                    @click="clickOptions($event,row)"
                  />
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
import { mixins_base, mixins_project_index, } from '@/minxins/project/index';
import ProjectAPI from '@/apis/project';
import { arrayToString, } from '@/utils/common';
import tableStyle from '../style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import ProcessPanel from '@/views/project/components/navigationPanel/processPanel.vue';
import Assign from '@/views/project/components/panelsGroup/assign.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import _ from 'lodash';
import { mapGetters, mapState, } from 'vuex';

import DemandAllPanel from '@/views/project/components/panelsGroup/hxey_demandAll.vue';
import TableOptionsMenu from './components/optionsMenu.vue';
import AddNewPanel from '../components/panelsGroup/addNew.vue';
import Research from '../components/panelsGroup/research.vue';
import Review from '../components/panelsGroup/review.vue';
import ToOrder from './components/toOrder.vue';
import End from '../components/task/end.vue';
import DemandAnalysisGroup from '../components/panelsGroup/demandAnalysisGroup.vue';
import TechnicalAnalysisGroup from '../components/panelsGroup/technicalAnalysisGroup.vue';
import DemandAssessGroup from '../components/panelsGroup/demandAssessGroup.vue';
import DemandReviewGroup from '../components/panelsGroup/demandReviewGroup.vue';
import PreliminaryLevelGroup from '../components/panelsGroup/preliminaryLevelGroup.vue';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';
import OrganizerToolTip from '@/views/project/needSetting/components/organizerToolTip.vue';
import downLoadFile from '@/utils/downLoad';
import DialogPause from './dialog/pause.vue';
import HeaderSet from '@/views/project/components/setting/tableHeader.vue';

export default {
  name: 'XmXqgl',
  components: {
    ProcessPanel,
    TableCellAttachment,
    TableOptionsMenu,
    DemandOrProjectName,
    OrganizerToolTip,
    HeaderSet,
  },
  filters: {
    color(val) {
      const config = [{
        field: ['1', 'end_project_order', 'item_before_project'],
        color: '2D405E',
        memo: '黑色',
      }, {
        field: ['2', 'demand_inv_review', 'implement_start', 'item_program_review'],
        color: 'E6A23C',
        memo: '深黄色',

      }, {
        field: ['4', '3', 'demand_init', 'program_review_reject', 'reject_end', 'demand_pause'],
        color: 'F56C6C',
        memo: '红色',

      }, {
        field: ['item_establish', 'end_termination', 'implement_over'],
        color: '67C23A',
        memo: '绿色',
      }, {
        field: ['end_inv_reject'],
        color: 'C0C4CC',
        memo: '灰色',
      },
      {
        field: ['demand_inv', 'demand_inv_review_next', 'technical_analysis', 'demand_analysis', 'demand_assess'],
        color: '409EFF',
        memo: '蓝色',

      }];
      if (!val) {
        return `#E040FB`;
      }
      const rs = _.find(config, (v, i) => {
        return v.field?.includes(val.toString());
      });
      return `color:#${rs?.color || '2D405E'}`;
    },
  },

  mixins: [mixins_base, mixins_project_index, PaginationTable],
  data() {
    return {
      exportButtonDisabled: false,
      tableStyle,
      loading: true,
      defaultCode: 'demand',
      showDeamndPanel: true,
      listApi: ProjectAPI.demand.getNeedList,
      componentName: '',
      panelArguments: {
        demand: {
          width: drawerWidth.small_px,
          props: {
            title: '需求信息',
            hiddenSaveButton: true,
            showFooter: true,
            showTimeLine: true,
          },
        },
        research: {
          width: drawerWidth.larger_pr,
          props: {
            title: '调研',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        review: {
          width: drawerWidth.larger_pr,
          props: {
            title: '评审',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        demandAnalysis: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求分析',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        technicalAnalysis: {
          width: drawerWidth.larger_pr,
          props: {
            title: '技术分析',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        demandAssess: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求评估',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        demandReview: {
          width: drawerWidth.larger_pr,
          props: {
            title: '需求评审',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
      },
      tableColumns: [],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    userInfoFilterValue() {
      return [{
        text: this.userInfo.name,
        value: this.userInfo.id,
      }];
    },
    ...mapState('dictionary', {
      urgentFilter: (v) => {
        return _.map(v.dicList.itemPriority, (e) => {
          return {
            text: e.name,
            value: Number(e.value),
          };
        });
      },
      whereFilter: (v) => {
        return _.map(v.dicList.itemType, (e) => {
          return {
            text: e.name,
            value: Number(e.value),
          };
        });
      },
      statusFilter: (v) => {
        return _.map(v.dicList.itemProcessShow, (e) => {
          return {
            text: e.name,
            value: e.value,
          };
        });
      },
    }),
    dynamicTableColumns() {
      return this.$store.state['project/needSetting'].tableColumns;
    },
    showColumnList() {
      return this.tableColumns.filter(item => item.show);
    },
  },
  watch: {
    dynamicTableColumns: {
      immediate: true,
      handler(newVal,) {
        this.tableColumns = [...newVal];
      },
    },
  },
  activated() {
    this.renderRouteQueryParamsPanel();
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
    this.queryCondition.code = this.defaultCode;
    this.currentPage = 1;
    this.queryCondition.pageNum = this.currentPage;
    this.fetchData();
    // 注入 发起投票 撤销投票 回调事件
    this.SET_INJECT_EVENT({ name: 'submitVote', fun: this.fetchData, });
  },
  created() {
    this.initTableColumn();
  },
  methods: {
    async   onExport() {
      try {
        this.exportButtonDisabled = true;
        console.log(this.queryCondition);
        const res = await ProjectAPI.demand.exportExcel({
          temp: this.queryCondition.code,
        });
        const fileName = `需求管理.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.exportButtonDisabled = false;
      }
    },
    onDone() {
      this.fetchData();
      this.FETCH_PERFORM_EVENT({ name: 'process', });
    },

    /**
     * 针对查看操作的处理
     */
    perviewOptions(type) {
      const state = type;
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchView', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });
      const state1 = ['demand_init', 'demand_inv', 'end_termination', null];
      this.panelArguments.demand.props.showFooter = false;
      this.panelArguments.research.props.showFooter = false;
      this.panelArguments.demandAnalysis.props.showFooter = false;
      this.panelArguments.technicalAnalysis.props.showFooter = false;
      this.panelArguments.demandAssess.props.showFooter = false;
      this.panelArguments.demandReview.props.showFooter = false;

      if (state1.includes(state)) {
        this.panelArguments.demand.props.showTimeLine = true;
        this.panelArguments.demand.width = drawerWidth.small_px;
        this.renderPanelFn(AddNewPanel, this.panelArguments.demand.width, this.panelArguments.demand.props);
      } else {
        this.renderPanelFn(DemandAllPanel, drawerWidth.larger_pr, {});
      }
    },
    renderRouteQueryParamsPanel() {
      if (this.$route.params.itemCode) {
        this.clickOptions('search', this.$route.params);
      }
    },
    optionsDelete(row) {
      this.$confirm(`是否删除「${row.title}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await ProjectAPI.demand.del(row.id);
          this.onDone();
        } catch (e) {
          this.$message.error(e);
        }
      }).catch(() => {});
    },
    optionsBack(row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await ProjectAPI.base.backDemand(row.itemCode);
          this.onDone();
        } catch (e) {
          this.$message.error(e);
        }
      }).catch(() => {});
    },
    optionsEnd(row) {
      this.$dialog({
        title: '终止',
        subTitle: `项目编号:${row.itemCode}`,
        position: 'center',
        width: dialogWidth.small_px,
        component: () => <End onDone={this.onDone} where={'demand'} />,
      });
    },
    optionsToOrder() {
      this.$dialog({
        title: '转工单',
        width: dialogWidth.small_px,
        position: 'center',
        component: () => <ToOrder onDone={this.onDone} />,
      });
    },
    optionsPause(row) {
      this.$dialog({
        title: '暂停原因',
        component: () => <DialogPause itemCode={row.itemCode} onDone={this.onDone}/>,
      });
    },
    async optionsOpen(row) {
      await ProjectAPI.base.demandOrProjectOpen(row.itemCode);
      this.$message.success({
        message: '开启成功!',
        onClose: this.onDone(),
      });
    },

    async clickOptions(v, r) {
      this.SET_ITEM_CODE(r.itemCode);
      this.SET_RESEARCH_INFO({ ...r, });
      if (v !== 'search') {
        this.panelArguments.demand.props.showFooter = true;
        this.panelArguments.research.props.showFooter = true;
        this.panelArguments.demandAnalysis.props.showFooter = true;
        this.panelArguments.technicalAnalysis.props.showFooter = true;
        this.panelArguments.demandAssess.props.showFooter = true;
        this.panelArguments.demandReview.props.showFooter = true;
      }
      if (['del', 'back', 'end', 'toOrder', 'pause', 'open'].includes(v)) {
        if (v === 'del') {
          this.optionsDelete(r);
        } else if (v === 'back') {
          this.optionsBack(r);
        } else if (v === 'end') {
          this.optionsEnd(r);
        } else if (v === 'toOrder') {
          this.optionsToOrder();
        } else if (v === 'pause') {
          this.optionsPause(r);
        } else {
          this.optionsOpen(r);
        }
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        this.SET_PERVIEW(false);
        await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
        const result = await ProjectAPI.base.getAllProjectData(r.itemCode);
        await this.FETCH_PANEL_DATA(result);
        loading.close();
        switch (v) {
        // 编辑状态
          case 'edit':
            this.panelArguments.demand.props.showFooter = true;
            this.panelArguments.demand.props.showTimeLine = true;
            this.panelArguments.demand.width = drawerWidth.small_px;
            this.renderPanelFn(
              AddNewPanel,
              this.panelArguments.demand.width,
              this.panelArguments.demand.props
            );
            break;

          case 'search':

            this.perviewOptions(r.beforePauseState);
            break;
          case 'distribute':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.renderPanelFn(Assign, drawerWidth.larger_pr, { });
            break;
          case 'demand_inv':
            //
            break;
          case 'research':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.panelArguments.research.props.showFooter = true;
            this.renderPanelFn(
              Research,
              this.panelArguments.research.width,
              this.panelArguments.research.props
            );
            break;
          case 'review':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.renderPanelFn(
              Review,
              this.panelArguments.review.width,
              this.panelArguments.review.props
            );
            break;
            // 初定级
          case 'preliminaryLevel':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.renderPanelFn(
              PreliminaryLevelGroup,
              this.panelArguments.review.width,
              this.panelArguments.review.props
            );
            break;
            // 需求分析
          case 'demandAnalysis':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.renderPanelFn(
              DemandAnalysisGroup,
              this.panelArguments.demandAnalysis.width,
              this.panelArguments.demandAnalysis.props
            );
            break;
            // 技术分析
          case 'technicalAnalysis':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
            this.renderPanelFn(
              TechnicalAnalysisGroup,
              this.panelArguments.technicalAnalysis.width,
              this.panelArguments.technicalAnalysis.props
            );
            break;
            // 需求评估
          case 'demandAssess':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
            this.renderPanelFn(
              DemandAssessGroup,
              this.panelArguments.demandAssess.width,
              this.panelArguments.demandAssess.props
            );
            break;
            // 需求评审
          case 'demandReview':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });

            this.renderPanelFn(
              DemandReviewGroup,
              this.panelArguments.demandReview.width,
              this.panelArguments.demandReview.props
            );
            break;
        }
      } catch (error) {
        this.$message.error(error);
        loading.close();
      }
    },
    /**
     * 新增需求
     */
    async addNew() {
      this.SET_ITEM_CODE('');
      await this.FETCH_PANEL_DATA({});

      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: false, });
      this.SET_PANCEL_EDIT({ name: 'needInfo', edit: false, });
      this.panelArguments.demand.width = drawerWidth.mini_px;

      this.panelArguments.demand.props.showFooter = true;
      this.panelArguments.demand.props.showTimeLine = false;
      this.renderPanelFn(
        AddNewPanel,
        this.panelArguments.demand.width,
        this.panelArguments.demand.props
      );
    },

    /**
     * 渲染各种面板
     */
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

    /**
     * 流程图的点击
     */
    changeProcess(type) {
      this.queryCondition.code = type === 'demandStand' ? 'stand' : type;
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
    },

    filterChange(val) {
      for (const i in val) {
        if (i === 'itemType') {
          this.queryCondition['itemSource'] = arrayToString(val[i]);
        } else {
          this.queryCondition[i] = arrayToString(val[i]);
        }
      }
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;

      this.fetchData();
    },
    initTableColumn() {
      this.$store.dispatch('project/needSetting/GET_TABLE_COLUMNS');
    },
    getTableColumnFilters(prop) {
      if (prop === 'principal' || prop === 'users') {
        return this.userInfoFilterValue;
      } else if (prop === 'itemType') {
        return this.whereFilter;
      } else if (prop === 'showState') {
        return this.statusFilter;
      } else {
        return null;
      }
    },
    changeColumn(columns) {
      this.tableColumns = columns;
      this.$refs.table.doLayout();
      this.setTableColumn(columns);
    },
    setTableColumn: _.debounce(async function (columns) {
      this.$store.dispatch('project/needSetting/UPDATE_TABLE_COLUMNS', columns);
    }, 3000),
  },
};
</script>

<style lang="scss" scoped>
 ::v-deep  .base-margin-bottom{
    margin-bottom:0  !important;
}

.demand-container {
  background: rgb(255, 255, 255);
  // margin-left: 12px;
}
.demand-aside {
  background: #fff;
}
.pagination-container {
  text-align: right;
  margin: 16px 24px 0 0;
}
.demand-main-header {
  line-height: 60px;
  height: 60px;
  min-height: 60px;
}
.p-16 {
  padding: 0 16px;
}
.dialog-panel {
  display: flex;
  justify-content: flex-end;
  height: 100%;
}
</style>
