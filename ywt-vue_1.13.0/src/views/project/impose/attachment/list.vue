<template>
  <div class="attachment_container">
    <div v-for="(v, i) in attachment" :key="i" class="attachment">
      <div class="attachment_wrapper">
        <div class="attachment_head">
          <template v-if="isImg(v.suffix)">
            <el-image
              style="width: 100%; height: 100%"
              :src="v.url"
              fit="cover"
              :preview-src-list="[v.url]"
              :z-index="7000"
            />
          </template>
          <template v-else>
            <span> {{ v.suffix }} </span>
          </template>
        </div>
        <div class="attachment_body">
          <el-tooltip class="item" effect="dark" content="下载" placement="bottom">
            <i class="el-icon-download" @click="onDownload(v.url, v.fileName)" />
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
</template>

<script>
import { stringifyToArr, } from '@/filters';
import { mapState, } from 'vuex';
import downLoadFile from '@/utils/downLoad';
import preview from '@/utils/filePreview';
export default {
  name: 'AttachmentList',
  props: {
    data: {
      type: String,
      default: JSON.stringify([]),
    },
  },
  data() {
    return {
      loading: null,
    };
  },
  computed: {
    formatter() {
      return stringifyToArr(this.data);
    },
    ...mapState('login', {
      baseUrl: (v) => {
        return v['uriConfig'].fileBaseUri;
      },
    }),
    attachment() {
      const val = [];
      const suffix_reg = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      for (const i of this.formatter) {
        val.push({
          name: i.name.replace(suffix_reg, ''),
          suffix: i.name.match(suffix_reg)[1],
          url: this.baseUrl + i.url,
          previewUrl: i.url,
          fileName: i.name,
        });
      }
      console.log(val);
      return val;
    },
  },
  methods: {
    close() {
      this.$emit('done');
    },
    isImg(fix) {
      const imgReg = /(JPG|PNG|GIF|JPEG)/i;
      return imgReg.test(fix);
    },
    onDownload(url, filename) {
      console.log(`[打印] ~ url, filename`, url, filename);

      downLoadFile(url, filename);
    },
    onPreview(fileData) {
      preview(fileData.previewUrl);
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
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-align: center;
      margin-top: 6px;
      color: #575757;
      font-size: 14px;
    }
  }
}
</style>
