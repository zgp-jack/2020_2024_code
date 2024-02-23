<!--
    用于展示附件列表
 -->
<template>
  <el-container v-loading="loading">
    <el-main>
      <div class="attachment_container">
        <div v-for="(v, i) in previewData" :key="i" class="attachment">
          <div class="attachment_wrapper">
            <div class="attachment_head">
              <template v-if="v.previewValue">
                <img
                  style="width: 100%; height: 100%"
                  :src="v.previewValue"
                  fit="cover"
                >
              </template>
              <template v-else>
                <span> {{ v.suffix }} </span>
              </template>
            </div>
            <div class="attachment_body">
              <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
                <i class="el-icon-download" @click="onDownload(v)" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
                <i class="el-icon-view" @click="onPreview(v)" />
              </el-tooltip>
            </div>
          </div>

          <div class="attachment_footer">
            <el-tooltip effect="dark" :content="v.name" placement="bottom">
              <span>{{ v.name }}</span>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {
  downloadFile,
} from '@/common/utils/download';
import { FilePreview, } from '@/common/utils/filePreview';
import { getSuffix, isImage, } from '@/common/utils/file';
import { getFile, } from '@/common/components/upload/api';
import sysConfig from '@/config/index';
export default {
  name: 'Attachment',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      FILE_URL: sysConfig.BASE_FILE_URL,
      loading: false,
      previewData: [],
    };
  },
  computed: {

  },
  watch: {
    data: {
      handler: 'init',
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async init(value) {
      this.loading = true;
      this.previewData = [];
      if (value && value.length > 0) {
        for (const i of value) {
          if (isImage(i.name)) {
            const previewValue = this.FILE_URL + i.url;
            Object.assign(i, { previewValue, suffix: '', });
          } else {
            Object.assign(i, {
              previewValue: '',
              suffix: getSuffix(i.name),
            });
          }
          this.previewData.push(i);
        }
      }
      this.loading = false;
    },
    close() {
      this.$emit('done');
    },
    async onDownload(item) {
      try {
        const st = await getFile(item.url);
        downloadFile(st, item.name);
      } catch (err) {
        this.$notify.error(err);
      }
    },
    onPreview(fileData) {
      const { url, name, } = fileData;
      FilePreview(url, name);
    },
  },
};
</script>
<style lang='scss' scoped>
.el-footer-tag {
  padding: 0;
  text-align: right;
}
.attachment_container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .attachment {
    width: 127px;
    display: flex;
    flex-direction: column;
    margin: 0 0 20px 20px;
    > .attachment_wrapper {
      background: #d7e5f9;
      overflow: hidden;
      border-radius: 4px;
      height: 135px;
      position: relative;

      > .attachment_head {
        height: 100%;
        text-align: center;
        line-height: 108px;
        > span {
          display: inline-block;
          font-weight: 600;
          color: #1890ff;
        }
        > .attachment_head--img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      }
      > .attachment_body {
        height: 27px;
        background-color: rgba(96, 155, 239, 0.6);
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        align-items: center;
        >i{
          color: #1790ff;
          cursor: pointer;
        }
      }
    }
    > .attachment_footer {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-align: center;
      margin-top: 6px;
      color: #575757;
      font-size: 14px;
    }
  }
}
</style>
