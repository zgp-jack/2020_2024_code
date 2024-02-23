<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-22 17:28:58
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:34:07
 * @Description: 运维小组下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :value="item.id"
      :label="item.name"
    />
  </el-select>
</template>

<script>
import GroupApi from '@/apis/system/group';
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择运维小组',
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
      const { list, } = await GroupApi.list();
      this.list = list;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>

