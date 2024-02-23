<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 20:48:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 20:48:56
 * @Description:首页模块
-->
<template>
  <el-container>
    <el-main class="container">
      <el-row class="header">
        <el-col :span="4" class="base-padding-right">
          <engineer-card />
        </el-col>
        <el-col :span="20" style="padding-left:12px">
          <statistics-card />
        </el-col>
      </el-row>
      <el-row class="main">
        <main-card />
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import EngineerCard from './table/engineer.vue';
import StatisticsCard from './table/statistics.vue';
import MainCard from './table/main.vue';
export default {
  name: 'Sy',
  components: {
    EngineerCard,
    StatisticsCard,
    MainCard,
  },
};
</script>

<style lang="scss" scoped>
.el-container ::v-deep .el-aside {
  background: white;
}

.el-row + .el-row {
  padding-top: 12px;
}

.container {
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
}
.header {
  height: 130px;
}
.main {
  height:100%;
  flex:1;
}

</style>
