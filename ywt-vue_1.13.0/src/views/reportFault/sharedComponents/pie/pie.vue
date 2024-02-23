<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 17:29:51
 * @Description:饼图
-->
<template>
  <div><div ref="pie1" style="height: 250px" /></div>
</template>

<script>
import * as echarts from 'echarts';
import { cloneDeep, } from 'lodash';
export default {
  props: {
    option: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      pieOption: {
        title: {
          text: '接听率',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        grid: {
          x: 30,
          y: 20,
          x2: 30,
          y2: 35,
        },
        series: [
          {
            type: 'pie',
            radius: [0, 90],
            top: 20,
            center: ['50%', '50%'],
            // roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              position: 'inner',
            },
            color: ['#FD8F18', '#1213E9', '#2D8FFF', '#00CF85', '#AF18FD'],
            data: [],
          }
        ],
      },
    };
  },
  watch: {
    option(newVal) {
      this.repaint(newVal);
    },
  },
  created() {
    setTimeout(() => {
      this.repaint(this.option);
    }, 2000);
  },
  methods: {
    chart() {
      let data = [];
      data = cloneDeep(this.pieOption);
      data.series[0].data = [];
      //   echarts.init(this.$refs.pie).setOption(data, true);
    },
    repaint(option) {
      let data = [];
      data = cloneDeep(this.pieOption);
      data.series[0].data = option.data;
      data.title.text = option.title;
      echarts.init(this.$refs.pie1).setOption(data, true);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
