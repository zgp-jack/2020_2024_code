/**
* @file index.vue
* @author huang
* @date 2023/10/11
* @description 名称 时间显示
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <span class="sub-label-text">
    {{ label }}:
    <span class="value">
      {{ value || '-' }}
    </span>
  </span>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.sub-label-text {
  font-size: 14px;
  font-weight: 400;
  @include font_color_imp('color-assist-gray');

  .value {
    @include font_color_imp('color-text-main');
  }

  & + & {
    margin-left: 47px;
  }
}
</style>
