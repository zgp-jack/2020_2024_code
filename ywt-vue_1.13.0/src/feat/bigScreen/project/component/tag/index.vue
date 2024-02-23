<template>
  <div class="big-screen-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Tag',
};
</script>

<style lang="scss">
.big {
  &-screen {
    &-wrapper {
      display: inline-block;
      padding: 0px 6px;
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      color:#fff;
    }
  }
}
</style>
