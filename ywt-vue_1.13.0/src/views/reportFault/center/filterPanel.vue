<template>
  <el-card class="pure-flex">
    <el-radio-group v-model="activeBtn" size="mini" @change="changeTemplateType()">
      <div>
        <el-badge :value="redData.manualCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="其他" border>其他</el-radio>
        </el-badge>
        <el-badge :value="redData.wechatCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="微信报修" border>微信报修</el-radio>
        </el-badge>
        <el-badge :value="redData.phoneCreate || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="电话报修" border>电话报修</el-radio>
        </el-badge>
      </div>
      <div class="complex">

        <img class="normal-arrow comp1" src="../../../assets/filterPanel/arrow-comp-1.png">
        <div class="flex">
          <div>
            <img class="comp2" src="../../../assets/filterPanel/arrow-comp-2.png">
          </div>
          <div>
            <el-badge :value="redData.pickedUp || null" :max="99" class="item">
              <el-radio class="btn btn-margin-bottom gray" label="已接" border>已接</el-radio>
            </el-badge>
            <el-badge :value="redData.missed || null" :max="99" class="item">
              <el-radio class="btn btn-margin-bottom" label="未接" border>未接</el-radio>
            </el-badge>
          </div>
          <div>
            <img class="comp3" src="../../../assets/filterPanel/arrow-comp-3.png">
          </div>

        </div>

      </div>
      <div>
        <el-badge :value="redData.waitDelivery || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="待派单" border>待派单</el-radio>
        </el-badge>
        <el-badge :value="redData.untenited || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="待建单" border>待建单</el-radio>
        </el-badge>
        <el-badge :value="redData.findSomeone || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="电话找人" border>电话找人</el-radio>
        </el-badge>
        <el-badge :value="redData.endPhone || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="电话解决" border>电话解决</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="../../../assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.waitAccept || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray " label="待接单" border>待接单</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="../../../assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.processing || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="处理中" border>处理中</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="comp-arrow comp4" src="../../../assets/filterPanel/arrow-comp-4.png">
      </div>
      <div>
        <el-badge :value="redData.waitAudit || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="完成待审" border>完成待审</el-radio>
        </el-badge>
        <el-badge :value="redData.sendOut || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="送修" border>送修</el-radio>
        </el-badge>
        <el-badge :value="redData.transform || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="转为需求" border>转为需求</el-radio>
        </el-badge>
        <el-badge :value="redData.terminated || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="终止" border>终止</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="comp-arrow" src="../../../assets/filterPanel/arrow-comp-5.png">
      </div>
      <div>
        <el-badge :value="redData.waitAppraisal || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="待评价" border>待评价</el-radio>
        </el-badge>
        <el-badge :value="redData.notPassAudit || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom" label="未通过" border>未通过</el-radio>
        </el-badge>
      </div>
      <div>
        <img class="normal-arrow" src="../../../assets/filterPanel/arrow-left.png">
      </div>
      <div>
        <el-badge :value="redData.ended || null" :max="99" class="item">
          <el-radio class="btn btn-margin-bottom gray" label="结束" border>结束</el-radio>
        </el-badge>
      </div>
    </el-radio-group>
  </el-card>
</template>
<script>
export default {
  props: {
    redData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      activeBtn: '待派单',
    };
  },
  watch: {
    redData() {},
  },
  methods: {
    changeTemplateType() {
      this.$emit('changeTemplateType', this.activeBtn);
    },
  },

};
</script>
<style lang="scss" scoped>
::v-deep .el-card__body {
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
  > div {
    &.complex {
      width: 170px;
    }
    .btn {
      margin-bottom: 15px;
      height: 26px;
      width: 90px;
      &.gray {
        background-color: $--pure-color-theme-light;
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
      &.comp3 {

        width: 40px;
        padding :18px 8px 0 8px;
        position: relative;
        top:-80px;
        height:140px ;
      }
    }
  }
}
</style>

