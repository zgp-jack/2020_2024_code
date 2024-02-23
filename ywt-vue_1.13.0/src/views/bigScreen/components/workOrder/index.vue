<template>
  <Wrapper :title="'进行中工单'">
    <Table :data="tableData">
      <el-table-column prop="appointment" label="报修时间" width="180px" />
      <el-table-column prop="faultRemark" show-overflow-tooltip label="工单标题" width="auto" min-width="200px" />
      <el-table-column prop="deptName" show-overflow-tooltip label="报修科室" width="180px">
        <template #default="{row}">
          {{ row.deptName || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="makeUserName" label="处理人" width="90px" />
      <el-table-column prop="responseType" label="响应类型" width="atuo" min-width="100px">
        <template #default="{row}">
          {{ row.responseType || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="degree" label="紧急程度" width="100px" />
      <el-table-column prop="hurryCount" label="催单次数" width="100px">
        <template #default="{row}">
          {{ row.hurryCount || 0 }}次
        </template>
      </el-table-column>
      <el-table-column prop="isOverTime" label="是否超时" width="100px">
        <template #default="{row}">
          <span :style="row.isOverTime | overTimeColor">
            {{ row.isOverTime | overTimeText }}
          </span>
        </template>
      </el-table-column>
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
  filters: {
    overTimeColor(val) {
      const color = val ? '#E64645' : '';
      return `color:${color}`;
    },
    overTimeText(val) {
      const text = val ? '是' : '否';
      return text;
    },
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
      this.tableData = await BigScreenApi.WorkInProgressOrder();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table tbody tr:hover {
  background: linear-gradient(
    90deg,
    rgba(24, 144, 255, 0.3),
    rgba(24, 144, 255, 0.05)
  ) !important;
}
::v-deep .el-table tbody tr:hover > td {
  background: transparent !important;
}

::v-deep .el-table__body-wrapper {
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
::v-deep .el-table th.gutter {
  display: table-cell !important;
  background: transparent !important;
}
</style>
