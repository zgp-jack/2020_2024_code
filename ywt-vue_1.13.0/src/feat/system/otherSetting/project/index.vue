<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item name="1">
      <template #title>
        <span class="title">项目任务工时配置</span>
      </template>
      <ProjectWorkTimeConfig />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import ProjectWorkTimeConfig from './components/projectWorkTimeConfig.vue';
export default {
  components: {
    ProjectWorkTimeConfig,
  },
  data() {
    return {
      activeName: '1',
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-family: AlibabaPuHuiTi_2_55_Regular;
  font-weight: 400;
  font-size: 18px;
  color: #334266;
  letter-spacing: 0;
}
</style>
