<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    :clearable="true"
    :show-all-levels="false"
    :filterable="filterable"
    :options="list"
    collapse-tags
    :filter-method="customFilter"
    :props="{checkStrictly:true,multiple: true,emitPath: false}"
    v-bind="$attrs"
    @change="closeCascader"
  />
</template>

<script>
import {
  find,
  // findLast,
  some,
  // clone,
  cloneDeep,
} from 'lodash-es';
import {
  toTree,
} from '@/common/utils/dataConvert';
export default {
  name: 'DepartmentCascader',
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
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
  },

  computed: {
    list() {
      return toTree(cloneDeep(this.originList), 0, { idKey: 'deptId', parentIdKey: 'parentId', labelKey: 'deptName', disabledList: this.disabledList, });
    },
    originList() {
      return this.$store.state['SYSTEM_DEPT'].list || [];
    },
    selectedData: {
      set(newVal) {
        // const nodeId = findLast(newVal);
        console.log(newVal);
        this.$emit('input', newVal);
        this.$emit('change', newVal);
        // this.$emit('change', find(this.originList, { id: nodeId, }));
      },
      get() {
        return this.value;
        // const pathArr = this.genFullPath(this.value);
        // this.$nextTick(() => {
        //   this.$nextTick(() => {
        //     this.$refs.cascader.presentText = clone(pathArr).reverse().map(id => {
        //       return find(this.originList, { id, }).deptName;
        //     }).join('/');
        //   });
        // });
        // return pathArr;
      },
    },
  },
  methods: {
    customFilter(node, keywork) {
      if (node.data.deptName && node.data.deptName.indexOf(keywork) !== -1) {
        return true;
      }
      if (node.data.abbreviation && node.data.abbreviation.indexOf(keywork.toUpperCase()) !== -1) {
        return true;
      }
    },
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
        // this.$refs.cascader.dropDownVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
