<!--  -->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <el-row class=" base-margin-left base-margin-top">
            <el-col :span="20">
              <el-row class="el-row">
                <el-col :span="6" class="el-col">
                  <el-input v-model="searchData.query" size="mini" placeholder="需求/项目名称" />
                </el-col>
                <el-col :span="6" class="el-col">
                  <el-date-picker
                    v-model="searchData.time"
                    class="w-100"
                    size="mini"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-col>
                <el-col :span="6" class="el-col">
                  <UserSelect v-model="searchData.principal" size="mini" :multiple="true" placeholder="责任人" />
                </el-col>
                <el-col :span="6" class="el-col">
                  <UserSelect
                    v-model="searchData.users"
                    placeholder="参与人"
                    multiple
                    size="mini"
                  />
                </el-col>
                <el-col :span="6" class="el-col">
                  <UserSelect v-model="searchData.createUser" size="mini" :multiple="true" placeholder="创建人" />
                </el-col>
                <el-col :span="6" class="el-col">
                  <DicMultipleSelect
                    v-model="searchData.level"
                    collapse-tags
                    dic-key="itemPriority"
                    placeholder="项目优先级"
                    size="mini"
                    class="w-100"
                  />
                </el-col>
                <el-col :span="6" class="el-col">
                  <DicMultipleSelect
                    v-model="searchData.showStateStr"
                    collapse-tags
                    dic-key="itemProcessShow"
                    placeholder="状态"
                    size="mini"
                    class="w-100"
                  />
                </el-col>

              </el-row>
            </el-col>
            <el-col :span="4">
              <el-col :span="12">
                <pure-button type="wire-frame" label="重置" @click="clickReset" />
              </el-col>
              <el-col :span="12">
                <pure-button label="查询" @click="clickSearch" />
              </el-col>
              <el-col :span="12">
                <pure-button type="wire-frame" :disabled="downButtonDisable" label="导出" @click="onExport" />
              </el-col>
            </el-col>
          </el-row>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :data="data"
              border
              size="mini"
              :tree-props="{ children: 'children' }"
              row-key="id"
              :cell-style="tableStyle.cellStyle"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                v-for="(v, i) in showTableColumns"
                :key="i"
                :label="v.label"
                :type="v.type"
                :property="v.property"
                :fixed="v.fixed"
                :width="v.w"
                align="left"
                :formatter="v.formatter"
                :column-key="v.property"
                :show-overflow-tooltip="v.overflow"
              >
                <template v-if="v.property === 'options'" #default="{ row }">
                  <OptionsMenu :data="row" @click="click($event, row)" />
                </template>
                <template #header>
                  <template v-if="v.type === 'index'">
                    <el-popover
                      style="padding:0"
                      popper-class="no-padding"
                      placement="bottom-start"
                      width="400"
                      :offset="-16"
                      :visible-arrow="false"
                      trigger="click"
                    >
                      <el-tabs type="border-card" value="tableColumn">
                        <el-tab-pane label="表头设置" name="tableColumn">
                          <pure-draggable :data="tableColumns" :has-checked="true" @change="handleTableColumnChange" />
                        </el-tab-pane>
                      </el-tabs>
                      <i slot="reference" class="el-icon-s-operation" />
                    </el-popover>
                    序号
                  </template>
                  <span v-else>{{ v.label }}</span>
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

