<template>
  <span class="process-panel-header-wrapper" @click="$emit('click')">
    <svg-icon icon-class="demandPanel" />
    <slot>
      名称
    </slot>
  </span>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.process {
  &-panel {
    &-header {
      &-wrapper {
        cursor: pointer;
        border: 1px solid #fff;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        padding: 0 6px;
        border-radius: 4px;
      }
    }
  }
}
</style>
