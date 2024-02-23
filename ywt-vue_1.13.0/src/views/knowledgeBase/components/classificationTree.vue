<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-15 11:23:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-18 16:45:53
 * @Description:知识分类树
-->

<template>
  <el-tree
    highlight-current
    accordion
    node-key="id"
    :data="treeData"
    :props="props"
    default-expand-all
    v-on="$listeners"
  />
</template>

<script>
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval';
export default {
  name: 'KonwledgeBaseClassificationTree',
  data() {
    return {
      treeData: [],
      props: {
        children: 'children',
        label: 'name',
      },
    };
  },
  async created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const list = await KnowledgeBaseRetrievalApi.classificationList();
      this.treeData = [{
        id: null,
        name: '全部',
        children: list,
      }];
    },
  },
};

</script>

<style lang="scss" scoped>

</style>
