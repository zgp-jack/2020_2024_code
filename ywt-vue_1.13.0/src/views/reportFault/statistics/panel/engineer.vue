<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-26 10:49:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-16 15:59:46
 * @Description:工程师排名(工单数量)
-->
<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <span class="label">工程师排名(工单数量)</span>
        <el-radio-group v-model="sort" size="mini" @change="handleSortChange">
          <el-radio-button label="first">前25名</el-radio-button>
          <el-radio-button label="last">后25名</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="12" class="right">
        <i :class="typeClass" @click="handleChangeType" />

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div id="engineer-echart" class="echart" :style="{float:'left',width: '100%', height: '260px'}" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import StatisticsApi from '@/apis/reportFault/statistics';
export default {
  data() {
    return {
      sort: 'first',
      typeClass: 'icon-chart-bar',
      chart: null,
      data: null,
      deptId: null,
      startTime: null,
      endTime: null,
      // 从后台获取的原始数据，别问我为什么要定义这个变量，问我就是后台很垃圾
      unsortData: null,
    };
  },
  async mounted() {
    const chartDom = document.getElementById('engineer-echart');
    this.chart = echarts.init(chartDom);
  },
  methods: {
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.deptId = condition.deptId;
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.fetchData();
    },
    // 排名切换
    async handleSortChange() {
      if (this.sort === 'first') {
        this.data = this.getFirst25();
      } else {
        this.data = this.getLast25();
      }
      this.drawChart();
    },
    // 获取前25名数据
    getFirst25() {
      // 是否有25条数据
      let has25 = true;
      const data = {};
      if (this.unsortData) {
        if (this.unsortData.users.length >= 25) {
          has25 = true;
        } else {
          has25 = false;
        }

        for (const key in this.unsortData) {
          const value = this.unsortData[key];
          if (has25) {
            data[key] = value.slice(0, 25);
          } else {
            data[key] = value;
          }
        }
      }
      return data;
    },
    // 获取后25名数据
    getLast25() {
      let has25 = true;
      const data = {};
      if (this.unsortData) {
        if (this.unsortData.users.length >= 25) {
          has25 = true;
        } else {
          has25 = false;
        }
        for (const key in this.unsortData) {
          let value = [...this.unsortData[key]];
          value = value.reverse();
          if (has25) {
            data[key] = value.slice(0, 25);
          } else {
            data[key] = value;
          }
        }
      }
      return data;
    },
    async fetchData() {
      try {
        this.unsortData = await StatisticsApi.engineer({ deptId: this.deptId, startTime: this.startTime, endTime: this.endTime, });
        this.handleSortChange();
      } catch (error) {
        console.log(error);
      }
    },
    // 绘制图表
    drawChart() {
      if (this.typeClass === 'icon-chart-bar') {
        this.drawBar(this.data);
      } else {
        this.drawSoothLine(this.data);
      }
    },
    async handleChangeType() {
      this.typeClass = this.typeClass === 'icon-chart-bar' ? 'icon-chart-line' : 'icon-chart-bar';
      this.drawChart();
    },
    // 绘制柱状图
    async drawBar(data) {
      const option = this.genOption('bar');
      this.chart.setOption(option);
      window.addEventListener('resize', () => {
        this.chart.resize();
      });
    },
    genOption(type) {
      const show = this.data?.users?.length === 0 && this.data?.orderAmount?.length === 0;
      const option = {
        title: {
          show: show,
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
          data: this.data.users,

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
            padding: [0, 30, 0, -10], // 四个数字分别为上右下左与原位置距离
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
        toolbox: {
          feature: {
            saveAsImage: {
              name: `工程师排名(工单数量)${this.sort === 'first' ? '前' : '后'}25名`,

            },
          },
        },
        grid: {
          show: false,
          x: 40,
          x2: 40,
          y: 12,
          bottom: 70,

        },
        series: [{
          data: this.data.orderAmount,
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
        }],
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

<style lang="scss" scoped>
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
.right {
  text-align: right;
}
.icon-chart-line,.icon-chart-bar {
  font-size: 16px !important;
  color: #409EFF
}
.el-icon-download {
  color: #409EFF;
  cursor: pointer;
  margin-left: 12px;
}
</style>
