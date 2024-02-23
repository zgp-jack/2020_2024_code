<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-11 10:44:56
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-18 19:27:56
 * @Description:
-->
<template>
  <span
    class="pure-tag"
    :class="[
      period ? 'pure-tag--'+period: ''
    ]"
    v-on="$listeners"
  >{{ label }}</span>
</template>

<script>
export default {
  props: {
    period: {
      type: String,
      default: 'day',
    },
    label: {
      type: String,
      default: '标',
    },
    color: {
      type: String,
      default: '',
    },

  },
  data() {
    return {

    };
  },
};
</script>

<style lang="scss" scoped>
.pure-tag  {

  padding:3px 5px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 400px;
  line-height: 30px;
  cursor: pointer;
  &--week {
    color: #E6A23C;
    background: rgba(230,162,60,0.10);
    border: 1px solid rgba(230,162,60,0.50);
  }
  &--month {
    background: rgba(64,158,255,0.10);
    border: 1px solid rgba(64,158,255,0.50);
    color: #409eff;
  }
  &--day {
    background: rgba(245,108,108,0.10);
    border: 1px solid rgba(245,108,108,0.50);
    color: #f56c6c;
  }
  &--year {
    background: rgba(103,194,58,0.10);
    border: 1px solid rgba(103,194,58,0.50);
    color: #67c23a;
  }

}
</style>
