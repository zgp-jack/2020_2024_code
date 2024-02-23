<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-30 14:08:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-25 22:40:26
 * @Description: 统计面板
-->
<template>
  <el-card>
    <el-row>
      <el-col :span="20">
        <module-card module="WORK_ORDER" />
      </el-col>
      <el-col :span="20">
        <module-card module="RESEARCH" />
      </el-col>
      <el-col :span="20">
        <module-card module="PROJECT" />
      </el-col>
      <el-col :span="20">
        <module-card module="TASK" />
      </el-col>
      <el-col :span="18">
        <module-card module="DUTY" :divider="false" />
      </el-col>
      <el-col :span="200">
        <i class="el-icon-s-operation" @click="onClick" />
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
import SettingDialog from '../dialog/setting.vue';

export default {
  components: {
    ModuleCard: () => import('./moduleCard.vue'),
  },
  methods: {
    onClick() {
      this.$dialog({
        title: '首页数据统计设置',
        component: () => <SettingDialog onDone={() => {}}/>,
        width: '688px',
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.el-col-20 {
  width: 20%;
}
.el-col-18 {
  width: 18%;
}
.el-col-200 {
  width: 2%;
}
::v-deep .el-card__body {
  padding: 16px 16px;
  padding-left: 60px;
}
.center {
  text-align: center;
}
</style>
