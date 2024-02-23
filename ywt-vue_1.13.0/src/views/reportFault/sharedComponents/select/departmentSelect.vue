<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 15:42:20
 * @Description:
-->
//科室下拉框
<template>
  <el-cascader v-model="selectdData" :options="list" clearable />
</template>

<script>
import { findLast, find, cloneDeep, } from 'lodash';
import { convertToCascader, } from '@/utils/common';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      listOrign: this.$store.state.dictionary.departmentList,
    };
  },
  computed: {
    selectdData: {
      set(newVal) {
        this.$emit('input', findLast(newVal));
      },
      get() {
        let arr = [this.value];
        if (this.value) {
          arr = [this.value];
          arr = this.findParent(arr, this.value);
        } else {
          arr = [];
        }
        return arr;
      },
    },
    list() {
      return convertToCascader(cloneDeep(this.listOrign), 0, 'dept_name');
    },
  },
  created() {
  },
  methods: {
    findParent(arr, id) {
      const pid = find(this.listOrign, { id, })?.parent_id;
      if (pid) {
        arr.unshift(pid);
        return this.findParent(arr, pid);
      } else {
        return arr;
      }
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
