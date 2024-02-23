<template>
  <Wrapper :title="Title">
    <Table :data="tableData">
      <el-table-column prop="title" width="200" show-overflow-tooltip label="项目名称" />
      <el-table-column prop="priority" label="紧急程度">
        <template #default="{row}">
          <span :style=" row.priority | textColor">
            {{ row.priority | needLevel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalProgress" label="进度">
        <template #default="{row}">
          {{ row.totalProgress || 0 }}%
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="要求完成时间" />
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
    textColor(val) {
      const colors = {
        '1': '#C9E5FF',
        '2': '#E6A945',
        '3': '#E64645',
      };

      const color = colors[String(val)];
      return `color:${color}`;
    },
  },
  props: {
    // A B
    type: {
      type: String,
      default: 'A',
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ProjectLevel() {
      if (this.type === 'A') {
        return '1';
      }
      return '2';
    },
    Title() {
      const count = this.tableData?.length || 0;
      return `${this.type}类项目(${count}个)`;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const projectLevel = this.ProjectLevel;
      this.tableData = await BigScreenApi.ProjectTypeSum({ projectLevel, });
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
::v-deep .el-table::before,
::v-deep .el-table--group::after,
::v-deep .el-table--border::after{
  background-color: transparent  !important;
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
