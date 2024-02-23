<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-19 14:28:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-19 14:51:51
 * @Description:项目名称下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :value="index"
      :label="item"
    />
  </el-select>
</template>

<script>
import ProjectApi from '@/apis/project';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择项目名称',
    },
  },
  data() {
    return {
      list: [],
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
  async created() {
    try {
      const list = await ProjectApi.projectNameList();
      this.list = list;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
