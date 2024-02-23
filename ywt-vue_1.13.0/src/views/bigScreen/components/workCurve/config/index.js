const option = {
  type: 'line',
  backgroundColor: 'transparent',

  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      color: '#C9E5FF',
    },
    axisTick: {
      // 是否显示坐标轴刻度。
      show: false,
    },
    axisLine: {
      show: false,
    },
  },

  yAxis: {
    type: 'value',
    // 坐标轴轴线相关设置。
    axisLine: {
      // 是否显示坐标轴轴线。
      show: false,
    },
    // 坐标轴刻度相关设置。
    axisTick: {
      // 是否显示坐标轴刻度。
      show: false,
    },
    // 坐标轴刻度标签的相关设置。
    axisLabel: {
      color: '#C9E5FF',
      width: '20',
      // formatter: (value) => {
      //   console.log(value, 'value');
      //   if (value.length > 4) {
      //     return `${value.slice(0, 4)}...`;
      //   }
      //   return value;
      // },
      //   textStyle: {
      //     color: function (value, index) {
      //         return value >= 0 ? 'green' : 'red';
      //     }
      // }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
  },

  tooltip: {
    // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后 一定时间 后隐藏，设置为 true 可以保证一直显示提示框内容。
    alwaysShowContent: false,
    show: true,
    // 是否将 tooltip 框限制在图表的区域内。
    confine: true,
    formatter: `
    {a}
    <br/>
    {b}
    {c}%`,

  },
  // 图例
  legend: {
    icon: 'rect',
    left: 'center',
    type: 'plain',
    itemGap: 20,
    itemHeight: 2,
    itemWidth: 18,
    textStyle: {
      color: '#C9E5FF',
      fontSize: 14,
    },
    // formatter: `{name}{a}/{d}%`,
    formatter: function (name) {
      console.log(name);
      return '' + name;
    },
  },
  series: [{
    smooth: true,
    name: '',
    data: [],
    type: 'line',
    color: '#37BF50',
    symbol: 'circle',
    symbolSize: 5,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(55,191,80,0.60)',
        }, {
          offset: 1,
          color: 'rgba(55,191,80,0.00)',
        }],
      },
    },
  }, {
    name: '',
    smooth: true,
    data: [],
    type: 'line',
    color: '#1890FF',
    symbol: 'circle',
    symbolSize: 5,
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(24,144,255,0.60)',
        }, {
          offset: 1,
          color: 'rgba(24,144,255,0.00)',
        }],
      },
    },
  }, {
    name: '',
    smooth: true,
    symbol: 'circle',
    symbolSize: 5,

    data: [],
    type: 'line',
    color: '#BA8C37',
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(191,139,55,0.60)',
        }, {
          offset: 1,
          color: 'rgba(191,139,55,0.00)',
        }],
      },
    },
  }],
};

export default option;
