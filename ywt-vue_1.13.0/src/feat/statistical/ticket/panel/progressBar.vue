<template>
  <div ref="ProgressBar" class="charts-dom" />
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'ProgressBar',
  props: {
    progressData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    maximumData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    progressOption: {
      type: Object,
      default: () => {
        return {};
      },
    },
    unit: {
      type: String,
      default: () => {
        return '';
      },
    },
    gridOption: {
      type: Object,
      default: () => {
        return {
          left: 0,
          top: 12,
          right: 80,
          bottom: 12,
          containLabel: true,
        };
      },
    },
  },
  data() {
    return {
      option: null,
      myChart: null,
    };
  },
  watch: {
    progressData: {
      handler(val) {
        this.renderEchart();
      },
      deep: true,
    },
  },
  mounted() {
    this.renderEchart();
  },
  methods: {
    // 初始化Echart对象
    initEchart() {
      return echarts.init(this.$refs.ProgressBar);
    },
    // 初始化Echart配置
    initOption() {
      const { colorList, innerTitle, } = { ...this.progressOption, };
      return {
        grid: this.gridOption,
        xAxis: {
          type: 'value', // 坐标轴类型,分别有：
          splitLine: { show: false, }, // 坐标轴在 grid 区域中的分隔线
          axisLabel: { show: false, }, // 坐标轴刻度标签
          axisTick: { show: false, }, // 坐标轴刻度
          axisLine: { show: false, }, // 坐标轴轴线
          max: this.maximumData[0],
        },
        yAxis: {
          type: 'category',
          splitLine: { show: false, }, // 坐标轴在 grid 区域中的分隔线
          axisLabel: { show: false, }, // 坐标轴刻度标签
          axisTick: { show: false, }, // 坐标轴刻度
          axisLine: { show: false, }, // 坐标轴轴线
        },
        series: [
          {
            name: '人数', // 名称
            type: 'bar', // 柱状、条形图
            barWidth: 40, // 柱条的宽度,默认自适应
            itemStyle: {
              normal: {
                // 个性化设置每个柱子颜色不一样
                color: (params) => {
                  return colorList[params.dataIndex];
                },
              },
            },
            data: this.progressData, // 中数据内容数组
            label: {
              // 图形上的文本标签
              show: true,
              position: 'center', // 标签的位置
              offset: [10, 15], // 标签文字的偏移
              color: '#1A2133', // 标签字体颜色
              fontSize: 18, // 标签字号
              formatter: (params) => {
                return innerTitle[params.dataIndex];
              },
            },
            zlevel: 2, // 柱状图所有图形的 zlevel 值,
          },
          {
            type: 'bar',
            barGap: '-100%',
            barWidth: 40,
            data: this.maximumData,
            label: {
              // 图形上的文本标签
              show: true,
              position: 'right', // 标签的位置
              offset: [30, 0], // 标签文字的偏移
              // 标签字号
              formatter: (params) => {
                return `{${params.dataIndex}| ${this.progressData[params.dataIndex]}${this.unit}}`;
              },
              rich: this.lableRich(colorList),
            },
            color: '#fff',
            zlevel: 1, // 柱状图所有图形的 zlevel 值,
          }
        ],
      };
    },
    // 动态配置不同lable样式
    lableRich(colorList) {
      const richList = {};
      colorList.forEach((color, idx) => {
        richList[idx] = {
          color,
          fontSize: 18,
        };
      });
      return richList;
    },
    // 导出图片
    exportImg(fileName) {
      const picInfo = this.myChart.getDataURL({
        type: 'jpg',
        // 导出的图片分辨率比例。
        pixelRatio: 2,
        // 导出的图片背景色
        backgroundColor: '#fff',
        // 无需渲染的组件的数组
        excludeComponents: '',
      });
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = picInfo;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    },
    // 销毁Echart
    destroyEchart() {
      if (this.myChart) {
        echarts.dispose(this.myChart);
        this.myChart = null;
        this.option = null;
      }
    },
    // 渲染Echart
    renderEchart() {
      this.destroyEchart();
      this.myChart = this.initEchart();
      this.option = this.initOption();
      this.myChart.setOption(this.option, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.charts-dom {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
