<template>
  <pure-panel-card
    v-if="list.length>0"
    class="max-height"
  >
    <div slot="header">相关信息（{{ list.length }}）</div>
    <el-card v-for="item in list" :key="item.id" :body-style="{ padding: '0px' }" class="card-body">
      <div style="padding: 16px;">
        <div class="card-display">
          <span :class="['card-status',item.currState]">{{ item.currStateToName }}</span>
          <span>
            <span class="card-base">处理人：</span>
            <span>{{ item.makeUserName || '-' }}</span>
          </span>
        </div>
        <div class="card-content">
          {{ item.faultRemark }}
        </div>
        <div class="card-foot card-display">
          <span>
            <span class="card-base">影响范围：</span>
            <span>{{ item.rangeTypeToName || '-' }}</span>
          </span>
          <span>{{ item.createTime }}</span>
        </div>
        <div class="card-btn">
          <!-- 电话盒子对接后打开 -->
          <el-button v-if="info.id" v-auth="'obstacles:server:repeat'" type="primary" plain @click="onReTicket(item, info.id)">重报</el-button>
          <el-button v-if="info.id" v-auth="'obstacles:server:link'" type="primary" plain @click="onLinkTicket(item, info.id)">关联工单</el-button>
          <el-button v-if="item.currState === 'wait_delivery'" v-auth="'obstacles:server:allocate'" type="primary" plain @click="onDispatchTicket(item.orderNum)">派单</el-button>
          <el-button v-if="item.currState === 'wait_accept'" v-auth="'obstacles:server:again:allocate'" type="primary" plain @click="onReDispatchTicket(item.orderNum)">重派</el-button>
          <el-button v-if="item.currState === 'suspended'" v-auth="'obstacles:server:open'" type="primary" plain @click="onOpenSuspendedTicket(item.orderNum)">开启</el-button>
          <el-button v-if="item.currState === 'processing'" v-auth="'obstacles:server:suspend'" type="primary" plain @click="onUpdateTicket(item.orderNum, 'suspend')">暂停</el-button>
          <el-button v-if="item.currState === 'wait_accept' || item.currState === 'processing' || item.currState === 'wait_delivery'" v-auth="'obstacles:server:edit'" type="primary" plain @click="onUpdateAnswerAndFaultInfo(item.orderNum)">编辑</el-button>
          <el-button v-if="item.currState === 'not_pass_audit' || item.currState === 'suspended' || item.currState === 'processing'" v-auth="'obstacles:server:reminder'" type="primary" plain @click="reminder(item.orderNum)">催单</el-button>
          <el-button v-if="item.currState !== 'wait_audit'" v-auth="'obstacles:server:termination'" type="danger" plain @click="onUpdateTicket(item.orderNum, 'endTermination')">终止</el-button>
        </div>
      </div>
    </el-card>
  </pure-panel-card>
</template>

