<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-22 09:45:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-28 11:12:32
 * @Description:院区及科室报修面板
-->
<template>
  <Card
    v-loading="loading"
    title="院区及科室报修"
    element-loading-background="#01070da6"
  >
    <div ref="department" style="height:100%" />
  </Card>
</template>

<script>

import Card from '../../component/card';
import TicketBigScreenApi from '../api';
import {
  mergePieOption,
} from '../../utils';
import DepartmentDialog from '../dialog/department.vue';
import moment from 'moment';
import * as echarts from 'echarts';
export default {
  components: {
    Card,
  },
  data() {
    return {
      option: {},
      data: null,
      startTime: null,
      endTime: null,
      loading: false,
    };
  },
  async created() {
    this.startTime = moment().startOf('month').format('YYYY-MM-DD');
    this.endTime = moment().endOf('month').format('YYYY-MM-DD');
  },
  async mounted() {
    this.loading = true;
    this.data = await TicketBigScreenApi.department({ startTime: this.startTime, endTime: this.endTime, });
    const chart = echarts.init(this.$refs.department);
    this.option = mergePieOption({ data: this.data, });
    this.option.series[0].labelLayout = function (params) {
      const isLeft = params.labelRect.x < chart.getWidth() / 2;
      const points = params.labelLinePoints;
      // Update the end point.
      points[2][0] = isLeft
        ? params.labelRect.x
        : params.labelRect.x + params.labelRect.width;
      return {
        labelLinePoints: points,
      };
    };
    chart.setOption(this.option);
    this.loading = false;
    chart.on('click', (event) => {
      const data = event.data;
      if (data.click === 0) {
        return;
      }
      data.startTime = this.startTime;
      data.endTime = this.endTime;
      this.$dialog({
        title: `院区及科室报修-${data.name}`,
        width: '740px',
        customClass: 'special-dialog',
        component: () => <DepartmentDialog data={data} />,
      });
    });
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
