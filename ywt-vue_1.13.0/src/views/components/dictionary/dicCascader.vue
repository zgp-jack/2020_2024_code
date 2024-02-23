<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-15 12:03:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-14 10:51:07
 * @Description: 数据字典级联选择器
-->
<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    v-bind="$attrs"
    :options="options"
    :filterable="true"
    :clearable="true"
    :props="props"
    @change="onChange"
  />
</template>

<script>
import {
  some,
  findLast,
  find,
} from 'lodash';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    dicKey: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      options: [],
      props: {
        value: 'id',
        checkStrictly: true,
      },
      dicData: [],
    };
  },
  computed: {
    selectedData: {
      set(val) {
        const vitualValue = findLast(val);
        this.$emit('input', vitualValue);
        this.$emit('change', vitualValue);
      },
      get() {
        let realValue = [];
        realValue = this.genFullPath(this.value);
        console.log(realValue);
        return realValue;
      },
    },
  },

  mounted() {
  },
  created() {
    if (!this.dicKey) {
      console.error('dicCascader组件必须设置dicKey属性');
      return;
    }
    const dicData = this.$store.state['dictionary']['dicList'][this.dicKey];
    if (!dicData) {
      console.error('dicCascader组件找不到dicKey对应的数据字典');
      return;
    }
    this.dicData = dicData;
    this.options = this.convertData(dicData);
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
      return find(this.dicData, { id, })?.parent_id;
    },
    convertData(list, parentId = 0) {
      const parentObj = {};
      list.forEach(item => {
        parentObj[item.id] = item;
      });
      if (!parentId) {
        return list
          .filter((item) => !parentObj[item.parent_id])
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.name;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      } else {
        return list
          .filter((item) => item.parent_id === parentId)
          .map((item) => {
            item.children = this.convertData(list, item.id);
            item.label = item.name;
            if (item.children.length === 0) {
              delete item.children;
            }
            return item;
          });
      }
    },
    // 检测该id是否存在
    isExisted(id) {
      return some(this.dicData, { id, });
    },
    // 选中节点变化时触发
    onChange(node) {
      this.$refs.cascader.dropDownVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
