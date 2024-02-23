<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 14:16:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-11 00:17:18
 * @Description:
-->
<template>
  <el-row align="middle">
    <el-col :span="24">
      <el-input v-model="searchValue" size="mini" class="border" v-bind="$attrs">
        <i slot="prefix" class="el-icon-search el-input__icon" />
      </el-input>
    </el-col>
  </el-row>
</template>
<script>
export default {

  data() {
    return {
      searchValue: '',
    };
  },
  watch: {
    searchValue(n, o) {
      this.$emit('input', n);
    },
  },
};
</script>
<style lang="scss" scoped>
.border ::v-deep .el-input__inner{
  border-radius: 4px;
}
</style>
