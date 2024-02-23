import TicketApi from './api';
import TicketDrawer from './common/drawer/ticket.vue';
import UserDrawer from './common/drawer/dispatch.vue';
import PrintTicketDialog from './common/dialog/print.vue';

export default {
  methods: {
    /**
     * 编辑工单（可编辑接听信息，故障信息）
     */
    async onUpdateAnswerAndFaultInfo(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketDrawer
          operatorType='EDIT'
          id={ticketId}
          onDone={this.onPerformedOperation}
        />,
      });
    },
    /**
     * 接单
     * @param {String} ticketId 工单编号
     */
    async onAcceptTicket(ticketId, refreshData) {
      try {
        await TicketApi.accept(ticketId);
        this.$message.success('接单成功');
        this.onPerformedOperation(refreshData);
      } catch (error) {
        this.$message.error(`接单失败: ${error}`);
      }
    },
    /**
     * 查看工单
     * @param {String} ticketId 工单编号
     */
    async onViewTicket(ticketId) {
      this.$drawer({
        component: () => <TicketDrawer operatorType='VIEW'
          id={ticketId}
        />,
      });
    },
    /**
     * 创建工单
     */
    async onCreateTicket(createPattern = 'byManual', answerInfo) {
      this.$drawer({
        width: '65.47%',
        component: () => <TicketDrawer
          operatorType='CREATE'
          createPattern={createPattern}
          answerInfo={answerInfo}
          onDone={this.onPerformedOperation}
          onRefresh ={this.onPerformedOperation}
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
        component: () => <TicketDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType={dealType}
          onDone={this.onPerformedOperation}
        />,
      });
    },
    /**
     * 退回工单
     * @param {String} ticketId 工单编号
     */
    async onSendTicketBack(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType='back'
          onDone={this.onPerformedOperation}
        />,
      });
    },
    /**
     * 通过审核
     */
    async onPassAudit(ticketIds) {

    },
    /**
     * 未通过审核
     */
    async onNotPassAudit(ticketId) {

    },
    /**
     * 开启暂停工单
     * @param {String} ticketId 工单编号
     */
    async onOpenSuspendedTicket(ticketId, refreshData) {
      try {
        // 开启暂停工单
        await TicketApi.openSuspended(ticketId);
        this.$message.success('操作成功');
        this.onPerformedOperation(refreshData);
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message.error(`操作失败: ${error}`);
        }
      }
    },
    /**
     * 重启终止工单
     * @param {String} ticketId 工单编号
     */
    async onRestartTerminatedTicket(ticketId, refreshData) {
      try {
        // 重启终止工单
        await TicketApi.restartTerminated(ticketId);
        this.$message.success('操作成功');
        this.onPerformedOperation(refreshData);
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message.error(`操作失败: ${error}`);
        }
      }
    },
    /**
     * 查看工单关联的通话记录
     * @param {Object} ticketInfo 工单信息
     * @param {Number} linkedType 关联类型
     */
    async onViewLinkedCallRecord(ticketInfo, linkedType) {

    },
    /**
     * 派单
     * @param {String} ticketId 工单编号
     */
    async onDispatchTicket(ticketId) {
      this.$drawer({
        width: '600px',
        component: () => <UserDrawer ticketId={ticketId}
          onDone={this.onPerformedOperation}
        />,
      });
    },
    /**
     * 重派
     * @param {String} ticketId 工单编号
     */
    async onReDispatchTicket(ticketId) {
      this.$drawer({
        width: '600px',
        component: () => <UserDrawer ticketId={ticketId}
          onDone={this.onPerformedOperation}
        />,
      });
    },
    /**
     * 电话找人
     * @param {Number} callRecordId 通话记录ID
     */
    async onFindPerson(callRecordId) {

    },
    /**
     * 通话记录标记为无效电话
     * @param {Number} callRecordId 通话记录ID
     */
    async onInvalidPhone(callRecordId) {
      try {
        await this.$confirm('确定将本条通话记录标记为无效电话吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await TicketApi.invalidPhone(callRecordId);
        this.$message.success('操作成功');
        this.onPerformedOperation();
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
    onPrintTicket(id) {
      this.$dialog({
        title: '工单信息',
        width: '648px',
        top: '10vh',
        position: 'center',
        component: () => <PrintTicketDialog id={id}/>,
      });
    },
    onPerformedOperation(refreshData) {
      if (this.$refs.pureTable) {
        this.$refs.pureTable.fetchData();
        if (refreshData) {
          refreshData();
        }
      } else {
        console.warn('未给PureTable组件设置ref="pureTable"');
      }
    },
  },
};
