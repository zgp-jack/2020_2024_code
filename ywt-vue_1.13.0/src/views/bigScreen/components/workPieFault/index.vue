<template>
  <Wrapper :title="'故障类别排名'">
    <div ref="pieFault" style="height:100%" />
  </Wrapper>
</template>

<script>
import Wrapper from '../wrapper/index.vue';
import Option from './config/index';
import * as echarts from 'echarts';
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
    initChart(data) {
      const ref = this.$refs['pieFault'];
      setTimeout(function () {
        const E = echarts.init(ref);
        Option.series[0].data = data;
        E.setOption(Option);
      }, 300);
    },
    async initData() {
      const rs = await BigScreenApi.WorkFaultClassRank();
      this.initChart(rs);
    },
  },

};
</script>

<style>

</style>
