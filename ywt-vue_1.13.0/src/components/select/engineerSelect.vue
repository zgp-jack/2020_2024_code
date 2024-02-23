<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:33:48
 * @Description:工程师下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :disabled="disabled"
    :placeholder="placeholder"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="Number(index)"
      :label="item"
    />
  </el-select>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].engineerList,
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        this.$emit('input', newVal);
        this.$emit('change');
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
