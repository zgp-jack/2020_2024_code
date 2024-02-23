<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-22 10:11:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-22 10:22:28
 * @Description:会议安排面板
-->
<template>
  <Card
    v-loading="loading"
    title="待开始会议安排"
    element-loading-background="#01070da6"
  >
    <Table :data="tableData">
      <el-table-column prop="time" label="会议时间" width="180" />
      <el-table-column prop="meetingRoomName" label="会议室" width="180" />
      <el-table-column prop="title" label="会议主题" />
    </Table>
  </Card>
</template>

<script>
import Card from '../../component/card';
import Table from '../../component/table/index.vue';
import TicketBigScreenApi from '../api';
export default {
  components: {
    Card,
    Table,
  },
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    this.tableData = await TicketBigScreenApi.meeting();
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>

</style>
