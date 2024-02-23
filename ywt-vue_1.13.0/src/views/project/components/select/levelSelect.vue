<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 10:56:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-15 11:02:46
 * @Description: 紧急程度下拉框(字典:itemLevel)
-->
<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
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
    placeholder: {
      type: String,
      default: '请选择项目优先级',
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].itemLevelList,
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        this.$emit('input', newVal);
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
