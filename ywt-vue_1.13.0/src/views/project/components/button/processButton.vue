<!--  -->
<template>
  <el-badge :value="badgeValue" :max="99">
    <button class="process-button" :disabled="disabled" :style="[disabledStyle,activeStyle]" @click="click">
      <slot />
    </button>
  </el-badge>
</template>

<script>
export default {
  components: {},
  props: {
    badgeValue: {
      type: [String, Number],
      default: '',
    },
    disabled: Boolean,
    active: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    disabledStyle() {
      if (this.disabled) {
        return {
          backgroundColor: '#f0f1f5',
          color: '#a8abb3',
        };
      }
      return {};
    },
    activeStyle() {
      if (!this.disabled && this.active) {
        return {
          borderColor: '#426ED7',
          backgroundColor: '#fff',
          color: '#426ED7',
        };
      }
      return {};
    },
  },
  mounted() {},
  methods: {
    click() {
      this.$emit('click', this.$event);
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep .el-badge__content{
  background-color:#F56C6C !important;

}
.process-button {
  height: 26px;
  line-height: 26px;
  text-align: center;
  min-width: 74px;
  max-width: 74px;
  width: 74px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  color: #334266;
  background: #fff;
  font-size: 14px;
  &:hover{
  background: #33426625;
  cursor: pointer;
  }
}
</style>
