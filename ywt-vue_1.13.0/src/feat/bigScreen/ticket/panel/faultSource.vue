<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 17:37:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-30 14:43:05
 * @Description:报修类型(故障来源)面板
-->
<template>
  <Card
    v-loading="loading"
    title="报修类型"
    element-loading-background="#01070da6"
  >
    <div ref="faultSource" style="height:100%" />
  </Card>
</template>

<script>
import Card from '../../component/card';
import TicketBigScreenApi from '../api';
import {
  mergeGradientStackedAreaChartOption,
} from '../../utils';
import * as echarts from 'echarts';
export default {
  components: {
    Card,
  },
  data() {
    return {
      option: {},
      data: null,
      loading: false,
    };
  },
  async created() {

  },
  async mounted() {
    this.loading = true;
    this.data = await TicketBigScreenApi.faultSource({ dateType: 2, });
    const chart = echarts.init(this.$refs.faultSource);
    this.option = mergeGradientStackedAreaChartOption({ data: this.data, });
    chart.setOption(this.option);
    this.loading = false;
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
