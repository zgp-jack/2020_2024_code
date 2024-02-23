/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-28 09:58:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:56:40
 * @Description: 大屏工具
 */
import { color as colorUtil, } from 'echarts';
const colors = ['#1890FF', '#17E69A', '#DD3A43', '#FA541C', '#FA8C16', '#FADB14', '#52C41A', '#48D3A0', '#3FC1E7', '#1890FF', '#985EE9', '#EB2F96'];
/**
 * 合并饼图配置
 * @param {Object} customOption 自定义饼图配置
 * @param {Array} data 数据
 */
export const mergePieOption = ({
  customOption = {},
  data = [],
} = {}) => {
  const defaultOption = {
    // 背景色，默认无背景
    backgroundColor: 'transparent',
    // 图例组件
    legend: {
      show: false,
    },
    // 提示框组件
    tooltip: {
      formatter: (params) => {
        const {
          marker,
          name,
          percent,
          value,
        } = params;
        return `${marker}<span style="color:#c9e5ff">${name}</span><br/>
        <span style="color:#96cdff;padding-right:10px">报修数</span>  ${value}<br/>
        <span style="color:#96cdff;padding-right:10px">报修占比</span>     ${percent}%
        `;
      },
      borderColor: 'transparent',
      backgroundColor: '#01070da6',
      confine: true,
      rich: {
        time: {
          fontSize: 12,
          color: '#96cdff',
        },
      },
      textStyle: {
        color: '#fff',
      },
    },
    series: [{
      type: 'pie',
      startAngle: data?.length > 1 ? 90 : 125,

      data: data,
      labelLine: {
        length: 20,
        length2: 40,
        smooth: 0,
        lineStyle: {
        },
      },
      radius: '65%',
      label: {
        alignTo: 'edge',
        formatter: `{b}\n{time|{c}件({d}%)}`,
        fontSize: 14,
        lineHeight: 20,
        minMargin: 5,
        edgeDistance: 10,
        color: '#c9e5ff',
        rich: {
          time: {
            fontSize: 12,
            color: '#96cdff',
          },
        },
      },

      itemStyle: {
        color: function (params) {
          const index = params.dataIndex % colors.length;
          const color = colors[index];
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0.4,
            colorStops: [{
              offset: 0,
              color: colorUtil.modifyAlpha(color, 0.3), // 0% 处的颜色
            }, {
              offset: 1,
              color: colorUtil.modifyAlpha(color, 0.8), // 100% 处的颜色
            }],
            global: false, // 缺省为 false
          };
        },

      },
    }],
  };
  return defaultOption;
};
/**
 * 合并渐变堆叠面积图配置
 * @param {*} param0
 */
export const mergeGradientStackedAreaChartOption = ({
  customOption = {},
  data = [],
} = {}) => {
  const defaultOption = {
    color: colors,
    // 图例组件
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
      formatter: function (name) {
        return '' + name;
      },
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.names,
      axisLabel: {
        color: '#C9E5FF',
      },
      axisTick: {
        // 是否显示坐标轴刻度。
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
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(0, 0, 0, 0.80)',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(0, 0, 0, 0.80)',
        },
      },
      borderColor: 'transparent',
      textStyle: {
        color: '#96CDFF',
      },
    },
    backgroundColor: 'transparent',
    series: data.series.map((item, index) => {
      const color = colors[index];
      return {
        type: 'line',
        name: item.name,
        data: item.data,
        symbol: 'circle',
        symbolSize: 5,
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: colorUtil.modifyAlpha(color, 1), // 0% 处的颜色',
            }, {
              offset: 1,
              color: colorUtil.modifyAlpha(color, 0.1), // 100% 处的颜色
            }],
          },
        },
        emphasis: {
          focus: 'series',
        },

      };
    }),
  };
  return defaultOption;
};