import { mapActions, } from 'vuex';
import moment from 'moment';
import { tableConfig, } from './components/config/table.config';
import { mapState, } from 'vuex';
import { mixins_base, mixins_project_index, mixins_task, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import tableStyle from '../style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import { debounce, } from 'lodash';

import UserSelect from '../components/userSelect/index';
import DicMultipleSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';

// import ChangeApplication from '../impose/components/changeDialog.vue';
// import HandleTable from '../impose/components/handleTable.vue';
import ToOrder from '../needSetting/components/toOrder.vue';
import End from '../components/task/end.vue';
import { arrayToString, } from '@/utils/common';
import Research from '../components/panelsGroup/research.vue';
import ItemSet from '../components/panelsGroup/itemSet.vue';
import AddNewPanel from '../components/panelsGroup/addNew.vue';
import EditLookOrder from '../components/panelsGroup/editLookOrder.vue';
import Review from '../components/panelsGroup/review.vue';
import NeedAssign from '../needSetting/components/needAssign.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import DemandAnalysisGroup from '../components/panelsGroup/demandAnalysisGroup.vue';
import TechnicalAnalysisGroup from '../components/panelsGroup/technicalAnalysisGroup.vue';
import DemandAssessGroup from '../components/panelsGroup/demandAssessGroup.vue';
import DemandReviewGroup from '../components/panelsGroup/demandReviewGroup.vue';
import downLoadFile from '@/utils/downLoad';
import PureDraggable from '@/components/draggable';

export default {
  name: 'XmXmcx',
  components: {
    UserSelect,
    DicMultipleSelect,
    OptionsMenu: () => import('./components/optionsMenu.vue'),
    PureDraggable,
  },
  mixins: [mixins_base, mixins_project_index, mixins_task, PaginationTable],
  data() {
    return {
      listApi: ProjectAPI.search.search,
      tableStyle,
      tableConfig,
      result: {},
      componentName: 'TaskTable',
      width: 'auto',

      panelArguments: {
        demand: {
          width: drawerWidth.small_px,
          props: {
            title: '需求信息',
            hiddenSaveButton: true,
            showFooter: true,
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
        ItemSet: {
          width: drawerWidth.small_px,
          null: {
            width: drawerWidth.small_px,
          },
          end_termination: {
            width: drawerWidth.small_px,

          },
          item_program_review: {
            width: drawerWidth.small_px,
          },
          item_establish: {
            width: drawerWidth.larger_pr,
          },
          program_review_reject: {
            width: drawerWidth.small_px,
          },
          implement_start: {
            width: drawerWidth.small_px,
          },
          implement_over: {
            width: drawerWidth.small_px,
          },
          item_before_project: {
            width: drawerWidth.small_px,
          },
          end_project: {
            width: drawerWidth.small_px,
          },
          reject_end: {
            width: drawerWidth.small_px,
          },
          props: {
            title: '项目信息',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        DemandReviewGroup: {
          width: drawerWidth.larger_pr,
          item_establish: {
            width: drawerWidth.larger_pr,
          },
          props: {
            title: '需求评审',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        Research: {
          width: drawerWidth.larger_pr,
          item_establish: {
            width: drawerWidth.larger_pr,
          },
          props: {
            title: '调研',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        EditLookOrder: {
          width: drawerWidth.larger_pr,
          item_program_review: {
            width: drawerWidth.larger_pr,
          },
          item_before_project: {
            width: drawerWidth.larger_pr,
          },
          implement_over: {
            width: drawerWidth.larger_pr,
          },
          props: {
            title: '评审',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
      },
      downButtonDisable: false,
      searchData: {
        query: '',
        time: [],
        createUser: '',
        principal: '',
        users: '',
        showStateStr: '',
        level: '',
      },
      tableColumns: [],
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),
    dynamicTableColumns() {
      return this.$store.state['project/search'].tableColumns;
    },
    showTableColumns() {
      const tableColumnsProp = this.dynamicTableColumns.filter(item => item.checked).map(item => item.prop);
      const orderMap = this.dynamicTableColumns.reduce((acc, cur, index) => {
        acc[cur.prop] = index + 1;
        return acc;
      }, {});
      const result = [];
      tableConfig.forEach(item => {
        if (item.type === 'index') {
          item.order = 0;
          result.push(item);
        } else if (item.property === 'options') {
          item.order = 10000;
          result.push(item);
        } else if (tableColumnsProp.includes(item.property)) {
          item.order = orderMap[item.property];
          result.push(item);
        }
      });
      result.sort((a, b) => a.order - b.order);
      return result;
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
    // this.init();
    this.DISPATCHT_GET_USER_LIST();
    this.fetchData();
  },
  created() {
    this.initTableColumn();
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
    this.fetchData();
  },
  methods: {
    initTableColumn() {
      this.$store.dispatch('project/search/GET_TABLE_COLUMNS');
    },
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    async onExport() {
      const searchValue = {
        level: this.searchData.level || '',
        showStateStr: arrayToString(this.searchData.showStateStr) || '',
        startTime: this.timeIsValue() ? moment(this.searchData.time[0]).format('YYYY-MM-DD ') : '',
        endTime: this.timeIsValue() ? moment(this.searchData.time[1]).format('YYYY-MM-DD') : '',
        principal: this.searchData.principal || '',
        users: this.searchData.users || '',
        createUser: this.searchData.createUser || '',
        query: this.searchData.query || '',

      };
      if (Object.values(searchValue).join('')) {
        try {
          const loading = this.$loading({ lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)', });
          this.downButtonDisable = true;
          Object.assign(searchValue, {
            pageNum: this.queryCondition.pageNum,
            pageSize: 999, });
          const res = await ProjectAPI.exportJointQueryExcel(searchValue);
          loading.close();
          const fileName = `联合查询.xlsx`;
          downLoadFile(res, fileName, () => {
            this.downButtonDisable = false;
          });
        } catch (err) {
          //
        } finally {
          this.downButtonDisable = false;
        }
      } else {
        this.downButtonDisable = false;
        this.$message.warning('请设置查询条件');
      }
    },
    timeIsValue() {
      if (this.searchData.time && this.searchData.time.length) {
        return true;
      }
      return false;
    },
    clickSearch: debounce(function () {
      const self = this;
      const searchValue = {
        level: this.searchData.level || '',
        showStateStr: arrayToString(this.searchData.showStateStr) || '',
        startTime: self.timeIsValue() ? moment(self.searchData.time[0]).format('YYYY-MM-DD ') : '',
        endTime: self.timeIsValue() ? moment(self.searchData.time[1]).format('YYYY-MM-DD') : '',
        principal: this.searchData.principal || '',
        users: this.searchData.users || '',
        createUser: this.searchData.createUser || '',
        query: this.searchData.query || '',
      };

      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition = searchValue;
      this.fetchData();
    }, 300),
    clickReset: debounce(function () {
      this.searchData = {
        query: '',
        time: [],
        createUser: '',
        principal: '',
        users: '',
        showStateStr: '',
        level: '',
      };
      const searchValue = {
        startTime: '',
        endTime: '',
        level: '',
        showStateStr: '',
        principal: '',
        users: '',
        createUser: '',
        query: '',
      };
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition = searchValue;
      this.fetchData();
    }, 300),

    optionsDemandDel(r) {
      this.$confirm(`是否删除「${r.title}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ProjectAPI.demand.del(r.id);
            this.onDone();
          } catch (e) {
            this.$message.error(e);
          }
        })
        .catch(() => {});
      return;
    },
    optionsBack(r) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ProjectAPI.base.backDemand(r.itemCode);
            this.onDone();
          } catch (e) {
            this.$message.error(e);
          }
        })
        .catch(() => {});
    },
    optionsEnd(r) {
      this.$dialog({
        title: '终止',
        subTitle: `项目编号:${r.itemCode}`,
        position: 'center',
        width: '548px',
        component: () => <End onDone={this.onDone} />,
      });
    },
    optiosnDemandToOrder() {
      this.$dialog({
        title: '转工单',
        width: '548px',
        position: 'center',
        component: () => <ToOrder onDone={this.onDone} />,
      });
    },
    optionsDistribute(r) {
      this.$dialog({
        title: '需求分配',
        position: 'center',
        subTitle: `需求编号：${r.itemCode}`,
        width: '544px',
        component: () => <NeedAssign onDone={this.onDone} />,
      });
    },
    optionsDemandReasearch() {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.panelArguments.research.props.showFooter = true;
      this.renderPanelFn(
        Research,
        this.panelArguments.research.width,
        this.panelArguments.research.props
      );
    },
    optionsDemandReview() {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.renderPanelFn(
        Review,
        this.panelArguments.review.width,
        this.panelArguments.review.props
      );
    },
    optionsDemandEdit(r) {
      this.panelArguments.demand.props.showFooter = true;
      this.renderPanelFn(
        AddNewPanel,
        this.panelArguments.demand.width,
        this.panelArguments.demand.props
      );
    },
    optionsDemandSearch(type) {
      const state = type;
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchView', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });

      const state1 = ['demand_init', 'demand_inv', 'end_termination', null];
      const state2 = ['demand_inv_review_next', 'end_project_order', 'demand_analysis'];
      const state3 = ['technical_analysis'];
      const state4 = ['demand_assess'];
      const state5 = ['demand_inv_review', ''];
      // 未通过（需求评审）  已立项
      const state6 = ['end_inv_reject', 'item_establish'];
      // 未通过（需求评估）
      const state7 = ['end_assess_reject'];
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
      } else if (state2.includes(state)) {
        this.renderPanelFn(Research, this.panelArguments.research.width, this.panelArguments.research.props);
      } else if (state3.includes(state)) {
        this.renderPanelFn(DemandAnalysisGroup, this.panelArguments.demandAnalysis.width, this.panelArguments.demandAnalysis.props);
      } else if (state4.includes(state)) {
        this.renderPanelFn(TechnicalAnalysisGroup, this.panelArguments.technicalAnalysis.width, this.panelArguments.technicalAnalysis.props);
      } else if (state5.includes(state)) {
        this.renderPanelFn(DemandAssessGroup, this.panelArguments.demandAssess.width, this.panelArguments.demandAssess.props);
      } else if (state6.includes(state)) {
        this.renderPanelFn(DemandReviewGroup, this.panelArguments.demandReview.width, this.panelArguments.demandReview.props);
      } else if (state7.includes(state)) {
        this.renderPanelFn(DemandAssessGroup, this.panelArguments.demandReview.width, this.panelArguments.demandReview.props);
      }
    },
    optionsStandSearch(row) {
      const state = row.showState;
      let componentName = '';
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchViewPlan', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      const searchResult = [
        {
          memo: '(方案编辑 => 需求 + 调研)/',
          type: ['item_establish'],
          componentName: 'DemandReviewGroup',
        },
        {
          memo: '(项目实施)/(项目结束)/(方案制定=> 评审)',
          type: [
            'implement_start',
            'item_before_project',
            'item_program_review',
            'implement_over',
            'reject_end',
            'end_termination'
          ],
          componentName: 'ItemSet',
        }
      ];
      for (const i of searchResult) {
        if (i.type.includes(state)) {
          componentName = i.componentName;
          break;
        } else {
          componentName = 'ItemSet';
        }
      }
      this.panelArguments[componentName].props.title = '查看';
      this.panelArguments[componentName].props.showFooter = false;
      if (
        [
          'item_before_project',
          'program_review_reject',
          'end_project',
          'implement_over',
          'item_program_review',
          'implement_start',
          null,
          'null',
          'reject_end',
          'end_termination'
        ].includes(state)
      ) {
        if (this.getterPanelGroupData.demand) {
          this.panelArguments[componentName][state].width = drawerWidth.larger_pr;
        } else {
          this.panelArguments[componentName][state].width = drawerWidth.small_px;
        }
      }
      this.renderPanelFn(
        componentName === 'Research' ? Research : ItemSet,
        this.panelArguments[componentName][state].width,
        this.panelArguments[componentName].props
      );
    },
    optionsStandDel(r) {
      this.$confirm(`是否删除「${r.title}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ProjectAPI.setUp.del(r.id);
            this.onDone();
          } catch (e) {
            this.$message.error(e);
          }
        })
        .catch(() => {});
    },
    optionsStandEdit(r) {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_TASK_PERMISSION_NAME('');
      // 判断是否是项目负责人 还是项目的创建人
      if (Number(r.principal) === this.myId || Number(r.createUser === this.myId)) {
        this.SET_TASK_PERMISSION_NAME('leader');
        // 判断是否是 项目参与人员
      } else if (r.joinUser?.includes(this.myId)) {
        this.SET_TASK_PERMISSION_NAME('join');
        this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
        // 判断是否是该项目的任务成员
      } else if (r.users?.includes(this.myId)) {
        this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
      }
    },
    optionsStandSet(r) {
      // TODO  后续判断 在面板里面做权限判定
      // 判断是否是项目负责人’
      if (Number(r.principal) === this.myId || Number(r.createUser === this.myId)) {
        this.SET_TASK_PERMISSION_NAME('leader');
        // 判断是否是 项目参与人员
      } else if (r.joinUser?.includes(this.myId)) {
        this.SET_TASK_PERMISSION_NAME('join');

        this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
        // 判断是否是该项目的任务成员
      } else if (r.users?.includes(this.myId)) {
        this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
      }

      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
    },
    optionsStandReview() {
      this.SET_CONFIRM_REVIEW('review');
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
    },

    handelRenderPanel(planName, title, state) {
      this.panelArguments[planName].props.title = title;
      this.panelArguments[planName].props.showFooter = true;
      const width = this.getterPanelGroupData.demand ? drawerWidth.larger_pr : this.panelArguments[planName][state].width;
      let component = null;
      if (planName === 'ItemSet') {
        component = ItemSet;
      } else if (planName === 'Research') {
        component = Research;
      } else if (planName === 'EditLookOrder') {
        component = EditLookOrder;
      } else {
        //
      }
      this.renderPanelFn(
        component,
        width,
        this.panelArguments[planName].props
      );
    },

    async click(info, r) {
      const type = info.code;
      let title = '';
      let componentName = '';
      const beforePauseState = r.beforePauseState;
      if (type !== 'standEdit' && type !== 'standSet') {
        this.SET_LOOK_TASK(true);
      } else {
        this.SET_LOOK_TASK(false);
      }
      if (!['demandDel', 'back', 'end'].includes(type)) {
        this.SET_PERVIEW(false);
        await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
        const result = await ProjectAPI.base.getAllProjectData(r.itemCode);
        await this.FETCH_PANEL_DATA(result);
        this.SET_RESEARCH_INFO(r);
        this.SET_ITEM_CODE(r.itemCode);
      }

      switch (type) {
        case 'end':
          this.optionsEnd(r);
          return;
        case 'back':
          this.optionsBack(r);
          return;
        case 'demandDel':
          this.optionsDemandDel(r);
          return;
        case 'demandToOrder':
          this.optiosnDemandToOrder();
          return;
        case 'demandSearch':
          this.optionsDemandSearch(beforePauseState);
          return;
        case 'demandEdit':
          this.optionsDemandEdit();
          break;
        case 'distribute':
          this.optionsDistribute();
          return;
        case 'demandResearch':
          this.optionsDemandReasearch();
          return;
        case 'demandReview':
          this.optionsDemandReview();
          return;
        case 'standSearch':
          this.optionsStandSearch(r);
          return;
        case 'standDel':
          this.optionsStandDel(r);
          return;
        case 'standEdit':
          componentName = 'ItemSet';
          title = '编辑';
          this.optionsStandEdit(r);
          break;
        case 'standSet':
          title = '方案制定';
          componentName = 'ItemSet';
          this.optionsStandSet(r);
          break;
        case 'standReview':
          componentName = 'EditLookOrder';
          title = '评审方案';
          this.optionsStandReview();
          break;

        // case 'handle':
        //   this.SET_LOOK_TASK(false);
        //   this.renderPanelFn(HandleTable, '80%', { handleTitle: '处理', });
        //   break;
        // case 'change':
        //   this.$dialog({
        //     title: '变更申请',
        //     width: '688px',
        //     position: 'center',
        //     component: () => <ChangeApplication onDone={this.fetchData}/>,
        //   });
        //   break;
        // case 'confirm':
        //   this.SET_LOOK_TASK(false);
        //   this.renderPanelFn(HandleTable, '80%', { handleTitle: '确认', });

        //   break;
      }
      this.handelRenderPanel(componentName, title, beforePauseState);
    },

    /**
     * 渲染各种面板
     */
    renderPanelFn(component, width, props) {
      const self = this;
      this.$drawer({
        width: width,
        component: () => {
          return self.$createElement(component, {
            props: props,
            on: {
              done: () => {
                self.fetchData();
              },
            },
          });
        },
      });
    },
    /**
     * 结果确认
     */
    async clickConfirmResult() {
      await ProjectAPI.impose.confirmResult(this.itemCode);
      this.$message.success('提交成功');
    },
    handleTableColumnChange(newVal) {
      this.$store.dispatch('project/search/UPDATE_TABLE_COLUMNS', newVal);
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep  .base-margin-bottom{
    margin-bottom:0  !important;
}
.el{
  &-col{
    margin-bottom: 12px;
    padding:0 6px 0 6px  ;

  }
}
.w{
  &-100{
    width: 100%;
  }
}
.t-r {
  text-align: right;
}
</style>
