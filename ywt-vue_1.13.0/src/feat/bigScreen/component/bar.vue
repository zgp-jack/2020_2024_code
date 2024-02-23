<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 18:36:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-30 11:17:21
 * @Description:进度条
-->

<template>
  <div class="bar_wrapper">
    <div class="outer" :style="OtherStyle">
      <div class="inner" :style="InnerStyle" />
    </div>
    <span v-if="showPer" class="text">
      {{ Per }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    showPer: Boolean,
  },
  computed: {
    Per() {
      return this.value + '%';
    },
    Value() {
      return String(this.value || 0);
    },
    InnerStyle() {
      return {
        backgroundImage: 'linear-gradient(270deg,#7ddbff, #1890ff)',
        width: `${this.value}%`,
      };
    },
    OtherStyle() {
      return {
        height: '8px',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.bar_wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  > .outer {
    flex: 1;
    padding-right: 50px;
    background-color: rgba(38, 58, 77, 1);
    overflow: hidden;
    position: relative;
    vertical-align: middle;
    display: inline-block;
    > .inner {
      position: absolute;
      left: 0;
      top:  0;
      height: 100%;
      text-align: right;
      line-height: 1;
      white-space: nowrap;
      transition: width 0.6s ease;
    }
  }
  >.text{
    color: #C9E5FF;
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    width: 40px;
    flex-basis: 40px;
  }
}
</style>
