<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-08 11:47:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-14 17:34:45
 * @Description: 处理工单
-->

<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        工单信息
        <span class="orderNum">工单编号:{{ orderNum }}</span>
      </span>
    </div>
    <div class="body">
      <el-row
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <el-col :span="10">
          <process-info ref="make" :make="make" class="process-info" />
        </el-col>
        <el-col :span="10" class="middle-col">
          <div>
            <answer-info :info="data.info" :disabled="true" :show-expand="true" class="answer-info" />
          </div>
          <div class="flex-container">
            <fault-info :fault="fault" :disabled="true" :show-expand="true" class="fault-info" />
          </div>
        </el-col>
        <el-col :span="4">
          <process-flow :order-num="orderNum" class="process-flow" :disabled="true" />
        </el-col>
      </el-row>
    </div>
    <div class="button">
      <el-button
        type="primary"
        size="mini"
        :loading="submitButtonLoading"
        @click="handleSubmit"
      >提交</el-button>
    </div>
  </div>
</template>

<script>

import {
  dealWorkOrder,
  sendBack,
  assistWorkOrder,
} from '@/apis/reportFault/workOrder';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import TicketApi from '@/views/reportFault/api';
export default {
  components: {
    ProcessFlow: () => import('../panel/processFlow'),
    AnswerInfo: () => import('../panel/answerInfo'),
    FaultInfo: () => import('../panel/faultInfo'),
    ProcessInfo: () => import('../panel/processInfo.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },

    },
    makeType: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      submitButtonLoading: false,
    };
  },
  computed: {
    orderNum() {
      return this.data?.info?.orderNum;
    },
    info() {
      const info = Object.assign({}, this.data.info);
      return info;
    },
    fault() {
      const fault = Object.assign({
        source: 1,
        degree: '1',
        rangeType: '1',
        responseType: '1',
        sendUser: null,

      }, this.data.fault);
      return fault;
    },
    make() {
      const make = Object.assign({
        processValue: '1',
        remark: null,
      }, this.data.make);
      make.faultType = this.fault.faultType;
      make.faultRemark = this.fault.faultRemark;
      if (this.makeType) {
        make.makeType = this.makeType;
      }
      return make;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const make = await this.$refs['make'].check();
        let method = null;
        let data = {};
        let assist = [];
        switch (make.makeType) {
          case 4:
            method = dealWorkOrder;
            data = {
              orderNum: make.orderNum,
              remark: make.remark,
              processEnclosure: make.processEnclosure,
            };
            break;
          case 5:
            method = sendBack;
            data = {
              orderNum: make.orderNum,
              remark: make.remark,
              processValue: make.processValue,
            };
            break;
          case 7:
            data = {
              orderNum: make.orderNum,
              remark: make.remark,
              processValue: make.processValue,
              processEnclosure: make.processEnclosure,
              sendUser: make.sendUser,
              sendTeam: make.sendTeam,
            };
            await TicketApi.transfer(data);
            return this.$emit('done');
          case 31:
            data = {
              orderNum: make.orderNum,
              organizer: make.organizer,
              sponsor: make.sponsor,
              phone: make.phone,
              aboutSystem: make.aboutSystem,
              level: make.level,
              startTime: make.startTime,
              title: make.title,
              endTime: make.endTime,
              remark: make.remark,
              enclosure: make.enclosure,
            };
            await WorkOrderApi.upgrade(data);
            return this.$emit('done');
          case 6:
            data = {
              orderNum: make.orderNum,
              remark: make.remark,
              processValue: make.processValue,
            };
            await TicketApi.terminate(data);
            return this.$emit('done');
          case 2:
            data = {
              orderNum: make.orderNum,
              remark: make.remark,
              processValue: make.processValue,
              processEnclosure: make.processEnclosure,
            };
            await TicketApi.suspend(data);
            return this.$emit('done');
          case 3:
            data = {
              orderNum: make.orderNum,
              makeWay: make.makeWay,
              realTime: Number(make.realTime) * 60,
              isLocal: make.isLocal,
              faultType: make.faultType,
              faultRemark: make.faultRemark,
              processEnclosure: make.processEnclosure,
            };
            await TicketApi.complete(data);
            return this.$emit('done');
          case 30:
            method = assistWorkOrder;
            console.log(make.assist);

            assist = make.assist.map(item => {
              if (item.isTeam) {
                return {
                  content: item.content,
                  sendTeam: item.teamId, };
              } else {
                return {
                  content: item.content,
                  sendUser: item.engineerId,
                };
              }
            });
            data = {
              orderNum: make.orderNum,
              assist: JSON.stringify(assist),
            };
            break;
        }
        this.submitButtonLoading = true;
        await method(data);
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;
        if (error) {
          this.$message({
            type: 'error',
            message: error,
            duration: 3000,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

  .body .el-row {
    height: 100%;
  }
 .button {

    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

    .fault-info {
    height: 100%;
    &::v-deep .pure-card__body {
    height: calc(100% - 71px);
    }
  }
    .process-flow {
    height: 100%;
    &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
  }
  .process-info {
    height: 100%;
    &::v-deep .pure-card__body {
      max-height:calc(100% - 71px);
      height: calc(100% - 71px);
  }
  }
  .answer-info {
    margin-bottom: 16px;
  }
  .flex-container {
    flex:1;
    overflow: hidden;
  }
    .middle-col {
    display: flex;
    flex-direction: column;
  }
  .orderNum {
    padding-left: 36px;
    font-size: 14px;
    color: #879bba;
  }
</style>
