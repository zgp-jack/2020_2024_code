import * as echarts from 'echarts';
import { gridStyle, } from '../../../common/echarts.style';

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

const option = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      shadowStyle: {
        color: 'transparent',
      },
    },

    // formatter: (params, ticket, callback) => {
    //   console.log(params);
    //   return `{b}`;
    // },
  },
  legend: {
    right: 'center',
    textStyle: {
      color: '#C9E5FF',
    },
    // data: ['已完成', '处理中'],
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
        if (value.length > 4) {
          return `${value.slice(0, 3)}...`;
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
};

export default option;
