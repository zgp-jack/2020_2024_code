<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:46:22
 * @Description:故障分类下拉框
-->
<template>
  <el-cascader
    v-model="selectedData"
    :options="list"
    filterable
    clearable
    @change="handleChange"
  />
</template>

<script>
import { findLast, find, isString, } from 'lodash';
export default {
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      faultTypeList: this.$store.state['dictionary'].faultTypeList,
    };
  },
  computed: {
    list() {
      return this.convertData(this.faultTypeList);
    },
    selectedData: {
      set(newVal) {
        this.$emit('change', newVal);
        this.$emit('input', newVal);
      },
      get() {
        return isString(this.value) ? this.value.split(',') : this.value;
      },
    },
  },
  created() {},
  methods: {
    handleChange(item) {
      const leaf = findLast(item);
      const data = find(this.faultTypeList, { value: leaf, });
      if (data.parm) {
        this.$emit('change', parseFloat(data.parm));
      }
    },
    convertData(list, parent_id = 0) {
      const parentObj = {};
      list.forEach((item) => {
        parentObj[item.id] = item;
      });
      if (!parent_id) {
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
          .filter((item) => item.parent_id === parent_id)
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
  },

};
</script>

<style lang="scss" scoped>
</style>
