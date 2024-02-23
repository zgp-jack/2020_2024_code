<template>
  <el-drawer
    :with-header="false"
    v-bind="$attrs"
    custom-class="custom-drawer-container"
    v-on="$listeners"
  >
    <div class="drawer-content">
      <div class="drawer-header">
        <slot name="header">
          <div class="drawer-title">
            <span class="title">{{ $attrs.title }}</span>
          </div>
          <div class="drawer-close" @click="onClose">
            <svg-icon icon-class="multiple" />
          </div>
        </slot>
      </div>
      <div class="drawer-main">
        <slot />
      </div>
      <div class="drawer-footer">
        <slot name="footer">
          <el-button @click="onClose">关闭</el-button>
        </slot>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'CustomDrawer',
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
.custom-drawer-container {
  .drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include background_color_imp('color-bg');
    }
    .drawer-title {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      .title {
        flex: 1;
        font-size: 18px;
        color: #282827;
        font-weight: bolder;
      }
    }
    .drawer-close {
      font-size: 18px;
      color: #BFCBD1;
      padding: 16px 20px;
      cursor: pointer;
    }
    .drawer-main {
      flex: 1;
      overflow: auto;
      padding: 20px;
    }
    .drawer-footer {
      padding: 16px 20px;
      background: #fafafa;
      border-top: 1px solid #eee;
    }
  }
}
</style>
