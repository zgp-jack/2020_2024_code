<template>
  <div class="pure" :class="[detail.printDirection===0?'portrait':'landscape']">
    <div class="card" style="page-break-after: always;">
      <div class="title flex-text">微信扫码报修</div>
      <div v-show="detail.showAcceptDept" class="dept flex-text">- {{ detail.acceptDept }} -</div>
      <div class="wrapper">
        <div class="qr-code">
          <img :src="detail.imageUrl">

        </div>
        <div class="dept2 flex-text">{{ detail.deptName }}</div>
      </div>
      <div v-show="detail.showCustomPhrase" class="custom-phrase flex-text">{{ detail.customPhrase }}</div>
    </div>
  </div>
</template>

<script>
import {
  omitBy,
  isNil,
} from 'lodash';
export default {
  props: {
    config: {
      type: Object,
      default: function () {
        return {
          // 二维码图片
          imageUrl: null,
          // 科室名称
          deptName: null,
          // 是否显示接收科室
          showAcceptDept: 0,
          // 接收科室
          acceptDept: '信息科',
          // 是否显示自定义短语
          showCustomPhrase: 0,
          // 自定义短语
          customPhrase: null,
          // 打印尺寸
          qrSize: [],
          // 打印方向
          printDirection: 0,
        };
      },
    },
  },
  data() {
    return {
      detail: {
        imageUrl: require('@/assets/default_dept_qr_code.webp'),
        deptName: '',
        showAcceptDept: 1,
        acceptDept: '信息科',
        showCustomPhrase: 1,
        customPhrase: '',
        qrSize: [],
        printDirection: 0,
      },
    };
  },
  watch: {
    config: {
      handler(nv, ov) {
        this.detail = Object.assign({}, this.detail, omitBy(nv, isNil));
      },
      deep: true,
    },
  },
  mounted() {
    this.detail = Object.assign({}, this.detail, omitBy(this.config, isNil));
  },
};
</script>

<style lang="scss" scoped>
// 打印倍率
$multiplier:1;
.pure {
   text-align: center;
   &.portrait  {
    transform:rotate(0deg);
    -ms-transform:rotate(0deg); /* IE 9 */
    -webkit-transform:rotate(0deg); /* Safari and Chrome */
    }
    &.landscape {
      transform:rotate(270deg);
      -ms-transform:rotate(270deg); /* IE 9 */
      -webkit-transform:rotate(270deg); /* Safari and Chrome */
    }

.card {
    width: 232px * $multiplier ;
    background: #ffffff;
    border-radius: 4px*$multiplier;
    border: 1px solid #000000;
    margin-right: auto;
    margin-left: auto;
    padding: 24px*$multiplier 24px*$multiplier 16px*$multiplier 24px*$multiplier;
    box-sizing: border-box;
  }
  .title {
    font-size: 24px  * $multiplier;
    font-weight: 700;
    color: #191919;
    height: 32px  * $multiplier;
    margin-bottom: 4px  * $multiplier;
  }
   .dept {
    font-size: 14px*$multiplier;
    height: 24px*$multiplier;
    color: #666666;
  }
  .wrapper {
    width: 184px  * $multiplier;
    height: 228px  * $multiplier;
    border: 0.5px solid #E7E7E7;
    border-radius: 2px*$multiplier;
    margin-bottom: 8px  * $multiplier;
  }
  .qr-code {
    margin-top: 16px  * $multiplier;
    img {
      width: 160px * $multiplier;
      height: 160px * $multiplier;
    }
  }

  .dept2 {
    font-size: 14px  * $multiplier;
    height: 44px  * $multiplier;
    color: #191919;
    font-family: MicrosoftYaHeiUISNaNpxibold;
  }
  .flex-text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
   .custom-phrase {
    height: 20px  * $multiplier;
    font-size: 12px  * $multiplier;
  }
  }
</style>
