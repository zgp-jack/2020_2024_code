<template>
  <Wrapper :title="'待开始会议安排'">
    <Table :data="tableData">
      <el-table-column prop="time" label="会议时间" width="180" />
      <el-table-column prop="meetingRoomName" label="会议室" width="180" />
      <el-table-column prop="title" label="会议主题" />
    </Table>
  </Wrapper>
</template>

<script>
import Wrapper from '../wrapper/index.vue';
import Table from '../table/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';

export default {
  components: {
    Wrapper,
    Table,
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    async initData() {
      this.tableData = await BigScreenApi.WorkMeetingArrange();
    },

  },

};
</script>

<style   lang="scss" scoped>
::v-deep .el-table tbody tr:hover {
    background: linear-gradient(90deg,rgba(24,144,255,0.30), rgba(24,144,255,0.05)) !important;
}
::v-deep .el-table tbody tr:hover>td {
    background: transparent !important;
}

::v-deep .el-table__body-wrapper{

  &::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  &::-webkit-scrollbar-thumb {
    background: #1890ff !important;
    border-radius: 0 !important;
  }
  &::-webkit-scrollbar-track {
    background: transparent !important;
  }
}
::v-deep .el-table th.gutter{
  display: table-cell !important;
  background: transparent !important;
}

</style>
