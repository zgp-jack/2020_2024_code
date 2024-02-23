<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-25 18:02:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-02 14:05:46
 * @Description: 树形字典级联选择器
-->
<template>
  <el-cascader
    ref="cascader"
    v-model="selectedData"
    v-bind="$attrs"
    :options="list"
    :props="config"
    @change="onChange"
  />
</template>

<script>
import {
  convertToCascader,
} from '@/utils/common';
export default {
  name: 'TreeDicCascader',
  props: {
    dicKey: {
      type: String,
      default: null,
    },
    props: {
      type: Object,
      default: () => ({
        checkStrictly: true,
        value: 'id',
        label: 'name',
        emitPath: false,
      }),
    },
    value: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      config: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        emitPath: false,
      },
    };
  },
  computed: {
    list() {
      const list = this.$store.state['dictionary']['dicList'][this.dicKey] || [];
      return convertToCascader(list);
    },
    selectedData: {
      set(val) {
        console.log(val);
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },
  },
  mounted() {
    this.config = Object.assign({}, this.config, this.props);
  },
  methods: {
    onChange() {
      if (this.props.checkStrictly) {
        this.$refs.cascader.dropDownVisible = false;
      }
    },
  },

};
</script>

<style lang="scss" scoped>

</style>
