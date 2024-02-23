<template>
  <!-- <qr-code id="tst" v-bind="$attrs" @print="onPrint" /> -->
  <dialog-template>
    <template #title> 科室二维码打印 </template>
    <el-skeleton animated :loading="loading" :rows="3">
      <template slot="template" />
      <template>
        <div id="code" ref="codeArea" class="bg">
          <!-- <el-scrollbar> -->
          <div
            v-for="(item, index) in printList"
            :key="index"
            :style="size"
            class="printCard"
          >
            <div class="head">
              <p class="device-name">{{ item.deptName }}</p>
              <p class="device-type">{{ item.deptPlace }}</p>
            </div>
            <div class="foot">
              <!-- <ul class="label">
                  <li>联系人:{{ item.leader }}</li>
                  <li>电话:{{ item.phone }}</li>
                  <li>email:{{ item.email }}</li>
                </ul> -->
              <img class="qrCode" :src="item.code">
            </div>
          </div>
          <!-- </el-scrollbar> -->
        </div>
      </template>
    </el-skeleton>
    <template #footer>
      <pure-button @click="onPrint"> 打印 </pure-button>
      <pure-button @click="onCancel"> 取消 </pure-button>
    </template>
  </dialog-template>
</template>

<script>
// import QrCode from '../components/qrcode.vue';
import DialogTemplate from '@/common/components/dialog/template.vue';
import Print from 'print-js';
import SystemDepartmentManagementApi from '../api';
import { getDepartmentCodeConfigData, } from '@/features/system/otherConfig/api';
import { mmToPx, } from '@/common/utils/print.js';
export default {
  components: {
    DialogTemplate,
  },
  props: {
    ids: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      printConfig: {
        bottomColor: '',
        bottomColorRegion: 1,
        frameColor: null,
        printDirection: 1,
        printSize: 1,
        selectBottomColor: 1,
        selectFrameColor: 1,
        showAreaLogo: false,
        showAssetModel: false,
        styleType: 1,
      },
      printSize: {
        1: {
          width: 140,
          height: 80,
          unit: 'mm',
        },
        2: {
          width: 240,
          height: 160,
          unit: 'mm',
        },
      },
    };
  },
  computed: {
    bottomPreviewBgStyle() {
      if (this.printConfig.bottomColorRegion === 2) {
        return this.previewBgStyle;
      }
      return null;
    },
    previewBgStyle() {
      const bottomColorArr = [
        this.customBottomColor,
        '#fff',
      ];
      const bgColor = bottomColorArr[this.printConfig.selectBottomColor];
      return {
        backgroundColor: bgColor,
      };
    },
    topPreviewBgStyle() {
      if (this.printConfig.bottomColorRegion === 1) {
        return this.previewBgStyle;
      }
      return null;
    },
    allPreviewBgStyle() {
      if (this.printConfig.bottomColorRegion === 0) {
        return this.previewBgStyle;
      }
      return null;
    },
    previewFrameStyle() {
      const frameColorArr = [
        this.customFrameColor,
        null,
      ];
      const frameColor = frameColorArr[this.printConfig.selectFrameColor];
      return {
        borderColor: frameColor || 'transparent',
      };
    },
    printList() {
      return this.list.map((item) => {
        return {
          ...item,
        };
      });
    },
    size() {
      const the = this;
      return {
        width: mmToPx(the.printSize[the.printConfig.printSize].width) + 'px',
        height: mmToPx(the.printSize[the.printConfig.printSize].height) + 'px',
      };
    },
  },
  mounted() {
    this.getAssetPrintImg();
    this.getConfig();
  },
  methods: {
    // 获取打印资产配置
    async getConfig() {
      const res = await getDepartmentCodeConfigData();
      this.printConfig = res;
    },
    // 获取打印图片
    async getAssetPrintImg() {
      try {
        this.loading = true;
        const res = await SystemDepartmentManagementApi.assetPrint(this.ids);
        this.list = res;
        console.log(res, 'res');
      } catch (err) {
        this.$notify.error(err);
      } finally {
        this.loading = false;
      }
    },

    onPrint() {
      const the = this;
      const focuser = setInterval(
        () => window.dispatchEvent(new Event('focus')),
        500
      );
      Print({
        documentTitle: '科室二维码',
        printable: this.$refs.codeArea,
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
        // 纵向 横向
        style: `
            @media print {
            @page {
              size:  ${
  the.printConfig.printDirection === 1 ? 'portrait' : 'landscape'
} ;
            }
            }
   .printCard {
    background:${the.printConfig.bottomColor};
    border:1px solid #000;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4px;
    width:${the.size.width};
    height:${the.size.height}
  }

  .printCard + .printCard {
    margin-top: 16px;
    margin-bottom: 16px;
  }


  .qrCode {
    width: 200px;
    height: 200px;
  }
  .label {
    list-style: none;
    font-size: 18px;
    margin: 0;
    padding: 0;
  }
  li {
    margin-top: 10px;
  }
          `,
      });
    },
    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

  <style lang="scss" scoped>
  .printCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    width: 350px;
    height: 300px;
    .device-name {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: 700;
      }
  }
  .bg {
    background: #fff;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    height: 400px;
  }
  .print {
    & + & {
      margin-left: 16px;
      margin-bottom: 16px;
    }
    background: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    padding: 4px;
    .head {
      flex: 1;
      .device-name {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: 700;
      }
      .device-type {
        margin: 0;
      }
    }
    .foot {
      flex: 1;
      display: flex;
      flex-direction: row;
          justify-content: space-between;

      .label {
        list-style: none;
        font-size: 18px;
        margin: 0;
        padding: 0;
      }
      .qrCode {
        width: 100px;
        height: 100px;
      }
    }
  }

  li {
    margin-top: 10px;
  }
  //  .content-box {
  //       // flex: auto;
  //       // overflow: auto;
  //       padding: 16px;
  //       // background: #F3F3F3;
  //     }
  //       .preview-box {
  //       // width: 400px;
  //       margin: 0 auto;
  //       background: #fff;
  //       font-size: 12px;
  //       color: #191919;
  //       border: 1px solid #eee;
  //       .device-info-box {
  //         padding: 16px;
  //         font-size: 14px;
  //         color: #fff;
  //         .device-name {
  //           margin-top: 0;
  //           margin-bottom: 10px;
  //           font-size: 24px;
  //           font-weight: 700;
  //         }
  //         .device-type {
  //           margin: 0;
  //         }
  //       }
  //       .bottom {
  //         display: flex;
  //         justify-content: space-between;
  //         line-height: 20px;
  //         padding: 16px;
  //         align-items: center;
  //         .address-info-box {
  //           flex: auto;
  //           .address-info-item {
  //             margin: 0;
  //             & + .address-info-item {
  //               margin-top: 10px;
  //             }
  //           }
  //         }
  //         .qrcode {
  //           flex: none;
  //           width: 104px;
  //           height: 104px;
  //           margin-left: 20px;
  //         }
  //       }
  //       .qrcode-box {
  //         padding: 16px;
  //         border: 1px solid #E7E7E7;
  //         .qrcode {
  //           width: 180px;
  //           height: 180px;
  //         }
  //         .receiving-department {
  //           margin-top: 10px;
  //           margin-bottom: 0;
  //           font-size: 14px;
  //           color: #191919;
  //         }
  //       }
  //       .custom-phrase {
  //         margin-top: 10px;
  //         font-size: 12px;
  //         color: #191919;
  //       }
  //     }
  </style>
