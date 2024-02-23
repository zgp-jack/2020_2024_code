
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <div class="flex  ">
            <ProcessPanel
              :key="'stand'"
              :active-button="defaultCode"
              active-panel-name="stand"
              :show-header="showApprovalPanel"
              @click="changeProcess"
            >
              <el-row class="approval-main-header p-16">
                <el-col :span="1">
                  <JYWCaretButton @click="showApprovalPanel = !showApprovalPanel" />
                </el-col>
                <el-col :span="11">
                  <search v-model="searchValue" class="base-margin-right" style="width: 200px" />
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <!-- <pure-button size="mini" label="导出" type="wire-frame" /> -->
                  <pure-button
                    size="mini"
                    label="新增项目"
                    @click="addProject"
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
                  <template v-else-if="item.prop === 'sponsor'">
                    <span v-if="row.sponsor">
                      {{ row.sponsor }}
                    </span>
                    <span v-else>
                      {{ row.createUser | member }}
                    </span>
                  </template>
                  <span v-else-if="item.prop === 'principal'">{{ row.principal | member }}</span>
                  <span v-else-if="item.prop === 'joinUser'">{{ row | joinUsers | member }}</span>
                  <template v-else-if="item.prop === 'startTime'">
                    <span v-if="row.startTime">{{ row.startTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <template v-else-if="item.prop === 'endTime'">
                    <span v-if="row.endTime">{{ row.endTime | date('YYYY-MM-DD') }}</span>
                    <span v-else>-</span>
                  </template>
                  <TableCellAttachment v-else-if="item.prop === 'enclosure'" :data="row.enclosure" />
                  <template v-else-if="item.prop === 'showState'">
                    <span v-if="!row.showState">
                      待提交
                    </span>
                    <span v-else-if="row.state" :style=" row.showState | color">
                      {{ row.showState | needStatus }}
                    </span>
                    <span v-else>
                      未提交
                    </span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="left" :show-overflow-tooltip="false" label="操作" :fixed="'right'" min-width="247px">
                <template #default="{row}">
                  <TableOptionsMenu
                    :data="row"
                    @click="clickOptions($event, row)"
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
import {
  mixins_base,
  mixins_project_index,
  mixins_task,
} from '@/minxins/project/index';
import { mapGetters, mapMutations, mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';
import { arrayToString, } from '@/utils/common';
import tableStyle from '../style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import ProcessPanel from '@/views/project/components/navigationPanel/processPanel.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';
import _ from 'lodash';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import PanelGroupAll from '../components/panelsGroup/hxey_demandAll.vue';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';
import DialogPause from '@/views/project/needSetting/dialog/pause.vue';
import HeaderSet from '@/views/project/components/setting/tableHeader.vue';

export default {
  name: 'XmXmlxps',
  components: {
    ProcessPanel,
    TableCellAttachment,
    DemandOrProjectName,
    // eslint-disable-next-line vue/no-unused-components
    ItemSet: () => import('../components/panelsGroup/itemSet.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Research: () => import('../components/panelsGroup/research.vue'),
    // eslint-disable-next-line vue/no-unused-components
    DemandReviewGroup: () => import('../components/panelsGroup/demandReviewGroup.vue'),

    // eslint-disable-next-line vue/no-unused-components
    Review: () => import('../components/panelsGroup/review.vue'),
    // eslint-disable-next-line vue/no-unused-components
    EditLookOrder: () => import('../components/panelsGroup/reviewPlan.vue'),
    TableOptionsMenu: () => import('./components/optionsMenu.vue'),
    // eslint-disable-next-line vue/no-unused-components
    HandlePanel: () => import('../components/panelsGroup/handlePanel.vue'),
    // eslint-disable-next-line vue/no-unused-components
    End: () => import('../components/task/end.vue'),
    // eslint-disable-next-line vue/no-unused-components
    HeaderSet,
  },
  filters: {
    joinUsers(val) {
      let joinUser = '';
      if (val.joinUser === '[]' || val.joinUser === null) {
        joinUser = '';
      } else {
        joinUser = val.joinUser + ',';
      }
      const allUsers = joinUser + (val.users || '');
      const all = _.uniq(allUsers.split(',')).toString();
      return all;
    },
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
        field: ['demand_inv', 'demand_inv_review_next'],
        color: '409EFF',
        memo: '蓝色',

      }
      ];
      if (!val) {
        return `#E040FB`;
      }
      const rs = _.find(config, (v, i) => {
        return v.field.includes(val.toString());
      });
      return rs ? `color:#${rs.color}` : '';
    },
  },
  mixins: [mixins_base, mixins_project_index, mixins_task, PaginationTable],
  data() {
    return {
      tableStyle,
      showApprovalPanel: true,
      defaultCode: 'stand',
      tableData: [],
      need_code: '',
      visibles: {
        visible: false,
        endVisible: false,
      },
      componentName: '',
      isSubmit: false,
      listApi: ProjectAPI.setUp.getListData,
      isInit: false,
      panelArguments: {
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
            title: '新增项目',
            hiddenSaveButton: true,
            showFooter: true,
            showTimeLine: true,
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
      tableColumns: [],
    };
  },
  computed: {
    ...mapState('login', {
      myId: (v) => {
        return Number(v.userInfo.id) || 0;
      },
    }),
    ...mapState('dictionary', {
      urgentFilter: (v) => {
        return _.map(v.dicList.itemPriority, (e) => {
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
    ...mapGetters(['userInfo']),
    userInfoFilterValue() {
      return [{
        text: this.userInfo.name,
        value: this.userInfo.id,
      }];
    },
    dynamicTableColumns() {
      return this.$store.state['project/setup'].tableColumns;
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
    // this.renderRouteQueryParamsPanel();
    this.DISPATCHT_GET_USER_LIST();
    this.queryCondition.code = this.defaultCode;
    this.currentPage = 1;
    this.queryCondition.pageNum = this.currentPage;
    this.fetchData();
  },
  created() {
    this.initTableColumn();
  },
  methods: {
    ...mapMutations('project/index', ['SET_CONFIRM_REVIEW', 'SET_TASK_PERMISSION_NAME']),
    onDone() {
      this.fetchData();
      this.FETCH_PERFORM_EVENT({ name: 'process', });
    },

    /**
     * 针对查看操作的处理
     */
    perviewOptions() {
      let width = '';
      if (this.getterPanelGroupData.demand) {
        width = drawerWidth.larger_pr;
      } else {
        width = drawerWidth.small_px;
      }

      this.renderPanelFn(
        PanelGroupAll,
        width,
        {
          where: 'project',
          width: width,
        }
      );
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
          await ProjectAPI.setUp.del(row.id);
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
        component: () => <End onDone={this.onDone} />,
      });
    },
    optionsBack(row) {
      this.$confirm('正在执行撤销操作, 是否继续?', '提示', {
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
      if (['end', 'del', 'back', 'pause', 'open'].includes(v)) {
        if (v === 'end') {
          this.optionsEnd(r);
        } else if (v === 'del') {
          this.optionsDelete(r);
        } else if (v === 'back') {
          this.optionsBack(r);
        } else if (v === 'pause') {
          this.optionsPause(r);
        } else {
          this.optionsOpen(r);
        }
        return;
      }
      let title = '';
      let componentName = '';
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const showState = r.beforePauseState;
      await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
      try {
        const result = await ProjectAPI.setUp.reviewInfo(r.itemCode);
        await this.FETCH_PANEL_DATA(result);
        this.SET_RESEARCH_INFO({ ...r, });
        loading.close();

        if (v !== 'edit' && v !== 'set') {
          this.SET_LOOK_TASK(true);
        } else {
          this.SET_LOOK_TASK(false);
        }

        switch (v) {
          case 'search':
            this.perviewOptions(showState);
            return;
            // 编辑状态
          case 'edit':
            componentName = 'ItemSet';
            this.panelArguments[componentName].props.showTimeLine = true;
            title = '编辑';
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.SET_TASK_PERMISSION_NAME('');
            // 判断是否是项目负责人 还是项目的创建人
            if (Number(r.principal) === this.myId || Number(r.createUser === this.myId)) {
              this.SET_TASK_PERMISSION_NAME('leader');
              this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: false, });

            // 判断是否是 项目参与人员
            } else if (r.joinUser?.includes(this.myId)) {
              this.SET_TASK_PERMISSION_NAME('join');
              this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            // 判断是否是该项目的任务成员
            } else if (r.users?.includes(this.myId)) {
              this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            }

            break;
          case 'stop':
            this.$dialog({
              title: '暂停原因',
              component: () => <DialogStop/>,
            });
            break;
          case 'set':
            title = '方案制定';
            componentName = 'ItemSet';
            this.panelArguments[componentName].props.showTimeLine = true;

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
            break;
          case 'research':
            this.componentName = 'Research';
            break;
          case 'review':
            this.SET_CONFIRM_REVIEW('review');
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            componentName = 'EditLookOrder';
            title = '任务评审';
            break;
          default:
            break;
        }
        this.panelArguments[componentName].props.title = title;
        this.panelArguments[componentName].props.showFooter = true;
        const width = this.getterPanelGroupData.demand ? drawerWidth.larger_pr : this.panelArguments[componentName][showState].width;
        this.renderPanelFn(
          componentName,
          width,
          this.panelArguments[componentName].props
        );
      } catch (error) {
        loading.close();
      }
    },

    async addProject() {
      await this.FETCH_PANEL_DATA({});
      this.SET_RESEARCH_INFO({});
      this.SET_LOOK_TASK(false);
      this.SET_ITEM_CODE('');
      this.SET_TASK_LIST([]);
      this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: false, });
      this.panelArguments.ItemSet.props.title = '新增项目';
      this.panelArguments.ItemSet.width = drawerWidth.mini_px;
      this.panelArguments.ItemSet.props.showFooter = true;
      this.panelArguments.ItemSet.props.showTimeLine = false;

      this.SET_TASK_PERMISSION_NAME('leader');
      this.renderPanelFn(
        'ItemSet',
        this.panelArguments.ItemSet.width,
        this.panelArguments.ItemSet.props
      );
    },
    changeProcess(type) {
      this.queryCondition.code = type;
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
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
              save: () => {
                self.onDone();
              },
            },
          });
        },
      });
    },

    filterChange(val) {
      for (const i in val) {
        if (i === 'joinUser') {
          this.queryCondition['users'] = arrayToString(val[i]);
        } else {
          this.queryCondition[i] = arrayToString(val[i]);
        }
      }
      this.currentPage = 1;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
    },
    initTableColumn() {
      this.$store.dispatch('project/setup/GET_TABLE_COLUMNS');
    },
    getTableColumnFilters(prop) {
      if (prop === 'principal' || prop === 'joinUser') {
        return this.userInfoFilterValue;
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
      this.$store.dispatch('project/setup/UPDATE_TABLE_COLUMNS', columns);
    }, 3000),
  },
};
</script>

<style lang="scss" scoped>
::v-deep  .base-margin-bottom{
    margin-bottom:0  !important;
}
.setUp_aside {
  background: #fff;
}
.p-16 {
  padding: 0 16px;
}
.approval-main-header {
  line-height: 60px;
  height: 60px;
  min-height: 60px;
}
.setUp-bottom_container {
  background: rgb(255, 255, 255);
  // margin-left: 12px;
}
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

</style>
