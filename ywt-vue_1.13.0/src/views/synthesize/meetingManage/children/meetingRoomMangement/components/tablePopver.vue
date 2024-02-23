
<!--  -->
<template>
  <el-popover placement="bottom" trigger="hover" title="" width="400">
    <div class="content-wrapper">
      <span v-for="(v,i) in times " :key="i">{{ v }}</span>
    </div>

    <span slot="reference">
      {{ values }}
    </span>

  </el-popover>
</template>

<script>
import { arrayToString, } from '@/utils/common';
export default {
  filters: {

  },
  components: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    times() {
      if (this.data.busMeetingRoomTimeDtos.length) {
        return this.data.busMeetingRoomTimeDtos.map(e => {
          return `${e.startTime}-${e.endTime}`;
        });
      }
      return '-';
    },
    values() {
      return arrayToString(this.times, '/');
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
.content {
  &-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > span {
      display: inline-block;
      width: 33.33%;
      font-size: 18px;
      font-weight: 400;
      color: #334266;
      margin: 0 0  16px  0;
    }
  }
}
</style>
