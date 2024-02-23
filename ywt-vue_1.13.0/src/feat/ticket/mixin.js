/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-19 09:59:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-04 12:01:23
 * @Description: 工单复用
 */
import TicketInfoDrawer from './drawer/ticket.vue';
import SendBackDialog from './dialog/sendBack.vue';
import NotPassAuditDialog from './dialog/notPassAudit.vue';
import DispatchTicketDialog from './dialog/dispatch.vue';
import FindPersonDrawer from './drawer/findPerson.vue';
import TicketLinkedCallRecordDialog from './dialog/linkedCallRecord.vue';
import TicketApi from './api';
import PrintTicketDialog from './dialog/print.vue';
export default {
  methods: {
    /**
     * 查看工单
     * @param {String} ticketId 工单编号
     */
    async onViewTicket(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketInfoDrawer operatorType='VIEW' id={ticketId}/>,
      });
    },
    /**
     * 创建工单
     * @param {String} createPattern 创建方式: 弹屏-byPop, 手动-byManual, 通话记录-byCallRecord
     * @param {Object} answerInfo 接听信息
     */
    async onCreateTicket(createPattern = 'byManual', answerInfo) {
      this.$drawer({
        width: '74.167%',
        component: () => <TicketInfoDrawer
          operatorType='CREATE'
          createPattern={createPattern}
          answerInfo={answerInfo}
          onDone={this.onPerformedOpertion}
        />,
      });
    },
    /**
     * 更新(处理)工单
     * @param {String} ticketId 工单编号
     * @param {String} dealType 工单操作 完成-complete, 暂停工单-suspend, 终止工单-endTermination, 转交-forward, 退回-back, 处理-making, 工单升级-endUpgrade, 多人协作-assist
     */
    async onUpdateTicket(ticketId, dealType) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketInfoDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType={dealType}
          onDone={this.onPerformedOpertion}
        />,
      });
    },
    /**
 * 编辑工单（可编辑接听信息，故障信息）
 */
    async onUpdateAnswerAndFaultInfo(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketInfoDrawer
          operatorType='EDIT'
          id={ticketId}
          onDone={this.onPerformedOpertion}
        />,
      });
    },
    /**
     * 退回工单
     * @param {String} ticketId 工单编号
     */
    async onSendTicketBack(ticketId) {
      this.$dialog({
        title: '退单',
        subTitle: `工单号: ${ticketId}`,
        width: '536px',
        top: '32vh',
        position: 'center',
        component: () => <SendBackDialog ticketId={ticketId} onDone={this.onPerformedOpertion}/>,
      });
    },
    /**
     * 接单
     * @param {String} ticketId 工单编号
     */
    async onAcceptTicket(ticketId) {
      try {
        await TicketApi.accept(ticketId);
        this.$message.success('接单成功');
        this.onPerformedOpertion();
      } catch (error) {
        this.$message.error(`接单失败: ${error}`);
      }
    },
    async onPassAudit(ticketId) {
      try {
        await TicketApi.passAudit(ticketId);
        this.$message.success('审核通过处理成功');
        this.onPerformedOpertion();
      } catch (error) {
        this.$message.error(`审核通过处理失败: ${error}`);
      }
    },
    async onNotPassAudit(ticketId) {
      this.$dialog({
        title: '审核信息',
        subTitle: `工单号: ${ticketId}`,
        width: '536px',
        top: '32vh',
        position: 'center',
        component: () => <NotPassAuditDialog ticketId={ticketId} onDone={this.onPerformedOpertion}/>,
      });
    },
    /**
     * 开启暂停工单
     * @param {String} ticketId 工单编号
     */
    async onOpenSuspendedTicket(ticketId) {
      try {
        await TicketApi.openSuspended(ticketId);
        this.$message.success('工单已开启');
        this.onPerformedOpertion();
      } catch (error) {
        this.$message.error(`工单开启失败: ${error}`);
      }
    },
    /**
     * 开启暂停工单
     * @param {String} ticketId 工单编号
     */
    async onRestartTerminatedTicket(ticketId) {
      try {
        await TicketApi.restartTerminated(ticketId);
        this.$message.success('工单已重启');
        this.onPerformedOpertion();
      } catch (error) {
        this.$message.error(`工单重启失败: ${error}`);
      }
    },
    /**
     * 查看工单关联的通话记录
     * @param {Object} ticketInfo 工单信息
     * @param {Number} linkedType 关联类型
     */
    async onViewLinkedCallRecord(ticketInfo, linkedType) {
      let title = '';
      let subTitle = '';
      switch (linkedType) {
        case 1:
          title = '催单信息';
          subTitle = `催单次数: ${ticketInfo.hurryCount}`;
          break;
        case 2:
          title = '重报信息';
          subTitle = `重报次数: ${ticketInfo.repeatCount}`;
          break;
        case 3:
          title = '撤单信息';
          subTitle = `撤单次数: ${ticketInfo.revokeCount}`;
          break;
      }
      this.$dialog({
        title,
        subTitle,
        width: '648px',
        top: '10vh',
        position: 'center',
        component: () => <TicketLinkedCallRecordDialog linkedType={linkedType} ticketId={ticketInfo.orderNum}/>,
      });
    },
    /**
     * 派单
     * @param {String} ticketId 工单编号
     */
    async onDispatchTicket(ticketId) {
      this.$drawer({
        width: '548px',
        component: () => <DispatchTicketDialog ticketId={ticketId} onDone={this.onPerformedOpertion}/>,
      });
    },
    /**
     * 重派
     * @param {String} ticketId 工单编号
     */
    async onReDispatchTicket(ticketId) {
      this.$drawer({
        width: '548px',
        component: () => <DispatchTicketDialog ticketId={ticketId} isReDispatch={true} onDone={this.onPerformedOpertion}/>,
      });
    },

    /**
     * 电话找人
     * @param {Number} callRecordId 通话记录ID
     */
    async onFindPerson(callRecordId) {
      this.$innerDrawer({
        width: '548px',
        component: () => <FindPersonDrawer callRecordId={callRecordId} onDone={this.onPerformedOpertion}/>,
      });
    },
    /**
     * 通话记录标记为无效电话
     * @param {Number} callRecordId 通话记录ID
     */
    async onInvalidPhone(callRecordId) {
      try {
        await this.$confirm('确定将本条通话记录标记为无效电话吗', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await TicketApi.invalidPhone(callRecordId);
        this.$message.success('操作成功');
        this.onPerformedOpertion();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message.error(`操作失败: ${error}`);
        }
      }
    },
    /**
     * 打印工单
     * @param {Number} id 工单id
     */
    async onPrintTicket(id) {
      this.$dialog({
        title: '工单信息',
        width: '648px',
        top: '10vh',
        position: 'center',
        component: () => <PrintTicketDialog id={id}/>,
      });
    },
  },
};
