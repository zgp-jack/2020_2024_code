<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-19 11:09:38
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 10:59:17
 * @Description:周期标签
-->
<template>
  <span
    class="period-tag"
    :class="[
      period ? 'period-tag--'+period: ''
    ]"
  >
    {{ periodName }}
  </span>
</template>

<script>
const PERIOD_MAP = {
  day: '天',
  week: '周',
  month: '月',
  year: '年',
  halfYear: '半年',
  quarter: '季',
};
export default {
  props: {
    period: {
      type: String,
      default: 'day',
    },

  },
  data() {
    return {

    };
  },
  computed: {
    periodName() {
      return PERIOD_MAP[this.period] || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.period-tag  {

  padding:3px 5px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 400px;
  line-height: 30px;
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
  &--halfYear {
    background: rgba(12, 165, 204, 0.1);
    border: 1px solid rgba(12, 165, 204, 0.5);
    color: #0CA5CC;
    border-radius: 15px;
  }
  &--quarter {
    background: rgba(195, 107, 201, 0.1);
    border: 1px solid rgba(195, 107, 201, 0.5);
    color: #C36BC9;
  }

}
</style>
