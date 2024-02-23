<template>
  <el-row style="width: 100%; height: 100%; padding-top: 16px">
    <el-col align="middle" :span="24">{{ curTime }}</el-col>
  </el-row>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      intervalHandle: null,
      curTime: '',
    };
  },
  mounted() {
    this.updateCurTime();
    this.intervalHandle = setInterval(() => {
      this.updateCurTime();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.intervalHandle);
  },
  methods: {
    updateCurTime() {
      const dow = moment().isoWeekday();
      let dowZh = '星期';
      if (dow === 1) {
        dowZh += '一';
      } else if (dow === 2) {
        dowZh += '二';
      } else if (dow === 3) {
        dowZh += '三';
      } else if (dow === 4) {
        dowZh += '四';
      } else if (dow === 5) {
        dowZh += '五';
      } else if (dow === 6) {
        dowZh += '六';
      } else if (dow === 7) {
        dowZh += '日';
      }
      this.curTime = moment().format('YYYY年MM月DD日') + ' ' + dowZh;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card ::v-deep .el-card__body {
  padding: 0px;
  font-size: 14px;
}
.el-row ::v-deep .el-col {
  padding: 5px;
}
</style>
