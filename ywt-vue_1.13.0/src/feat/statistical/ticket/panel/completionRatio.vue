<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-02 15:49:50
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-22 10:19:05
 * @Description:统计分析-工单完成率
-->
<template>
  <el-card style="height:598px">
    <el-row>
      <el-col>
        <span class="label">工单完成率（{{ average.name }}：{{ average.value.toFixed(0) }}%）</span>
        <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按人员" @change="handleTabChange" />
        <el-button size="mini" class="el-icon-download download" @click="getImg" />
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
          :unit="'人'"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import TicketApi from '../api';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import ProgressBar from './progressBar.vue';
import Moment from 'moment';
export default {
  components: {
    PureButtonGroup,
    ProgressBar,
  },
  data() {
    return {
      progressData: [],
      maximumData: [],
      average: { name: '', value: 0, },
      max: 0,
      progressOption: {
        colorList: ['#EA7D64', '#F6C638', '#72DDB2', '#7484A1', '#729FF9', '#82CFEE'],
        // innerTitle: ['完成率 0% ', '完成率 100%', '完成率 60%-79%', '完成率 80%-99%', '完成率 20%-59%', '完成率 1%-19%'],
        innerTitle: [],
      },
      groupBtnOptions: [{
        count: null,
        name: '按人员',
      }, {
        count: null,
        name: '按小组',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: '1', // 1项目类型2项目负责人3项目级别4供应商
      nameLabel: '按人员',
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
      const data = await TicketApi.completionRatio({ startDate: this.startTime, endDate: this.endTime,
        queryType: this.template,
      });
      data.forEach(item => {
        if (item.name === '平均完成率') {
          this.average = item;
        } else {
          if (this.max < Number(item.value)) this.max = Number(item.value);
          this.maximumData.unshift(this.max);
          this.progressData.unshift(item.value);
          this.progressOption.innerTitle.unshift(item.name);
        }
      });
    },
    handleTabChange(val) {
      switch (val) {
        case '按人员':
          this.template = '1';
          this.nameLabel = '按人员';
          break;
        case '按小组':
          this.template = '2';
          this.nameLabel = '按小组';
          break;
        case '按供应商':
          this.template = '3';
          this.nameLabel = '按供应商';
          break;
      }
      this.fetchData();
    },
    getImg() {
      let fileName = '';
      switch (this.template) {
        case '1':
          fileName = '工单-人员完成率';
          break;
        case '2':
          fileName = '工单-小组完成率';
          break;
        case '3':
          fileName = '工单-供应商完成率';
          break;
      }
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
  width: 270px;
  display: inline-block;
  margin-right: 28px;
}
.download{
  float: right;
}
</style>
