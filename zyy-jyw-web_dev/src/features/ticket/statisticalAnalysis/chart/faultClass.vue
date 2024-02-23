/**
* @file faultClass.vue.vue
* @author huang
* @date 2023/8/30
* @description  故障分类
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <chart-panel
    title="故障分类占比图"
    @download="onDownload"
  >
    <div
      ref="faultClass"
      :style="{height: '260px'}"
    />
  </chart-panel>
</template>

<script>
import ChartPanel from '../panel/index.vue';
import * as echarts from 'echarts';
import StatisticalAnalysisApi from '../api';
import { downloadFile, } from '@/common/utils/download';

export default {
  components: {
    ChartPanel,
  },
  data() {
    return {
      faultTypePie: null,
      // 故障分类数据
      faultTypeData: null,
      queryParams: {
        deptId: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  mounted() {
    this.faultTypePie = echarts.init(this.$refs.faultClass);
    this.fetchFaultTypeData();
  },
  methods: {
    async onDownload() {
      const rs = await StatisticalAnalysisApi.exportFaultTypeAnalysis(this.queryParams);

      downloadFile(rs, '故障分类.xlsx');
    },
    // 获取故障分类数据
    async fetchFaultTypeData(query) {
      this.queryParams = query;
      try {
        const { rows, } = await StatisticalAnalysisApi.getFaultTypeAnalysis(query);

        this.faultTypeData = rows.filter((item) => item.value !== 0).map(item => ({
          value: item.realityNum,
          name: item.nameTitle,
          // parentId: item.key,
          // click: item.click,
        }));
        this.drawFaultTypePie();
      } catch (error) {
        console.log(error);
      }
    },
    drawFaultTypePie() {
      if (this.faultTypePie) {
        this.faultTypePie.off('click');
      }
      const hidden = this.faultTypeData.some(item => item.value > 0);
      const option = {
        color: ['#FF7F50',
          '#87CEFA',
          '#DA70D6',
          '#32CD32',
          '#6495ED',
        ],
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
            data: this.faultTypeData,
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
      this.faultTypePie.setOption(option);
      this.faultTypePie.on('click', (params) => {
        if (params.data.click && params.data.value > 0) {
          this.preArr.push(this.currentId);
          this.currentId = params.data.parentId;
          this.faultTypePie.off('click');
          this.fetchFaultTypeData();
        }
      });
      window.addEventListener('resize', () => {
        this.faultTypePie.resize();
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
