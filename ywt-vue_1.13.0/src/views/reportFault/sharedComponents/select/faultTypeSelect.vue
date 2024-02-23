<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-05-27 17:41:39
 * @Description:故障分类下拉框
-->
<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    :options="list"
    filterable
    clearable
    placeholder="故障分类"
    :props="{checkStrictly: true,value: 'id',}"
    @change="handleChange"
  />
</template>

<script>
import { findLast, find, } from 'lodash';
export default {
  props: {
    value: {
      type: [String, Number],
      default: null,
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
      set(val) {
        const vitualValue = findLast(val);
        this.$emit('input', vitualValue);
        this.$emit('change', vitualValue);
      },
      get() {
        return Number(this.value);
      },
    },
  },
  created() {},
  methods: {
    handleChange(item) {
      const leaf = findLast(item);
      const data = find(this.faultTypeList, { id: leaf, });
      if (data?.parm) {
        this.$emit('change', parseFloat(data.parm));
      }
      this.$refs.cascader.dropDownVisible = false;
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
