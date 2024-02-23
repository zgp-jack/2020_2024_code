<template>
  <el-dialog
    :visible="visible"
    :width="width"
    custom-class="bigScreenDialog"
    append-to-body
    :close-on-click-modal="false"
    :modal="false"
    @closed="closed"
    @close="close"
  >
    <div slot="title" class="header">
      <span class="title">
        {{ title }}
      </span>
    </div>
    <slot />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: 'title',
    },
    width: {
      type: String,
      default: '30%',
    },
  },
  methods: {
    close() {
      this.$emit('close',);
    },
    closed() {
      this.$emit('closed',);
    },
  },
};
</script>

<style lang="scss">
@import "~@/feat/bigScreen/style/linearGradient.scss";

.bigScreenDialog {
  background: #01070d;
  border: 1px solid #062440;
  box-shadow: 0px 20px 40px 10px #000c1a,
    0px 10px 20px 0px rgba(24, 144, 255, 0.15);
 @extend .boderLinearGradient;
}
</style>

<style lang="scss" scoped>
.header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #263341;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    right: 0;
    width: 15px;
    bottom: -2px;
    height: 3px;
    opacity: 0.8;
    background: #ffffff;
  }
}
.title {
  color: #fff;
  font-size: 18px;
  font-weight: 400;
}
::v-deep .el-dialog__header {
  padding: 0 20px;
}
::v-deep .el-dialog__headerbtn {
  top: 10px;
  font-size: 20px;
}
::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
}
</style>
