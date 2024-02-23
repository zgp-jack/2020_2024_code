<template>
  <Wrapper :title="'院区及科室报修'">
    <div ref="pieRepair" style="height:100%" />
  </Wrapper>
</template>

<script>
import * as echarts from 'echarts';
import Wrapper from '../wrapper/index.vue';
import Option from './config/index';
import BigScreenApi from '@/apis/bigScreen/index';

export default {
  components: {
    Wrapper,
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    async initData() {
      const rs = await BigScreenApi.WorkDeparmentRepair();
      this.initChart(rs);
    },
    initChart(data) {
      const ref = this.$refs['pieRepair'];
      setTimeout(function () {
        const E = echarts.init(ref);
        Option.series[0].data = data;
        E.setOption(Option);
      }, 300);
    },
  },

};
</script>

<style>

</style>
