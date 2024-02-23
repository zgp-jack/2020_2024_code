<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-16 16:18:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:37:06
 * @Description:巡检模板下拉框
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
      :value="item.id"
      :label="item.templateName"
    />
  </el-select>
</template>

<script>
import InspectionTemplateApi from '@/apis/inspection/template';
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
      default: '请选择巡检模板',
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
      const list = await InspectionTemplateApi.list();
      this.list = list;
    } catch (error) {
      console.log('获取巡检模板失败');
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
