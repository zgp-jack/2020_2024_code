/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-19 09:59:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-20 11:31:07
 * @Description: 工单复用
 */
import ViewTicket from './sharedComponents/dialog/viewWorkOrder';
import SendBackDialog from './dialog/sendBack.vue';
import TicketApi from './api';
export default {
  methods: {
    /**
     * 查看工单
     * @param {String} ticketId 工单编号
     */
    async onViewTicket(ticketId) {
      try {
        const data = await TicketApi.detail(ticketId);
        this.$drawer({
          width: '1688px',
          component: () => <ViewTicket data={data}/>,
        });
      } catch (error) {
        this.$message.error(error);
      }
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
  },
};
