<template>
  <div class="module-header">
    <span class="module-header-title">{{ title }}</span>
    <template v-if="$slots.extra">
      <span class="extra">
        <slot name="extra" />
      </span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.module-header {
  background: #f0f7f7;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #dde9e8;
  padding: 6px 0 6px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  &::before {
    display: inline-block;
    content: "";
    width: 6px;
    // height: 100%;
    height: 20px;
    margin-right: 6px;
    background: #006666;
  }

  &-title {
    font-size: 16px;
    font-weight: 500;
    color: #757e7e;
  }
}
.extra {
  margin-left: 30px;
}
</style>
