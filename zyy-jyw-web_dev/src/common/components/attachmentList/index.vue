<template>
  <div>
    <a
      v-for="(item,index) in list"
      :key="index"
      class="el-upload-list__item-name"
      @click="preview(item)"
    >
      <div class="preview__file-main">
        <svg-icon :icon-class="getSuffixIcon(item.name)" />
        <el-tooltip effect="dark" :content="item.name" placement="bottom-start">
          <span class="preview__file-name">{{ item.name }}</span>
        </el-tooltip>
      </div>
    </a>
  </div>
</template>

<script>
import { downloadFile, } from '@/common/utils/download';
import { filePreview, getFile, } from '../upload/api';
export default {
  name: 'PureAttachmentList',
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    async  preview(item) {
      const path = await filePreview(item.url);
      window.open(path);
    },
    async  downLoad(item) {
      try {
        const st = await getFile(item.url);
        downloadFile(st, item.name);
      } catch (err) {
        this.$notify.error(err);
      }
    },
    getSuffix(name) {
      return name.substring(name.lastIndexOf('.') + 1);
    },
    getSuffixIcon(name) {
      const suffix = this.getSuffix(name) || '';
      switch (suffix.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
          return 'type-jpg';
        case 'png':
          return 'type-png';
        case 'gif':
          return 'type-gif';
        case 'rar':
          return 'type-rar';
        case 'zip':
          return 'type-zip';
        case 'doc':
        case 'docx':
          return 'type-doc';
        case 'xls':
        case 'xlsx':
          return 'type-xls';
        case 'pdf':
          return 'type-pdf';
        case 'txt':
          return 'type-txt';
        case 'pptx':
          return 'type-ppt';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 长文件名称缩短*/
:deep(.el-upload-list__item-name){
  width: 280px;
}
.preview__file-main{
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 长文件名称缩短*/
.preview__file-name{
  width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
