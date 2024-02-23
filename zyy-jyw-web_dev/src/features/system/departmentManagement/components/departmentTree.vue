<template>
  <el-tree
    :data="treeData"
    :props="config"
    accordion
    highlight-current
    node-key="deptId"
    @node-click="handleNodeClick"
  />
</template>

<script>

import { mapState, } from 'vuex';
import { convertToTree, } from '@/common/utils/convert';

export default {
  name: 'DepartmentTree',
  props: {},
  data() {
    return {
      config: {
        children: 'children',
        label: 'deptName',
        id: 'deptId',
      },
    };
  },
  computed: {
    ...mapState('SYSTEM_DEPT', {
      depList: state => state.list,
    }),
    treeData() {
      const deptParent = { deptId: 0, deptName: '全部科室', };
      const deptList = convertToTree(this.depList, {
        id: 'deptId',
        parentId: 'parentId',
      });
      const parentTreeData = [deptParent, ...deptList,
      ];
      return parentTreeData;
    },
  },
  methods: {
    handleNodeClick(nodeData) {
      this.$emit('node-click', nodeData);
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
