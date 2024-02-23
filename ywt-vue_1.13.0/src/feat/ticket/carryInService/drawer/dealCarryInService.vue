<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-25 11:14:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 14:58:48
 * @Description:
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">
        {{ title }}
      </div>
    </div>
    <div class="body">
      <el-row
        class="h-100"
        :gutter="16"
        type="flex"
      >
        <el-col class="h-100" :span="10">
          <collapse key="left">
            <component
              :is="leftComponent"
              ref="leftComponent"
              class="carry-info-panel"
              :data="leftComponentDefaultData"
            /></collapse>

        </el-col>
        <el-col :span="10" class="h-100">
          <collapse key="middle" v-model="active" accordion>
            <carry-info-panel
              v-if="carryInfo.id"
              :disabled="true"
              :data="carryInfo"
              :show-expand="middleController.carryInfo.showExpand"
            />
            <take-away-panel
              v-if="takeAwayInfo.id&&carryInfo.bidsFlag===0"
              :disabled="true"
              :data="takeAwayInfo"
              :show-expand="middleController.takeAway.showExpand"
            />
            <engineer-take-away-panel
              v-if="engineerTakeAwayInfo.id"
              :disabled="true"
              :data="engineerTakeAwayInfo"
              :show-expand="middleController.engineerTakeAway.showExpand"
            />
            <deal-accept-panel
              v-if="dealAcceptInfo.id"
              :disabled="true"
              :data="dealAcceptInfo"
              :show-expand="middleController.dealAccept.showExpand"
            />
            <quote-price-with-bid-panel
              v-if="middleController.quotePriceWithBid.show"
              :show-expand="middleController.quotePriceWithBid.showExpand"
              :disabled="true"
              :data="quotePriceWithBidInfo"
            />
            <quote-price-without-bid-panel
              v-if="quotePriceWithoutBidInfo.id"
              :show-expand="middleController.quotePriceWithoutBid.showExpand"
              :disabled="true"
              :data="quotePriceWithoutBidInfo"
            />
            <examine-quote-price-with-bid-panel
              v-if="examineQuotePriceWithBidInfo.id"
              :disabled="true"
              :data="examineQuotePriceWithBidInfo"
              :show-expand="middleController.examineQuotePriceWithBid.showExpand"
            />
            <examine-quote-price-without-bid-panel
              v-if="examineQuotePriceWithoutBidInfo.id"
              :disabled="true"
              :data="examineQuotePriceWithoutBidInfo"
              :show-expand="middleController.examineQuotePriceWithoutBid.showExpand"
            />
            <take-away-panel
              v-if="takeAwayInfo.id&&carryInfo.bidsFlag===1"
              :disabled="true"
              :data="takeAwayInfo"
              :show-expand="middleController.takeAway.showExpand"
            />
            <failure-tender-panel
              v-if="failureTenderInfo.id"
              :disabled="true"
              :data="failureTenderInfo"
              :show-expand="middleController.failureTender.showExpand"
            />
            <repair-settle-panel
              v-if="repairSettleInfo.id"
              :disabled="true"
              :data="repairSettleInfo"
              :show-expand="middleController.repairSettle.showExpand"
            />
            <unable-repair-panel
              v-if="middleController.unableRepair.show"
              :disabled="true"
              :data="unableRepairInfo"
              :show-expand="middleController.unableRepair.showExpand"
            />
            <complete-repair-panel
              v-if="middleController.completeRepair.show"
              :disabled="true"
              :data="completeRepairInfo"
              :show-expand="middleController.completeRepair.showExpand"
            />
            <confirm-send-back-to-department-panel
              v-if="sendBackToDepartmentInfo.id"
              :disabled="true"
              :data="sendBackToDepartmentInfo"
              :show-expand="middleController.sendBackToDepartment.showExpand"
            />
            <confirm-return-panel
              v-if="confirmReturnInfo.id"
              :disabled="true"
              :data="confirmReturnInfo"
              :show-expand="middleController.confirmReturn.showExpand"
            />

          </collapse>
        </el-col>
        <el-col :span="4">
          <process-flow-panel :id="repairId" class="process-flow-panel" />
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <div v-if="title==='厂家报价'">

        <pure-button
          label="返回"
          @click="$emit('cancel')"
        />
        <pure-button
          label="结束报价"
          type="wire-frame"
          @click="onSubmit"
        />
      </div>
      <pure-button
        v-else
        label="提交"
        @click="onSubmit"
      />

    </div>
  </div>
</template>

<script>

