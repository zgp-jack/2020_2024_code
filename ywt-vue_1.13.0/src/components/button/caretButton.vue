<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 14:16:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-15 16:37:11
 * @Description:
-->
<template>
  <el-row>
    <el-col>
      <el-button type="text" class="black" @click="handlerClick">
        <i :class="currentClass" class="icon" />
        {{ label }}</el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: '筛选',
    },
  },
  data() {
    return {
      currentClass: 'el-icon-caret-bottom',
      isShowing: false,
    };
  },
  methods: {
    handlerClick() {
      this.isShowing = !this.isShowing;
      this.currentClass = this.isShowing
        ? 'el-icon-caret-top'
        : 'el-icon-caret-bottom';
      this.$emit('click');
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  color: #7D8DB3;
  font-size: 18px;
}
.black {
  color: #334266;
  font-size: 18px;
  padding: 0px;
}
</style>
