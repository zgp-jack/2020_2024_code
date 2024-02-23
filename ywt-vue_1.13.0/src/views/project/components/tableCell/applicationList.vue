<!--
    变更申请列表
  -->
<template>
  <el-badge :value="Num" @click.native="clickBadge">
    <img :src="icon" width="16px" height="16px" alt="">
  </el-badge>
</template>

<script>
import ApplicationList from '@/views/project/impose/components/application.vue';
import drawerWidth from '../../common/width/drawer';
export default {
  props: ['data'],
  data() {
    return {
      icon: require('@/assets/project/icons/apply.svg'),
    };
  },
  computed: {

    Num() {
      if (this.data.applyAudit === 1) {
        return 1;
      }
      return '';
    },
  },
  methods: {
    onDone() {},
    clickBadge() {
      this.$drawer({
        with: drawerWidth.larger_pr,
        component: () => <ApplicationList data={this.data} onDone={this.onDone}/>,
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
