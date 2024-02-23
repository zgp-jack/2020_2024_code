<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-29 18:03:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-30 16:39:56
 * @Description:
-->
<template>
  <div
    v-loading="loading"
    class="w-100"
    element-loading-background="#01070da6"
  >
    <div ref="department" class="department-chart" />
  </div>
</template>

<script>

import TicketBigScreenApi from '../api';
import {
  mergeGradientStackedAreaChartOption,
} from '../../utils';
import * as echarts from 'echarts';
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {

        };
      },
    },
  },
  data() {
    return {
      option: {},
      pieData: null,
      chart: null,
      cacheData: [],
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    this.pieData = await TicketBigScreenApi.deptRankDetail(this.data);
    this.option = mergeGradientStackedAreaChartOption({ data: this.pieData, });
    const chart = echarts.init(this.$refs.department);
    chart.setOption(this.option);
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.department-chart {
  height: 251px;
  width:708px;
}
</style>
