<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-23 15:20:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-30 11:06:56
 * @Description:故障分类弹窗
-->
<template>
  <div
    v-loading="loading"
    class="w-100"
    element-loading-background="#01070da6"
  >
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item,index) in cacheData"
        :key="index"
        :to="'#'"
        @click.native="onBreadcrumbClick(index)"
      >{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div id="faultType" ref="faultType" class="fault-type-pie" />
    <div class="btn">
      <i v-show="cacheData.length>1" class="el-icon-refresh-right" @click="onPrev"> 返回上级</i>
    </div>

  </div>

</template>

<script>
import TicketBigScreenApi from '../api';
import {
  mergePieOption,
} from '../../utils';
import * as echarts from 'echarts';

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {

        };
      },
    },
  },
  data() {
    return {
      option: {
      },
      pieData: null,
      chart: null,
      cacheData: [],
      loading: true,
      startTime: null,
      endTime: null,
    };
  },
  created() {

  },
  async mounted() {
    this.chart = echarts.init(document.getElementById('faultType'));
    this.loading = true;
    this.pieData = await TicketBigScreenApi.faultType({ id: this.data.id, startTime: this.data.startTime, endTime: this.data.endTime, });
    this.cacheData.push(this.data);
    this.option = mergePieOption({ data: this.pieData, });
    this.option.series[0].labelLayout = (params) => {
      const isLeft = params.labelRect.x < this.chart.getWidth() / 2;
      const points = params.labelLinePoints;
      // Update the end point.
      points[2][0] = isLeft
        ? params.labelRect.x
        : params.labelRect.x + params.labelRect.width;
      return {
        labelLinePoints: points,
      };
    };
    this.chart.setOption(this.option);
    this.loading = false;
    this.chart.on('click', (event) => {
      if (event.data.click === 0) {
        return;
      }
      this.cacheData.push(event.data);
      this.renderChart(event.data);
    });
  },
  methods: {
    async renderChart(parentData) {
      this.loading = true;
      this.pieData = await TicketBigScreenApi.faultType({ id: parentData.id, startTime: this.data.startTime, endTime: this.data.endTime, });
      this.option.series[0].data = this.pieData;
      this.chart.setOption(this.option);
      this.loading = false;
    },
    onPrev() {
      this.cacheData.pop();
      this.renderChart(this.cacheData[this.cacheData.length - 1]);
    },
    onBreadcrumbClick(index) {
      if (this.cacheData.length > 1 && index !== (this.cacheData.length - 1)) {
        this.cacheData.splice(index + 1);
        this.renderChart(this.cacheData[this.cacheData.length - 1]);
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.fault-type-pie {
  height: 440px;
  width:708px;
}
.btn {
  height: 15px;
}
.el-icon-refresh-right {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #c9e5ff;
  line-height: 14px;
  cursor: pointer;
}
::v-deep .el-breadcrumb__inner.is-link {
  color: #1890ff;
}
::v-deep .el-breadcrumb__item:last-child .el-breadcrumb__inner{
  color: #c9e5ff;
}
</style>
