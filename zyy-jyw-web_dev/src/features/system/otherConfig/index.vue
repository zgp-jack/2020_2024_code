<template>
  <div class="page-other-config">
    <el-tabs v-model="activeName">
      <el-tab-pane label="全局" name="first">
        <CompGlobal />
      </el-tab-pane>
      <el-tab-pane label="报障" name="second">
        <CompReportError />
      </el-tab-pane>
      <!-- <el-tab-pane label="项目" name="third">项目</el-tab-pane> -->
      <el-tab-pane label="知识" name="third">
        <CompKnowledge />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CompGlobal from './components/global.vue';
import CompReportError from './components/reportError.vue';
import CompKnowledge from './knowledge.vue';

export default {
  components: {
    CompGlobal,
    CompReportError,
    CompKnowledge,
  },
  data() {
    return {
      activeName: 'first',
    };
  },
};
</script>

<style lang="scss" scoped>
.page-other-config {
  height: 100%;
  overflow: auto;
  padding: 12px;
  ::v-deep {
    .el-tabs__header {
      padding:0 10px;
      background: #fff;
    }
  }
}
</style>
