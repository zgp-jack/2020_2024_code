<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 14:47:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:34:12
 * @Description: 巡检模板下拉框
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
      :label="item.name"
    />
  </el-select>
</template>

<script>
import InspectionTempApi from '@/apis/inspection/template';
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
    try {
      const data = await InspectionTempApi.tempListForSelect();
      this.list = data;
    } catch (error) {
      this.$message({
        type: 'error',
        message: error,
      });
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
