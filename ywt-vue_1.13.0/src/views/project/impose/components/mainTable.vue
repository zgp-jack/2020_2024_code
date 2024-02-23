<!--
   项目实施
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
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
              :cell-class-name="tableStyle.cellClassName"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column label="序号" :fixed="true" align="left" width="85px" type="index" :show-overflow-tooltip="true">
                <template #header>
                  <HeaderSet
                    :column-list="tableColumns"
                    @change="changeColumn"
                  />序号
                </template>
              </el-table-column>
              <el-table-column v-for="(item, index) in showColumnList" :key="item.prop + index" align="left" v-bind="item">
                <template #default="{ row, }">
                  <PopoverProjectInfo v-if="item.prop === 'title'" :info="row" />
                  <span v-else-if="item.prop === 'principal'">{{ row.principal | member }}</span>
                  <span v-else-if="item.prop === 'users'">{{ row.users | formatterUser }}</span>
                  <span v-else-if="item.prop === 'createUser'">{{ row.createUser | member }}</span>
                  <template v-else-if="item.prop === 'startTime'">
                    <span v-if="row.startTime">{{ row.startTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <template v-else-if="item.prop === 'endTime'">
                    <span v-if="row.endTime">{{ row.endTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <PopverProcessListSummary v-else-if="item.prop === 'totalProgress'" :value="row.totalProgress ? row.totalProgress +'%':'-'" :row-data="row" />
                  <template v-else-if="item.prop === 'updateTime'">
                    <span v-if="row.totalProgress === 100" :style="row | timeOutColor">
                      {{ row.updateTime }}
                    </span>
                    <span v-else>-</span>
                  </template>
                  <TableCellAttachment v-else-if="item.prop === 'enclosure'" :data="row.enclosure" />
                  <TableCellApplication v-else-if="item.prop === 'applyNum'" :data="row" />
                  <TableCellMeeting v-else-if="item.prop === 'meetingNum'" :data="row" :key-name="'meetingNum'" />
                  <TableCellContract v-else-if="item.prop === 'contractWaitNum'" :data="row" :key-name="'contractWaitNum'" />
                  <span v-else-if="item.prop === 'enforceState'" :style="convertStatusStyle(row.enforceState)">
                    {{ convertStatus(row.enforceState) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" :fixed="'right'" align="left" min-width="320px" prop="options" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <TableOptionsMenu :data="row" :process-panel-code="processPanelCode" @click="click($event,row)" />
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
import { mapMutations, mapState, } from 'vuex';
import moment from 'moment';
import {
  mixins_base,
  mixins_project_index,
  mixins_task,
} from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import tableStyle from '../../style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '../../common/width/dialog';
import PopoverProjectInfo from '@/views/project/components/popver/projectInfo.vue';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import TableCellMeeting from '@/views/project/components/tableCell/meeting.vue';
import TableCellContract from '@/views/project/components/tableCell/contract.vue';
import TableCellApplication from '@/views/project/components/tableCell/applicationList.vue';
import ChangeProjectTable from './projectTaskTable.vue';
import ChangeApplication from './changeDialog.vue';
import ItemSet from '../../components/panelsGroup/itemSet.vue';
import TableOptionsMenu from './optionsMenu.vue';
import EditLookOrder from '../../components/panelsGroup/reviewPlan.vue';
import DenerateReportDialog from './generateReport/denerateReportDialog.vue';
import { arrayToString, } from '@/utils/common';
import ProjectSummary from '../dialog/summary.vue';
import ProjectWeekly from '../dialog/weekly.vue';
import PopverProcessListSummary from '../popver/summary.vue';
import DialogPause from '@/views/project/needSetting/dialog/pause.vue';
import DialogTermination from '../dialog/termination.vue';
import { statusList, } from '../constants/index';
import HeaderSet from '@/views/project/components/setting/tableHeader.vue';
import _ from 'lodash';

export default {
  name: 'Impose',
  components: {
    TableCellAttachment,
    TableCellMeeting,
    TableCellContract,
    PopoverProjectInfo,
    TableOptionsMenu,
    TableCellApplication,
    PopverProcessListSummary,
    HeaderSet,
  },
  filters: {
    timeOutColor(val) {
      const isTimeBefore = val.updateTime ? moment(val.updateTime).isSameOrBefore(val.endTime) : false;
      return `color:${isTimeBefore ? '' : '#F56C6C'}`;
    },
    formatterUser(val) {
      return arrayToString(val);
    },
  },
  mixins: [mixins_base, mixins_project_index, mixins_task, PaginationTable],
  props: {
    code: {
      type: String,
      default: '',
    },
    queryForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableStyle,
      componentName: 'TaskTable',
      processPanelCode: '',
      listApi: ProjectAPI.impose.getImposeListMain,
      width: 'auto',
      panelArguments: {
        ItemSet: {
          width: drawerWidth.small_px,
          item_program_review: {
            width: drawerWidth.small_px,
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
          props: {
            title: '项目信息',
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
      tableColumns: [],
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),
    dynamicTableColumns() {
      return this.$store.state['project/impose'].tableColumns;
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
    this.renderContractProjectInfo();
  },
  created() {
    this.initTableColumn();
  },
  mounted() {
    this.SET_INJECT_EVENT({ name: 'imposeList', fun: this.fetchData, });
    this.queryCondition.code = this.code;
    this.fetchData();
    this.renderContractProjectInfo();
  },
  methods: {
    ...mapMutations('project/index', ['SET_CONFIRM_REVIEW', 'SET_INJECT_EVENT']),
    query(queryData) {
      Object.assign(this.queryCondition, queryData);
      this.fetchData();
    },
    onDone() {
      this.fetchData();
      this.FETCH_PERFORM_EVENT({ name: 'process', });
    },
    async renderContractProjectInfo() {
      const itemCode = this.$route.query.itemCode;
      if (itemCode) {
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        const info = await ProjectAPI.setUp.getListData({
          pageNum: 1,
          pageSize: 1,
          query: itemCode,
          code: 'all',
        });
        loading.close();
        this.click('searh', info.list[0]);
      }
    },
    async click(type, r) {
      this.SET_ITEM_CODE(r.itemCode);
      let loading = null;

      switch (type) {
        case 'searh':
          this.SET_LOOK_TASK(true);
          try {
            loading = this.$loading({
              lock: true,
              text: '加载中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
            await this.FETCH_PANEL_DATA(await ProjectAPI.setUp.reviewInfo(r.itemCode));
            this.SET_RESEARCH_INFO(r);
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchViewPlan', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.panelArguments['ItemSet'].props.showFooter = false;
            if (this.getterPanelGroupData.demand) {
              this.panelArguments['ItemSet'].width = drawerWidth.larger_pr;
            } else {
              this.panelArguments['ItemSet'].width = drawerWidth.small_px;
            }
            this.renderPanelFn(ItemSet, this.panelArguments['ItemSet'].width, this.panelArguments['ItemSet'].props);
          } finally {
            loading.close();
          }
          break;
        case 'handle':
          this.renderPanelFn(ChangeProjectTable, drawerWidth.larger_pr, { title: '处理', params: r, code: 'handle', });
          break;
        case 'append':
          this.renderPanelFn(ChangeProjectTable, drawerWidth.larger_pr, { title: '任务补充', params: r, code: 'append', });
          break;
        case 'changeApplication':
          this.SET_PERVIEW(false);
          this.SET_RESEARCH_INFO(r);
          this.$dialog({
            title: '变更申请',
            width: dialogWidth.mini_px,
            position: 'center',
            component: () => <ChangeApplication onDone={this.fetchData} data={r}/>,
          });
          break;
        case 'confirm':
          this.renderPanelFn(ChangeProjectTable, drawerWidth.larger_pr, { title: '确认结果', params: r, code: 'confirm', });
          break;
        case 'confirmResult':
          try {
            loading = this.$loading({
              lock: true,
              text: '加载中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
            await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
            await this.FETCH_PANEL_DATA(await ProjectAPI.setUp.reviewInfo(r.itemCode));
            this.SET_RESEARCH_INFO({ ...r, });
            this.SET_ITEM_CODE(r.itemCode);
            this.SET_CONFIRM_REVIEW('confirm');
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.panelArguments['EditLookOrder'].props.title = '确认结果';
            this.panelArguments['EditLookOrder'].props.showFooter = true;
            this.renderPanelFn(EditLookOrder, this.getterPanelGroupData.demand ? drawerWidth.larger_pr : this.panelArguments['EditLookOrder'][r.showState].width, this.panelArguments['EditLookOrder'].props);
          } finally {
            loading.close();
          }
          break;
        // 变更
        case 'change':
          this.renderPanelFn(ChangeProjectTable, drawerWidth.larger_pr, { title: '变更任务', params: r, code: 'change', });
          break;
        case 'generateReport':
          this.denerateReportDialog(r);
          // this.$emit('setGenerateReport', r, true);
          break;
        case 'pause':
          this.$dialog({
            title: '暂停原因',
            component: () => <DialogPause itemCode={r.itemCode} onDone={this.onDone}/>,
          });
          break;
        case 'open':
          await ProjectAPI.base.demandOrProjectOpen(r.itemCode);
          this.$message.success({
            message: '开启成功!',
            onClose: this.onDone(),
          });
          break;
        case 'termination':
          this.$dialog({
            title: '终止原因',
            component: () => <DialogTermination itemCode={r.itemCode} onDone={this.onDone}/>,
          });
          break;
        case 'restart':
          await ProjectAPI.impose.restart({ itemCode: r.itemCode, });
          this.$message.success({
            message: '重启成功!',
            onClose: this.onDone(),
          });
          break;
        case 'summary':
          this.$dialog({
            title: '项目总结',
            width: '688px',
            component: () => <ProjectSummary projectId={r.itemCode} onDone={() => {}}/>,
          });
          break;
        case 'weekly':
          this.$dialog({
            title: '项目周报',
            width: '688px',
            component: () => <ProjectWeekly projectId={r.itemCode} onDone={() => {}}/>,
          });
          break;
      }
    },
    // 生成报告弹窗
    denerateReportDialog(row) {
      this.$dialog({
        title: '生成报告',
        width: '960px',
        component: () => <DenerateReportDialog onDone={this.denerateReportDone} data={row}/>,
      });
    },
    // 生成报告弹窗按钮回调
    denerateReportDone(v, row, checkList) {
      v && this.$emit('setGenerateReport', row, checkList, v);
    },
    async getList(code) {
      if (['notCompleted', 'endCompleted', 'verifyResults'].includes(code)) {
        if (code === 'verifyResults') {
          this.processPanelCode = 'confirmResult';
        } else {
          this.processPanelCode = code;
        }
      } else {
        this.processPanelCode = '';
      }
      // 控制 确认结果的按钮显示
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.code = code;
      this.fetchData();
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
                self.onDone();
              },
            },
          });
        },
      });
    },
    /**
     * 结果确认
     */
    // async clickConfirmResult() {
    //   await ProjectAPI.impose.confirmResult(this.itemCode);
    //   this.$message.success('提交成功');
    //   this.onDone();
    // },
    // 转换状态显示文本
    convertStatus(val) {
      const data = statusList.find(item => item.value === val);
      if (data) {
        return data.name;
      } else {
        return '-';
      }
    },
    // 转换状态样式
    convertStatusStyle(val) {
      if (val === 'demand_pause') {
        return {
          color: '#E6A945',
        };
      } else if (val === 'implement_terminate') {
        return {
          color: '#E64645',
        };
      } else if (val === 'end_project') {
        return {
          color: '#334266',
        };
      } else {
        return {
          color: '#4574E6',
        };
      }
    },
    initTableColumn() {
      this.$store.dispatch('project/impose/GET_TABLE_COLUMNS');
    },
    changeColumn(columns) {
      this.tableColumns = columns;
      // this.$refs.table.doLayout();
      this.setTableColumn(columns);
    },
    setTableColumn: _.debounce(async function (columns) {
      this.$store.dispatch('project/impose/UPDATE_TABLE_COLUMNS', columns);
    }, 3000),
  },

};
</script>

<style lang='scss' scoped>

.pagination-container{
  margin-top: 16px;
  text-align: right;
}
.dialog-panel {
  display: flex;
  justify-content: flex-end;
  height: 100%;
}

</style>
