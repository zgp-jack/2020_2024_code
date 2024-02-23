<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-01-10 10:56:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-01-10 10:58:49
 * @Description:通用科室级联选择器
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
import {
  find,
  findLast,
  some,
  clone,
  cloneDeep,
} from 'lodash';
import {
  toTree,
} from '@/utils/dataConvert';
export default {
  name: 'DepartmentCascader',
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
    },
    disabledList: {
      type: Array,
      default: () => [],
    },
    // 科室数据源
    source: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    list() {
      return toTree(cloneDeep(this.originList), 0, { parentIdKey: 'parentId', labelKey: 'deptName', disabledList: this.disabledList, });
    },
    originList() {
      return this.source;
    },
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
