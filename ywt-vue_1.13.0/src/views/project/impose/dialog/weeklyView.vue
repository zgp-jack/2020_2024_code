<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="项目总结" name="summary">
      <div v-loading="summaryDataLoading" class="box">
        <ProcessListSummary v-if="summaryData && summaryData.length" :data-list="summaryData" />
        <el-result v-if="summaryData && !summaryData.length" title="暂无数据!" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="子任务记录" name="subHistory" class="box">
      <div v-loading="subHistoryDataLoading">

        <CollapseSubTaskHistory v-if="subHistoryData && subHistoryData.length" :data-list="subHistoryData" />
        <el-result v-if="subHistoryData && !subHistoryData.length" title="暂无数据!" />
      </div>

    </el-tab-pane>
    <el-tab-pane label="相关待办" name="todo">
      <div v-loading="toDoDataLoading" class="box">
        <TabToDo v-if="toDoData && toDoData.length" :data-list="toDoData" />
        <el-result v-if="toDoData && !toDoData.length" title="暂无数据!" />

      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ProcessListSummary from '../processList/summary.vue';
import CollapseSubTaskHistory from '../collapse/subTaskHistory.vue';
import TabToDo from '../tab/todo.vue';
import PorjectApi from '@/apis/project/index';
export default {
  components: {
    ProcessListSummary,
    CollapseSubTaskHistory,
    TabToDo,
  },
  props: {
    parmas: {
      type: Object,
      default: () => {
        return {
          projectId: '',
          startTime: '',
          endTime: '',
          members: '',
          planStartTime: '',
          planEndTime: '',
        };
      },
    },
  },
  data() {
    return {
      activeName: 'summary',
      summaryData: null,
      summaryDataLoading: false,
      toDoData: null,
      toDoDataLoading: false,

      subHistoryData: null,
      subHistoryDataLoading: false,

    };
  },
  mounted() {
    // 默认第一次获取项目总结数据
    this.getSummaryData();
  },
  methods: {
    // 获取项目总结
    async getSummaryData() {
      console.log(this.parmas, 'this.parmas');
      this.summaryData = null;
      this.summaryDataLoading = true;
      const res = await PorjectApi.impose.getProjectSummary(this.parmas);
      this.summaryData = res || [];
      this.summaryDataLoading = false;
    },
    // 获取子任务记录
    async  getSubHistoryData() {
      this.subHistoryData = null;
      this.subHistoryDataLoading = true;
      const res = await PorjectApi.impose.getProjectWeeklySubTaskHistory(this.parmas);
      this.subHistoryData = res || [];
      this.subHistoryDataLoading = false;
    },
    // 获取相关待办
    async  getToDoData() {
      this.toDoData = null;
      this.toDoDataLoading = true;

      const res = await PorjectApi.impose.getProjectWeeklyToDo(this.parmas);
      this.toDoData = res || [];
      this.toDoDataLoading = false;
    },
    handleClick(tab, event) {
      const { name, } = tab;
      switch (name) {
        case 'summary':
          this.getSummaryData();
          break;
        case 'subHistory':
          this.getSubHistoryData();
          break;
        default:
          this.getToDoData();
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
 ::v-deep .el-tabs__header .el-tabs__item.is-active {
    background-color: unset !important;
    color: #4574E6 !important;
  }
  ::v-deep .el-tabs__header{
     margin: 0;
  }
.m{
  &-t{
    &-16{
      margin-top:16px ;
    }
  }
}
.box{
  background-color: #F5F6F7;
  padding: 8px;
  height: 480px;
  min-height: 480px;
  max-height: 500px;
  overflow: auto;
}

</style>
