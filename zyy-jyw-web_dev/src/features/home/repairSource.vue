<template>
  <div>
    <el-row class="home_card home_card_center">
      <el-col :span="5">
        <div class="home_card_header" style="padding-top: 20px;">
          <span>报修来源统计</span>
        </div>
        <div class="home_card_body">
          <div class="home_source_item">
            <span class="source_title">近7天报修总数</span>
            <div class="source_num"><span>{{ orderSourceTotal.week }}</span>个</div>
          </div>
          <div class="home_source_item">
            <span class="source_title">近30天报修总数</span>
            <div class="source_num"><span>{{ orderSourceTotal.month }}</span>个</div>
          </div>
          <div class="home_source_item">
            <span class="source_title">近1年报修总数</span>
            <div class="source_num"><span>{{ orderSourceTotal.year }}</span>个</div>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="home-tab-brief">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="近7天" name="first">
              <div id="echarts_1" style="width: 100%;height: 260px" />
            </el-tab-pane>
            <el-tab-pane label="近30天" name="second">
              <div id="echarts_2" style="width: 100%;height: 260px" />
            </el-tab-pane>
            <el-tab-pane label="近1年" name="third">
              <div id="echarts_3" style="width: 100%;height: 260px" />
            </el-tab-pane>
          </el-tabs>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { orderSourceTotal, getOrderSourceLine, } from '@/features/home/api';

export default {
  name: 'RepairSource',
  data() {
    return {
      activeName: 'first',
      currentTab: '0',
      orderSourceTotal: {
        week: 0,
        month: 0,
        year: 0,
      }, // 报修来源统计(总数)
      areaColor: [
        {
          color1: 'rgb(128, 255, 165)',
          color2: 'rgb(1, 191, 236)',
        },
        {
          color1: 'rgb(0, 221, 255)',
          color2: 'rgb(77, 119, 255)',
        },
        {
          color1: 'rgb(55, 162, 255)',
          color2: 'rgb(116, 21, 219)',
        },
        {
          color1: 'rgb(255, 0, 135)',
          color2: 'rgb(135, 0, 157)',
        },
        {
          color1: 'rgb(255, 191, 0)',
          color2: 'rgb(224, 62, 76)',
        },
        {
          color1: '#DA70D6',
          color2: '#8A2BE2',
        },
        {
          color1: '#FFA07A',
          color2: '#FFA500',
        },
      ],
    };
  },
  mounted: function () {
    this.initEcharts('echarts_1', 1);
    this.getOrderSourceTotal();
  },
  methods: {
    /* 报修来源统计(总数) */
    getOrderSourceTotal() {
      orderSourceTotal().then((res) => {
        if (res) {
          this.orderSourceTotal = res;
        }
      });
    },
    /* 报修来源切换 */
    handleClick(tab) {
      const index = tab.index;
      if (index === '0') {
        this.$nextTick(() => {
          this.initEcharts('echarts_1', 1);
        });
      }
      if (index === '1') {
        this.$nextTick(() => {
          this.initEcharts('echarts_2', 2);
        });
      }
      if (index === '2') {
        this.$nextTick(() => {
          this.initEcharts('echarts_3', 3);
        });
      }
    },
    getChartSeries(name, yData, color) {
      let color1 = 'rgb(128, 255, 165)';
      let color2 = 'rgb(1, 191, 236)';
      if (color) {
        color1 = color.color1;
        color2 = color.color1;
      }
      const seriesData = {
        name: name,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: color1,
            },
            {
              offset: 1,
              color: color2,
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: yData,
      };
      return seriesData;
    },
    initEcharts(chartDomId, type) {
      const param = {
        type: type,
      };
      const that = this;
      getOrderSourceLine(param).then((res) => {
        if (res) {
          const yData = [];
          res.series.forEach((item, index) => {
            const key = Object.keys(item)[0];
            const values = Object.values(item)[0];
            const color = that.areaColor[index];
            const seriesData = that.getChartSeries(key, values, color);
            yData.push(seriesData);
          });
          const chartDom = document.getElementById(chartDomId);
          const myChart = echarts.init(chartDom);
          const option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00', '#DA70D6',
            ],
            title: {
              text: '',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985',
                },
              },
            },
            legend: {
              data: res.legendData,
              x: 'center',
              y: 'bottom',
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true,
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: res.axisData,
              },
            ],
            yAxis: [
              {
                type: 'value',
              },
            ],
            series: yData,
          };
          option && myChart.setOption(option);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
/* 卡片样式*/
.home_card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #2D405E;
  transition: 0.3s;
}
.home_card_center {
  height: 320px;
}
.home_card_header {
  padding: 12px 12px;
  box-sizing: border-box;

  span {
    @include font_color_imp('color-primary');
    font-size: 15px;
    font-weight: bold;
  }
}
.home_card_body {
  padding: 12px;
}
.home_source_item {
  width: 100%;
  padding-top: 20px;

  .source_title {
    font-size: 16px;
    @include font_color_imp('color-primary');
  }

  .source_num {
    padding: 10px 0;
    font-size: 18px;
    @include font_color_imp('color-primary');

    span {
      font-weight: bold;
    }
  }
}

/*报修来源*/
.home-tab-brief {
  padding-top: 10px;
}

.home-tab-brief ::v-deep .el-tabs__header {
  margin: 0 !important;
}

</style>
