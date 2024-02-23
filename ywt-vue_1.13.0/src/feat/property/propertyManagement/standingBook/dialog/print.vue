<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-21 10:08:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:58:18
 * @Description:打印数据展示
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
        documentTitle: '资产二维码',
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
  font-size: 10px;
  line-height: 17px;
  text-align: center;
  box-sizing: border-box;
}
.pure .card {
  width: 230px;
  height: 112px;
  border: 0.5px solid #000000;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.pure .hospital {
  font-size: 14px;
  font-weight: bold;
  padding: 3.5px 0;
}
.pure .label {
  width: 49px;
  vertical-align: top;
  display: inline-block;
}
.pure .label div {
  height: 17px;
  border-top: 0.5px solid #000000;
  border-right: 0.5px solid #000000;
  box-sizing: border-box;
}
.pure .value {
  width: 106px;
  vertical-align: top;
  display: inline-block;
}
.pure .value div {
  height: 17px;
  border-top: 0.5px solid #000000;
  border-right: 0.5px solid #000000;
  box-sizing: border-box;
}
.pure .value-long {
  width: 178px;
  display: inline-block;
  border-top: 0.5px solid #000000;
  box-sizing: border-box;
}
.pure .qr-code {
  width: 70.5px;
  display: inline-grid;
  padding: 3.5px;
  border-top: 0.5px solid #000000;
  box-sizing: border-box;
  justify-items: center;
}
.pure .qr-code img {
  width: 60px;
  height: 60px;
}


        `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
