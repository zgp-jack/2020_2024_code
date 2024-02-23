import { gridStyle, } from '../../../common/echarts.style';
const _gridStyle = gridStyle;
_gridStyle.left = '15%';
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
  },
  legend: {
    textStyle: {
      color: '#C9E5FF',
    },
  },
  grid: _gridStyle,
  xAxis: {
    show: false,
  },
  yAxis: [
    {
      type: 'category',
      position: 'left',
      offset: 30,
      axisLabel: {
        align: 'left',
        color: '#C9E5FF',
        formatter: (value, index) => {
          if (value.length > 2) {
            const text = `${value.slice(0, 2)}...`;
            return text;
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
      inverse: true,

      splitLine: { // 网格线
        show: false,
      },
      data: [],
    },
    {

      position: 'left',
      type: 'category',
      offset: 40,
      axisLabel: {
        align: 'right',
        rich: {
          a: {
            color: '#E64645',
          },
          b: {
            color: '#60E7FC',
          },
          c: {
            color: '#7DC1FF',
          },
          d: {
            color: '#C9E5FF',
          },
        },
        formatter: (value, index) => {
          let rich = '';
          if (index === 0) {
            rich = 'a';
          } else if (index > 0 && index < 3) {
            rich = 'b';
          } else if (index > 3 && index < 5) {
            rich = 'c';
          } else {
            rich = 'd';
          }
          if (value.length > 4) {
            return `{${rich}|No.${index + 1}}`;
          }
          return `{${rich}|No.${index + 1}}`;
        },

      },
      // 坐标刻度
      axisTick: {
        show: false,
        alignWithLabel: false,
      },
      axisLine: {
        show: false,
      },

      splitLine: { // 网格线
        show: false,
      },
      inverse: true,

      // 总数
      data: [],

    },
    {
      type: 'category',
      axisLabel: {
        color: '#C9E5FF',
        formatter: (value, index) => {
          return value + '个';
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
      // 是否是反向坐标轴。
      inverse: true,
      // 总数
      data: [],
      min: 0,

    }],
  series: [
    {
      name: '',
      type: 'bar',
      stack: 'total',
      barWidth: 10,
      label: {
        show: true,
        color: '#fff',
        distance: 0,
        padding: 0,
        borderRadius: 0,
        formatter: (value, index) => {
          if (value.data) {
            return value.data;
          }
          return '';
        },
      },
      tooltip: {
        formatter: '{a0}: {c0}<br />{b1}: {c1}',
      },
      itemStyle: {
        color: 'rgba(96, 231, 252, 0.2)',
        borderColor: 'rgba(96, 231, 252, 0.8)',
        borderWidth: 1,
      },
      z: 10,
      data: [],
    },
    {
      name: '',
      type: 'bar',
      stack: 'total',
      barWidth: 10,

      itemStyle: {
        color: 'rgba(24,144,255,0.2)',
        borderColor: 'rgba(24,144,255,0.8)',
        borderWidth: 1,
      },
      label: {
        show: true,
        color: '#fff',
        distance: 0,
        padding: 0,
        borderRadius: 0,
        formatter: (value, index) => {
          if (value.data) {
            return value.data;
          }
          return '';
        },
      },
      z: 5,
      data: [],

    },
    {
      name: '',
      type: 'bar',
      stack: 'total',
      barWidth: 10,
      itemStyle: {
        color: 'rgba(23,230,154,0.2)',
        borderColor: 'rgba(23,230,154,0.8)',
        borderWidth: 1,
      },
      label: {
        show: true,
        color: '#fff',
        distance: 0,
        padding: 0,
        borderRadius: 0,
        formatter: (value, index) => {
          if (value.data) {
            return value.data;
          }
          return '';
        },
      },
      z: 5,
      data: [],

    }

  ],
};

export default option;
