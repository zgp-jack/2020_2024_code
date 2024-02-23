<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 16:11:43
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 18:06:23
 * @Description:知识分类级联选择器
-->
<template>
  <el-cascader
    v-model="checkedValue"
    :options="options"
    v-bind="$attrs"
    :props="props"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'KnowledgeClassificationCascaders',
  props: {
    value: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      checkedValue: this.value,
      options: this.$store.state.knowledgeBase.knowledgeClassification,
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  watch: {
    value(newVal) {
      this.checkedValue = newVal;
    },
  },
  methods: {
    onChange(newVal) {
      this.$emit('input', newVal);
      this.$emit('change', newVal);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
