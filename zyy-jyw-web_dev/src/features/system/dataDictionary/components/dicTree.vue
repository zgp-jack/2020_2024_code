<template>
  <el-tree
    :data="list"
    :default-expand-all="true"
    :props="config"
    accordion
    node-key="id"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import {
  convertToTree,
} from '@/common/utils/convert';
import { mapState, } from 'vuex';
import { find, } from 'lodash-es';

export default {
  name: 'TreeDicTree',
  props: {
    dicKey: {
      type: String,
      default: null,
    },

  },
  data() {
    return {
      config: {
        children: 'children',
        label: 'dictLabel',
        id: 'id',
      },
    };
  },
  computed: {
    ...mapState('SYSTEM_DIC', {
      dicList: state => state.list,
    }),
    list() {
      const findData = find(this.dicList, { type: this.dicKey, })?.data || [];
      if (findData) {
        return convertToTree(findData, {
          id: 'id',
          parentId: 'parentId',
        });
      }
      return [];
    },
  },
  mounted() {
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
