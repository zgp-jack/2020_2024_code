<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-30 17:54:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:36:52
 * @Description: 卡片首页
-->
<template>
  <div class="card-container">
    <Engineer class="engineer" :api-params="apiParams" @setWorkWarp="setWorkWarp" v-on="$listeners" @setIsLoginUserBtns="setIsLoginUserBtns" />
    <div class="work-warp">
      <WorkWarp v-for="(item,idx) in workList" :key="idx" :work="item" :card-api-params="cardApiParams" />
    </div>
  </div>
</template>

<script>
import HomeApi from '@/apis/home';
import Engineer from './engineer';
import WorkWarp from './workWarp';
export default {
  components: {
    Engineer,
    WorkWarp,
  },
  props: {
    queryData: {
      type: Object,
      default: () => ({}),
    },
  },
  provide() {
    return {
      CareView: this,
    };
  },
  data() {
    return {
      workList: [
        { title: '工单', color: '#3DCC9C', key: 'order', api: HomeApi.workOrderList, },
        { title: '任务', color: '#F57B7C', key: 'task', api: HomeApi.taskList, },
        { title: '调研', color: '#96ACFA', key: 'research', api: HomeApi.researchList, },
        { title: '巡检', color: '#74CDD4', key: 'inspection', api: HomeApi.inspectionList, },
        { title: '项目', color: '#AA66CC', key: 'project', api: HomeApi.projectList, }
      ],
      apiParams: {},
      cardApiParams: {},
      onlyView: true,
    };
  },
  computed: {

  },
  watch: {
    queryData: {
      handler(newVal, oldVal) {
        const { dateRange, waitWork, } = newVal;
        // const [startTime, endTime] = dateRange;
        const startTime = dateRange?.[0];
        const endTime = dateRange?.[1];
        this.apiParams.startTime = startTime;
        this.apiParams.endTime = endTime;
        this.apiParams.waitWork = waitWork;
        this.apiParams.pageSize = 99;
        this.apiParams.pageNum = 0;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
  },
  destroyed() {

  },
  activated() {

  },
  deactivated() {

  },
  methods: {
    setWorkWarp(userItem) {
      this.cardApiParams = { ...userItem, ...this.apiParams, };
    },
    setIsLoginUserBtns(v) {
      this.onlyView = !v;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container{
  display: flex;
  justify-content: space-between;
  height: 100%;
  background: #F0F0F0;
  .engineer{
    width: 196px;
    height: 100%;
  }
  .work-warp{
    width: calc(100% - 210px);
    height: 655px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .work-warp::-webkit-scrollbar { display: none; }
}
</style>

