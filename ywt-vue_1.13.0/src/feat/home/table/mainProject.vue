<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-11-03 18:10:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:39:00
 * @Description:
-->
<template>
  <el-container>
    <el-main>
      <table-area>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :max-height="tableMaxHeight"
              border
              :data="data"
              :empty-text="emptyText"
              :tree-props="{ children: 'children' }"
              row-key="id"
              :cell-style="tableStyle.cellStyle"
              :cell-class-name="tableStyle.cellClassName"
            >
              <el-table-column label="序号" :fixed="true" align="left" width="85px" type="index" :show-overflow-tooltip="true" />
              <el-table-column label="项目名称" :fixed="true" align="left" width="245px" prop="title" :show-overflow-tooltip="false">
                <template #default="{row}">
                  <PopoverProjectInfo :info="row" />
                </template>
              </el-table-column>
              <el-table-column label="负责人" :fixed="false" align="left" width="102px" prop="principal" :show-overflow-tooltip="true">
                <template #default="{row}">
                  {{ row.principal | member }}
                </template>
              </el-table-column>
              <el-table-column label="参与人员" :fixed="false" align="left" width="142px" prop="users" :show-overflow-tooltip="true">
                <template #default="{row}">
                  {{ row.users | formatterUser }}
                </template>
              </el-table-column>
              <el-table-column label="创建人" :fixed="false" align="left" width="90px" prop="createUser" :show-overflow-tooltip="true">
                <template #default="{row}">
                  {{ row.createUser | member }}
                </template>
              </el-table-column>
              <el-table-column label="开始日期" :fixed="false" align="left" width="200px" prop="startTime" :show-overflow-tooltip="true">
                <template #default="{row}">
                  {{ row.startTime | date('YYYY-MM-DD') }}
                </template>
              </el-table-column>
              <el-table-column label="结束日期" :fixed="false" align="left" width="200px" prop="endTime" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <template v-if="row.endTime">
                    {{ row.endTime | date('YYYY-MM-DD') }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="进度" :fixed="false" align="left" width="94px" prop="totalProgress" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <template v-if="row.totalProgress">
                    {{ row.totalProgress }}%
                  </template>
                  <template v-else>
                    -
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="实际完成日期" :fixed="false" align="left" width="220px" prop="updateTime" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <span v-if="row.totalProgress === 100" :style="row | timeOutColor">
                    {{ row.updateTime }}
                  </span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="附件" :fixed="'right'" align="left" width="60px" prop="enclosure" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <TableCellAttachment :data="row.enclosure" />
                </template>
              </el-table-column>
              <el-table-column label="变更" :fixed="'right'" align="left" width="60px" prop="applyNum" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <TableCellApplication :data="row" />
                </template>
              </el-table-column>
              <el-table-column label="会议" :fixed="'right'" align="left" width="60px" prop="meetingNum" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <TableCellMeeting :data="row" :key-name="'meetingNum'" />
                </template>
              </el-table-column>
              <el-table-column label="合同/发票" :fixed="'right'" align="left" width="110px" prop="contractNum" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <TableCellContract :data="row" :key-name="'contractNum'" />
                </template>
              </el-table-column>
              <el-table-column label="操作" :fixed="'right'" align="left" width="320px" prop="options" :show-overflow-tooltip="true">
                <template #default="{row}">
                  <ImposeOptionsMenu :data="row" :only-view="queryCondition.showRange!==0" @click="click($event,row)" />
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
      </table-area>
    </el-main>
  </el-container>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import { mapMutations, mapState, } from 'vuex';
import moment from 'moment';

import {
  mixins_base,
  mixins_project_index,
  mixins_task,
} from '@/minxins/project';
import ProjectAPI from '@/apis/project';
import HomeApi from '@/apis/home';
import tableStyle from '@/views/project/style/table';
import TableArea from '@/views/components/common/tableArea.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';
import TableCellContract from '@/views/project/components/tableCell/contract.vue';
import TableCellApplication from '@/views/project/components/tableCell/applicationList.vue';
import TableCellMeeting from '@/views/project/components/tableCell/meeting.vue';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import PopoverProjectInfo from '@/views/project/components/popver/projectInfo.vue';

import ChangeProjectTable from '@/views/project/impose/components/projectTaskTable.vue';

import ChangeApplication from '@/views/project/impose/components/changeDialog.vue';
import ItemSet from '@/views/project/components/panelsGroup/itemSet.vue';
import ImposeOptionsMenu from '@/views/project/impose/components/optionsMenu.vue';
import EditLookOrder from '@/views/project/components/panelsGroup/reviewPlan.vue';
import { arrayToString, } from '@/utils/common';

export default {
  components: {
    PopoverProjectInfo,
    TableCellContract,
    TableCellApplication,
    TableCellMeeting,
    TableCellAttachment,
    ImposeOptionsMenu,
    TableArea,
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
  mixins: [PaginationTable, mixins_base, mixins_project_index, mixins_task],
  props: {
    queryData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      btnText: '切换甘特图',
      tableStyle,
      loading: false,
      result: {},
      componentName: 'TaskTable',
      dialogParams: {
        visible: false,
        title: '需求信息',
        nameCode: '',
        hiddenSaveButton: true,
      },
      width: 'auto',
      SW: {
        keyWord: '',
        W: {
          code: '',
        },
        N: 10,
        P: 1,
      },
      listApi: HomeApi.projectList,
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
    };
  },
  computed: {
    ...mapState('project/index', ['imposeOptionsVisibles']),
    ...mapState('login', ['userInfo']),

  },
  watch: {
    queryData: {
      handler(newVal) {
        this.queryCondition.startTime = newVal.dateRange?.[0];
        this.queryCondition.endTime = newVal.dateRange?.[1];
        this.queryCondition.sendUser = newVal.sendUser?.join(',');
        this.queryCondition.waitWork = newVal.waitWork;
        this.queryCondition.showRange = newVal.showRange;
        this.fetchData();
      },
      deep: true,
    },
  },

  async created() {
    this.SET_INJECT_EVENT({ name: 'imposeList', fun: this.fetchData, });

    this.DISPATCHT_GET_USER_LIST();

    this.queryCondition.startTime = this.queryData.dateRange?.[0];
    this.queryCondition.endTime = this.queryData.dateRange?.[1];
    this.queryCondition.sendUser = this.queryData.sendUser?.join(',');
    this.queryCondition.waitWork = this.queryData.waitWork;
    this.queryCondition.showRange = this.queryData.showRange;
    this.queryCondition.pageNum = this.currentPage;
    this.queryCondition.pageSize = this.pageSize;

    this.queryCondition.processStr = 'item_program_review,implement_start,item_before_project,implement_over';

    this.fetchData();
  },

  methods: {
    ...mapMutations('project/index', ['SET_CONFIRM_REVIEW', 'SET_INJECT_EVENT']),
    onDrawerDone() {
      this.$emit('update');
      this.fetchData();
    },
    async click(type, r) {
      this.SET_ITEM_CODE(r.itemCode);
      let loading = null;
      switch (type) {
        case 'searh':
          try {
            loading = this.$loading({
              lock: true,
              text: '加载中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
            this.SET_LOOK_TASK(true);
            await this.FETCH_PANEL_DATA(await ProjectAPI.setUp.reviewInfo(r.itemCode));
            this.SET_ITEM_CODE(r.itemCode);
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
          } catch (error) {
            loading.close();
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
            component: () => <ChangeApplication data={r} onDone={this.onDrawerDone}/>,
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
            this.renderPanelFn(EditLookOrder,
              this.getterPanelGroupData.demand ? drawerWidth.larger_pr : this.panelArguments['EditLookOrder'][r.showState].width,
              this.panelArguments['EditLookOrder'].props
            );
          } catch (error) {
            this.$message.error(error);
          } finally {
            loading.close();
          }
          break;
          // 变更
        case 'change':
          this.renderPanelFn(ChangeProjectTable, drawerWidth.larger_pr, { title: '变更任务', params: r, code: 'change', });
          break;
      }
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
                self.onDrawerDone();
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
      this.dialogParams.visible = false;
    },

  },
};
</script>

<style lang="scss" scoped>

</style>
