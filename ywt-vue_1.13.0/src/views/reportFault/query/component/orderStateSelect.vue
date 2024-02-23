<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-29 17:35:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:42:56
 * @Description: 工单状态下拉框
-->

<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
    :clearable="true"
    :filterable="filterable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
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
      type: [Array, String],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择工单状态',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    // 是否有所有工单状态选择
    hasAll: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default: false,
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
      const list = this.$store.state['dictionary'].orderAllProcessList;
      if (this.hasAll) {
        list.unshift({
          name: '所有工单状态',
          value: null,
        });
      }
      this.list = list;
    } catch (error) {
      console.error(error);
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
