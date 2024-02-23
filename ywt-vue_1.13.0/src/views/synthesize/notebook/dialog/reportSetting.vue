<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-14 13:49:07
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-16 09:55:15
 * @Description:生成报告配置弹窗
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="138px"
      size="mini"
    >
      <el-form-item label="已完成事项" prop="timeOfDoneItem">
        <el-date-picker
          v-model="formData.timeOfDoneItem"
          size="mini"
          class="base-margin-right item-width"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :default-time="['00:00:00','23:59:59']"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="计划事项">
        <el-date-picker
          v-model="formData.timeOfPlanItem"
          size="mini"
          class="base-margin-right item-width"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :default-time="['00:00:00','23:59:59']"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="人员" prop="users">
        <el-select
          v-model="formData.users"
          filterable
          default-first-option
          size="mini"
          multiple
          class="base-margin-right item-width"
          placeholder="请选择人员"
          :disabled="reportData.showRange == 0"
          @change="changeUser"
        >
          <el-option v-for="item in userList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目">
        <el-select
          v-model="formData.projects"
          filterable
          default-first-option
          size="mini"
          multiple
          collapse-tags
          class="base-margin-right item-width"
          placeholder="请选择项目"
          :disabled="reportData.showRange == 0"
          @change="change"
        >
          <el-option v-for="item in projectList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col class="align-right">
          <pure-button label="取消" type="sub-wire-frame" @click="$emit('cancel')" />
          <pure-button label="确定" @click="onSubmit" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ReportTabs from './reportTabs.vue';
import NotebookApi from '@/apis/notebook';
import moment from 'moment';
export default {
  props: {
    reportData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        // 已完成事项时间
        timeOfDoneItem: [],
        // 计划事项时间
        timeOfPlanItem: [],
        // 人员
        users: [],
        // 项目
        projects: [],
      },
      userList: [],
      isChangeUser: [],
      projectList: [],
      isChangeProjectList: [],
      rules: {
        timeOfDoneItem: [
          {
            type: 'array', required: true, message: '请选择已完成事项时间', trigger: 'change',
          }
        ],
        users: [
          {
            required: true, message: '请选择人员', trigger: 'change',
          }
        ],
      },
    };
  },
  created() {
    this.formData = {
      timeOfDoneItem: this.getDayOfWeek(new Date(), 0),
      timeOfPlanItem: this.getDayOfWeek(new Date(), 1),
      users: this.reportData.sendUser,
      projects: [],
    };
    this.getGenerateReportPopupData();
  },
  methods: {
    changeUser(v) {
      this.isChangeUser = [];
      this.userList.forEach(user => {
        v.forEach(item => {
          if (user.id === item) {
            this.isChangeUser.push(user);
          }
        });
      });
    },
    change() {

    },
    // 获取生成报告人员和项目下拉
    async getGenerateReportPopupData() {
      const res = await NotebookApi.getGenerateReportPopup({ showRange: this.reportData.showRange, });
      const { itemWorkMap, userMap, } = res;
      this.userList = this.dataConversion(userMap);
      this.projectList = this.dataConversion(itemWorkMap);
      this.projectList.forEach(item => {
        this.formData.projects.push(item.id + '');
      });
    },
    dataConversion(data) {
      const resData = [];
      for (const key in data) {
        resData.push({ id: key, name: data[key], });
      }
      return resData;
    },
    // 获取 当前时间 向前或向后 任意几周 的 周一和周末
    getDayOfWeek(date, witchWeek) {
      // witchWeek 前进或后退几周 -1为倒退一周 1为前进一周 0为本周
      var D = date.getDay() || 7; // 今天周几
      const oneDay = 24 * 60 * 60 * 1000; // 每天的时间戳
      const weekDayDifference = oneDay * (witchWeek + 1) * 6 + witchWeek * oneDay; // 时差
      const oneDayDifference = date.getDate() + 1 > D ? witchWeek * oneDay * 7 : witchWeek * oneDay * 6; // 时差
      const nowMonday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - D).getTime();// 本周一
      const targetMonday = nowMonday + oneDayDifference;// 目标周一
      const targetSunday = nowMonday + weekDayDifference;// 目标周末
      const M = moment(targetMonday).format('YYYY-MM-DD');
      const S = moment(targetSunday).format('YYYY-MM-DD');
      return [M, S];
    },
    async  onSubmit() {
      await this.$refs.form.validate();
      this.changeUser(this.formData.users);
      const [startTimeOfDone, endTimeOfDone] = this.formData.timeOfDoneItem;
      const [startTimeOfPlan, endTimeOfPlan] = this.formData.timeOfPlanItem || [];
      const data = {
        startTimeOfDone,
        endTimeOfDone,
        startTimeOfPlan,
        endTimeOfPlan,
        itemCodeAll: this.formData.projects.join(','),
      };
      this.$innerDialog({
        title: '事项报告',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <ReportTabs searchForm={data} userList={this.isChangeUser}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.item-width{
  width: 400px;
}

</style>
