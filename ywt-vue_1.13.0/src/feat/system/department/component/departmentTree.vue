<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 15:38:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 15:47:08
 * @Description: 科室树型控件
-->
<template>
  <el-tree
    :data="treeData"
    node-key="id"
    accordion
    highlight-current
    @node-click="handleNodeClick"
  />
</template>

<script>

export default {
  name: 'DepartmentTree',
  props: {

  },

  computed: {
    treeData() {
      return this.$store.state.systemDepartment.list;
    },
  },
  methods: {
    handleNodeClick(nodeData) {
      this.$emit('node-click', nodeData.id, nodeData.deptNo);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
