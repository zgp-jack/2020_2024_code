<template>
  <el-badge :value="Num" @click.native="clickBadge">
    <img :src="icon" width="16px" height="16px" alt="">
  </el-badge>
</template>

<script>
import drawerWidth from '../../common/width/drawer';
import ContractList from '@/views/project/impose/components/contractList.vue';
export default {
  props: ['data', 'keyName'],
  data() {
    return {
      icon: require('@/assets/project/icons/invoice.svg'),
    };
  },
  computed: {
    Num() {
      return this.data[this.keyName] || '';
    },
  },
  methods: {
    clickBadge() {
      this.$drawer({
        title: '会议',
        position: 'center',
        width: drawerWidth.larger_pr,
        component: () => <ContractList data={this.data} />,
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
