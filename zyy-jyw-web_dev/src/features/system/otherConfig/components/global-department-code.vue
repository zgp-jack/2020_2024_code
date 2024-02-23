<template>
  <div class="comp-global-department-code">
    <div class="left">
      <p class="title">科室码</p>
      <CompTips content="配置在“院区科室管理”中生成的可打印的科室码样式。科室码可用于报修。" style="margin-bottom: 8px" />
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
            <el-radio v-model="formData.selectBottomColor" :label="2">黑色</el-radio>
            <el-radio v-model="formData.selectBottomColor" :label="0">自定义</el-radio>
            <el-color-picker v-model="customBottomColor" />
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
      <CompModuleHeader title="内容配置" />
      <el-form label-width="120px" class="form-box">
        <el-form-item label="展示内容">
          <div class="color-select-box">
            <el-checkbox v-model="formData.showRepairDepart">报修科室</el-checkbox>
            <el-checkbox v-model="formData.showReceiveDepart">接收科室</el-checkbox>
            <el-checkbox v-model="formData.showCustomPhrase">自定义短语</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="接收科室">
          <el-input v-model="formData.receiveDepart" placeholder="请输入" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="自定义短语">
          <el-input v-model="formData.customPhrase" placeholder="请输入" maxlength="25" show-word-limit />
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <pure-button v-auth="'departCodeConfig:edit'" label="应用" :disabled="isButtonDisabled" @click="updateConfig" />
        <pure-button v-auth="'departCodeConfig:edit'" label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
      </div>
    </div>
    <div class="right">
      <p class="title">样式预览</p>
      <div class="content-box">
        <div class="preview-box" :style="previewBgStyle">
          <p class="preview-title">微信扫码报修</p>
          <p v-if="formData.showReceiveDepart" class="receiving-department">- {{ formData.receiveDepart }} -</p>
          <div class="qrcode-box" :style="previewFrameStyle">
            <img src="../images/qrcode.png" alt="qrcode" class="qrcode">
            <p v-if="formData.showRepairDepart" class="department-name">神经外科</p>
          </div>
          <div v-if="formData.showCustomPhrase" class="custom-phrase">{{ formData.customPhrase }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import { getDepartmentCodeConfigData, updateDepartmentCodeConfigData, } from '../api';
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
        '#000',
      ];
      const bgColor = bottomColorArr[this.formData.selectBottomColor];
      return {
        backgroundColor: bgColor,
      };
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
      getDepartmentCodeConfigData().then((result) => {
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
      updateDepartmentCodeConfigData({
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
      width: 232px;
      margin: 0 auto;
      padding: 16px;
      text-align: center;
      background: #fff;
      .preview-title {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 24px;
        color: #191919;
        font-weight: 700;
      }
      .receiving-department {
        font-size: 14px;
        color: #666666;
      }
      .qrcode-box {
        padding: 16px;
        border: 1px solid #E7E7E7;
        .qrcode {
          width: 180px;
          height: 180px;
        }
        .department-name {
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
