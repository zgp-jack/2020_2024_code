<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-30 14:57:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-02 20:01:26
 * @Description: 模块卡片
-->
<template>
  <el-row @click.native="handleClick">
    <el-col style="width:80px" class="left">
      <el-row>
        <img :src="imgUrl">
      </el-row>
      <el-row class="title">{{ config.title }}</el-row>
    </el-col>
    <el-col :span="11">
      <el-row>
        <span class="pure-label pure-first-line">
          {{ config.oneLabel }}
          <span :class="config.label">{{ config.one }}</span>
        </span>
      </el-row>
      <el-row>
        <span class="pure-label second-line">
          {{ config.twoLabel }}
          <span> {{ config.two }}</span>
        </span>
      </el-row>
      <el-row>
        <span class="pure-label second-line">
          {{ config.threeLabel }}
          <span>  {{ config.three }}</span>
        </span>
      </el-row>
      <el-row>
        <span class="pure-label second-line">
          {{ config.fourLabel }}
          <span>  {{ config.four }}</span>
        </span>
      </el-row>
    </el-col>
    <el-col v-if="divider" :span="1">
      <div class="divider" />
    </el-col>
  </el-row>
</template>

<script>
const CONFIG = {
  WORK_ORDER: {
    title: '我的工单',
    img: 'workOrder.png',
    label: 'work-order',
    oneLabel: '总数',
    twoLabel: '已完成',
    threeLabel: '进行中',
    fourLabel: '待接单',
    path: '/reportFault/myorder',
  },
  RESEARCH: {
    title: '我的调研',
    img: 'research.png',
    label: 'research',
    oneLabel: '总数',
    twoLabel: '已完成',
    threeLabel: '进行中',
    fourLabel: '超时',
    path: '/project/needSetting',
  },
  PROJECT: {
    title: '我的项目',
    img: 'project.png',
    label: 'project',
    oneLabel: '总数',
    twoLabel: '已完成',
    threeLabel: '进行中',
    fourLabel: '超时',
    path: '/project/impose',
  },
  TASK: {
    title: '我的任务',
    img: 'task.png',
    label: 'task',
    oneLabel: '总数',
    twoLabel: '已完成',
    threeLabel: '进行中',
    fourLabel: '超时',
    path: '/synthesize/taskManagement',
  },
  DUTY: {
    title: '我的排班',
    img: 'duty.png',
    label: 'duty',
    oneLabel: '总数',
    twoLabel: '已完成',
    threeLabel: '进行中',
    fourLabel: '最近班',
    path: '/synthesize/workforceManagement?onlySelf=true',
  },
};
const MODULES = {
  WORK_ORDER: 'WORK_ORDER',
  RESEARCH: 'RESEARCH',
  PROJECT: 'PROJECT',
  TASK: 'TASK',
  DUTY: 'DUTY',
};
import HomeApi from '@/apis/home';
import { bus, } from '@/utils/bus';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
const HOME_SETTING_KEY = 'home_setting';
import moment from 'moment';
export default {
  props: {
    module: {
      type: String,
      default: 'DUTY',
    },
    divider: {
      type: Boolean,
      default: true,
    },
  },
  data: function () {
    return {
      config: {
        title: null,
        img: null,
        one: null, // 第一行数据
        two: null, // 第二行数据
        three: null, // 第三行数据
        four: null, // 第四行数据
        oneLabel: null,
        twoLabel: null,
        threeLabel: null,
        fourLabel: null,

      },
    };
  },
  computed: {

    imgUrl() {
      return require(`@/assets/home/${this.config.img}`);
    },
  },
  async created() {
    this.config = Object.assign({}, this.config, CONFIG[this.module]);
    bus.$on('home-refresh-statistics', this.fetchData);
    const { startMonth = 'currentMonth', startDay = '01', endMonth = 'currentMonth', endDay = '31', } = getJSON(HOME_SETTING_KEY) || {};
    const startDate = `${this.getMonth(startMonth)}-${startDay}`;
    const endDate = `${this.getMonth(endMonth)}-${endDay}`;
    const startTime = moment(new Date(startDate)).valueOf();
    const endTime = moment(new Date(endDate)).valueOf();
    this.fetchData({ startTime, endTime, });
    setJSON(HOME_SETTING_KEY, { startMonth, startDay, endMonth, endDay, });
  },
  methods: {
    getMonth(monthLabel) {
      switch (monthLabel) {
        case 'currentMonth':
          return moment().startOf('month').format('YYYY-MM');
        case 'previousMonth':
          return moment().subtract('month', 1).format('YYYY-MM');
      }
    },
    async fetchData({ startTime, endTime, } = {}) {
      try {
        let data;
        switch (this.module) {
          case MODULES.WORK_ORDER:
            data = await HomeApi.workOrderStatistics({
              startTime,
              endTime,
            });
            this.config.one = data.total;
            this.config.two = data.complete;
            this.config.three = data.making;
            this.config.four = data.receiving;
            break;
          case MODULES.RESEARCH:
            data = await HomeApi.researchStatistics({
              startTime,
              endTime,
            });
            this.config.one = data.total;
            this.config.two = data.complete;
            this.config.three = data.making;
            this.config.four = data.overtime;
            break;
          case MODULES.PROJECT:
            data = await HomeApi.projectStatistics({
              startTime,
              endTime,
            });
            this.config.one = data.total;
            this.config.two = data.complete;
            this.config.three = data.making;
            this.config.four = data.overtime;
            break;
          case MODULES.TASK:
            data = await HomeApi.taskStatistics({
              startTime,
              endTime,
            });
            this.config.one = data.total;
            this.config.two = data.complete;
            this.config.three = data.making;
            this.config.four = data.overtime;
            break;
          case MODULES.DUTY:
            data = await HomeApi.dutyStatistics({
              startTime,
              endTime,
            });
            this.config.one = data.total;
            this.config.two = data.complete;
            this.config.three = data.making;
            this.config.four = data.recent;
            break;
        }
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    handleClick() {
      this.$router.push(this.config.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  opacity: 0.8;
  font-size: $--pure-base-font-size;
  font-weight: 400;
  color: #909399;
  margin-top:7px;
}
.center {
  text-align: center;
}
.left {
  text-align: left;
}
.pure-label {
  font-size: $--pure-little-font-size;
  font-weight: 400;
  color: #879bba;
  margin-right: 6px;
  display: inline-block;
  margin-bottom: 6px;
  span {
    color: #2D405E;
    position:absolute;
    left: 52px;
  }
}
.pure-first-line {
  line-height: 18px;
  span {
    font-size: 18px;
    font-weight: 600;
  }
  .task {
    color: #F57B7C;
  }
  .work-order {
    color: #3DCC9C;
  }
  .research {
    color: #5783D9
  }
  .project {
    color: #AA66CC
  }
  .duty {
    color: #F2AA61
  }

}
.divider {
  width: 1px;
  margin:10px 0;
  height: 75px;
  border-right:1px solid  rgba(144,147,153,0.2);
}
</style>
