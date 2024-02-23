<template>
  <div class="comp-global-department-code">
    <div class="left">
      <p class="title">资产码</p>
      <CompTips content="配置在“资产-资产管理-资产登记”中生成的可打印的资产码样式。资产码可用于报修，巡检。" />
      <CompModuleHeader title="基础配置" />
      <el-form label-width="120px" class="form-box">
        <el-form-item label="样式" class="is-required">
          <el-select v-model="formData.styleType">
            <el-option label="请选择" :value="0" disabled />
            <el-option label="样式1" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="打印尺寸">
          <el-select v-model="formData.printSize">
            <el-option label="请选择" :value="0" disabled />
            <el-option label="40mm*70mm" :value="1" />
            <el-option label="80mm*128mm" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="打印方向">
          <el-radio v-model="formData.printDirection" :label="1">纵向</el-radio>
          <el-radio v-model="formData.printDirection" :label="2">横向</el-radio>
        </el-form-item>
      </el-form>
      <CompModuleHeader title="样式配置" />
      <el-form label-width="120px" class="form-box">
        <el-form-item label="底色">
          <div class="color-select-box">
            <el-radio v-model="formData.selectBottomColor" :label="1">白色</el-radio>
            <el-radio v-model="formData.selectBottomColor" :label="0">自定义</el-radio>
            <el-color-picker v-model="customBottomColor" />
          </div>
        </el-form-item>
        <el-form-item label="底色区域">
          <div>
            <el-radio v-model="formData.bottomColorRegion" :label="1">上</el-radio>
            <el-radio v-model="formData.bottomColorRegion" :label="2">下</el-radio>
            <el-radio v-model="formData.bottomColorRegion" :label="0">全部</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="边框">
          <div class="color-select-box">
            <el-radio v-model="formData.selectFrameColor" :label="1">无边框</el-radio>
            <el-radio v-model="formData.selectFrameColor" :label="0">自定义</el-radio>
            <el-color-picker v-model="customFrameColor" />
          </div>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <pure-button label="应用" :disabled="isButtonDisabled" @click="updateConfig" />
        <pure-button label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
      </div>
    </div>
    <div class="right">
      <p class="title">样式预览</p>
      <div class="content-box">
        <div class="preview-box" :style="{...previewFrameStyle, ...allPreviewBgStyle}">
          <div class="device-info-box" :style="topPreviewBgStyle">
            <p class="device-name">联想台式电脑</p>
            <p class="device-type">型号：HUAWEI</p>
          </div>
          <div class="bottom" :style="bottomPreviewBgStyle">
            <div class="address-info-box">
              <p class="address-info-item">所属院区：华西二院（锦江院区）</p>
              <p class="address-info-item">使用科室：神经外科</p>
              <p class="address-info-item">资产类型：台式电脑</p>
              <p class="address-info-item">所在位置：门诊大楼1楼102号</p>
            </div>
            <img src="../images/qrcode.png" alt="qrcode" class="qrcode">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import { getAssetCodeConfigData, updateAssetCodeConfigData, } from '../api';
import { cloneDeep, isEqual, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
    CompTips,
  },
  data() {
    return {
      formData: {},
      originalFormData: null,
      customBottomColor: '',
      customFrameColor: '',
    };
  },
  computed: {
    isButtonDisabled() {
      const { selectBottomColor, bottomColor, selectFrameColor, frameColor, } = this.formData;
      return !this.originalFormData ||
        (isEqual(this.originalFormData, this.formData) &&
          (selectBottomColor !== 0 || this.customBottomColor === bottomColor) &&
          (selectFrameColor !== 0 || this.customFrameColor === frameColor));
    },
    previewBgStyle() {
      const bottomColorArr = [
        this.customBottomColor,
        '#fff',
      ];
      const bgColor = bottomColorArr[this.formData.selectBottomColor];
      return {
        backgroundColor: bgColor,
      };
    },
    allPreviewBgStyle() {
      if (this.formData.bottomColorRegion === 0) {
        return this.previewBgStyle;
      }
      return null;
    },
    topPreviewBgStyle() {
      if (this.formData.bottomColorRegion === 1) {
        return this.previewBgStyle;
      }
      return null;
    },
    bottomPreviewBgStyle() {
      if (this.formData.bottomColorRegion === 2) {
        return this.previewBgStyle;
      }
      return null;
    },
    previewFrameStyle() {
      const frameColorArr = [
        this.customFrameColor,
        null,
      ];
      const frameColor = frameColorArr[this.formData.selectFrameColor];
      return {
        borderColor: frameColor || 'transparent',
      };
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      const loading = this.showLoading();
      getAssetCodeConfigData().then((result) => {
        if (result) {
          this.originalFormData = result;
          const { selectBottomColor, bottomColor, selectFrameColor, frameColor, } = result;
          if (selectBottomColor === 0) {
            this.customBottomColor = bottomColor;
          }
          if (selectFrameColor === 0) {
            this.customFrameColor = frameColor;
          }
          this.formData = cloneDeep(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const { selectBottomColor, selectFrameColor, ...params } = this.formData;
      if (selectBottomColor === 0 && !this.customBottomColor) {
        this.$message.error('请选择自定义底色');
        return;
      }
      if (selectFrameColor === 0 && !this.customFrameColor) {
        this.$message.error('请选择自定义边框颜色');
        return;
      }
      const bottomColorArr = [
        this.customBottomColor,
        '#fff',
        '#000',
      ];
      const frameColorArr = [
        this.customFrameColor,
        null,
      ];
      const loading = this.showLoading();
      updateAssetCodeConfigData({
        ...params,
        selectBottomColor,
        bottomColor: bottomColorArr[selectBottomColor],
        selectFrameColor,
        frameColor: frameColorArr[selectFrameColor],
      }).then(() => {
        this.$message.success('操作成功');
        this.getConfig();
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.formData = cloneDeep(this.originalFormData);
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-global-department-code {
  display: flex;
  padding: 16px;
  background: #fff;
  .left {
    flex: auto;
    .title {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }
    .form-box {
      max-width: 500px;
      .color-select-box {
        display: flex;
        align-items: center;
      }
    }
  }
  .right {
    flex: 0 0 500px;
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    padding: 0 16px;
    border-left: 1px solid #eee;
    .title {
      flex: none;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
    }
    .content-box {
      flex: auto;
      overflow: auto;
      padding: 16px;
      background: #F3F3F3;
    }
    .preview-box {
      width: 400px;
      margin: 0 auto;
      background: #fff;
      font-size: 12px;
      color: #191919;
      border: 1px solid #eee;
      .device-info-box {
        padding: 16px;
        font-size: 14px;
        color: #fff;
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
      .bottom {
        display: flex;
        justify-content: space-between;
        line-height: 20px;
        padding: 16px;
        align-items: center;
        .address-info-box {
          flex: auto;
          .address-info-item {
            margin: 0;
            & + .address-info-item {
              margin-top: 10px;
            }
          }
        }
        .qrcode {
          flex: none;
          width: 104px;
          height: 104px;
          margin-left: 20px;
        }
      }
      .qrcode-box {
        padding: 16px;
        border: 1px solid #E7E7E7;
        .qrcode {
          width: 180px;
          height: 180px;
        }
        .receiving-department {
          margin-top: 10px;
          margin-bottom: 0;
          font-size: 14px;
          color: #191919;
        }
      }
      .custom-phrase {
        margin-top: 10px;
        font-size: 12px;
        color: #191919;
      }
    }
  }
}
</style>