import EngineerTakeAwayPanel from '../panel/engineerTakeAway.vue';
import TakeAwayPanel from '../panel/manufacturerTakeAway.vue';
// 流标处理面板
import FailureTenderPanel from '../panel/failureTender.vue';
// 接收处置面板
import DealAcceptPanel from '../panel/dealAccept.vue';
// 报价审核-邀标面板
import ExamineQuotePriceWithBidPanel from '../panel/examineQuotePriceWithBid.vue';
// 报价审核-不邀标面板
import ExamineQuotePriceWithoutBidPanel from '../panel/examineQuotePriceWithoutBid.vue';
// 厂家报价-不邀标面板
import QuotePriceWithoutBidPanel from '../panel/quotePriceWithoutBid.vue';
// 厂家报价-邀标面板
import QuotePriceWithBidPanel from '../panel/quotePriceWithBid.vue';
// 完成维修面板
import CompleteRepairPanel from '../panel/completeRepair.vue';
// 确认送回科室面板
import ConfirmSendBackToDepartmentPanel from '../panel/confirmSendBackToDepartment.vue';
// 送回确认
import ConfirmReturnPanel from '../panel/confirmReturn';
// 送回处置面板
import DealReturnPanel from '../panel/dealReturn.vue';
// 无法维修面板
import UnableRepairPanel from '../panel/unableRepair.vue';
import CarryInfoPanel from '../panel/carryInfo.vue';
// 维修结算面板
import RepairSettlePanel from '../panel/repairSettle.vue';
import ProcessFlowPanel from '../panel/processFlow.vue';
import FormDialog from '@/minxins/common/formDialog';
import CarryInServiceApi from '../api';

