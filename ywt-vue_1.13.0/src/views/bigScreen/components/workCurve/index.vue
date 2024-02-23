<template>
  <Wrapper :title="'报修类型'">
    <div ref="curve" style="height:100%" />
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
    const self = this;
    this.$nextTick(() => {
      self.initData();
    });
  },
  methods: {
    async initData() {
      const rs = await BigScreenApi.WorkOrderRepairClass();
      this.initEchart(rs);
    },
    initEchart(data) {
      // TODO 需调整 tooltip
      const ref = this.$refs['curve'];
      setTimeout(function () {
        const E = echarts.init(ref);
        Option.xAxis.data = data.names;
        Option.series[0].name = data.series[0].name;
        Option.series[0].data = data.series[0].data;
        Option.series[1].name = data.series[1].name;
        Option.series[1].data = data.series[1].data;
        Option.series[2].name = data.series[2].name;
        Option.series[2].data = data.series[2].data;
        E.setOption(Option);
      }, 300);
    },
  },

};
</script>

<style>

</style>
