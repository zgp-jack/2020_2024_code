<template>
  <el-container>
    <el-main class="main">
      <TableLayout :no-padding="true">
        <div class="content-box">
          <el-tabs v-model="activeName" :tab-position="'left'" class="left_tab">
            <el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name" :label="item.label" />
          </el-tabs>
          <div class="main-content">
            <repair v-if="activeName === '4' " />
            <ticket v-if="activeName === '5' " />
          </div>
        </div>
      </TableLayout>
    </el-main>
  </el-container>
</template>

<script>
import pageMixin from '@/mixins/page';
// import taskDuty from './components/taskDuty.vue';
// import taskDispose from './components/taskDispose.vue';
// import meet from './components/meet.vue';
import ticket from './components/ticket.vue';
import repair from './components/repair.vue';
// import taskInspection from '@/features/inspection/inspectionTask/index.vue';
// import abnormal from '@/features/inspection/abnormalRectification/index.vue';

export default {
  name: 'Pending',
  components: {
    ticket,
    repair,
    /* taskDuty,
    taskDispose,
    meet,
    taskInspection,
    abnormal, */
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      activeName: '4',
      tabList: [
        // {label: '待值班任务', name: '1', componentName: 'task-duty'},
        // {label: '待处理任务', name: '2', componentName: 'task-dispose'},
        // {label: '待处理会议', name: '3', componentName: 'meet'},
        { label: '待处理报修', name: '4', componentName: 'repair', },
        { label: '待处理工单', name: '5', componentName: 'ticket', },
        /* { label: '待巡检任务', name: '6', componentName: 'task-inspection', },
        { label: '待异常整改', name: '7', componentName: 'abnormal', }, */
      ],
    };
  },
  computed: {
    /* componentName() {
      return this.tabList.find(t => t.name === this.activeName).componentName;
    }, */
  },
  activated() {
    const { type, } = this.$route.query;
    this.activeName = type || '4';
  },
};
</script>

<style lang="scss" scoped>
.page-system-settings {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  padding: 10px;
  background: #fff;
  .left_tab{
    flex: 0 0 111px;
    border-right: 1px solid #dde9e8;
  }

  .main-content {
    padding-left: 10px;
    flex: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
