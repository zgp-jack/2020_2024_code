<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 11:39:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-17 17:52:17
 * @Description:资产类型树型控件
-->
<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    accordion
    highlight-current
    @node-click="handleNodeClick"
  />
</template>

<script>
// import PropertyManagementApi from '@/apis/property/propertyManagement';
export default {
  name: 'PurePropertyTypeTree',
  props: {},
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      treeData: [],
    };
  },

  async created() {
    try {
      // const { list, } = await PropertyManagementApi.typeList();
      // this.treeData = list;
    } catch (error) {
      this.$message({
        type: 'error',
        message: error,
      });
    }
  },
  methods: {
    handleNodeClick(nodeData) {
      this.$emit('node-click', nodeData.id);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
