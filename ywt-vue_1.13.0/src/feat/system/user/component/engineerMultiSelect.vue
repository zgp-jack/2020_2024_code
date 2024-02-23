<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 15:03:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-04 10:32:55
 * @Description:用户下拉框(多选)
-->
<template>
  <pure-draggable-select
    v-model="selectedData"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :label="item.name"
      :value="item.id"
    />
  </pure-draggable-select>
</template>

<script>

export default {
  name: 'EngineerMultiSelect',
  components: {
    PureDraggableSelect: () => import('@/components/select/draggableSelect'),
  },
  props: {
    value: {
      type: String,
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
        this.$emit('input', newVal.join(','));
        this.$emit('change');
      },
      get() {
        return this.value ? this.value.split(',').map(item => Number(item)) : [];
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
