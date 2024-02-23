<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 16:43:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 17:01:17
 * @Description:知识分类树形控件
-->
<template>
  <el-tree
    highlight-current
    accordion
    node-key="id"
    :data="data"
    :props="props"
    default-expand-all
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: 'KonwledgeBaseClassificationTree',
  data() {
    return {
      data: [],
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
      const list = await this.$store.dispatch('knowledgeBase/FETCH_KNOWLEDGE_CLASSIFICATION');
      this.data = [{
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
