<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 13:46:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-04 10:31:04
 * @Description: 用户下拉框
-->

<template>
  <el-select
    v-model="selectedData"
    :filterable="true"
    v-bind="$attrs"
    clearable
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
export default {
  name: 'EngineerSelect',
  props: {
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
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
    list() {
      const engineerList = this.$store.state.systemEngineer.list;
      if (!engineerList.length) {
        this.$store.dispatch('systemEngineer/FETCH_ENGINEER_LIST');
      }
      return engineerList;
    },
  },
  created() {
    this.$store.dispatch('systemEngineer/FETCH_ENGINEER_LIST');
  },
};
</script>

<style lang="scss" scoped>

</style>

