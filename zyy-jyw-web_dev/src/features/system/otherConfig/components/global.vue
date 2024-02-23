<template>
  <div class="comp-other-config-global">
    <el-tabs v-model="activeName" tab-position="left">
      <!--      <el-tab-pane label="大屏" name="bigScreen">
        <CompGlobalBigScreen />
      </el-tab-pane>-->
      <el-tab-pane label="科室码" name="departmentCode">
        <CompGlobalDepartmentCode />
      </el-tab-pane>
      <!--      <el-tab-pane label="资产码" name="assetCode">
        <CompGlobalAssetCode />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
// import CompGlobalBigScreen from './global-big-screen.vue';
import CompGlobalDepartmentCode from './global-department-code.vue';
// import CompGlobalAssetCode from './global-asset-code.vue';

export default {
  components: {
    // CompGlobalBigScreen,
    CompGlobalDepartmentCode,
    // CompGlobalAssetCode,
  },
  data() {
    return {
      activeName: 'departmentCode',
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
