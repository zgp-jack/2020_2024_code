<template>
  <div class="page-system-form-config">
    <div class="left">
      <div class="menu-box">
        <div
          v-for="(item, index) in configList"
          :key="item.menuId"
          class="menu-item"
          :class="{active: currentConfigIndex === index}"
          @click="onChangeConfig(index)"
        >
          {{ item.menuName }}
        </div>
      </div>
    </div>
    <div class="right">
      <p class="title">{{ currentConfig.menuName }}</p>
      <el-radio-group v-model="currentFormId" size="medium">
        <el-radio-button v-for="item in formList" :key="item.id" :label="item.id">{{ item.formName }}</el-radio-button>
      </el-radio-group>
      <div class="content-box">
        <div class="basic-info">
          <form-box title="基础信息">
            <el-form label-width="100px">
              <el-form-item v-for="item in formConfigList" :key="item.id" :label="item.columnComment">
                <el-checkbox v-model="item.isShow" label="展示" />
                <el-checkbox v-model="item.isRequired" label="必填" />
              </el-form-item>
            </el-form>
          </form-box>
          <div class="btn-box">
            <pure-button label="应用" :disabled="isButtonDisabled" @click="onUpdateFormConfigList" />
            <pure-button label="取消" :disabled="isButtonDisabled" type="patch" @click="onCancel" />
          </div>
        </div>
        <div class="form-preview-box">
          <form-box title="表单预览">
            <el-form label-width="100px" label-suffix=":" class="preview-form">
              <el-form-item v-for="item in previewFormConfigList" :key="item.id" :label="item.columnComment" :class="{'is-required': item.isRequired}">
                <el-input v-if="item.htmlType === 'input'" :placeholder="`请输入${item.columnComment}`" />
                <el-input v-if="item.htmlType === 'textarea'" :placeholder="`请输入${item.columnComment}`" />
                <el-select v-if="item.htmlType === 'select'" :placeholder="`请选择${item.columnComment}`" value="">
                  <el-option label="请选择" value="" disabled />
                </el-select>
                <el-checkbox-group v-if="item.htmlType === 'checkbox'" value="" disabled>
                  <el-checkbox label="1" />
                </el-checkbox-group>
                <el-radio-group v-if="item.htmlType === 'radio'" value="" disabled>
                  <el-radio label="1" />
                </el-radio-group>
                <el-date-picker v-if="item.htmlType === 'datetime'" :placeholder="`请选择${item.columnComment}`" />
                <el-upload v-if="item.htmlType === 'image'" action="" class="upload-box">
                  <i class="el-icon-upload2" />
                  <p class="upload-tips">点击上传</p>
                </el-upload>
                <el-upload v-if="item.htmlType === 'upload'" action="">
                  <pure-button label="点击上传" type="major" />
                </el-upload>
                <div v-if="item.htmlType === 'editor'" :id="`richTextContainer${item.id}`" />
              </el-form-item>
            </el-form>
          </form-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMenuListData, getFormListData, getFormConfigListData, updateFormConfigListData, } from './api';
import E from 'wangeditor';
import { cloneDeep, isEqual, } from 'lodash-es';

export default {
  data() {
    return {
      configList: [],
      currentConfigIndex: 0,
      formList: [],
      currentFormId: '',
      formConfigList: [],
      originalFormData: null,
    };
  },
  computed: {
    currentConfig() {
      return this.configList[this.currentConfigIndex] ?? {};
    },
    currentForm() {
      const data = this.formList.find(item => item.id === this.currentFormId);
      return data ?? {};
    },
    previewFormConfigList() {
      return this.formConfigList.filter(item => item.isShow);
    },
    isButtonDisabled() {
      return !this.originalFormData || isEqual(this.originalFormData, this.formConfigList);
    },
  },
  watch: {
    currentConfig() {
      this.getFormList();
    },
    currentForm() {
      this.getFormConfigList();
    },
  },
  created() {
    this.getMenuList();
  },
  methods: {
    initEditor() {
      this.formConfigList.forEach(item => {
        if (item.htmlType === 'editor') {
          const editor = new E(`#richTextContainer${item.id}`);
          editor.create();
        }
      });
    },
    getMenuList() {
      const loading = this.showLoading();
      getMenuListData().then(result => {
        if (result.data) {
          this.configList = result.data;
        }
      }).finally(() => {
        loading.close();
      });
    },
    onChangeConfig(index) {
      this.currentConfigIndex = index;
    },
    getFormList() {
      const loading = this.showLoading();
      const params = {
        menuId: this.currentConfig.menuId,
      };
      getFormListData(params).then(result => {
        if (result.data) {
          this.formList = result.data;
          this.currentFormId = result.data[0].id;
        }
      }).finally(() => {
        loading.close();
      });
    },
    getFormConfigList() {
      const loading = this.showLoading();
      const params = {
        formId: this.currentFormId,
      };
      getFormConfigListData(params).then(result => {
        if (result.data) {
          this.originalFormData = result.data;
          this.formConfigList = cloneDeep(result.data);
          this.$nextTick(() => {
            this.initEditor();
          });
        }
      }).finally(() => {
        loading.close();
      });
    },
    onUpdateFormConfigList() {
      const loading = this.showLoading();
      updateFormConfigListData(this.formConfigList).then(() => {
        this.getFormConfigList();
        this.$message.success('操作成功');
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.formConfigList = cloneDeep(this.originalFormData);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-system-form-config {
  height: 100%;
  background: #fff;
  display: flex;
  .left {
    flex: 0 0 150px;
    border-right: 1px solid #eeeeee;
    .menu-box {
      display: flex;
      flex-direction: column;
      .menu-item {
        height: 40px;
        line-height: 40px;
        padding: 0 16px;
        border-right: 2px solid transparent;
        font-size: 14px;
        text-align: right;
        cursor: pointer;
        &.active {
          color: #006666;
          border-color: #006666;
        }
      }
    }
  }
  .right {
    flex: auto;
    overflow: auto;
    padding: 14px 16px;
    .title {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
    .content-box {
      display: flex;
      margin-top: 16px;
      .basic-info {
        flex: 1 1 50%;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .form-preview-box {
        flex: 1 1 50%;
        margin-left: 20px;
      }
      .btn-box {
        margin-top: 20px;
      }
      .content-item {
        border-radius: 4px 4px 0px 0px;
        border: 1px solid #dde9e8;
        &-header {
          display: flex;
          align-items: center;
          height: 36px;
          padding: 0 16px;
          background: #f0f7f7;
          font-size: 16px;
          color: #757e7e;
          &::before {
            display: inline-block;
            content: '';
            width: 6px;
            height: 20px;
            margin-right: 6px;
            background: #006666;
          }
        }
        &-body {
          padding: 16px;
        }
      }
    }
  }
}
.upload-box {
  width: 96px;
  height: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  border: 2px dashed #e7e7e7;
  border-radius: 2px;
  cursor: pointer;
  .upload-tips {
    margin-top: 8px;
    margin-bottom: 0;
    font-size: 12px;
    color: #999999;
  }
}
</style>
