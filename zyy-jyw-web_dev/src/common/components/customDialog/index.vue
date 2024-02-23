<template>
  <el-dialog
    class="component-custom-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    top="50px"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="container">
      <div class="header">
        <span class="title">{{ $attrs.title }}</span>
        <div class="btn-close" @click="onClose">
          <svg-icon icon-class="multiple" />
        </div>
      </div>
      <div v-if="$slots.fixed" class="fixed">
        <slot name="fixed" />
      </div>
      <div class="content">
        <slot />
      </div>
      <div v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CustomDialog',
  inheritAttrs: false,
  methods: {
    onClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.component-custom-dialog {
  ::v-deep {
    .el-dialog__header {
      height: 0;
      padding: 0;
      overflow: hidden;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 50px);
    overflow: hidden;
  }
  .header {
    flex: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    @include background_color_imp('color-bg');
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #282827;
    }
    .btn-close {
      font-size: 18px;
      color: #BFCBD1;
      cursor: pointer;
    }
  }
  .fixed {
    flex: none;
    padding: 20px;
  }
  .content {
    position: relative;
    flex: auto;
    padding: 20px;
    overflow: auto;
  }
  .footer {
    flex: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    background-color: #fafafa;
    border-top: 1px solid #ededed;
    box-shadow: -5px 0px 6px 0px rgba(0,102,102,0.2);
  }
}
</style>
