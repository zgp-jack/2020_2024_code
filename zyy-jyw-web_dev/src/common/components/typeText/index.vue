<!--
  状态颜色文本组件
-->

<template>
  <span class="typeText">
    <i :style="[typeStyle]" />
    {{ typeLabel }}
  </span>

</template>
<script>

export default {
  props: {
    type: {
      type: [
        String,
        Number,
      ],
      default: '',
    },
    config: {
      type: Object,
      default: () => {
        return {
          '': {
            label: '',
            color: '',
          },
        };
      },
    },
  },
  computed: {
    typeStyle() {
      return {
        'background-color': this.config[this.type]?.color || '',
      };
    },
    typeLabel() {
      return this.config[this.type]?.label || '-';
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.typeText {
  font-size: 14px;
  font-weight: 400;

  i {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}
</style>
