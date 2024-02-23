<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div v-if="list.length" class="preview-container">

    <div class="attchment-name">附件：</div>
    <div>

      <template v-for="(item,index) in list">
        <el-image
          v-if="item.isImage"
          :key="index"
          :src=" item.previewData"
          :preview-src-list="[item.previewData]"
          style="width: 50px; height: 50px;margin:0px 2px 5px 2px"
          :z-index="9999"
        />
        <div v-else class="file-list">
          <i class="el-icon-folder" />
          <span @click="downLoad(item)">
            {{ item.name }}
          </span>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import downLoadFile from '@/utils/downLoad';
import { isImage, truncateFileName, } from '@/utils/common';
export default {
  name: 'Attachment',
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    list() {
      return this.fileList.map((item) => {
        return {
          ...item,
          name: truncateFileName(item.name, 10),
          isImage: isImage(item.url),
          previewData: isImage(item.url) ? `${process.env.VUE_APP_BASE_API}/busLocalFile/getFile/${item.url}?token=${this.$store.state.login.accessToken}` : '',
        };
      });
    },
  },

  mounted() {

  },
  methods: {
    downLoad(val) {
      const { name, url, } = val;
      downLoadFile(url, name);
    },

  },
};
</script>
<style lang='scss' scoped>
.preview-container{
    display: flex;
        margin: 5px 0;

    .attchment-name{
        color: #2d405e;
        white-space:nowrap;
    }
}
    .file-list{
      &+&{
        margin-top: 8px;
      }
        cursor: pointer;
        color: #879bba;
        display: flex;

        &:hover{
            color: #2d405e;
        }
    }
</style>
