<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-05-30 16:20:37
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 16:12:12
 * @Description:具有小组的科室级联选择器
-->

<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    v-bind="$attrs"
    :options="list"
    :props="props"
    clearable
    placeholder="科室/小组"
    :show-all-levels="false"
    @change="closeCascader"
  />
</template>

<script>
import DepartmentApi from '../api';
export default {
  name: 'DeptHasTeamCascader',
  data() {
    return {
      list: [],
      selectedData: null,
      props: {
        checkStrictly: true,
        value: 'pseudoId',
        label: 'name',
        children: 'teams',
        emitPath: false,
      },
    };
  },
  async created() {
    try {
      this.list = await DepartmentApi.deptsHasTeam();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    closeCascader() {
      this.$refs.cascader.dropDownVisible = false;
      const checkedNode = this.$refs.cascader.getCheckedNodes();
      const nodeData = checkedNode[0]?.data;
      this.$emit('change', nodeData);
    },
    clear() {
      console.log(this.$refs);
      // this.$refs.cascader.clearCheckedNodes();
      this.selectedData = null;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
