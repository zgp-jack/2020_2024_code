/**
* @file upload.vue
* @author huang
* @date 2023/11/2
* @description  通用上传dialog
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <!---->
  <dialog-template>
    <template #title>
      {{ title }}
    </template>

    <div
      v-if="showNotice"
      :class="`notice-${type}`"
      class="notice-box"
    >
      <i
        :class="[`el-icon-${type}`,`icon-${type}`]"
        class=" icon"
      />
      <span class="notice-text">
        {{ noticeText }}
      </span>
    </div>

    <el-timeline>
      <el-timeline-item>
        <template #dot>
          <span class="dot">
            1
          </span>
        </template>
        下载模版
        <div class="box">
          <pure-button
            icon="download"
            label="下载空模版"
            type="minor"

            @click="downloadTemplate"
          />
          <p class="alert">请勿增、删、改模板内标题</p>
          <p class="alert">填入数据 <span class="primary">不超过5000条</span></p>
        </div>

      </el-timeline-item>
      <el-timeline-item>
        <template #dot>
          <span class="dot">
            2
          </span>
        </template>
        上传文件
        <div class="box">
          <el-upload
            :action="'api'+importApi"
            :before-upload="onBeforeUpload"
            :headers="headers"
            :on-success="onSuccess"
            :show-file-list="false"
            class="upload-box"
            drag
          >
            <i class="el-icon-upload2" />
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
            <span
              slot="tip"
              class="alert"
            >
              请上传大小不超过1M的"xls","xlsx"格式文件
            </span>
          </el-upload>

        </div>
      </el-timeline-item>
    </el-timeline>

    <template #footer>
      <pure-button
        label="取消"
        type="minor"
        @click="$emit('done')"
      />

    </template>
  </dialog-template>
</template>
<script>
import DialogTemplate from './template.vue';
import PureButton from '@/common/components/button/index.vue';
import { downloadFile, } from '@/common/utils/download';
import { mapState, } from 'vuex';

export default {
  components: {
    PureButton,
    DialogTemplate,
  },
  props: {
    title: String,
    importApi: {
      type: String,
      default: '',
    },
    downloadTemplateApi: {
      type: Function,
      default: () => {
      },
    },
    fileName: String,
  },
  data() {
    return {
      acceptTypeList: [
        'xls',
        'xlsx',
      ],
      maxSize: 1,
      noticeText: '',
      file: null,
      showNotice: false,
      type: '',
    };
  },

  computed: {
    ...mapState('APP_LOGIN', [
      'accessToken',
    ]),
    headers() {
      return { Authorization: this.accessToken, };
    },
  },
  mounted() {

  },
  methods: {

    onSuccess({ code, msg, }, file, fileList) {
      if (code === 200) {
        this.type = 'success';
        this.noticeText = '上传成功';
      } else {
        this.type = 'error';
        this.noticeText = msg;
      }
      this.showNotice = true;
    },

    async downloadTemplate() {
      if (this.downloadTemplateApi instanceof Function && this.downloadTemplateApi) {
        try {
          const res = await this.downloadTemplateApi();
          downloadFile(res, `${this.fileName || '模版'}.xlsx`);
        } catch (error) {
          this.noticeText = error;
        }
      } else {
        console.error('下载模版api 为空，请检查');
      }
    },

    onBeforeUpload(file) {
      const { name, size, } = file;
      const limitSize = 1024 * 1024 * this.maxSize;
      const suffix = name.substring(name.lastIndexOf('.') + 1);
      const isAcceptSize = size < limitSize;

      const isAcceptType = this.acceptTypeList.includes(suffix);
      if (!isAcceptType) {
        this.$message({
          message: `不支持上传${suffix}格式文件`,
          type: 'warning',
        });
        return false;
      }
      if (!isAcceptSize) {
        this.$message({
          message: `上传文件大小不能超过${this.maxSize}M!`,
          type: 'warning',
        });
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang='scss'
  scoped
>
::v-deep .el-timeline-item__tail {
  border: none !important;
}

.box {
  margin-top: 8px;
}

.alert {
  font-size: 12px;
  font-weight: 400;
  color: #799F9F;
}

.primary {
  color: #282827;
}

.dot {
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: #E5F1F0;
  border-radius: 9px 9px 9px 9px;
  opacity: 1;
  color: #006666;
  font-size: 12px;
}

::v-deep .el-timeline-item__wrapper {
  top: 0 !important;
}

.upload-box {
  width: 516px;
  height: 96px;
  background: #FFFFFF;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;

  .el-upload__text {
    font-size: 14px;
    font-weight: 400;
    color: #BFCBD1;
  }

  ::v-deep .el-upload-dragger {
    width: 516px;
    height: 96px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid #DDE9E8;
  }

  .el-icon-upload2 {
    font-size: 16px;
    color: #c0c4cc;
    line-height: 50px;
  }
}

.notice {
  &-box {
    display: inline-block;
    padding: 9px 16px;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    color: #282827;
    margin-bottom: 16px;

    .icon {
      font-size: 14px;
      //color: #fff;

      &-success {
        color: #1EC969;
      }

      &-error {
        color: #FF836B;
      }
    }

  }

  &-error {
    background: #FFE6E1;
    border: 1px solid #FFD2C9;
  }

  &-success {
    background: #D2F4E1;
    border: 1px solid #AEEBC9;
  }

  &-text {
    font-size: 14px;
    font-weight: 400;
    color: #282827;
  }
}
</style>
