<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-08 11:05:56
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-14 17:34:18
 * @Description: 查看工单
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        工单信息
        <pure-tag v-if="orderNum.includes('#')" :label="'协'" />
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
          <process-info :make="make" :disabled="true" class="process-info" />
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
          <process-flow :order-num="orderNum" :disabled="true" class="process-flow" />
        </el-col>
      </el-row>
    </div>
    <div class="footer" />
  </div>
</template>

<script>
import PureTag from '@/components/tag/tag.vue';
export default {
  components: {
    ProcessFlow: () => import('../panel/processFlow'),
    AnswerInfo: () => import('../panel/answerInfo'),
    FaultInfo: () => import('../panel/faultInfo'),
    ProcessInfo: () => import('../panel/processInfo.vue'),
    PureTag,
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      info: {},
    };
  },
  computed: {
    orderNum() {
      return this.data?.info?.orderNum;
    },
    fault() {
      const fault = Object.assign({}, this.data.fault);
      return fault;
    },
    make() {
      const make = Object.assign({

      }, this.data.make);

      if (make.makeWay) {
        make.makeType = 3;
        make.faultType = this.fault.faultType;
        make.faultRemark = this.fault.faultRemark;
      }
      return make;
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .middle-col {
    display: flex;
    flex-direction: column;
  }
  .orderNum {
    padding-left: 36px;
    font-size: 14px;
    color: #879bba;
  }
  .fault-info {
    flex:1;
  }
  .body .el-row {
    height: 100%;
  }
  .flex-container {
    flex:1;
    overflow: hidden;
  }
  .footer {
    height: 1px;
  }
</style>
