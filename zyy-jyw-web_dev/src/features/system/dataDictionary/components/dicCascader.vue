/**
* @file dicCascader.vue
* @author huang
* @date 2023/10/27
* @description  dic 级联选择
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-cascader
    v-model="selectedValue"
    :options="options"
    :props="props"
    @change="handleChange"
  />
</template>
<script>
import { mapState, } from 'vuex';
import { find, } from 'lodash-es';
import { convertToTree, } from '@/common/utils/convert';

export default {
  props: {
    value: {
      type: [
        String,
        Number,
      ],
      default: null,
    },
    dicKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // options: [],
      // selectedValue: null,
      props: {
        value: 'dictValue',
        label: 'dictLabel',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false,
      },
    };
  },
  computed: {
    ...mapState('SYSTEM_DIC', {
      dicList: 'list',
    }),
    selectedValue: {
      set(val) {

      },
      get() {
        return String(this.value) || null;
      },
    },

    options() {
      const val = find(this.dicList, { type: this.dicKey, })?.data || [];
      const tree = convertToTree(val, {
        id: 'id',
        parentId: 'parentId',
      });
      console.log(tree, 'tree');

      return tree;
    },
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