export default {
  name: 'DealCarryInServiceDrawer',
  components: {
    CarryInfoPanel,
    EngineerTakeAwayPanel,
    TakeAwayPanel,
    FailureTenderPanel,
    DealAcceptPanel,
    ExamineQuotePriceWithBidPanel,
    ExamineQuotePriceWithoutBidPanel,
    QuotePriceWithoutBidPanel,
    QuotePriceWithBidPanel,
    ConfirmSendBackToDepartmentPanel,
    DealReturnPanel,
    ConfirmReturnPanel,
    UnableRepairPanel,
    CompleteRepairPanel,
    ProcessFlowPanel,
    RepairSettlePanel,
  },
  mixins: [FormDialog],
  props: {
    repairId: {
      type: Number,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      active: '',
      name: '送修',
      // 送修信息
      carryInfo: {},
      // 工程师取走信息
      engineerTakeAwayInfo: {},
      // 厂家取走信息
      takeAwayInfo: {},
      // 接收处置信息
      dealAcceptInfo: {},
      // 报价-不邀标信息
      quotePriceWithoutBidInfo: {
      },
      // 报价-邀标信息
      quotePriceWithBidInfo: {
      },
      // 报价审核-不邀标
      examineQuotePriceWithoutBidInfo: {},
      // 报价审核-邀标
      examineQuotePriceWithBidInfo: {},
      // 流标处理信息
      failureTenderInfo: {},
      // 完成维修
      completeRepairInfo: {},
      // 送回信息
      sendBackToDepartmentInfo: {},
      // 送回确认
      confirmReturnInfo: {},
      // 无法维修
      unableRepairInfo: {},
      // 维修结算
      repairSettleInfo: {},

      // 左侧面板默认数据
      leftComponentDefaultData: {},
      middleController: {
        carryInfo: {
          show: true,
          showExpand: true,
          name: 'CarryInfoPanel',
        },
        takeAway: {
          show: false,
          showExpand: true,
          name: 'TakeAwayPanel',
        },
        engineerTakeAway: {
          show: false,
          showExpand: true,
          name: 'EngineerTakeAwayPanel',
        },
        dealAccept: {
          show: false,
          showExpand: true,
          name: 'DealAcceptPanel',
        },

        quotePriceWithoutBid: {
          show: false,
          showExpand: true,
          name: 'QuotePriceWithoutBidPanel',
        },
        quotePriceWithBid: {
          show: false,
          showExpand: true,
          name: 'QuotePriceWithBidPanel',
        },
        examineQuotePriceWithoutBid: {
          show: false,
          showExpand: true,
          name: 'ExamineQuotePriceWithoutBidPanel',
        },
        examineQuotePriceWithBid: {
          show: false,
          showExpand: true,
          name: 'ExamineQuotePriceWithBidPanel',
        },
        failureTender: {
          show: false,
          showExpand: true,
          name: 'FailureTenderPanel',
        },
        repairSettle: {
          show: false,
          showExpand: true,
          name: 'RepairSettlePanel',
        },
        unableRepair: {
          show: false,
          showExpand: true,
          name: 'UnableRepairPanel',
        },
        completeRepair: {
          show: false,
          showExpand: true,
          name: 'CompleteRepairPanel',
        },
        sendBackToDepartment: {
          show: false,
          showExpand: true,
          name: 'ConfirmSendBackToDepartmentPanel',
        },

        confirmReturn: {
          show: false,
          showExpand: true,
          name: 'ConfirmReturnPanel',
        },

      },

    };
  },
  computed: {
    title() {
      switch (this.action) {
        case 'TakeAwayPanel':
          return '厂家取走';
        case 'QuotePriceWithoutBidPanel':
        case 'QuotePriceWithBidPanel':
          return '厂家报价';
        case 'DealAcceptPanel':
          return '接收处置';
        case 'ExamineQuotePricePanel':
          return '报价审核';
        case 'ConfirmSendBackToDepartmentPanel':
          return '确认送回科室';
        case 'DealReturnPanel':
          return '送回处置';
        case 'ConfirmReturnPanel':
          return '送回确认';
        default:
          return '';
      }
    },
    leftComponent() {
      if (this.action === 'ExamineQuotePricePanel') {
        if (this.carryInfo.bidsFlag === 1) {
          return 'ExamineQuotePriceWithBidPanel';
        } else {
          return 'ExamineQuotePriceWithoutBidPanel';
        }
      } else {
        return this.action;
      }
    },
  },
  created() {
    this.detail();
  },
  methods: {
    async onSubmit() {
      await this.$refs.leftComponent.check(this.repairId);
      this.$emit('done');
    },
    async detail() {
      this.loading = true;
      const data = await CarryInServiceApi.detail(this.repairId);
      const {
        repairQuote, // 报价信息
        quoteConfirm, // 报价审核信息
      } = data;
      // 送修信息
      this.carryInfo = data.repairInfo;
      this.middleController.carryInfo.show = this.carryInfo.id;
      // 厂家取走信息
      this.takeAwayInfo = data.manufacturerTakeAwayVo;
      this.middleController.takeAway.show = this.takeAwayInfo.id;
      // 接收处置
      this.dealAcceptInfo = data.receiveDealResultVo;
      this.middleController.dealAccept.show = this.dealAcceptInfo.id;
      // 工程师取走信息
      this.engineerTakeAwayInfo = data.takeAway;
      this.middleController.engineerTakeAway.show = this.engineerTakeAwayInfo.id;
      // 完成维修
      this.completeRepairInfo = data.finishRepair;
      this.middleController.completeRepair.show = this.completeRepairInfo.id;
      // 送回信息
      this.sendBackToDepartmentInfo = data.sendDept;
      this.middleController.sendBackToDepartment.show = this.sendBackToDepartmentInfo.id;
      // 送回确认
      this.confirmReturnInfo = data.repairReturn;
      this.middleController.confirmReturn.show = this.confirmReturnInfo.id;
      // 无法维修
      this.unableRepairInfo = data.cantRepairVo;
      this.middleController.unableRepair.show = this.unableRepairInfo.id;
      // 维修结算
      this.repairSettleInfo = data.settlementResultVo;
      this.middleController.repairSettle.show = this.repairSettleInfo.id;
      // 报价信息
      if (repairQuote.bidsFlag === 1) {
        this.quotePriceWithBidInfo = repairQuote;
        this.middleController.quotePriceWithBid.show = this.quotePriceWithBidInfo.id;
      } else {
        this.quotePriceWithoutBidInfo = data.repairQuote;
        this.middleController.quotePriceWithoutBid.show = this.quotePriceWithoutBidInfo.id;
      }
      // 报价审核信息
      if (quoteConfirm.bidsFlag === 1) {
        this.examineQuotePriceWithBidInfo = quoteConfirm;
        this.middleController.examineQuotePriceWithBid.show = this.examineQuotePriceWithBidInfo.id;
      } else {
        this.examineQuotePriceWithoutBidInfo = quoteConfirm;
        this.middleController.examineQuotePriceWithoutBid.show = this.examineQuotePriceWithoutBidInfo.id;
      }
      // 流标处理信息
      this.failureTenderInfo = data.overflowBidDeal || {};
      this.middleController.failureTender.show = this.failureTenderInfo.id;
      // 处理中间面板显示逻辑
      const arr = [];
      for (const key in this.middleController) {
        if (this.middleController[key].show) {
          arr.push(key);
        }
      }
      if (arr.length === 1) {
        this.middleController[arr[0]].showExpand = false;
      } else {
        arr.map(item => {
          this.middleController[item].showExpand = true;
        });
        const last = arr.pop();
        this.active = this.middleController[last].name;
        this.middleController[last].showExpand = true;
      }
      // 设置左侧面板初始数据
      if (this.action === 'QuotePriceWithBidPanel') {
        this.leftComponentDefaultData = this.quotePriceWithBidInfo;
      }
      if (this.leftComponent === 'ExamineQuotePriceWithBidPanel') {
        this.leftComponentDefaultData = {
          repairId: this.repairId,
        };
      }
      // 送回确认
      if (this.leftComponent === 'ConfirmReturnPanel') {
        this.leftComponentDefaultData = this.confirmReturnInfo;
      }
      // 送回处置
      if (this.leftComponent === 'DealReturnPanel') {
        this.leftComponentDefaultData = {
          repairResult: this.confirmReturnInfo.repairResult,
        };
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
      height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
   .carry-info-panel
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 40px);
    }
  }
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.item {
  height: 100%;
  margin-bottom: 16px;
}
.middle {
  display: flex;
  flex-direction: column;
  .last {
    flex:1;
    margin-bottom: 0px;
    overflow: hidden;
  }
}
    .process-flow-panel {
    height: 100%;
    &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
  }
</style>

