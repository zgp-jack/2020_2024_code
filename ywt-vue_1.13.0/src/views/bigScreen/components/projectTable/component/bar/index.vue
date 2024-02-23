<template>
  <div class="bar_wrapper">
    <div class="outer" :style="OtherStyle">
      <div class="inner" :style="InnerStyle" />
    </div>
    <div v-if="showPer" class="text">
      <span>
        {{ Per }}
      </span>
    </div>
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
      let val = 0;
      if (this.Value >= 100) {
        val = 100;
      } else {
        val = this.Value;
      }
      return val + '%';
    },
    Value() {
      return String(this.value || 0);
    },
    InnerStyle() {
      let val = 0;
      if (this.Value >= 100) {
        val = 100;
      } else {
        val = this.Value;
      }
      return {
        backgroundImage: 'linear-gradient(270deg,#7ddbff, #1890ff)',
        width: `${val}%`,
      };
    },
    OtherStyle() {
      return {
        height: '8px',
        width: this.showPer ? '70%' : '100%',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.bar_wrapper {
  > .outer {
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
      // &::before {
      //   content: "";
      //   position: absolute;
      //   right: 0;
      //   width: 2px;
      //   height: 100%;
      //   background: #cce6ff;
      // }
    }
  }
  >.text{
    color: #C9E5FF;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
    font-size: 14px;
  }
}
</style>
