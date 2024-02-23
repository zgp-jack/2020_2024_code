<!--
  报修
-->

<template>
  <Layout :layout-list="layout" :item-title="'报修数据展示'" />
</template>

<script>

import Layout from './layout/index.vue';
// 报修类型
import WorkCurve from './components/workCurve/index.vue';
// 工程师接单数
import WorkStackLine from './components/workStackLine/index.vue';
// 故障类别
import WorkPieFault from './components/workPieFault/index.vue';
// 院区及科室报修
import WorkPieRepair from './components/workPieRepair/index.vue';
// 报修科室排名
import WorkDepartmentRank from './components/workDepartmentRank/index.vue';
// 会议安排
import WorkMeetingArrange from './components/workMeetingArrange/index.vue';
// 进行中工单
import WorkOrder from './components/workOrder/index.vue';
// 人员排班
import WorkPeopleRowInfo from './components/workPeopleRowInfo/index.vue';
import { mapActions, } from 'vuex';
export default {
  components: {
    Layout,
  },

  data() {
    return {
      layout: [
        { 'x': 0, 'y': 0, 'w': 4, 'h': 1, 'i': '0', static: false, component: WorkCurve, },
        { 'x': 4, 'y': 0, 'w': 4, 'h': 1, 'i': '1', static: false, component: WorkDepartmentRank, },
        { 'x': 8, 'y': 0, 'w': 4, 'h': 1, 'i': '2', static: false, component: WorkPieFault, },
        { 'x': 0, 'y': 1, 'w': 4, 'h': 1, 'i': '3', static: false, component: WorkPieRepair, },
        { 'x': 4, 'y': 1, 'w': 4, 'h': 1, 'i': '4', static: false, component: WorkStackLine, },
        { 'x': 8, 'y': 1, 'w': 4, 'h': 1, 'i': '5', static: false, component: WorkMeetingArrange, },
        { 'x': 0, 'y': 2, 'w': 8, 'h': 2.1, 'i': '6', isDraggable: false, static: false, component: WorkOrder, },
        { 'x': 8, 'y': 2, 'w': 4, 'h': 2.1, 'i': '7', isDraggable: false, static: false, component: WorkPeopleRowInfo, }
      ],

    };
  },
  created() {
    this.DISPATCHT_GET_USER_LIST();
  },

  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

  },
};
</script>

<style scoped>

</style>
