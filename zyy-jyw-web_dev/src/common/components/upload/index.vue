<template>
  <div>
    <template v-if="listType !== 'picture-card'">
      <pure-button v-if="!isDisabled" class="upload-button" icon="upload" @click="upload">
        上传附件
      </pure-button>
      <div class="el-upload__tip">
        <i class="el-icon-warning-outline" />
        <span class="el_upload_accept_span">支持：{{ accept }} ，单个文件不能超过100M</span>
      </div>
      <ul class="file-ul">
        <li v-for="(item,index) in perviewData" :key="item.uid" class="file-li">
          <svg-icon :icon-class="iconMap[item.suffix]" />
          <span class="file-name" @click="handlePreview(item)">
            {{ item.name }}
          </span>
          <i v-if="!isDisabled" class="el-icon-close file-icon-del" @click="handleRemove(index)" />
          <i
            class="el-icon-download file-icon-download"
            @click.stop="handleDownload(item)"
          />
        </li>
      </ul>
    </template>
    <template v-else>
      <ul class="el-upload-list el-upload-list--picture-card">
        <li
          v-for="(item, index) in perviewData"
          :key="item.uid"
          class="el-upload-list__item is-success"
        >
          <div class="h-100">
            <img
              v-if="item.perviewValue"
              :src="item.perviewValue"
              class="el-upload-list__item-thumbnail"
              alt=""
            >
            <div v-else class="suffix-wrapper">
              <p>{{ item.name }}</p>
            </div>
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePreview(item)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span class="el-upload-list__item-preview">
                <i
                  class="el-icon-download"
                  @click.stop="handleDownload(item)"
                />
              </span>
              <span
                v-if="!isDisabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(index)"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </li>
      </ul>
      <div
        v-if="!isDisabled"
        tabindex="0"
        class="el-upload el-upload--picture-card"
        @click="upload"
      >
        <i class="el-icon-plus" />
      </div>
    </template>

    <input
      ref="input"
      class="input"
      type="file"
      name="file"
      :multiple="multiple"
      :accept="accept"
      @change="handleInputChange"
    >
  </div>
</template>

<script>
import { getFile, uploadFile, } from './api';
import { getSuffix, isAcceptFile, } from '@/common/utils/file';
import { FilePreview, } from '@/common/utils/filePreview';

import {
  downloadFile,
} from '@/common/utils/download';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    listType: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    multiple: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png,.gif,.rar,.zip,.doc,.docx,.xls,.xlsx,.pdf,.txt,.pptx',
    },
  },
  data() {
    return {
      // perviewData: [],
      fileData: [],
      isUpload: false,
      iconMap: {
        jpg: 'type-jpg',
        jpeg: 'type-jpg',
        png: 'type-png',
        gif: 'type-gif',
        rar: 'type-rar',
        zip: 'type-zip',
        doc: 'type-doc',
        docx: 'type-doc',
        xls: 'type-xls',
        xlsx: 'type-xls',
        pdf: 'type-pdf',
        txt: 'type-txt',
        pptx: 'type-ppt',
      },

    };
  },
  computed: {

    isDisabled() {
      return this.disabled || (this.$parent?.elForm || {}).disabled;
    },
    perviewData() {
      return this.fileData.map((item) => {
        return {
          ...item,
          suffix: getSuffix(item.name),
        };
      });
    },

  },
  watch: {
    value: {
      handler(val) {
        this.fileData = val || [];
      },
      deep: true,
    },
  },
  mounted() {

  },

  methods: {
    async handleDownload(item) {
      try {
        const st = await getFile(item.url);
        downloadFile(st, item.name);
      } catch (err) {
        this.$notify.error(err);
      }
    },
    handlePreview(item) {
      FilePreview(item.url, item.name);
    },
    handleRemove(index) {
      this.fileData.splice(index, 1);
      this.$emit('input', this.fileData);
      this.$emit('change', this.fileData);
    },
    async handleInputChange(val) {
      const { files, } = val.target;
      // 判断是否没有选择文件,那么不执行接口请求
      if (files.length === 0) {
        return;
      }
      const fileList = Array.from(files);
      let isAccept = true;
      fileList.forEach((file) => {
        const flag = isAcceptFile(this.accept, file.name);
        if (!flag) {
          isAccept = false;
        }
      });
      if (!isAccept) {
        this.$message.error('上传文件类型不正确');
        return false;
      }
      this.isUpload = true;

      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        const res = await uploadFile(files);
        console.log(res, 'res');

        if (res && res.length) {
          this.fileData = [
            ...this.fileData,
            ...res,
          ];
          this.$emit('input', this.fileData);
          this.$emit('change', this.fileData);
        }
      } catch (err) {
        this.$notify.error({
          title: '文件上传',
          message: err,
        });
      } finally {
        //
        loading.close();
      }
    },
    upload() {
      // 重置value事件
      this.$refs.input.value = '';
      this.$refs.input.click();
    },
  },
};
</script>

<style lang="scss" scoped>
 @import "~@/common/styles/theme/handle.scss";
.el-upload__tip {
  font-size: 14px;
  padding: 6px;
  line-height: 22px;
  @include font_color_imp('color-special');
  @include background_color_imp('color-assist-3');
}
.input {
  display: none;
}
.h-100 {
  height: 100%;
}
.suffix {
  &-wrapper {
    display: flex;
    background-color: #409eff;
    color: #fff;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 600;
    padding: 8px;
    line-height: 1.5;
    @extend .h-100;
    p {
      flex: 1;
      margin: 0;
      padding: 0;
    }
  }
}
.upload-button {
  margin-bottom: 8px;
}
.file {
  &-icon {
    color: #606266;
    &-download {
      &:hover {
        color: #409eff;
        cursor: pointer;
        background-color: #f5f7fa;
      }
    }
    &-del {
      &:hover {
        color: #f56c6c;
        background-color: rgb(253, 226, 226);
        cursor: pointer;
      }
    }
  }
  &-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #606266;
    margin-left: 8px;
    padding-right: 8px;
    &:hover {
      color: #409eff;
      cursor: pointer;
      background-color: #f5f7fa;
    }
  }
  &-ul {
    list-style: none;
    margin: 0;
  }
  &-li {
    display: flex;
    align-items: center;
    transition: color 0.3s;
  }
}
.el_upload_accept_span{
  word-wrap: break-word;
  word-break: break-all;
}
</style>
