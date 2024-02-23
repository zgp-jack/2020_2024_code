<template>
  <div class="comp-other-config-global">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="知识审核" name="knowledgeAudit">
        <KnowledgeAudit />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import KnowledgeAudit from './components/knowledge-audit.vue';

export default {
  components: {
    KnowledgeAudit,
  },
  data() {
    return {
      activeName: 'knowledgeAudit',
    };
  },
};
</script>

<style lang="scss" scoped>
.comp-other-config-global {
  ::v-deep {
    .el-tabs__header {
      width: 150px;
      margin-right: 0;
      background: #fff;
    }
  }
}
</style>