<script>
import { faultRemarkFormatter, } from '@/features/ticket/filter';
import ServiceDeskApi from '@/features/ticket/serviceDesk/api';
import UserDrawer from '../drawer/dispatch.vue';
import TicketApi from '../../api';
import WarrantyApi from '@/features/ticket/warranty/api';
import TicketDrawer from '../drawer/ticket.vue';
// import TicketMixin from '../../mixin';
export default {
  filters: {
    faultRemarkFormatter,
  },
  props: {
    info: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      linkedCallRecordId: null,
      currentDate: new Date(),
      depId: '',
    };
  },
  methods: {
    async onLinkTicket(row, phoneId) {
      const params = {
        id: phoneId, // 电话Id
        orderNum: row.orderNum,
      };
      await ServiceDeskApi.LinkApi(params);
      this.$message({
        type: 'success',
        message: '关联成功',
      });
      this.fetchInitData();
    },
    async onReTicket(row, phoneId) {
      const params = {
        id: phoneId, // 电话Id
        orderNum: row.orderNum,
      };
      await ServiceDeskApi.Repeat(params);
      this.$message({
        type: 'success',
        message: '重报成功',
      });
      this.fetchInitData();
    },
    async reminder(orderNum) {
      await WarrantyApi.updateReminder({ orderNum, id: this.info.id, });
      this.$notify.success('催单成功');
    },
    async onUpdateAnswerAndFaultInfo(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketDrawer
          operatorType='EDIT'
          id={ticketId}
          onDone={this.fetchInitData}
        />,
      });
    },
    async onUpdateTicket(ticketId, dealType) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType={dealType}
          onDone={this.fetchInitData}
        />,
      });
    },
    async onOpenSuspendedTicket(ticketId) {
      try {
        // 开启暂停工单
        await TicketApi.openSuspended(ticketId);
        this.$message.success('操作成功');
        this.fetchInitData();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message.error(`操作失败: ${error}`);
        }
      }
    },
    async onDispatchTicket(ticketId) {
      this.$drawer({
        width: '600px',
        component: () => <UserDrawer ticketId={ticketId}
          onDone={this.fetchInitData}
        />,
      });
    },
    async onReDispatchTicket(ticketId) {
      this.$drawer({
        width: '600px',
        component: () => <UserDrawer ticketId={ticketId}
          onDone={this.fetchInitData}
        />,
      });
    },
    /**
     *  获取通话记录关联的工单
     * @param {String} phone 报修电话
     * @param {Number} deptId 报修科室Id
     * @param {Number} callRecordId 通话记录Id
     */
    async fetchData(phone, deptId, callRecordId) {
      try {
        this.linkedCallRecordId = callRecordId;
        const { list, } = await ServiceDeskApi.callRecordLinkedTicketList({
          phone,
          deptId,
        });
        this.list = list;
      } catch (error) {
        this.$message.error(error);
      }
    },
    async fetchInitData(depId) {
      try {
        if (depId) {
          this.depId = depId;
        }
        this.list = await ServiceDeskApi.getHistoryByDeptId(this.depId);
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 重置 清空
    reset() {
      this.list = [];
    },
    /**
     * 关联工单
     * @param {String} ticketId 工单编号
     * @param {Number} linkedType 关联类型
     */
    async onLinked(ticketId, linkedType) {
      try {
        await ServiceDeskApi.linkTicket({
          ticketId,
          linkedType,
          callRecordId: this.linkedCallRecordId,
        });
        this.$message.success('关联成功');
        this.$emit('linkedTicket');
      } catch (error) {
        this.$message.error(error);
      }
    },
    onClick(orderNum, type) {
      this.$emit('relate', orderNum, type);
    },
  },
};
</script>

<style lang="scss" scoped>
.max-height {
  height: calc(100vh - 530px);
  &>::v-deep.pure-card__body {
    padding: 16px 16px 0 16px;
  }
}
.card-display{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.card-status {
  display: inline-block;
  padding: 2px;
  color: #fff;
}
.wait_delivery,.suspended,.wait_appraisal,.end_phone {
  background-color: #FFBC00;
}
.wait_accept,.terminated,.not_pass_audit{
  background-color: #f56c6c;
}
.processing,.wait_audit,.ended {
  background-color: #006666;
}
.card-btn{
  height: 32px;
  margin-top: 16px;
  font-size: 16px;
}
.card-content{
  margin-top: 16px;
  font-size: 16px;
}
.card-foot {
  margin-top: 16px;
}
.card-base {
  color: #006666;
}
.card-body {
  margin-bottom: 16px;
}
.disabled {
  background: #f7f7f7;
}
ul {
  margin: 0;
  list-style: none;
  li {
    padding-top: 16px;
    .state {
      font-size: 18px;
    }
    .desc {
      font-weight: bolder;
    }
    .info {
      color: #879BBA;
      padding: 18px 0 16px 0;
      display: flex;
      align-items: center;
    }
  }
}
/**
  工单状态
*/
//待接单
.orderState-create {
  color: #f56c6c;
}
//未派单
.orderState-start,
.orderState-back,
.orderState-null {
  color: #e6a23c;
}
//处理中
//已完成
.orderState-end_termination,
.orderstate_close {
  color: #cad0d7;
}
//处理中
.orderState- {
  color: #67c23a;
}
.pure-button {
  padding: 2px 12px;
  min-width: auto;
  margin-left: 10px;
  ::v-deep .label {
    font-size: 14px;
    line-height: 14px;
  }
}
</style>
