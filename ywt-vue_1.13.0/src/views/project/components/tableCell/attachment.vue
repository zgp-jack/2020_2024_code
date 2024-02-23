<template>
  <el-badge :value="Num" @click.native="clickBadge">
    <img :src="icon" width="16px" height="16px" alt="">
  </el-badge>
</template>

<script>
import { stringifyToArr, } from '@/filters';
import dialogWidth from '../../common/width/dialog';
import Attachment from '../attachment/attachment.vue';
export default {
  props: ['data'],
  data() {
    return {
      icon: require('@/assets/project/icons/file.svg'),
    };
  },
  computed: {
    Num() {
      const len = stringifyToArr(this.data).length;
      return len || '';
    },
  },
  methods: {
    clickBadge() {
      if (!this.Num) {
        return this.$message.warning('暂无数据!');
      }
      this.$dialog({
        title: '附件',
        position: 'center',
        width: dialogWidth.mini_px,
        component: () => <Attachment data={this.data} />,
      });
    },
  },
};
</script>

<style lang="scss">
.table {
  &-cell {
    &-attachment {
      > div {
        overflow: initial !important;
      }
    }
  }
}
</style>
