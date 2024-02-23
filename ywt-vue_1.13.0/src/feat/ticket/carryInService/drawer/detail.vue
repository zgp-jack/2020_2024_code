<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-11 11:03:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 22:01:25
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
        <el-col :span="6">
          <process-flow-panel :id="id" class="process-flow-panel" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import EngineerTakeAwayPanel from '../panel/engineerTakeAway.vue';
import ManufacturerTakeAwayPanel from '../panel/manufacturerTakeAway.vue';
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
// 科室接收-工程师送回
import AcceptPanel from '../panel/accept.vue';
// 科室接收-厂家送回
import AcceptManufacturerReturnPanel from '../panel/acceptManufacturerReturn';
// 无法维修面板
import UnableRepairPanel from '../panel/unableRepair.vue';
// 科室取走面板
import DepartmentTakeBackPanel from '../panel/departmentTakeBack.vue';
// 维修结算面板
import RepairSettlePanel from '../panel/repairSettle.vue';
// 流标处理面板
import FailureTenderPanel from '../panel/failureTender.vue';
import ProcessFlowPanel from '../panel/processFlow.vue';
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
    ProcessFlowPanel,
    AcceptManufacturerReturnPanel,
    DepartmentTakeBackPanel,
    RepairSettlePanel,
  },
  mixins: [FormDialog],
  data() {
    return {
      detailApi: CarryInServiceApi.detail,
      activePanel: '',
      activePanelData: {},
      allPanel: {
        CarryInfoPanel: {
          label: '送修信息',
          data: {},
          panel: 'CarryInfoPanel',
        },
        EngineerTakeAwayPanel: {
          label: '工程师取走',
          data: {},
          panel: 'EngineerTakeAwayPanel',
        },
        DealAcceptPanel: {
          label: '接收处置',
          data: {},
          panel: 'DealAcceptPanel',
        },
        ManufacturerTakeAwayPanel: {
          label: '厂家取走',
          data: {},
          panel: 'ManufacturerTakeAwayPanel',
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
        UnableRepairPanel: {
          label: '无法维修',
          data: {},
          panel: 'UnableRepairPanel',
        },
        // 厂家取走-邀标
        ManufacturerTakeAwayPanelWithBid: {
          label: '厂家取走',
          data: {},
          panel: 'ManufacturerTakeAwayPanel',
        },
        FailureTenderPanel: {
          label: '流标处理',
          data: {},
          panel: 'FailureTenderPanel',
        },
        RepairSettlePanel: {
          label: '维修结算',
          data: {},
          panel: 'RepairSettlePanel',
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
        AcceptManufacturerReturnPanel: {
          label: '科室接收',
          data: {},
          panel: 'AcceptManufacturerReturnPanel',
        },

        DepartmentTakeBackPanel: {
          label: '科室取走',
          data: {},
          panel: 'DepartmentTakeBackPanel',
        },

      },
      validPanels: [],
    };
  },
  beforeCreate() {
    // 送修信息面板-解决因维修历史弹窗可进行查看送修详情导致的组件循环引用问题
    this.$options.components.CarryInfoPanel = () => import('../panel/carryInfo.vue');
  },
  created() {
  },
  methods: {
    afterFetchDetail() {
      // 送修信息
      this.allPanel.CarryInfoPanel.data = this.formData.repairInfo;

      // 工程师取走信息
      this.allPanel.EngineerTakeAwayPanel.data = this.formData.takeAway;
      // 接收处置信息
      this.allPanel.DealAcceptPanel.data = this.formData.receiveDealResultVo;

      // 厂家取走信息 邀标和不要标顺序不同，邀标在报价审核后，不要标在厂家报价前

      if (this.formData.repairInfo.bidsFlag === 1) {
        this.allPanel.ManufacturerTakeAwayPanelWithBid.data = this.formData.manufacturerTakeAwayVo;
      } else {
        this.allPanel.ManufacturerTakeAwayPanel.data = this.formData.manufacturerTakeAwayVo;
      }
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
      // 流标处理信息
      this.allPanel.FailureTenderPanel.data = this.formData.overflowBidDeal || {};
      // 维修结算
      this.allPanel.RepairSettlePanel.data = this.formData.settlementResultVo;
      // 完成维修信息
      this.allPanel.CompleteRepairPanel.data = this.formData.finishRepair;
      // 送回信息
      this.allPanel.ConfirmSendBackToDepartmentPanel.data = this.formData.sendDept;
      // 送回确认
      this.allPanel.ConfirmReturnPanel.data = this.formData.repairReturn;
      // 送回处置
      this.allPanel.DealReturnPanel.data = this.formData.deptReclaim;
      this.allPanel.DealReturnPanel.data.repairResult = this.formData.repairReturn?.repairResult;
      // 领走
      this.allPanel.TakeBackPanel.data = this.formData.claim;
      // 无法维修
      this.allPanel.UnableRepairPanel.data = this.formData.cantRepairVo;
      // 工程师配送-科室接收
      this.allPanel.AcceptPanel.data = this.formData.engineerSendResultVo;
      // 厂家配送-科室接收
      this.allPanel.AcceptManufacturerReturnPanel.data = this.formData.manufacturerSendResultVo;
      // 科室取走
      this.allPanel.DepartmentTakeBackPanel.data = this.formData.deptReturnVo;
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
  .process-flow-panel {
    height: 100%;
    &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
  }
</style>
