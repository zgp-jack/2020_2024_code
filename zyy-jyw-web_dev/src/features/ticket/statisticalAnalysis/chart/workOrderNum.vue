/**
* @file workOrderNum.vue
* @author huang
* @date 2023/8/30
* @description  工单数量
* @projectName
* @email newflyhuang@gmail.com
*/
<template>
  <chart-panel title="工单数量">
    <template #subTitle>
      <el-radio-group
        v-model="type"
        size="small"
        @change="changeType"
      >
        <el-radio-button
          label="dept"
        >
          按科室
        </el-radio-button>
        <el-radio-button
          label="engineer"
        >
          按工程师
        </el-radio-button>

      </el-radio-group>
    </template>
    <template #left>
      <el-radio-group
        v-model="sort"
        size="small"
      >
        <el-radio-button
          label="first"
        >
          前25名
        </el-radio-button>
        <el-radio-button
          label="last"
        >
          后25名
        </el-radio-button>
      </el-radio-group>
      <svg-icon
        :icon-class="iconClass"
        style="margin: 0 16px"
        @click="onClickIcon"
      />

    </template>
    <div
      ref="departmentChart"
      :style="{height: '290px'}"
      class="echart"
      @download="onDownload"
    />

  </chart-panel>
</template>

<script>
import * as echarts from 'echarts';

import ChartPanel from '../panel/index.vue';
import StatisticalAnalysisApi from '../api';
import { downloadFile, } from '@/common/utils/download';
import { map, slice, } from 'lodash-es';

export default {
  components: {
    ChartPanel,
  },
  data() {
    return {
      type: 'dept',
      sort: 'first',
      // foldingLine || bar
      iconClass: 'foldingLine',
      chart: null,
      data: [],
      xAxis: [],
      deptId: null,
      startTime: null,
      endTime: null,
      // 从后台获取的原始数据，别问我为什么要定义这个变量，问我就是后台很垃圾
      unsortData: null,
      queryParams: {
        deptId: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  computed: {
    first25() {
      const val = slice(this.data, 0, 25);
      return {
        deptNames: map(val, 'nameTitle'),
        orderAmount: map(val, 'realityNum'),
      };
    },
    last25() {
      const val = slice(this.data, this.data.length - 25);
      return {
        deptNames: map(val, 'nameTitle'),
        orderAmount: map(val, 'realityNum'),
      };
    },
    chartData() {
      return this.sort === 'first' ? this.first25 : this.last25;
    },

  },
  watch: {
    chartData: {
      handler() {
        this.drawBar();
      },
      deep: true,
    },
  },
  async mounted() {
    this.chart = echarts.init(this.$refs.departmentChart);
    this.fetchData({}, 'dept');
  },
  methods: {
    //
    changeType(val) {
      this.fetchData({}, val);
    },
    async onDownload() {
      const rs = await StatisticalAnalysisApi.exportDeptRepair();
      downloadFile(rs, '工单来源分析.xlsx');
    },
    onClickIcon() {
      this.iconClass = this.iconClass === 'bar' ? 'foldingLine' : 'bar';
      this.drawChart();
    },
    // 绘制柱状图
    async drawBar() {
      const option = this.genOption('bar');
      this.chart.setOption(option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    // 绘制图表
    drawChart() {
      if (this.iconClass === 'bar') {
        this.drawBar(this.data);
      } else {
        this.drawSoothLine(this.data);
      }
    },
    async fetchData(query, type) {
      this.queryParams = query;
      try {
        if (type === 'dept') {
          const { rows, } = await StatisticalAnalysisApi.getDeptRepair(query);

          this.data = rows;
        } else {
          const { rows, } = await StatisticalAnalysisApi.getEngineerRank(query);

          this.data = rows;
        }
        this.drawChart();
      } catch (error) {
        console.log(error);
      }
    },

    // 查询条件变更后操作
    async changeQueryCondition(query) {
      this.fetchData(query, this.type);
    },

    genOption(type) {
      const option = {
        title: {
          show: Boolean(this.chartData.length),
          text: '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#879BBA',
            fontSize: 16,
            fontWeight: 400,
          },
        },
        xAxis: {
          type: 'category',
          data: this.chartData.deptNames,

          axisLabel: {
            interval: 0,
            rotate: 40,
            textStyle: {
              color: 'rgba(0,0,0,0.45)',
            },
          },
        },
        yAxis: {
          type: 'value',
          name: '(单)',
          nameTextStyle: {
            padding: [
              0,
              30,
              0,
              -10,
            ], // 四个数字分别为上右下左与原位置距离
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(0,0,0,0.45)',
            },
          },
          axisLine: { show: false, },
          axisTick: { show: false, },
        },
        tooltip: {
          trigger: 'item',
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {
        //       name: `科室报修情况(工单数量)${this.sort === 'first' ? '前' : '后'}25名`,
        //     },
        //
        //   },
        // },
        grid: {
          show: false,
          x: 40,
          x2: 40,
          y: 12,
          bottom: 110,

        },
        series: [{
          data: this.chartData.orderAmount,
          type: type,
          smooth: true,
          barWidth: 30,
          barMaxWidth: 30,
          symbol: 'circle', // 折点设定为实心点
          symbolSize: 5, // 设定实心点的大小
          itemStyle: {
            normal: {
              color: '#5B8FF9',
              lineStyle: {
                color: '#5B8FF9',
              },
            },
          },
        },
        ],
      };
      return option;
    },
    // 绘制平滑折线图
    async drawSoothLine(data) {
      const option = this.genOption('line');
      this.chart.setOption(option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
