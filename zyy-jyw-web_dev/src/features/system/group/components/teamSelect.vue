/**
* @file selectTeam.vue
* @author huang
* @date 2023/10/27
* @description  小组选择
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-select
    v-model="selectData"
    placeholder="请选择"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in teamList"
      :key="item.id"
      :label="item.teamName"
      :value="item.id"
    />
  </el-select>
</template>
<script>
import { mapState, } from 'vuex';

export default {
  props: {
    value: {
      type: [
        String,
        Number,
      ],
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('SYSTEM_TEAM', {
      teamList: 'list',
    }),
    selectData: {
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {},
};
</script>
<style lang='scss'
  scoped
>

</style>
