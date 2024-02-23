<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 15:00:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-22 13:44:45
 * @Description:工单大屏
-->
<template>
  <Layout :layout-list="layout" :item-title="title" />
</template>

<script>
import Layout from '../layout/index.vue';
import FaultSourcePanel from './panel/faultSource.vue';
import DepartmentRankPanel from './panel/departmentRank.vue';
import FaultTypePanel from './panel/faultType.vue';
import DepartmentPanel from './panel/department.vue';
import EngineerPanel from './panel/engineer.vue';
import MeetingPanel from './panel/meeting.vue';
import TicketPanel from './panel/ticket.vue';
import DutyPanel from './panel/duty.vue';
export default {
  components: {
    Layout,
  },
  data() {
    return {
      title: '报修数据展示',
      layout: [
        { 'x': 0, 'y': 0, 'w': 4, 'h': 5, 'i': '0', static: false, component: FaultSourcePanel, },
        { 'x': 4, 'y': 0, 'w': 4, 'h': 5, 'i': '1', static: false, component: DepartmentRankPanel, },
        { 'x': 8, 'y': 0, 'w': 4, 'h': 5, 'i': '2', static: false, component: FaultTypePanel, },
        { 'x': 0, 'y': 5, 'w': 4, 'h': 5, 'i': '3', static: false, component: DepartmentPanel, },
        { 'x': 4, 'y': 5, 'w': 4, 'h': 5, 'i': '4', static: false, component: EngineerPanel, },
        { 'x': 8, 'y': 5, 'w': 4, 'h': 5, 'i': '5', static: false, component: MeetingPanel, },
        { 'x': 0, 'y': 10, 'w': 8, 'h': 5, 'i': '6', static: true, component: TicketPanel, },
        { 'x': 8, 'y': 10, 'w': 4, 'h': 5, 'i': '7', static: true, component: DutyPanel, }
      ],
    };
  },
  created() {
    console.log('ticket');
  },
};
</script>

<style lang="scss" scoped>

</style>
