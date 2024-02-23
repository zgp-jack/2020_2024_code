<template>
  <div class="form-box">
    <div class="form-box-header">
      <div class="title">
        <slot name="title">{{ title }}</slot>
      </div>
      <slot name="operate" />
    </div>
    <div class="form-box-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    isHeaderHasBackground: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.form-box {
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #dde9e8;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background: #f0f7f7;
    font-size: 16px;
    color: #757e7e;
    .title {
      display: flex;
      &::before {
        display: inline-block;
        content: '';
        width: 6px;
        height: 20px;
        margin-right: 6px;
        background: #006666;
      }
    }
  }
  &-body {
    padding: 16px;
  }
}
</style>
