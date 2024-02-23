<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-22 13:34:58
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-13 14:48:50
 * @Description:科室二维码预览弹窗
-->
<template>
  <div>
    <qr-code id="tst" v-bind="$attrs" class="qr_code" @print="onPrint" />
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
    getDPI() {
      const arrDPI = [];
      if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      } else {
        const tmpNode = document.createElement('DIV');
        tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
      }
      return arrDPI;
    },
    mmToPx(value) {
      var inch = value / 25.4;
      var c_value = inch * this.getDPI()[0];
      return c_value;
    },
    onPrint(printConfig) {
      const [width] = printConfig.qrSize;
      const realWidth = this.mmToPx(width);
      const scale = realWidth / 301.6;
      const focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);
      Print({
        documentTitle: '科室二维码',
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
	  text-align: center;
    scale:${scale};
}

.pure .portrait  {
    transform:rotate(0deg);
    -ms-transform:rotate(0deg); /* IE 9 */
    -webkit-transform:rotate(0deg); /* Safari and Chrome */
    }
    .pure .landscape {
      transform:rotate(270deg);
      -ms-transform:rotate(270deg); /* IE 9 */
      -webkit-transform:rotate(270deg); /* Safari and Chrome */
    }
 .pure .card {
	 width: 301.6px;
	 background: #fff;
	 border-radius: 5.2px;
	 border: 1px solid #000;
	 margin-right: auto;
	 margin-left: auto;
	 padding: 31.2px 31.2px 20.8px 31.2px;
	 box-sizing: border-box;
}
 .pure .title {
	 font-size: 31.2px;
	 font-weight: 700;
	 color: #191919;
	 height: 41.6px;
	 margin-bottom: 5.2px;
}
 .pure .dept {
	 font-size: 18.2px;
	 height: 31.2px;
	 color: #666;
}
 .pure .wrapper {
	 width: 239.2px;
	 height: 296.4px;
	 border: 0.5px solid #e7e7e7;
	 border-radius: 2.6px;
	 margin-bottom: 10.4px;
}
 .pure .qr-code {
	 margin-top: 20.8px;
}
 .pure .qr-code img {
	 width: 208px;
	 height: 208px;
}
 .pure .dept2 {
	 font-size: 18.2px;
	 height: 57.2px;
	 color: #191919;
	 font-family: MicrosoftYaHeiUISNaNpxibold;
}
 .pure .flex-text {
	 display: flex;
	 justify-content: center;
	 align-items: center;
}
 .pure .custom-phrase {
	 height: 26px;
	 font-size: 15.6px;
}
      `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qr_code {
  width: fit-content;
}
</style>
