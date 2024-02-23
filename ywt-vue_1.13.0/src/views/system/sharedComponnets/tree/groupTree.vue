<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-21 20:33:45
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-06-04 15:16:19
 * @Description: 分组树形控件
-->
<template>
  <div>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      accordion
      highlight-current
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
function convertToCascader(list, deptId = 0, label = 'name') {
  const parentObj = {

  };
  list.forEach(item => {
    parentObj[item.id] = item;
  });
  if (!deptId) {
    return list.filter(item => !parentObj[item.deptId])
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  } else {
    return list.filter(item => item.deptId === deptId)
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  }
}

import {
  cloneDeep,
} from 'lodash';
import {
  getGroupListByDeptId,
} from '@/apis/system/group';
import {
  bus,
} from '@/utils/bus';
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        childre: 'children',
        label: 'name',
      },

    };
  },
  created() {
    this.fetchData();
    bus.$on('updateGroupTree', this.fetchData);
  },
  methods: {
    async fetchData() {
      const { list, } = await getGroupListByDeptId(null, 99999, 0);
      this.treeData = convertToCascader(cloneDeep(list), 0, 'name');
    },
    handleNodeClick(nodeData) {
      this.$emit('node-click', nodeData.id);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
