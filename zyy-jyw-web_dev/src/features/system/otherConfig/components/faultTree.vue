<template>
  <el-tree
    ref="tree"
    :data="treeData"
    :props="config"
    accordion
    highlight-current
    node-key="id"
    @node-click="handleNodeClick"
  />
</template>

<script>

// import { mapState, } from 'vuex';
import { convertToTree, } from '@/common/utils/convert';
import { find, } from 'lodash-es';

export default {
  name: 'DepartmentTree',
  props: {},
  data() {
    return {
      config: {
        children: 'children',
        label: 'dictLabel',
        id: 'id',
      },
    };
  },
  computed: {
    // ...mapState('SYSTEM_DEPT', {
    //   depList: state => state.list,
    // }),
    cachedDicList() {
      return this.$store.state['SYSTEM_DIC'].list || [];
    },
    list() {
      const faultList = find(this.cachedDicList, { type: 'obs_fault_type', })?.data || [];
      return faultList;
    },
    treeData() {
      const faultParent = { id: '', dictLabel: '全部分类', };
      const faultList = convertToTree(this.list, {
        id: 'id',
        parentId: 'parentId',
      });
      const parentTreeData = [faultParent, ...faultList,
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
