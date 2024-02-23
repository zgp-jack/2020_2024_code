<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="item.deptId"
      :label="item.deptName"
    />
  </el-select>
</template>

<script>
import { filter, } from 'lodash-es';
import { mapState, } from 'vuex';
export default {
  name: 'HospitalSelect',
  props: {
    value: {
      required: true,
    },
  },
  data() {
    return {
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

    ...mapState('SYSTEM_DEPT', {
      deptCachedList: 'list',
    }),
    list() {
      console.log(this.deptCachedList, 'deptCachedList');
      return filter(this.deptCachedList, { deptType: 0, parentId: 0, });
      // return this.deptCachedList.filter(item => item.deptType === 0).filter(item => item.parentId === 0);
    },
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
