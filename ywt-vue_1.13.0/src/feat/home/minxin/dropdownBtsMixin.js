import TaskApi from '@/apis/synthesize/taskManagement';
import TicketApi from '@/feat/ticket/api.js';
import ProjectAPI from '@/apis/project';

import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';
import { mixins_base, mixins_project_index, } from '@/minxins/project/index';
// import TicketMixin from '@/feat/ticket/mixin';
export default {
  created() {
  },
  components: {
    Handle: () => import('@/views/synthesize/taskManagement/components/task/handle.vue'),
    Stoped: () => import('@/views/synthesize/taskManagement/components/task/stop.vue'),
    Passed: () => import('@/views/synthesize/taskManagement/components/task/passed.vue'),
    AddTask: () => import('@/views/synthesize/taskManagement/components/panel/addTask.vue'),
    ToOrder: () => import('@/views/project/needSetting/components/toOrder.vue'),
    End: () => import('@/views/project/components/task/end.vue'),
    Review: () => import('@/views/project/components/panelsGroup/review.vue'),
    Inspection: () => import('@/views/inspection/task/dialog/inspection.vue'),
    ChangeApplication: () => import('@/views/project/impose/components/changeDialog.vue'),
    ChangeProjectTable: () => import('@/views/project/impose/components/projectTaskTable.vue'),
    Assign: () => import('@/views/project/components/panelsGroup/assign.vue'),
    ItemSet: () => import('@/views/project/components/panelsGroup/itemSet.vue'),
    EditLookOrder: () => import('@/views/project/components/panelsGroup/reviewPlan.vue'),
    TicketInfoDrawer: () => import('@/feat/ticket/drawer/ticket.vue'),
    ChildTask: () => import('@/views/synthesize/taskManagement/components/task/childTask.vue'),
    Research: () => import('@/views/project/components/panelsGroup/research.vue'),
    SendBackDialog: () => import('@/feat/ticket/dialog/sendBack.vue'),
    NotPassAuditDialog: () => import('@/feat/ticket/dialog/notPassAudit.vue'),
    AddNewPanel: () => import('@/views/project/components/panelsGroup/addNew.vue'),
    ApplicationList: () => import('@/views/project/impose/components/application.vue'),
    MeetingList: () => import('@/views/project/impose/components/meetingList.vue'),
    ContractList: () => import('@/views/project/impose/components/contractList.vue'),
    DialogPause: () => import('@/views/project/needSetting/dialog/pause.vue'),

  },
  mixins: [mixins_base, mixins_project_index],
  data() {
    return {
      inspection: [
        {
          name: 'inspection',
          type: '',
          plain: 'plain',
          size: 'mini',
          label: '巡检',
          click: this.inspectionOptionsMenuClick,
          class: 'el-icon-printer el-icon--right',
          style:
            'font-size: 14px;padding: 3px 5px;line-height: 14px;border-radius: 2px;background: #e3e9f7;color:#4970d1',
          show: () => true,
        }
      ],
      partial: {
        childId: null,
        parentId: null,
        parentLeaderId: null,
        type: '',
        index: null,
      },
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
      },
    };
  },
  methods: {
    // ----- 以下是 卡片-调研按钮组-弹窗-字方法------
    optionsDelete(row) {
      this.$confirm(`是否删除「${row.title}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ProjectAPI.demand.del(row.id);
            this.fetchData();
          } catch (e) {
            this.$message.error(e);
          }
        })
        .catch(() => {});
    },
    optionsBack(row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ProjectAPI.base.backDemand(row.itemCode);
            this.fetchData();
          } catch (e) {
            this.$message.error(e);
          }
        })
        .catch(() => {});
    },
    optionsEnd(row) {
      this.$dialog({
        title: '终止',
        subTitle: `项目编号:${row.itemCode}`,
        position: 'center',
        width: dialogWidth.small_px,
        component: () => (
          <End
            onDone={this.fetchData}
            where={'demand'}
            cardViewItemCode={row.itemCode}
          />
        ),
      });
    },
    optionsToOrder() {
      this.$dialog({
        title: '转工单',
        width: dialogWidth.small_px,
        position: 'center',
        component: () => <ToOrder onDone={() => { return this.fetchData('order'); }} />,
      });
    },
    optionsPause(row) {
      this.$dialog({
        title: '暂停原因',
        component: () => <DialogPause itemCode={row.itemCode} onDone={this.fetchData}/>,
      });
    },
    async optionsOpen(row) {
      await ProjectAPI.base.demandOrProjectOpen(row.itemCode);
      this.$message.success({
        message: '开启成功!',
        onClose: this.fetchData(),
      });
    },

    perviewOptions(type) {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchView', disabled: true, });
      if (
        [
          'demand_init',
          'demand_inv',
          'end_termination',
          null
        ].includes(type)
      ) {
        this.panelArguments.demand.props.showFooter = false;
        this.panelArguments.demand.props.showTimeLine = true;
        this.panelArguments.demand.width = drawerWidth.small_px;

        this.renderPanelFn(
          'AddNewPanel',
          this.panelArguments.demand.width,
          this.panelArguments.demand.props
        );
      } else if (
        [
          'demand_inv_review_next',
          'end_project_order',
          'end_inv_reject',
          'item_establish',
          'demand_inv_review'
        ].includes(type)
      ) {
        if (type === 'demand_inv_review') {
          this.panelArguments.research.props.title = '评审信息';
        } else if (type === 'item_establish') {
          this.panelArguments.research.props.title = '立项信息';
        }
        this.panelArguments.research.props.showFooter = false;
        this.renderPanelFn(
          'Research',
          this.panelArguments.research.width,
          this.panelArguments.research.props
        );
      }
    },
    // ----- 以上是 卡片-调研按钮组-弹窗-字方法------
    // 公共渲染方法
    renderPanelFn(componentName, width, props) {
      const self = this;
      this.$drawer({
        width: width,
        component: () => {
          return self.$createElement(componentName, {
            props: props,
            on: {
              done: () => {
                return this.fetchData();
              },
            },
          });
        },
      });
    },
    // 卡片-工单按钮组-弹窗
    async orderOptionsMenuClick(type, row) {
      switch (type) {
        case 'accept':
          // this.onAcceptTicket(row.orderNum);
          try {
            await TicketApi.accept(row.orderNum);
            this.$message.success('接单成功');
            this.fetchData();
          } catch (error) {
            this.$message.error(`接单失败: ${error}`);
          }
          break;
        case 'sendBack':
          this.$dialog({
            title: '退单',
            subTitle: `工单号: ${row.orderNum}`,
            width: '536px',
            top: '32vh',
            position: 'center',
            component: () => <SendBackDialog ticketId={row.orderNum} onDone={this.fetchData}/>,
          });
          // this.onSendTicketBack(row.orderNum);
          break;
        case 'complete':
          // this.onUpdateTicket(row.orderNum, 'making');
          this.$drawer({
            width: '87.917%',
            component: () => (
              <TicketInfoDrawer
                operatorType='UPDATE'
                id={row.orderNum}
                dealType='making'
                onDone={this.fetchData}
              />
            ),
          });
          break;
        case 'openSuspended':
          // this.onOpenSuspendedTicket(row.orderNum);
          try {
            await TicketApi.openSuspended(row.orderNum);
            this.$message.success('工单已开启');
            this.fetchData();
          } catch (error) {
            this.$message.error(`工单开启失败: ${error}`);
          }
          break;
        case 'restartTerminated':
          // this.onRestartTerminatedTicket(row.orderNum);
          try {
            await TicketApi.restartTerminated(row.orderNum);
            this.$message.success('工单已重启');
            this.fetchData();
          } catch (error) {
            this.$message.error(`工单重启失败: ${error}`);
          }
          break;
        case 'passAudit':
          // this.onPassAudit(row.orderNum);
          try {
            await TicketApi.passAudit(row.orderNum);
            this.$message.success('审核通过处理成功');
            this.onPerformedOpertion();
          } catch (error) {
            this.$message.error(`审核通过处理失败: ${error}`);
          }
          break;
        case 'notPassAudit':
          // this.onNotPassAudit(row.orderNum);
          this.$dialog({
            title: '审核信息',
            subTitle: `工单号: ${row.orderNum}`,
            width: '536px',
            top: '32vh',
            position: 'center',
            component: () => <NotPassAuditDialog ticketId={row.orderNum} onDone={this.fetchData}/>,
          });
          break;
      }
    },
    // 卡片-任务按钮组-弹窗
    async taskOptionsMenuClick(type, row) {
      this.$set(this.partial, 'parentId', row?.parentId || null);
      this.$set(this.partial, 'childId', row.id);

      this.$set(this.partial, 'type', type);

      switch (type) {
        case 'search':
          if (row?.parentId) {
            this.$dialog({
              title: '查看',
              width: '648px',
              position: 'center',
              component: () => (
                <ChildTask data={row} type={type} onDone={this.fetchData} />
              ),
            });
          } else {
            this.$drawer({
              title: '任务',
              width: '1280px',
              position: 'right-bottom',
              component: () => (
                <AddTask info={row} onDone={this.fetchData} type={type} />
              ),
            });
          }

          break;

        case 'del':
          await TaskApi.del(row.id);
          this.fetchData();
          break;

        case 'edit':
          if (row?.parentId) {
            this.$dialog({
              title: '编辑',
              width: '648px',
              position: 'center',
              component: () => (
                <ChildTask
                  data={row}
                  where={'index'}
                  type={type}
                  onDone={this.fetchData}
                />
              ),
            });
          } else {
            this.$set(this.partial, 'parentId', row.id || null);
            this.$drawer({
              title: '任务',
              width: '1144px',
              position: 'right-bottom',
              component: () => (
                <AddTask info={row} onDone={this.fetchData} type={type} />
              ),
            });
          }
          break;
        case 'addChild':
          this.$set(this.partial, 'parentId', row.id || null);
          this.$dialog({
            title: '添加子任务',
            width: '648px',
            position: 'center',
            component: () => (
              <ChildTask
                disabledDate={[row.planStartDate, row.planEndDate]}
                data={row}
                where={'index'}
                type={type}
                onDone={this.fetchData}
              />
            ),
          });

          break;
        case 'handle':
          this.$dialog({
            title: '处理任务',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Handle info={row} onDone={this.fetchData} />,
          });
          break;
        case 'assign':
          this.$drawer({
            component: () => <Assign onDone={this.fetchData} />,
          });
          break;
        case 'passed':
          this.$dialog({
            title: '转交任务',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Passed data={row} onDone={this.fetchData} />,
          });
          break;
        case 'stop':
          this.$dialog({
            title: '暂停',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => (
              <Stoped data={row} type={type} onDone={this.fetchData} />
            ),
          });
          break;
        case 'open':
          await TaskApi.open(row.id);
          this.fetchData();
          break;
        case 'end':
          this.$set(this.partial, 'parentId', row.parentId || row.id);

          this.$dialog({
            title: '终止',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => (
              <Stoped data={row} type={type} onDone={this.fetchData} />
            ),
          });
          break;
        case 'review':
          this.$drawer({
            title: '审核任务',
            width: '1144px',
            position: 'right-bottom',
            component: () => (
              <AddTask info={row} onDone={this.fetchData} type={type} />
            ),
          });
          break;
        case 'submit':
          await TaskApi.submit(row.id);
          this.fetchData();
          break;
      }
    },
    // 卡片-调研按钮组-弹窗
    async researchOptionsMenuClick(type, row) {
      this.SET_ITEM_CODE(row.itemCode);
      this.SET_RESEARCH_INFO({ ...row, });

      if (['del', 'back', 'end', 'toOrder', 'pause', 'open'].includes(type)) {
        if (type === 'del') {
          this.optionsDelete(row);
        } else if (type === 'back') {
          this.optionsBack(row);
        } else if (type === 'end') {
          this.optionsEnd(row);
        } else if (type === 'toOrder') {
          this.optionsToOrder();
        } else if (type === 'pause') {
          this.optionsPause(row);
        } else {
          this.optionsOpen(row);
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
        const result = await ProjectAPI.base.getAllProjectData(row.itemCode);
        await this.FETCH_PANEL_DATA(result);
        loading.close();
        switch (type) {
          // 编辑状态
          case 'edit':
            this.panelArguments.demand.props.showFooter = true;
            this.panelArguments.demand.props.showTimeLine = true;
            this.panelArguments.demand.width = drawerWidth.small_px;
            this.renderPanelFn(
              'AddNewPanel',
              this.panelArguments.demand.width,
              this.panelArguments.demand.props
            );
            break;
          case 'search':
            this.perviewOptions(row.showState);
            break;
          case 'distribute':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.renderPanelFn('Assign', drawerWidth.larger_pr, {});
            break;
          case 'demand_inv':
            break;
          case 'research':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.panelArguments.research.props.showFooter = true;
            this.renderPanelFn(
              'Research',
              this.panelArguments.research.width,
              this.panelArguments.research.props
            );
            break;
          case 'review':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.renderPanelFn(
              'Review',
              this.panelArguments.review.width,
              this.panelArguments.review.props
            );
            break;
        }
      } catch (error) {
        this.$message.error(error);
        loading.close();
      }
    },
    // 卡片-巡检按钮组-弹窗
    inspectionOptionsMenuClick() {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => (
          <Inspection
            actionType='update'
            taskId={this.workItem.exeId}
            propertyName={this.workItem.propertyName}
            onDone={this.fetchData}
          />
        ),
      });
    },
    // 卡片-项目按钮组-弹窗
    async projectOptionsMenuClick(type, row) {
      this.SET_ITEM_CODE(row.itemCode);
      let loading = null;
      switch (type) {
        case 'alteration':
          this.$drawer({
            with: drawerWidth.larger_pr,
            component: () => <ApplicationList data={row} onDone={this.onDone}/>,
          });
          break;
        case 'metting':
          this.$drawer({
            title: '会议',
            position: 'center',
            width: drawerWidth.larger_pr,
            component: () => <MeetingList data={row} onDone={this.fetchData}/>,
          });
          break;
        case 'invoice':
          this.$drawer({
            title: '会议',
            position: 'center',
            width: drawerWidth.larger_pr,
            component: () => <ContractList data={row} onDone={this.fetchData}/>,
          });
          break;

        case 'search':
          try {
            loading = this.$loading({
              lock: true,
              text: '加载中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            });
            this.SET_LOOK_TASK(true);
            await this.FETCH_PANEL_DATA(
              await ProjectAPI.setUp.reviewInfo(row.itemCode)
            );
            this.SET_ITEM_CODE(row.itemCode);
            this.SET_RESEARCH_INFO(row);
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({
              name: 'researchViewPlan',
              disabled: true,
            });
            this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.panelArguments['ItemSet'].props.showFooter = false;
            if (this.getterPanelGroupData.demand) {
              this.panelArguments['ItemSet'].width = drawerWidth.larger_pr;
            } else {
              this.panelArguments['ItemSet'].width = drawerWidth.small_px;
            }
            this.renderPanelFn(
              'ItemSet',
              this.panelArguments['ItemSet'].width,
              this.panelArguments['ItemSet'].props
            );
          } catch (error) {
            loading.close();
          } finally {
            loading.close();
          }
          break;
        case 'handle':
          this.renderPanelFn('ChangeProjectTable', drawerWidth.larger_pr, {
            title: '处理',
            params: row,
            code: 'handle',
          });
          break;
        case 'append':
          this.renderPanelFn('ChangeProjectTable', drawerWidth.larger_pr, {
            title: '任务补充',
            params: row,
            code: 'append',
          });
          break;
        case 'changeApplication':
          this.SET_PERVIEW(false);
          this.SET_RESEARCH_INFO(row);
          this.$dialog({
            title: '变更申请',
            width: dialogWidth.mini_px,
            position: 'center',
            component: () => (
              <ChangeApplication data={row} onDone={this.fetchData} />
            ),
          });
          break;
        case 'confirm':
          this.renderPanelFn('ChangeProjectTable', drawerWidth.larger_pr, {
            title: '确认结果',
            params: row,
            code: 'confirm',
          });
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
            await this.FETCH_PANEL_DATA(
              await ProjectAPI.setUp.reviewInfo(row.itemCode)
            );
            this.SET_RESEARCH_INFO({ ...row, });
            this.SET_ITEM_CODE(row.itemCode);
            this.SET_CONFIRM_REVIEW('confirm');
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.panelArguments['EditLookOrder'].props.title = '确认结果';
            this.panelArguments['EditLookOrder'].props.showFooter = true;
            this.renderPanelFn(
              'EditLookOrder',
              this.getterPanelGroupData.demand
                ? drawerWidth.larger_pr
                : this.panelArguments['EditLookOrder'][row.showState].width,
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
          this.renderPanelFn('ChangeProjectTable', drawerWidth.larger_pr, {
            title: '变更任务',
            params: row,
            code: 'change',
          });
          break;
      }
    },
  },
};
