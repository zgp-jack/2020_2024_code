<template>
  <div>
    <template v-if="listType !== 'picture-card'">
      <el-button v-if="!isDisabled" class="upload-button" type="primary" @click="upload">
        上传附件
      </el-button>
      <ul class="file-ul">
        <li v-for="(item,index) in perviewData" :key="item.uid" class="file-li">
          <i class="el-icon-document file-icon" />
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
import { uploadFile, getFile, } from './api';
import { getSuffix, isImage, } from '@/utils/common';
import preview from '@/utils/filePreview';
import downLoadFile from '@/utils/downLoad';

export default {
  props: {
    value: {
      type: [String, Array],
      default: () => JSON.stringify([]),
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
    accept: String,
  },
  data() {
    return {
      perviewData: [],
      fileData: [],
      isUpload: false,
    };
  },
  computed: {

    isDisabled() {
      return this.disabled || (this.$parent?.elForm || {}).disabled;
    },
  },

  mounted() {
    this.$nextTick(() => {
      const w = this.$watch('value', function (value) {
        if (!this.isUpload) {
          this.init();
        }
        if (w) {
          w();
        }
      }, {
        immediate: true,
        deep: true,
      });
    });
  },

  methods: {
    handleDownload(item) {
      downLoadFile(item.url, item.name);
    },

    async init() {
      if (this.value && this.value !== '[]') {
        const value = JSON.parse(this.value);
        this.fileData = [...this.fileData, ...value];
        if (this.listType === 'picture-card') {
          for (const i of value) {
            if (isImage(i.name)) {
              const stream = await getFile(i.url);
              const perviewValue = window.URL.createObjectURL(stream);
              Object.assign(i, { perviewValue, suffix: '', });
            } else {
              Object.assign(i, {
                perviewValue: '',
                suffix: getSuffix(i.name),
              });
            }

            this.perviewData.push(i);
          }
        } else {
          this.perviewData = value;
        }
      }
    },
    handlePreview(item) {
      preview(item.url, item.name);
    },
    handleRemove(index) {
      this.perviewData.splice(index, 1);
      this.fileData.splice(index, 1);
      const str = JSON.stringify(this.fileData);
      this.$emit('input', str);
      this.$emit('change', str);
    },
    async handleInputChange(val) {
      const { files, } = val.target;
      this.isUpload = true;
      for (const i of files) {
        const loading = this.$loading({
          lock: true,
          text: '上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
          const res = await uploadFile(i);
          if (res) {
            const format = {
              name: res.oldName,
              url: `${res.path}/${res.fileName}`,
              uid: i.lastModified + Date.now() + Math.random(),
            };
            this.fileData.push({
              ...format,
            });
            if (isImage(res.fileName)) {
              const stream = await getFile(res.url);
              const perviewValue = window.URL.createObjectURL(stream);
              Object.assign(format, { perviewValue, suffix: '', });
            } else {
              Object.assign(format, {
                perviewValue: '',
                suffix: getSuffix(res.fileName),
              });
            }
            this.perviewData.push(format);
            console.log(this.fileData, 'fileData');

            const str = JSON.stringify(this.fileData);
            this.$emit('input', str);
            this.$emit('change', str);
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
      }
    },
    upload() {
      this.$refs.input.click();
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
