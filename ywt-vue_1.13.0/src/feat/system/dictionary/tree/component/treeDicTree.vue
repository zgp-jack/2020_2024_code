<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-28 10:45:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 11:14:04
 * @Description: 树形字典(具有层级结构)树形控件
-->
<template>
  <el-tree
    :data="list"
    v-bind="$attrs"
    accordion
    node-key="id"
    :props="config"
    :default-expand-all="true"
    v-on="$listeners"
  />
</template>

<script>
import {
  convertToCascader,
} from '@/utils/common';
export default {
  name: 'TreeDicTree',
  props: {
    dicKey: {
      type: String,
      default: null,
    },
    props: {
      type: Object,
      default: () => ({
      }),
    },
  },
  data() {
    return {
      config: {
      },
    };
  },
  computed: {
    list() {
      const list = this.$store.state['dictionary']['dicList'][this.dicKey] || [];
      return convertToCascader(list);
    },
  },
  mounted() {
    this.config = Object.assign({}, this.config, this.props);
  },
};
</script>

<style lang="scss" scoped>

</style>
