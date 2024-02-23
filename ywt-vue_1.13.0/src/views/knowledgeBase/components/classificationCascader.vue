<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-15 11:01:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-18 14:49:11
 * @Description:知识分类级联选择器
-->
<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    :clearable="true"
    :filterable="filterable"
    :options="list"
    :props="{checkStrictly:true,}"
    v-bind="$attrs"
    @change="closeCascader"
  />
</template>

<script>
import DicTreeApi from '@/apis/system/dictionary/tree';
import {
  find,
  findLast,
  some,
  clone,
} from 'lodash';
export default {
  name: 'KnowledgeClassificationCascader',
  props: {
    value: {
      type: Number,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    // 是否严格的遵守父子节点不互相关联,为true时，选中任意节点关闭面板
    checkStrictly: {
      type: Boolean,
      default: true,
    }, },
  data() {
    return {
      list: [],
      originList: [],
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        const nodeId = findLast(newVal);
        this.$emit('input', nodeId);
        this.$emit('change', find(this.originList, { id: nodeId, }));
      },
      get() {
        const pathArr = this.genFullPath(this.value);
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$refs.cascader.presentText = clone(pathArr).reverse().map(id => {
              return find(this.originList, { id, }).deptName;
            }).join('/');
          });
        });
        return pathArr;
      },
    },
  },
  created() {
    this.fetchList();
  },
  methods: {
    // 通过id获取部门全路径数组
    genFullPath(id) {
      if (!this.isExisted(id)) {
        return [];
      }
      const fullPathArr = [];
      while (this.isExisted(id)) {
        fullPathArr.unshift(id);
        id = this.findParentId(id);
      }
      return fullPathArr;
    },
    findParentId(id) {
      return find(this.originList, { id, })?.parentId;
    },
    // 检测该id是否存在
    isExisted(id) {
      return some(this.originList, { id, });
    },
    async fetchList() {
      // const { data, } = await KnowledgeBaseRetrievalApi.classificationList();
      const { data, } = await DicTreeApi.itemList({ catalogId: 3, });
      this.list = data;
    },
    closeCascader() {
      if (this.checkStrictly) {
        this.$refs.cascader.dropDownVisible = false;
      }
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
