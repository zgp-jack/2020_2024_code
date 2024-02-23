<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:43:28
 * @Description:紧急程度下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :value="item.value"
      :label="item.name"
    />
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].degreeList,
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        this.$emit('change', newVal);
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
