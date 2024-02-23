<template>
  <el-card class="pure-flex">
    <el-radio-group v-model="activatedTemplateType" size="mini" @change="onTemplateTypeChange()">
      <div>
        <el-badge :value="redData.manualCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="manualCreate" border>其他</el-radio>
        </el-badge>
        <el-badge :value="redData.wechatCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="wechatCreate" border>微信报修</el-radio>
        </el-badge>
        <el-badge :value="redData.phoneCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="phoneCreate" border>电话报修</el-radio>
        </el-badge>
      </div>
      <div class="complex">
        <div class="comp3">
          <img src="@/assets/filterPanel/arrow-comp-3.png">
        </div>
        <img class="normal-arrow comp1" src="@/assets/filterPanel/arrow-comp-1.png">
        <div class="flex">
          <div>
            <img class="comp2" src="@/assets/filterPanel/arrow-comp-2.png">
          </div>
          <div>
            <el-badge :value="redData.pickedUp || null" :max="99" class="item">
              <el-radio class="btn btn-margin-bottom gray" label="pickedUp" border>已接</el-radio>
            </el-badge>
            <el-badge :value="redData.missed || null" :max="99" class="item">
              <el-radio class="btn btn-margin-bottom" label="missed" border>未接</el-radio>
            </el-badge>
          </div>

        </div>

      </div>
      <div style="position:relative">
        <img class="frame" :src="frameImg" @click="onClickHotArea">
        <el-badge :value="redData.waitDelivery || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="waitDelivery" border>待派单</el-radio>
          <img class="normal-arrow arrow-up" src="@/assets/filterPanel/arrow-up.png">
        </el-badge>

        <el-badge :value="redData.untenited || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="untenited" border>待建单</el-radio>
        </el-badge>
        <el-badge :value="redData.findSomeone || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="findSomeone" border>电话找人</el-radio>
        </el-badge>
        <el-badge :value="redData.endPhone || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="endPhone" border>电话解决</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="@/assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.waitAccept || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray " label="waitAccept" border>待接单</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="@/assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.processing || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="processing" border>处理中</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="comp-arrow comp4" src="@/assets/filterPanel/arrow-comp-4.png">
      </div>
      <div>
        <el-badge :value="redData.waitAudit || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="waitAudit" border>完成待审</el-radio>
        </el-badge>
        <el-badge :value="redData.sendOut || null" :max="99" class="item">
          <el-radio disabled class="btn btn-margin-bottom" label="sendOut" border>送修</el-radio>
        </el-badge>
        <el-badge :value="redData.transform || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="transform" border>工单升级</el-radio>
        </el-badge>
        <el-badge :value="redData.terminated || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="terminated" border>终止</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="comp-arrow" src="@/assets/filterPanel/arrow-comp-5.png">
      </div>
      <div>
        <el-badge :value="redData.waitAppraisal || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="waitAppraisal" border>待评价</el-radio>
        </el-badge>
        <el-badge :value="redData.notPassAudit || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="notPassAudit" border>未通过</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="@/assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.ended || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="ended" border>结束</el-radio>
        </el-badge>
      </div>
    </el-radio-group>
  </el-card>
</template>
<script>
import frameImg from '@/assets/filterPanel/frame.png';
import frameActiveImg from '@/assets/filterPanel/frame-active.png';
export default {
  name: 'TicketFlowChart',
  props: {
    redData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    defaultTemplateType: {
      type: String,
      default: 'untenited',
    },
  },
  data() {
    return {
      activatedTemplateType: 'untenited',
      frameImg: frameImg,
    };
  },
  watch: {
    redData() {},
    defaultTemplateType: {
      handler(val) {
        this.activatedTemplateType = val;
      },
      immediate: true,
    },
  },
  methods: {
    onTemplateTypeChange() {
      this.frameImg = frameImg;
      this.$emit('templateTypeChange', this.activatedTemplateType);
    },
    onClickHotArea() {
      this.activatedTemplateType = 'built_order';
      this.frameImg = frameActiveImg;
      this.$emit('templateTypeChange', this.activatedTemplateType);
    },
  },

};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
  width: 1040px;
  padding: 15px;
  display: flex;
  position: relative;
  .el-radio-group {
     display: flex;
     .el-radio-button__inner {
       width: 100%
     }
  }
}
::v-deep .el-badge {
  z-index: 20;
}
.btn {
  // border: 1px solid #409eff;
  border: 1px solid #dcdfe6;
  color: #409eff;
  width: 80px;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  padding-top: 2px;
  margin-right: 0;
  text-align: center;
  &.is-checked {
    background: white !important;
    border: 1px solid #456add;
   ::v-deep .el-radio__label {
     color: #456ADD
   }

  }
  &:hover {
    background: #d7e5f9;
  }
  &:focus {
    background: white;
  }
  &::v-deep .el-radio__input{
    display: none;
  }
  &::v-deep .el-radio__label {
    padding-left: 0;
    font-size: 14px;
    color: #334266;
  }
}
.btn-margin-bottom{
  margin-bottom: 15px;
  padding-top: 2px;
}
.pure-flex {
  display: flex;
  height: 179px;
   div {
    &.complex {
      width: 170px;
      position: relative;
    }
    .btn {
      margin-bottom: 15px;
      height: 26px;
      width: 90px;
      &.gray {
        &:focus {
          background-color: white;
        }
      }
    }
    img {
      width: 40px;
      &.normal-arrow {
         padding :8px 13px 0 13px;
      }
      &.comp-arrow {
        padding :8px 8px 0 8px;
      }
    }
    .complex img {
      width: 170px;
      &.comp1 {
        margin-bottom: 26px;
      }
      &.comp2 {
        width: 40px;
        padding :8px 8px 0 8px;
      }

    }
    .comp3 {
        position: absolute;
        right: 0px;
        img {
          width: 40px !important;
          padding :18px 8px 0 8px;
         height:140px ;
        }
      }
  }
  .arrow-up {
    position: absolute;
    left: 40px;
    top: 27px;
    width: 10px !important;
    height: 12px !important;
    padding: 0px !important;
}
.frame {
  width: 366px !important;
  height: 32px;
  position: absolute;
  left: -4px;
  top: -3px;
  cursor: pointer;
}
}

</style>
