<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-02 15:49:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 11:49:22
 * @Description:统计分析-报修科室
-->
<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <span class="label">报修科室TOP5</span>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button size="mini" class="el-icon-download  " @click="getImg" />

      </el-col>
    </el-row>
    <el-row class="base-margin-top">
      <el-col :span="24">
        <ProgressBar
          ref="Progress"
          style="width: 100%; height: 352px"
          :progress-option="progressOption"
          :progress-data="progressData"
          :maximum-data="maximumData"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import TicketApi from '../api';
import ProgressBar from './progressBar.vue';
import Moment from 'moment';
export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      progressData: [],
      maximumData: [],
      max: 0,
      progressOption: {
        colorList: ['#FA8A70', '#F7D263', '#7CA6F9', '#7CA6F9', '#7CA6F9'],
        // innerTitle: ['胸外科 ', '普外科', '泌尿外科', '神经外科', '骨科'],
      },
      startTime: null,
      endTime: null,
    };
  },
  created() {
    this.changeQueryCondition({ startTime: Moment().startOf('month').format('YYYY-MM-DD'), endTime: Moment().endOf('month').format('YYYY-MM-DD'), });
  },
  methods: {
  // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.fetchData();
    },
    async fetchData() {
      this.progressData = [];
      this.maximumData = [];
      this.max = 0;
      this.progressOption.innerTitle = [];
      const data = await TicketApi.deptRepairTopFive({ startDate: this.startTime, endDate: this.endTime, });
      data.forEach(item => {
        if (this.max < Number(item.orderAmount)) this.max = Number(item.orderAmount);
        this.maximumData.unshift(this.max);
        this.progressData.unshift(item.orderAmount);
        this.progressOption.innerTitle.unshift(item.deptIdToName);
      });
    },
    getImg() {
      const fileName = `报修科室`;
      this.$refs.Progress.exportImg(fileName);
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
</style>
