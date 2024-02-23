<template>
  <div class="chart-container pure-flex">
    <div class="fuck-btn">
      <pure-button :label="buttonLabel" :icon="buttonIcon" type="patch" @click="onChange" />
    </div>
    <pure-collapse-transition
      @transition-end="onFlowChartPanelTransitionEnd"
    >
      <el-radio-group v-show="flowChartVisible" v-model="activatedTemplateType" class="" @change="onTemplateTypeChange()">
        <div class="mrb">
          <el-badge :value="redData.manualCreate || null" :max="99" class="item manual-create">

            <el-radio class="btn" label="MANUAL_CREATE">其他</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.waitDelivery || null" :max="99" class="item row-1 arrow bottom-arrow">
            <el-radio class="btn" label="WAIT_DELIVERY">待派单</el-radio>
          </el-badge>
          <el-badge :value="redData.waitAccept || null" :max="99" class="item row-1 arrow">
            <el-radio class="btn" label="WAIT_ACCEPT">待接单</el-radio>
          </el-badge>
          <el-badge :value="redData.processing || null" :max="99" class="item row-1 arrow">
            <el-radio class="btn" label="PROCESSING">处理中</el-radio>
          </el-badge>
          <el-badge :value="redData.waitAudit || null" :max="99" class="item row-1 arrow wait-audit">
            <el-radio class="btn" label="WAIT_AUDIT">完成待审</el-radio>
          </el-badge>
          <el-badge :value="redData.waitAppraisal || null" :max="99" class="item row-1 arrow">
            <el-radio class="btn" label="WAIT_APPRAISAL">待评价</el-radio>
          </el-badge>
          <el-badge :value="redData.ended || null" :max="99" class="item arrow">
            <el-radio class="btn" label="ENDED">结束</el-radio>
          </el-badge>
        </div>
        <div class="mrb">
          <el-badge class="item wechat-create" :value="redData.wechatCreate || null" :max="99">

            <el-radio class="btn" label="WECHAT_CREATE">微信报修</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.untenited || null" :max="99" class="item half-left col-1">
            <el-radio class="btn" label="UNTENITED">待建单</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <!--<el-badge :value="redData.sendOut || null" :max="99" class="item half-left">
            <el-radio class="btn" disabled label="">送修</el-radio>
          </el-badge>-->
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.notPassAudit || null" :max="99" class="item half-left">
            <el-radio class="btn" label="NOT_PASS_AUDIT">未通过</el-radio>
          </el-badge>
          <el-badge :value="redData.evaluateResult || null" :max="99" class="item">
            <el-radio class="btn" label="EVALUATE_RESULT">评价结果</el-radio>
          </el-badge>
        </div>
        <div class="mrb">
          <el-badge :value="redData.phoneCreate || null" :max="99" class="item row-1 phone-create">
            <el-radio class="btn" label="PHONE_CREATE">电话报修</el-radio>
          </el-badge>
          <el-badge :value="redData.pickedUp || null" :max="99" class="item row-1 arrow">
            <el-radio class="btn" label="PICKED_UP">已接</el-radio>
          </el-badge>
          <el-badge :value="redData.findSomeone || null" :max="99" class="item arrow find-someone">
            <el-radio class="btn" label="FIND_SOMEONE">电话找人</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.transform || null" :max="99" class="item half-left transform">
            <el-radio class="btn" label="TRANSFORM">工单升级</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
        </div>
        <div class="mrb">
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.missed || null" :max="99" class="item missed arrow">
            <el-radio class="btn" label="MISSED">未接</el-radio>
          </el-badge>
          <el-badge :value="redData.endPhone || null" :max="99" class="item half-left">
            <el-radio class="btn" label="END_PHONE">电话解决</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
          <el-badge :value="redData.terminated || null" :max="99" class="item half-left">
            <el-radio class="btn" label="TERMINATED">终止</el-radio>
          </el-badge>
          <el-badge :value="redData.suspended || null" :max="99" class="item">
            <el-radio class="btn" label="SUSPENDED">暂停</el-radio>
          </el-badge>
          <el-badge class="item hided">
            <el-radio class="btn" disabled label="null">空</el-radio>
          </el-badge>
        </div>
      </el-radio-group>
    </pure-collapse-transition>
  </div>
</template>

