<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-22 09:59:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-02 15:16:58
 * @Description:工程师接单数面板
-->
<template>
  <Card
    v-loading="loading"
    title="工程师接单数"
    element-loading-background="#01070da6"
  >
    <div ref="engineer" style="height:100%" />
  </Card>
</template>

<script>
import Card from '../../component/card';
import TicketBigScreenApi from '../api';
import * as echarts from 'echarts';
import { keyBy, } from 'lodash';
const gradientColorGreen = new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: 'rgba(23,230,154,0.40)',
},
{
  offset: 1,
  color: 'rgba(23,230,154,0.05)',
}
]);
const gradientColotBlue = new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: 'rgba(24,144,255,0.40)',
},

{
  offset: 1,
  color: 'rgba(24,144,255,0.05)',
}
]);
const gridStyle = {
  left: '10%',
  right: '10%',
  bottom: '0%',
  top: '6%',
  containLabel: false,
  show: false,
};
export default {
  components: {
    Card,
  },
  data() {
    return {
      option: {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: (params) => {
            return `<span style="color:#c9e5ff">${params[0].name}</span><br/>
              ${params[0].marker}<span style="color:#96cdff;padding-right:10px">${params[0].seriesName}</span>  ${params[0].value}<br/>
              ${params[1].marker}<span style="color:#96cdff;padding-right:10px">${params[1].seriesName}</span>     ${params[1].value}
            `;
          },
          backgroundColor: '#01070da6',
          borderColor: 'transparent',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'transparent',
            },
          },
          textStyle: {
            color: '#fff',
          },
        },
        legend: {
          right: 'center',
          selectedMode: false,
          textStyle: {
            color: '#C9E5FF',
          },
        },
        grid: gridStyle,
        xAxis: {
          show: false,
          type: 'value',
          axisLine: {
            show: false,
          },

        },
        yAxis: [{
          type: 'category',
          axisLabel: {
            color: '#C9E5FF',
            formatter: (value) => {
              if (value.length > 5) {
                return `${value.slice(0, 4)}...`;
              }
              return value;
            },
          },
          // 坐标刻度
          axisTick: {
            show: false,
            alignWithLabel: false,
            length: 5,
          },
          axisLine: {
            show: false,
          },
          splitLine: { // 网格线
            show: false,
          },
          // inverse: true, // 排序
          data: [],
        }, {
          type: 'category',
          axisLabel: {
            color: '#C9E5FF',
            fontSize: 14,
            fontWeight: 'bold',
          },
          // 坐标刻度
          axisTick: {
            show: false,
            alignWithLabel: false,
            length: 5,
          },
          axisLine: {
            show: false,
          },
          splitLine: { // 网格线
            show: false,
          },
          // inverse: true, // 排序
          // 总数
          data: [],
          min: 0,
        }],
        series: [
          {
            name: '已完成',
            type: 'bar',
            stack: '总量',
            barWidth: 8,
            label: {
              show: true,
              formatter: '{a|}',
              color: '#fff',
              position: 'right',
              distance: 0,
              backgroundColor: '#60FFFF',
              padding: 0,
              borderRadius: 0,
              rich: {
                a: {
                  width: 2,
                  height: 8,
                  borderRadius: 0,
                  // lineHeight: 6,
                  backgroundColor: '#17E69A',
                },
              },
            },
            tooltip: {
              formatter: '{a0}: {c0}<br />{b1}: {c1}',
            },
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 0, 0],
                color: gradientColorGreen,
              },
            },
            z: 10,
            data: [],
          },
          {
            name: '处理中',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: gradientColotBlue,
                shadowBlur: [0, 0, 0, 10],
                // shadowColor: '#ebe806',
                barBorderRadius: [0],
                // shadowOffsetX: -20,
              },
            },
            label: {
              show: true,
              formatter: '{a|}',
              color: '#fff',
              position: 'right',
              distance: 0,
              backgroundColor: '#60FFFF',
              padding: 0,
              borderRadius: 0,
              rich: {
                a: {
                  width: 2,
                  height: 8,
                  borderRadius: 0,
                  // lineHeight: 6,
                  backgroundColor: '#1890FF',
                },
              },
            },
            z: 5,
            data: [],
          }

        ],
      },
      data: null,
      loading: false,
    };
  },
  async created() {

  },
  async mounted() {
    this.loading = true;
    this.data = await TicketBigScreenApi.engineer({ dateType: 2, });
    const chart = echarts.init(this.$refs.engineer);
    const MapData = keyBy(this.data.series, 'name');
    this.option.yAxis[0].data = this.data.names;
    this.option.yAxis[1].data = MapData['合计'].data;
    this.option.series[0].data = MapData['已完成'].data;
    this.option.series[1].data = MapData['处理中'].data;
    chart.setOption(this.option);
    this.loading = false;
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
