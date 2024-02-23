<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-11 11:03:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-12 20:21:50
 * @Description:送修查询drawer
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">
        查看
      </div>
    </div>
    <div class="body">
      <el-row
        class="h-100"
        :gutter="16"
        type="flex"
      >
        <el-col :span="18" class="h-100">
          <pure-card class="max-height">
            <div slot="header">
              主要流程信息
            </div>
            <el-row
              class="h-100"
              :gutter="16"
              type="flex"
            >
              <el-col :span="4" class="left h-100">
                <div v-for="(item,index) in validPanels" :key="index" style="text-align:center">
                  <img v-if="index!==0" class="normal-arrow arrow-up" src="@/assets/filterPanel/arrow-up.png">
                  <div>
                    <pure-button :label="item.label" :type="item.panel===activePanel?'default':'wire-frame'" @click="onChangePanel(item)" />
                  </div>
                </div>
              </el-col>
              <el-col :span="20">
                <collapse>
                  <component
                    :is="activePanel"
                    ref="activePanel"
                    class="carry-info-panel"
                    :disabled="true"
                    :data="activePanelData"
                  /></collapse>
              </el-col>
            </el-row>
          </pure-card>
        </el-col>
        <el-col :span="6" />
      </el-row>
    </div>
  </div>
</template>

<script>
// 送修信息面板
import CarryInfoPanel from '../panel/carryInfo.vue';
import EngineerTakeAwayPanel from '../panel/engineerTakeAway.vue';
import ManufacturerTakeAwayPanel from '../panel/manufacturerTakeAway.vue';
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
// 领走面板
import TakeBackPanel from '../panel/takeBack.vue';
// 科室接收
import AcceptPanel from '../panel/accept.vue';
// 无法维修面板
import UnableRepairPanel from '../panel/unableRepair.vue';
// 维修结算面板
// import RepairSettlePanel from '../panel/repairSettle.vue';

import FormDialog from '@/minxins/common/formDialog';
import CarryInServiceApi from '../api';

export default {
  name: 'DetailDrawer',
  components: {
    EngineerTakeAwayPanel,
    ManufacturerTakeAwayPanel,
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
    TakeBackPanel,
    AcceptPanel,
    CarryInfoPanel,
  },
  mixins: [FormDialog],
  data() {
    return {
      detailApi: CarryInServiceApi.detail,
      activePanel: 'CarryInfoPanel',
      activePanelData: {},
      allPanel: {
        CarryInfoPanel: {
          label: '送修信息',
          data: {},
          panel: 'CarryInfoPanel',
        },
        ManufacturerTakeAwayPanel: {
          label: '厂家取走',
          data: {},
          panel: 'ManufacturerTakeAwayPanel',
        },
        EngineerTakeAwayPanel: {
          label: '取走',
          data: {},
          panel: 'EngineerTakeAwayPanel',
        },
        QuotePriceWithBidPanel: {
          label: '厂家报价',
          data: {},
          panel: 'QuotePriceWithBidPanel',
        },
        QuotePriceWithoutBidPanel: {
          label: '厂家报价',
          data: {},
          panel: 'QuotePriceWithoutBidPanel',
        },
        ExamineQuotePriceWithBidPanel: {
          label: '报价审核',
          data: {},
          panel: 'ExamineQuotePriceWithBidPanel',
        },
        ExamineQuotePriceWithoutBidPanel: {
          label: '报价审核',
          data: {},
          panel: 'ExamineQuotePriceWithoutBidPanel',
        },
        CompleteRepairPanel: {
          label: '完成维修',
          data: {},
          panel: 'CompleteRepairPanel',
        },
        ConfirmSendBackToDepartmentPanel: {
          label: '送回信息',
          data: {},
          panel: 'ConfirmSendBackToDepartmentPanel',
        },
        ConfirmReturnPanel: {
          label: '送回确认',
          data: {},
          panel: 'ConfirmReturnPanel',
        },
        DealReturnPanel: {
          label: '送回处置',
          data: {},
          panel: 'DealReturnPanel',
        },
        TakeBackPanel: {
          label: '领走',
          data: {},
          panel: 'TakeBackPanel',
        },
        AcceptPanel: {
          label: '科室接收',
          data: {},
          panel: 'AcceptPanel',
        },
        UnableRepairPanel: {
          label: '无法维修',
          data: {},
          panel: 'UnableRepairPanel',
        },

      },
      validPanels: [],
    };
  },
  created() {
  },
  methods: {
    afterFetchDetail() {
      // 送修信息
      this.allPanel.CarryInfoPanel.data = this.formData.repairInfo;
      // 厂家取走信息
      this.allPanel.ManufacturerTakeAwayPanel.data = this.formData.manufacturerTakeAwayVo;
      // 工程师取走信息
      this.allPanel.EngineerTakeAwayPanel.data = this.formData.takeAway;
      // 报价信息
      if (this.formData.repairQuote.bidsFlag === 1) {
        this.allPanel.QuotePriceWithBidPanel.data = this.formData.repairQuote;
      } else {
        this.allPanel.QuotePriceWithoutBidPanel.data = this.formData.repairQuote;
      }
      // 报价审核信息
      if (this.formData.quoteConfirm.bidsFlag === 1) {
        this.allPanel.ExamineQuotePriceWithBidPanel.data = this.formData.quoteConfirm;
      } else {
        this.allPanel.ExamineQuotePriceWithoutBidPanel.data = this.formData.quoteConfirm;
      }
      // 完成维修信息
      this.allPanel.CompleteRepairPanel.data = this.formData.finishRepair;
      // 送回信息
      this.allPanel.ConfirmSendBackToDepartmentPanel.data = this.formData.sendDept;
      // 送回确认
      this.allPanel.ConfirmReturnPanel.data = this.formData.repairReturn;
      // 送回处置
      this.allPanel.DealReturnPanel.data = this.formData.deptReclaim;
      // 领走
      this.allPanel.TakeBackPanel.data = this.formData.claim;
      // 科室接收
      this.allPanel.AcceptPanel.data = this.formData.engineerSendResultVo;
      for (const key in this.allPanel) {
        const data = this.allPanel[key];
        if (data?.data.id) {
          this.validPanels.push(data);
        }
      }
      this.validPanels.reverse();
      const activePanel = this.validPanels[0];
      this.activePanel = activePanel.panel;
      this.activePanelData = activePanel.data;
    },
    onChangePanel(data) {
      this.activePanel = data.panel;
      console.log(this.activePanel);
      this.activePanelData = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.max-height {
  height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 40px);
    }
}
.left {
  border-right: 1px solid #dcdfe6;
  .el-button + .el-button {
    margin-left: 0;
  }
}
  .arrow-up {
    left: 40px;
    top: 27px;
    width: 10px !important;
    height: 12px !important;
    padding: 0px !important;
}
</style>
