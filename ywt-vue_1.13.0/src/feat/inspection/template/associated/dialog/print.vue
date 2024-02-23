<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-24 10:04:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:57:00
 * @Description: 巡检单元打印内容显示
-->
<template>
  <div>
    <qr-code id="tst" v-bind="$attrs" @print="onPrint" />
  </div>
</template>

<script>
import QrCode from '../component/qrcode.vue';
import Print from 'print-js';
export default {
  components: {
    QrCode,
  },

  methods: {

    onPrint() {
      const focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);
      Print({
        documentTitle: '巡检单元二维码',
        printable: 'tst',
        type: 'html',
        scanStyles: false,
        onPrintDialogClose: () => {
          clearInterval(focuser);
          this.$emit('done');
        },
        onError: () => {
          clearInterval(focuser);
          this.$emit('done');
        },
        style: `
  .pure {
  font-size: 14px;
  text-align: center;
  color: #000000;
}
.pure .card {
  width: 160px;
  height: 210px;
  border: 0.5px solid #000000;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: content-box;
  padding: 10px;
}
.pure .name {
  font-size: 20px;
  padding-top: 5px;
  padding-bottom: 10px;
  font-weight: 400;
}
.pure .parent-name {
  font-size: 14px;
  padding-bottom: 5px;
}
.pure .qr-code {
  width: 140px;
  height: 140px;
  border: 1px solid #000000;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  margin-right: auto;
  margin-left: auto;
}
 .break-page {
    page-break-after: always;
  }
.pure .qr-code img {
  width: 100px;
  height: 100px;
}

        `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
