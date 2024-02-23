<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-14 14:33:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-15 02:15:51
 * @Description: 查看子典项
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">查看字典项</div>
    </div>
    <div class="body  base-margin-bottom">
      <div class="table-content">
        <el-table
          border
          :data="list"
          height="100%"
          lazy
          :load="lazyLoad"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'child'}"
        >
          <el-table-column label="字典项" prop="name" />
        </el-table>
      </div>
    </div>
    <div class="footer" />
  </div>

</template>

<script>
import DictionaryApi from '../api';
import FormDialog from '@/minxins/common/formDialog';
export default {
  mixins: [FormDialog],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      needFetchDetail: false,
      list: [],
    };
  },
  mounted() {
    this.fetchCategory();
  },
  methods: {
    async fetchCategory() {
      const { list, } = await DictionaryApi.itemList({ catalogId: this.id, });
      this.list = list;
    },
    async lazyLoad(tree, treeNode, resolve) {
      const { list, } = await DictionaryApi.itemList({
        catalogId: treeNode.catalogId,
        parentId: tree.id,
        pageSize: 9999,
      });
      console.log(treeNode, list);
      resolve(list);
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
}
 .table-content{
    position: absolute;
    width: 100%;
    height: 100%;
 }
</style>
