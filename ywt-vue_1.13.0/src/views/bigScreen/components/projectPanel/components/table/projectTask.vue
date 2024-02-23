
<!--  -->
<template>
  <el-container>
    <el-main>
      <TaskTable :data="data" :task-list="taskList" />
    </el-main>
  </el-container>
</template>

<script>
import TaskTable from '@/views/bigScreen/components/projectPanel/components/table/taskTable.vue';
export default {
  name: 'TaskTableDialog',
  components: {
    TaskTable,
  },
  mixins: [],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    taskList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },

  computed: {
  },
  mounted() {},
  methods: {

  },
};
</script>
<style lang='scss' scoped>
@import "~@/views/bigScreen/style/form.scss";

</style>
