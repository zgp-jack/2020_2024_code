<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-21 13:59:58
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-04-23 10:35:23
 * @Description:总体分析
-->
<template>
  <el-card>
    <el-row :gutter="23">
      <el-col :span="12" class="source">
        <el-row type="flex" class="row-bg" justify="space-between" align="center">
          <el-col class="label">来源分析</el-col>
          <el-col class="right"><i class="el-icon-download" @click="onExportSource" /></el-col>
        </el-row>
        <div id="source-pie" class="echart" :style="{float:'left',width: '100%', height: '260px'}" />
      </el-col>
      <el-col :span="12" class="fault-type">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col class="label">故障分类</el-col>
          <el-col class="right">
            <el-button v-if="preArr.length>0" type="text" style="padding:0" @click="handlePre">返回上一级</el-button>
            <i class="el-icon-download" @click="onExportFaultType" /></el-col>
        </el-row>
        <div id="fault-type-pie" class="echart" :style="{float:'left',width: '100%', height: '260px'}" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
const sourceColor = {
  '电话报修': '#FF7F50',
  '微信报修': '#87CEFA',
  '补录': '#DA70D6',
  '电脑报修': '#32CD32',
  '上门报修': '#6495ED',
};
import StatisticsApi from '@/apis/reportFault/statistics';
import downLoadFile from '@/utils/downLoad';
export default {
  data() {
    return {
      formData: {
        deptId: null,
        startTime: null,
        endTime: null,
      },
      // 进入层级数组
      preArr: [],
      currentId: null,
      deptId: null,
      startTime: null,
      endTime: null,
      parentId: null,
      // 来源分析数据
      sourceData: null,
      // 故障分类数据
      faultTypeData: null,
      // 来源饼图
      sourcePie: null,
      // 故障分类饼图
      faultTypePie: null,
    };
  },
  created() {

  },
  mounted() {
    console.log('main mounted');
    this.faultTypePie = echarts.init(document.getElementById('fault-type-pie'));
    this.sourcePie = echarts.init(document.getElementById('source-pie'));
  },
  methods: {
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.deptId = condition.deptId;
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.currentId = null;
      this.preArr = [];
      this.fetchSourceData();
      this.fetchFaultTypeData();
    },
    // 获取来源数据
    async fetchSourceData() {
      try {
        const res = await StatisticsApi.source({ deptId: this.deptId, startTime: this.startTime, endTime: this.endTime, });
        this.sourceData = res.filter(item => item.value !== 0).map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: sourceColor[item.name], },
        }));
        this.drawSoucePie();
      } catch (error) {
        console.log(error);
      }
    },
    // 获取故障分类数据
    async fetchFaultTypeData() {
      try {
        const res = await StatisticsApi.faultType({ deptId: this.deptId, startTime: this.startTime, endTime: this.endTime, parentId: this.currentId, });
        this.faultTypeData = res.filter((item) => item.value !== 0).map(item => ({
          value: item.value,
          name: item.name,
          parentId: item.key,
          click: item.click,
        }));
        this.drawFaultTypePie();
      } catch (error) {
        console.log(error);
      }
    },
    // 返回上一级
    async handlePre() {
      this.currentId = this.preArr.pop();
      this.fetchFaultTypeData();
    },
    async handleQuery() {
      await this.initFaultTypePie();
    },
    async handleClear() {
      this.formData = Object.assign({}, { deptId: null, startTime: null, endTime: null, });
      await this.initFaultTypePie();
    },
    // 渲染来源分析饼图
    drawSoucePie() {
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
          }
        ],
      };
      this.sourcePie.setOption(option);
      window.addEventListener('resize', () => {
        this.sourcePie.resize();
      });
    },
    drawFaultTypePie() {
      if (this.faultTypePie) {
        this.faultTypePie.off('click');
      }
      const hidden = this.faultTypeData.some(item => item.value > 0);
      const option = {
        color: ['#FF7F50', '#87CEFA', '#DA70D6', '#32CD32', '#6495ED'],
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
          }
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
    async onExportSource() {
      const res = await StatisticsApi.exportSource({
        deptId: this.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      downLoadFile(res.url, '来源分析.xlsx');
    },
    async onExportFaultType() {
      const res = await StatisticsApi.exportFaultType({
        deptId: this.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      });

      downLoadFile(res.url, '故障分类.xlsx');
    },

  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 60px;
}
.gray-btn {
  color:#C0C4CC
}
.fault-type {
  border-left: 1px solid #ECF0F7;
}
.source , .fault-type{
  .label {
    font-size: 18px;
    font-weight: 600;
    color: #2d405e;
  }
}
.right {
  text-align: right;
}
.el-icon-download {
  color: #409EFF;
  cursor: pointer;
  margin-left: 12px;
}

</style>
