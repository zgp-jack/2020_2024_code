<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-19 15:50:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:48:17
 * @Description: 分组选择框
-->
<template>
  <el-cascader
    ref="cascader"
    v-model="selectdData"
    :show-all-levels="false"
    :options="list"
    clearable
    :props="{checkStrictly: true,childre: 'children',
             label: 'name',}"
    @change="closeCascader"
  />
</template>

<script>
function convertToCascader(list, deptId = 0, label = 'name') {
  const parentObj = {

  };
  list.forEach(item => {
    parentObj[item.id] = item;
  });
  if (!deptId) {
    return list.filter(item => !parentObj[item.deptId])
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  } else {
    return list.filter(item => item.deptId === deptId)
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  }
}

import { findLast, find, cloneDeep, } from 'lodash';
import {
  getGroupListByDeptId,
} from '@/apis/system/group';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      listOrign: [],
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
      return convertToCascader(cloneDeep(this.listOrign), 0, 'name');
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const { list, } = await getGroupListByDeptId(null, 99999, 0);
      this.listOrign = list;
    },
    findParent(arr, id) {
      const pid = find(this.listOrign, { id, }).deptId;
      if (pid) {
        arr.unshift(pid);
        return this.findParent(arr, pid);
      } else {
        return arr;
      }
    },
    closeCascader() {
      this.$refs.cascader.dropDownVisible = false;
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
