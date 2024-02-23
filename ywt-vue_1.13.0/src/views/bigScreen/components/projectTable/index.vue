<template>
  <Wrapper title="项目总体视图">
    <Table :data="tableData" @rowClick="rowClick">
      <el-table-column prop="title" label="项目名称" width="200px" show-overflow-tooltip />
      <el-table-column prop="createUserName" label="提出人" width="120px" show-overflow-tooltip />
      <el-table-column prop="principalName" label="负责人" width="120px" show-overflow-tooltip />
      <el-table-column prop="priority" label="紧急程度" width="120px">
        <template #default="{row}">
          <span :style=" row.priority | textColor">
            {{ row.priority | needLevel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="totalProgress" label="当前进度">
        <template #default="{row}">
          <Bar :value="row.totalProgress" show-per />
        </template>
      </el-table-column>
      <el-table-column prop="overtime" label="是否超期" width="120px">
        <template #default="{row}">
          <span :style="row.overtime | OverTimeColor">
            {{ row.overtime | isOverTime }}
          </span>
        </template>
      </el-table-column>
    </Table>
    <Drawer :visible.sync="visible" size="1026px" :data-width="'1026px'">
      <template #title>
        项目信息
      </template>
      <template #codeText>
        项目编号:{{ itemCode }}
      </template>
      <PanelsGroup :item-code="itemCode" :data="processData" />
    </Drawer>
  </Wrapper>
</template>

<script>
import Drawer from '../projectPanel/components/drawer/index.vue';
import PanelsGroup from '../projectPanel/components/panelsGroup/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';
import Wrapper from '../wrapper/index.vue';
import Table from '../table/index.vue';
import Bar from './component/bar/index.vue';
export default {
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
    OverTimeColor(val) {
      const color = val ? '#E64645' : '';
      return `color:${color} `;
    },
    isOverTime(val) {
      // 是否超期 (0未超时 1超时)
      return val ? '超时' : '未超时';
    },

  },
  components: {
    Wrapper,
    Table,
    Bar,
    Drawer,
    PanelsGroup,
  },
  data() {
    return {
      tableData: [],
      processData: {},
      visible: false,
      itemCode: '',
    };
  },
  computed: {
  },
  mounted() {
    this.init();
  },
  methods: {
    async rowClick(row) {
      this.itemCode = row.itemCode;
      let loading = null;
      try {
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        const rs = await BigScreenApi.ProjectProcess({ itemCode: row.itemCode, });
        this.processData = rs;
        this.visible = true;
      } catch (error) {
        this.$message.error(error);
      } finally {
        loading.close();
      }
    },
    async init() {
      this.tableData = await BigScreenApi.ProjectTotalView();
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
