/**
* @file selectCompany.vue
* @author huang
* @date 2023/10/31
* @description 第三方厂家/公司 选择
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-select
    v-model="selectValue"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in companyList"
      :key="item.deptId"
      :label="item.deptName"
      :value="item.deptId"
    />
  </el-select>
</template>
<script>
import { mapState, } from 'vuex';

export default {
  name: 'SelectCompany',
  props: {
    value: {
      type: [
        String,
        Number,
      ],
      default: '',
    },
  },
  computed: {
    ...mapState('SYSTEM_DEPT', {
      deptList: 'list',
    }),
    selectValue: {
      set(value) {
        this.$emit('change', value);
        this.$emit('input', value);
      },
      get() {
        return this.value;
      },
    },
    companyList() {
      return this.deptList.filter(item => item.deptType === 1);
    },
  },
  methods: {},

};
</script>

<style lang='scss'
  scoped
>

</style>
