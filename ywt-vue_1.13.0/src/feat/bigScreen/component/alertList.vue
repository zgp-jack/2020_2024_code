
<template>
  <div class="alert_wrapper">
    <div class="alert_wrapper_table">
      <Table :data="data" :is-roll="false">
        <el-table-column prop="orderWarningTime" label="告警时间" />
        <el-table-column prop="orderWarningCount" label="工单数" />
        <el-table-column prop="faultTypeName" label="故障分类" />

      </Table>
    </div>
    <div class="alert_wrapper_pagination">

      <el-pagination
        :current-page="paginationData.pageNum"
        :page-sizes="[10,15,20]"
        :page-size="paginationData.pageSize"
        layout="total,  prev, pager, next"
        :total="paginationData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Table from '../component/table/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';
export default {
  components: {
    Table,
  },
  data() {
    return {
      data: [],
      paginationData: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleSizeChange(pageSize) {
      this.paginationData.pageSize = pageSize;
      this.init(this.paginationData.pageSize, this.paginationData.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.paginationData.pageNum = pageNum;
      this.init(this.paginationData.pageSize, pageNum);
    },
    async init(pageSize = 10, pageNum = 1) {
      const rs = await BigScreenApi.AlertMsgList({
        pageSize: pageSize,
        pageNum: pageNum,
      });
      console.log(rs, 'rs');
      this.data = rs.list || [];
      this.paginationData = rs;
    },
  },
};
</script>

<style   lang="scss" scoped>
.alert_wrapper_table{
  height: 500px;
}
.alert_wrapper_pagination{
  text-align: right;
  padding: 30px 0;
}
::v-deep .el-pagination{
  color:#C9E5FF ;
}
::v-deep .el-pagination button{
// background-image: linear-gradient(90deg, rgba(201,229,255,0.20) 0%, rgba(201,229,255,0.00) 50%, rgba(201,229,255,0.20) 100%);
border: 1.5px solid rgba(201,229,255,0.30);
  background-color: transparent;

}
::v-deep .el-pager li{
  background-color: transparent;
}

::v-deep .el-table tbody tr:hover {
    background: linear-gradient(90deg,rgba(24,144,255,0.30), rgba(24,144,255,0.05)) !important;
}
::v-deep .el-table tbody tr:hover>td {
    background: transparent !important;
}
::v-deep .el-table__body-wrapper{
  &::-webkit-scrollbar {
    width: 4px !important;
    height:4px !important;
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