<script>
import PureCollapseTransition from '@/common/components/collapseTransition';
export default {
  components: {
    PureCollapseTransition,
  },
  props: {
    redData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    defaultTemplateType: {
      type: String,
      default: 'UNTENITED',
    },
  },
  data() {
    return {
      activatedTemplateType: 'UNTENITED',
      flowChartVisible: true,
    };
  },
  computed: {
    buttonLabel() {
      return this.flowChartVisible ? '收起流程图' : '展开流程图';
    },
    buttonIcon() {
      return this.flowChartVisible ? 'arrow-up' : 'arrow-down';
    },
  },
  created() {
  },
  methods: {
    onTemplateTypeChange() {
      this.$emit('templateTypeChange', this.activatedTemplateType);
    },
    onFlowChartPanelTransitionEnd() {
      this.$emit('transition-end');
    },
    onChange() {
      this.flowChartVisible = !this.flowChartVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
$space: 40px;
$width: 90px;
$height: 26px;
$margin: 16px;
.chart-container {
  width: 100%;
  padding: 16px 0 0 0;
  position: relative;
  // height: 192px;
  background-color: white;
  min-height: 56px;
  .fuck-btn {
    position: absolute;
    right: 16px;
    top: 13px;
  }
  .btn {
    // border: 1px solid #409eff;
    border: 1px solid #f0f7f7;
    color: #409eff;
    width: $width;
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
    text-align: center;
    background-color: #f0f7f7;
    //   display: flex;
    // justify-content: center;
    // align-items: center;

    &.is-checked {
      background: #006666 !important;
      border: 1px solid #006666;
      ::v-deep .el-radio__label {
        color: white !important;
      }
    }
    &:hover {
    }
    &:focus {
      background: #006666;
    }
    &::v-deep .el-radio__input {
      display: none;
    }
    &::v-deep .el-radio__label {
      padding-left: 0;
      font-size: 14px;
      color: #334266;
    }
  }
}
.mrb {
  margin-bottom: 16px;
}
.pure-flex {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  .btn {
    width: $width;
    height: 26px;
    line-height: 26px;
  }
  .item {
    &::after {
      content: "";
      background-color: #f0f7f7;
      position: absolute;
    }
  }
  .item + .item {
    margin-left: $space;
  }
  .hided {
    cursor: unset;
    opacity: 0;
    .btn {
      cursor: unset;
    }
  }
  .manual-create {
    &::after {
      content: "";
      height: 3px;
      width: calc($space * 2 + $width - 2px);
      top: 50%;
      // @include background_color_imp('color-bg');
    }
  }
  .row-1 {
    &::after {
      height: 3px;
      width: calc($space - 2px);
      top: 50%;
    }
  }
  .arrow {
    &:before {
      content: "";
      display: inline-block;
      border: 6px solid transparent;
      border-left: 6px solid #f0f7f7;
      position: absolute;
      top: 9px;
      left: -6px;
    }
  }
  .wechat-create {
    &::after {
      content: "";
      width: calc($space/2);
      height: 3px;
      top: 50%;
    }
    &::before {
      content: "";
      width: 3px;
      height: calc($height + 16px);
      position: absolute;
      top: calc(0px - $height);
      right: calc(0px - $space/2);
      background-color: #f0f7f7;
    }
  }
  .phone-create,
.wait-audit {
  .btn {
    &::after {
      content: "";
      width: 3px;
      height: calc($height + 16px);
      top: 60%;
      right: calc(0px - $space/2 - 1px);
      position: absolute;
      background-color: #f0f7f7;
    }
  }
}
.missed {
  .btn {
    &::before {
      content: "";
      width: calc($space/2);
      height: 3px;
      top: 50%;
      left: calc(0px - $space / 2 - 4px);
      position: absolute;
      background-color: #f0f7f7;
    }
  }
}
.transform {
  .btn {
    &::before {
      content: "";
      width: 3px;
      height: calc(3 * $margin + 3 * $height);
      position: absolute;
      top: calc(0px - 2 * $margin - 1.5 * $height);
      left: calc(0px - $space / 2 - 1px);
      background-color: #f0f7f7;
    }
  }
}
.find-someone {
  &::after {
    content: "";
    width: 3px;
    height: calc(3 * $margin + 3 * $height);
    position: absolute;
    top: calc(0px - 2 * $margin - 1.5 * $height);
    left: calc(0px - $space / 2);
    background-color: #f0f7f7;
  }
}
.half-left {
  &::before {
    content: "";
    display: inline-block;
    border: 6px solid transparent;
    border-left: 6px solid #f0f7f7;
    position: absolute;
    top: 9px;
    left: -6px;
  }
  &::after {
    content: "";
    width: calc($space/2 - 4px);
    height: 3px;
    top: 50%;
    left: calc(0px - $space / 2);
  }
}
.col-1 {
  .btn {
    &::after {
      content: "";
      height: calc($margin - 2px);
      width: 3px;
      top: calc(0px - $margin);
      left: calc($width/2);
      display: inline-block;
      position: absolute;
      background-color: #f0f7f7;
    }
  }
}
.bottom-arrow {
  .btn {
    &::after {
      content: "";
      display: inline-block;
      border: 6px solid transparent;
      border-bottom: 6px solid #f0f7f7;
      position: absolute;
      top: 19px;
      left: calc($width/2 - 4px);
    }
  }
}
}

</style>
