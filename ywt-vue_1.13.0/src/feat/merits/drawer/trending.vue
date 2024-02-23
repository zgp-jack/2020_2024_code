<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 16:12:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:57:48
 * @Description:趋势抽屉
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :elment-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">趋势查看 <span class="double-margin-left">{{ year }}年</span></div>
    </div>
    <div class="body">
      主观趋势图
      <div ref="subjective" style="height:49%" />
      客观趋势图
      <div ref="objective" style="height:49%" />
      <div />
    </div>
  </div>
</template>

<script>
import MeritsApi from '../api';
import FormDialog from '@/minxins/common/formDialog';
import moment from 'moment';
import * as echarts from 'echarts';
export default {
  mixins: [FormDialog],
  props: {
    year: {
      type: String,
      default: moment().year().toString(),
    },
    engineerId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      option: {
        backgroundColor: '#fff',
        color: ['#1890FF', '#17E69A', '#DD3A43', '#FA541C', '#FA8C16', '#FADB14', '#52C41A', '#48D3A0', '#3FC1E7', '#1890FF', '#985EE9', '#EB2F96'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        grid: {
          left: '25',
          right: '25',
          bottom: '24',
          top: '75',
          containLabel: true,
        },
        legend: {
          data: [],
          orient: 'horizontal',
          icon: 'path://M710.39682178 790.95627705c-128.17802812 0-175.14877237-141.31204805-216.94972061-265.90671035C451.65149844 400.4527669 418.21458857 313.2781956 352.13612188 313.2781956c-111.85511133 0-159.2256709 256.3517795-159.22567003 358.25963028-0.00427588 21.9823251-17.82275625 39.80080547-39.80508222 39.80080547-21.98553222 0-39.8040126-17.8184795-39.80828848-39.80080547 0-86.77796396 42.59416289-437.8730001 238.83904073-437.8730001 128.17802812 0 175.14877237 141.3109793 216.94544472 265.90670948s75.23678847 211.77137197 141.31525518 211.77137196 111.45850401-123.79823964 119.41738154-167.18561806c4.28892099-21.98553222 25.58600333-36.33396328 47.57153554-32.04611104 21.9823251 4.28785224 36.32968653 25.58493369 32.04183516 47.56725967-2.78587442 9.55492998-48.56145117 231.27783926-199.03075225 231.27783926z m-1e-8 0',
          show: true,
          left: 20,
          top: 25,
        },
        xAxis: {
          type: 'category',
          data: [],
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999',
            textStyle: {
              fontSize: 12,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F3F4F4',
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
        ],
      },
      subjectiveChart: null,
      objectiveChart: null,
    };
  },
  created() {

  },
  mounted() {
    this.subjectiveChart = echarts.init(this.$refs.subjective);
    this.objectiveChart = echarts.init(this.$refs.objective);
  },
  methods: {
    async fetchDetail() {
      try {
        this.loading = true;
        const data = await MeritsApi.queryTrending({
          year: this.year,
          engineerId: this.engineerId,
        });
        this.data = data;
        this.loading = false;
        this.initChart(this.subjectiveChart, data.subject);
        this.initChart(this.objectiveChart, data.object);
      } catch (error) {
        this.loadingText = '数据加载失败';
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    initChart(chart, data) {
      const option = Object.assign({}, this.option);
      option.legend.data = data.legend;
      option.series = data.series.map(item => {
        return {
          name: item.name,
          type: 'line',
          smooth: true,
          data: item.data,
        };
      });
      option.xAxis.data = data.category;
      chart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
