<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-30 07:14:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-05-30 07:30:25
 * @Description: 基本信息
-->
<template>
  <pure-card>
    <div slot="header">基本信息</div>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="102px"
      :inline="true"
      size="mini"
    >
      <el-form-item label="角色名">
        <el-input />
      </el-form-item>
      <el-form-item label="所属科室">
        <el-input />
      </el-form-item>
      <el-form-item label="显示排序">
        <el-input />
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      rules: {},
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
