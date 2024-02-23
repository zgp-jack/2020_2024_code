<template>
  <Wrapper style="height:100%" :title="'工程师接单数'">
    <div ref="stackLine" style="height:100%" class="echartStackLineWrapper" />
  </Wrapper>
</template>

<script>
import Option from './config/index';
import Wrapper from '../wrapper/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';
import * as echarts from 'echarts';
import { keyBy, } from 'lodash';
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
    async initData() {
      const rs = await BigScreenApi.WorkEngineerOrderNum();
      this.initChart(rs);
    },
    initChart(data) {
      const ref = this.$refs['stackLine'];
      const MapData = keyBy(data.series, 'name');
      setTimeout(function () {
        const E = echarts.init(ref);
        Option.yAxis[0].data = data.names.splice(0, 7);
        Option.yAxis[1].data = MapData['合计'].data.splice(0, 7);
        Option.series[0].data = MapData['已完成'].data.splice(0, 7);
        Option.series[1].data = MapData['处理中'].data.splice(0, 7);
        console.log(Option, 'opt');
        E.setOption(Option);
      }, 300);
    },
  },
};
</script>

<style>

</style>
