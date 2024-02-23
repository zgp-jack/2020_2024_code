<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-13 10:36:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-17 16:53:54
 * @FilePath: \ywt-vue-qp\src\components\pasteUp\index.vue
 * @Description:富文本组件
-->

<template>
  <div class="paste-up-container" @click="cancelClick">
    <div ref="paste-up-box" class="paste-up-box" @input="onInput" />
    <slot v-if="isSlotShow" />
    <ImageViewer v-if="showPerview" :z-index="zIndex" :initial-index="imageIndex" :on-close="closeViewer" :url-list="previewSrcList" />
  </div>
</template>

<script>
import Editor from 'wangeditor';
import { Base64, } from 'js-base64';
import ImageViewer from 'element-ui/packages/image/src/image-viewer';
export default {
  components: {
    ImageViewer,
  },
  props: {
    htmlHashVal: {
      type: Object,
      default: () => {},
    },
    disabledFun: {
      type: String,
      default: 'disable',
    },
    dataDom: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请先选择故障分类',
    },
  },
  data() {
    return {
      editor: null,
      isSlotShow: false,
      showPerview: false,
      previewSrcList: [],
      zIndex: 9999,
      imgSrc: '',
    };
  },
  computed: {
    imageIndex() {
      let previewIndex = 0;
      const srcIndex = this.previewSrcList.indexOf(this.imgSrc);
      if (srcIndex >= 0) {
        previewIndex = srcIndex;
      }
      return previewIndex;
    },
  },
  watch: {
    htmlHashVal: {
      handler(newVal, oldVal) {
        this.setHtmlVal(newVal);
      },
      deep: true,
    },
    disabledFun: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.disableOrEnableEditor(newVal);
        });
      },
      deep: true,
    },
    placeholder: {
      handler(newVal) {
        this.editor.config.placeholder = newVal;
      },
    },
    dataDom: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.editor?.txt?.html(newVal);
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.initEditor();
  },
  created() {},
  methods: {
    closeViewer() {
      this.showPerview = false;
    },
    handlePerview() {
      const self = this;
      const el = this.$refs['paste-up-box'];
      const imgs = el.querySelectorAll('img');
      if (imgs.length) {
        this.previewSrcList = Array.from(imgs).map(item => item.src);
        Array.from(imgs).forEach((img) => {
          img.addEventListener('click', function () {
            self.imgSrc = this.src;
            self.showPerview = true;
          });
        });
      }
    },
    onInput(e) {
      // 当用户键入 # 时 触发引用选择
      this.isSlotShow = this.editor.txt.text().indexOf('#') !== -1;
      const inputVal = this.editor.txt.text().slice(1, this.editor.txt.text().length);
      this.$emit('isInputHashTrue', this.isSlotShow, inputVal);
    },
    setHtmlVal(v) {
      const T = `问题描述：${v.title}`;
      const Q = `症状：${v.question}`;
      const Dom = `<p>${T}</p><p>${Q}</p><br>`;
      this.editor.txt.html(Dom);
      this.$emit('isInputHashTrue', false);
    },
    // 数据转换
    convertBase64() {
      // this.dataDom = Base64.decode(Base64.encode(this.editor.txt.html()));
      return Base64.decode(Base64.encode(this.editor.txt.html()));
    },
    // 清空
    clearHtml() {
      this.editor.txt.text() !== '' && this.editor.txt.html('');
    },
    // 隐藏浮框
    cancelClick() {
      this.isSlotShow = false;
      const nowDomStr = this.editor.txt.html();
      this.editor.txt.text().indexOf('#') !== -1 && this.deleteHash(nowDomStr);
    },
    // 回退一格并删除无用 # 号
    deleteHash(domStr) {
      const newDomStr = domStr.substring(0, domStr.lastIndexOf('#')) + '<br>';
      this.editor.txt.html(newDomStr);
    },
    // 初始化富文本实例
    initEditor() {
      this.editor = new Editor(this.$refs['paste-up-box']);
      this.initDefaultConfig();
      this.createEditor();
      this.disableOrEnableEditor(this.disabledFun);
      this.editor?.txt?.html(this.dataDom);
    },
    // 初始化默认配置
    initDefaultConfig() {
      this.editor.config = {
        ...this.editor.config,
        uploadImgParams: { token: this.$store.state.login.accessToken, }, // token 接口需要的token
        uploadFileName: 'file', // token 接口需要的token
        uploadImgHooks: {
          before: (xhr) => {
            return this.beforeUpload(xhr);
          },
          success: (xhr) => {
            return this.successUpload(xhr);
          },
          fail: (xhr, editor, resData) => {
            return this.failUpload(xhr, editor, resData);
          },
          error: (xhr) => {
            return this.errorUpload(xhr);
          },
          timeout: (xhr) => {
            return this.timeoutUpload(xhr);
          },
          customInsert: (insertImgFn, result) => {
            return this.customInsertImg(insertImgFn, result);
          },
        },
        uploadImgServer: 'api/busLocalFile/upload',
        showLinkImg: false,
        showFullScreen: false,
        menus: ['image'],
        // placeholder: '如需使用图片 请按Ctrl+V粘贴或将图片拖拽自此处',
        placeholder: this.placeholder,
        onchange: () => {
          this.handlePerview();
        },
      };
    },
    // 图片上传之前回调
    beforeUpload(xhr) {
      console.log(xhr);
    },
    // 图片上传成功并返回结果回调
    successUpload(xhr) {
      console.log(xhr);
    },
    // 图片上传并返回了结果 但图片插入时出错时回调
    failUpload(xhr, editor, resData) {
      console.log(xhr, editor, resData);
    },
    // 上传图片出错时回调
    errorUpload(xhr, editor, resData) {
      console.log(xhr, editor, resData);
    },
    // 图片上传成超时回调
    timeoutUpload(xhr) {
      console.log(xhr);
    },
    // 自定义插入图片到DOM
    customInsertImg(insertImgFn, result) {
      this.insertDomHTML('<p>图片：</p>');
      insertImgFn(
        `${this.$store.state.login.uriConfig.fileBaseUri}${result.body.url}`
      );
    },
    // 插入文本
    insertDomHTML(domNode) {
      this.editor.cmd.do('insertHTML', domNode);
    },
    // 禁用或启用
    disableOrEnableEditor(funName = 'disable') {
      this.editor[funName]();
    },
    // 创建富文本
    createEditor() {
      this.editor.create();
      this.editor.txt.html(this.dataDom);
    },
  },
};
</script>

<style lang="scss" scoped>
.paste-up-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.paste-up-box {
  ::v-deep .w-e-toolbar {
    display: none !important;
  }
  ::v-deep .w-e-text-container {
    border: none !important;
    .placeholder {
      color: #c0c4cc;
      font-size: 18px;
      margin-left: 3px;
    }
  }
}
.card-box {
  z-index: 99999;
  position: absolute;
  top: 40px;
  width: calc(100% - 20px);
  margin-left: 10px;
  .card-item {
    cursor: pointer;
  }
}
</style>
