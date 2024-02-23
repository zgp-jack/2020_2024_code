/**
* @file cascaderDepartmentList.vue
* @author huang
* @date 2023/8/15
* @description 级联部门列表
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-cascader
    ref="cascader"
    v-model="targetValue"
    :options="listData"
    :props="propsData"
    class="w-100"
    filterable
    v-bind="$attrs"
    @change="onChange"
  />
</template>

<script>
import { convertToTree, } from '@/common/utils/convert';
import { mapState, } from 'vuex';

export default {
  props: {
    value: {
      type: [
        Number,
        String,
        Array,
      ],
      default: () => [],
    },
    props: {
      type: Object,
      default: () => {
      },
    },

  },
  data() {
    return {};
  },
  computed: {
    ...mapState('SYSTEM_DEPT', [
      'list',
    ]),
    propsData() {
      return {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        hasChildren: 'hasChildren',
        checkStrictly: true,
        emitPath: false,
        ...this.props,
      };
    },
    targetValue: {
      set(val) {
        // console.log(val, 'das', this.$refs.cascader.getCheckedNodes());

        this.$emit('input', val);
        // this.$emit('change', this.$refs.cascader.getCheckedNodes());
      },
      get() {
        return this.value;
      },
    },
    listData() {
      const arr = this.list.map((item) => {
        if (item?.children && item?.children.length) {
          return item;
        }
        this.$delete(item, 'children');
        return item;
      });
      return convertToTree(arr);
    },
  },
  created() {
  },
  methods: {

    // 选择上级部门
    onChange(event) {
      // console.log(event, 'event');
    },
  },

};
</script>

<style lang='scss'
  scoped
>

</style>
