<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-09 16:33:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-05-27 17:34:00
 * @Description:供应商下拉框
-->

<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :value="item.id"
      :label="item.deptName"
    />
  </el-select>
</template>

<script>
import ThirdPartApi from '@/apis/thirdPart';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },

  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    selectedData: {
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },
  },
  async created() {
    const data = await ThirdPartApi.supplierList();
    this.list = data;
  },
};
</script>

<style lang="scss" scoped>

</style>
