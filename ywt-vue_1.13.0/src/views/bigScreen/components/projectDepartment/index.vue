<!--
  科室排名
-->

<template>
  <Wrapper style="height:100%" title="科室排名">
    <div ref="department" style="height:100%" class="echartStackLineWrapper" />
  </Wrapper>
</template>

<script>
import * as echarts from 'echarts';

import Option from './config/index';
import Wrapper from '../wrapper/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';
export default {
  components: {
    Wrapper,
  },
  data() {
    return {

    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    initEchart(data) {
      const ref = this.$refs['department'];
      setTimeout(function () {
        const E = echarts.init(ref);
        Option.yAxis[0].data = data.names;
        Option.yAxis[1].data = data.names;
        Option.yAxis[2].data = data.series[3].data;
        Option.series[0].data = data.series[0].data;
        Option.series[0].name = data.series[0].name;
        Option.series[1].name = data.series[1].name;
        Option.series[1].data = data.series[1].data;
        Option.series[2].name = data.series[2].name;
        Option.series[2].data = data.series[2].data;
        E.setOption(Option);
      }, 300);
    },
    async initData() {
      const rs = await BigScreenApi.ProjectDeparment();
      this.initEchart(rs);
    },
  },
};
</script>

<style>

</style>
