<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-22 09:32:51
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-30 11:07:17
 * @Description:故障分类面板
-->
<template>
  <Card v-loading="loading" title="故障类别排名" element-loading-background="#01070da6">
    <div ref="faultType" style="height:100%" />
  </Card>
</template>

<script>
import Card from '../../component/card';
import TicketBigScreenApi from '../api';
import FaultTypeDialog from '../dialog/faultType.vue';
import {
  mergePieOption,
} from '../../utils';
import moment from 'moment';
import * as echarts from 'echarts';
export default {
  components: {
    Card,
  },
  data() {
    return {
      option: {
      },
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
    this.data = await TicketBigScreenApi.faultType({ startTime: this.startTime, endTime: this.endTime, });
    const chart = echarts.init(this.$refs.faultType);

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
        title: `故障类别排名-${data.name}`,
        width: '740px',
        customClass: 'special-dialog',
        component: () => <FaultTypeDialog data={data} />,
      });
    });
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
