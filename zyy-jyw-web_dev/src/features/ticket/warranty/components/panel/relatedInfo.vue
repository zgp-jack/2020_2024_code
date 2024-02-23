<template>
  <pure-card v-if="list.length>0" class="max-height">
    <div slot="header">相关信息</div>
    <ul>
      <li
        v-for="(item,index) in list"
        :key="index"
      >
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="3" class="state orderState-create">{{ item.processStateToName }}</el-col>
              <el-col :span="19" class="desc">{{ item.faultRemark | faultRemarkFormatter }}</el-col>
            </el-row>
            <el-row :gutter="2" class="info">
              <el-col :span="7">{{ item.createTime }}</el-col>
              <el-col :span="6">处理人:{{ item.makeUserToName||'暂无' }}</el-col>
              <el-col :span="3">{{ item.rangeType|range }}事件</el-col>
              <el-col :span="8" class="flex space-between">
                <pure-button class="pure-button" label="催单" type="wire-frame" @click="onLinked(item.orderNum,1)" />
                <pure-button class="pure-button" label="重报" type="wire-frame" @click="onLinked(item.orderNum,2)" />
                <pure-button class="pure-button" label="撤单" type="wire-frame" @click="onLinked(item.orderNum,3)" />
              </el-col>
            </el-row>
          </el-col>

        </el-row>
      </li>
    </ul>
  </pure-card>

</template>

<script>
import { faultRemarkFormatter, } from '@/features/ticket/filter';
import ServiceDeskApi from '@/features/ticket/serviceDesk/api';
export default {
  filters: {
    faultRemarkFormatter,
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      list: [],
      linkedCallRecordId: null,
    };
  },
  methods: {
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
