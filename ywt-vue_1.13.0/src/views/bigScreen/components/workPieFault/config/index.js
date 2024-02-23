import EchartsColor from '@/views/bigScreen/style/echartsColor';
// 临时使用
const option = {
  backgroundColor: 'transparent',
  legend: {
    show: false,
    // orient: 'horizontal',
    // right: 0,
    // data: ['硬件类', '软件类'],
  },

  tooltip: {
    position: function (point, params, dom, rect, size) {
      return [10, 10];
      // return point;
    },
    formatter: `{b}<br/>报修数    {c}<br/>报修占比     {d}%`,
  },
  series: [{
    type: 'pie',
    data: [],
    hoverAnimation: true,
    // 高亮扇区的偏移距离
    hoverOffset: 5,
    roseType: false,
    // 是否在数据和为0（一般情况下所有数据为0） 的时候不显示扇区。
    stillShowZeroSum: true,
    // 起始角度，支持范围[0, 360]。
    startAngle: 135,
    selectedMode: false,
    // 视觉引导线
    labelLine: {
      length: 40,
      length2: 40,
      smooth: 0,
    },
    itemStyle: {
      normal: {
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        // color: function (params) {
        //   return colors[params.dataIndex];
        // },
        color: function (params) {
          const index = params.dataIndex;
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0.4,
            colorStops: [{
              offset: 0,
              color: EchartsColor.colorsLinearGradient[index].dark, // 0% 处的颜色
            }, {
              offset: 1,
              color: EchartsColor.colorsLinearGradient[index].bright, // 100% 处的颜色
            }],
            global: false, // 缺省为 false
          };
        },
        label: {
          formatter: `{b}\n{c}件({d}%)`,
          color: '#C9E5FF',
        },
      },
    },
  }],

};

export default option;
