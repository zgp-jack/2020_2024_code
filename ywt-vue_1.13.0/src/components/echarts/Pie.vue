<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 14:16:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 14:40:55
 * @Description:
-->
<template>
  <el-row>
    <el-col :span="24">
      <div :id="id" :style="{ height: height, width: width }" />
    </el-col>
  </el-row>
</template>
<script>
import * as echarts from 'echarts';
export default {
  props: {
    id: {
      type: String,
      default: 'pie',
    },
    width: {
      type: String,
      default: '200px',
    },
    height: {
      type: String,
      default: '200px',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initPie();
  },
  methods: {
    initPie() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption({
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            color: ['#1213E9', '#FD8F18'],
            data: [
              { value: 8, name: '已建单: 20', },
              { value: 6, name: '未建单：6', }
            ],
            itemStyle: {
              normal: {
                label: {
                  position: 'inner',
                },
              },
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
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
