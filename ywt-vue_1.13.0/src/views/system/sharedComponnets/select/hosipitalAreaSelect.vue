<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-18 11:28:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:44:34
 * @Description: 院区下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :disabled="disabled"
    :filterable="true"
    :placeholder="placeholder"
    clearable
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="item.id"
      :label="item.deptName"
    />
  </el-select>
</template>
<script>
import DepartmentApi from '@/apis/system/department';
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
      default: '请选择院区',
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
        this.$emit('change');
      },
      get() {
        return this.value;
      },
    },
  },
  async created() {
    try {
      const { list, } = await DepartmentApi.list({ deptType: 1, state: 1, });
      this.list = list;
    } catch (error) {
      console.log('获取院区失败');
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
