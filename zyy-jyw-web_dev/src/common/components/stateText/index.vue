/**
* @file index.vue.vue
* @author huang
* @date 2023/10/12
* @description  状态颜色文本
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <span
    :style="{
      color:config[state] ? config[state].color :''
    }"
    class="state-text"
  >
    {{ config[state] ? config[state].label : '' }}
  </span>
</template>
<script>
export default {

  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    state: {
      type: [
        String,
        Number,
      ],
      detail: '',
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.state {
  &-text {
    font-size: 12px;
    font-weight: 400;
  }
}

</style>
