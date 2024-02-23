<template>
  <el-badge :value="Num" @click.native="clickBadge">
    <img :src="icon" width="16px" height="16px" alt="">
  </el-badge>
</template>

<script>
import drawerWidth from '../../common/width/drawer';
import MeetingList from '@/views/project/impose/components/meetingList.vue';
export default {
  props: ['data', 'keyName'],
  data() {
    return {
      icon: require('@/assets/project/icons/metting.svg'),
    };
  },
  computed: {
    Num() {
      return this.data[this.keyName];
    },
  },
  methods: {
    clickBadge() {
      this.$drawer({
        title: '会议',
        position: 'center',
        width: drawerWidth.larger_pr,
        component: () => <MeetingList data={this.data} />,
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
