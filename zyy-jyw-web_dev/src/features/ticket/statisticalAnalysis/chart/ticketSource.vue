/**
* @file ticketSource.vue
* @author huang
* @date 2023/8/29
* @description 工单来源
* @projectName
* @email newflyhuang@gmail.com
*/
<template>

  <chart-panel
    title="工单来源占比图"
    @download="onDownload"
  >
    <!--    -->
    <div
      ref="sourcePie"
      :style="{height: '260px'}"
    />

  </chart-panel>
</template>

<script>
import * as echarts from 'echarts';

import ChartPanel from '../panel/index.vue';
import StatisticalAnalysisApi from '../api';
import { downloadFile, } from '@/common/utils/download';

const sourceColor = {
  '电话报修': '#FF7F50',
  '微信报修': '#87CEFA',
  '补录': '#DA70D6',
  '电脑报修': '#32CD32',
  '上门报修': '#6495ED',
};
export default {
  components: {
    ChartPanel,
  },
  data() {
    return {
      // 来源分析数据
      sourceData: null,
      // 来源饼图
      sourcePie: null,
      queryParams: {
        deptId: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  mounted() {
    this.sourcePie = echarts.init(this.$refs.sourcePie);
    this.fetchSourceData();
  },
  methods: {
    // 下载
    async onDownload() {
      const rs = await StatisticalAnalysisApi.exportSourceAnalysis(this.queryParams);

      downloadFile(rs, '工单来源分析.xlsx');
    },

    // 获取来源数据
    async fetchSourceData(query) {
      this.queryParams = query;
      try {
        const { rows, } = await StatisticalAnalysisApi.getSourceAnalysis(this.queryParams);

        this.sourceData = rows.filter(item => item.realityNum !== 0).map(item => ({
          value: item.realityNum,
          name: item.nameTitle,
          itemStyle: { color: sourceColor[item.nameTitle], },
        }));
        console.log(this.sourceData);
        this.drawSourcePie();
      } catch (error) {
        console.log(error);
      }
    },
    drawSourcePie() {
      const hidden = this.sourceData.some(item => item.value > 0);
      const option = {
        title: {
          show: !hidden,
          text: '暂无数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#879BBA',
            fontSize: 16,
            fontWeight: 400,
          },
        },
        tooltip: {
          trigger: 'item',

        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          itemGap: 12,
          bottom: 'bottom',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: this.sourceData,
            label: {
              formatter: '{b}: {c} ({d}%)',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      this.sourcePie.setOption(option);
      window.addEventListener('resize', () => {
        this.sourcePie.resize();
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
