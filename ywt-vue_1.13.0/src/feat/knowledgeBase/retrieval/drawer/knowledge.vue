<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-07 21:30:56
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:57:31
 * @Description:
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <div class="title">
        <span>{{ title }}</span>
      </div>

    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">知识详情
          <span v-if="formData.createUser" class="title-desc">
            创建人:
            <span>{{ formData.createUser|staffId }}</span>
          </span>
          <span v-if="formData.createTime" class="title-desc">
            创建时间:
            <span>{{ formData.createTime }}</span>
          </span>
        </div>
        <el-form
          ref="form"
          :model="formData"
          label-position="right"
          label-width="102px"
          size="mini"
          :rules="rules"
          :disabled="operatorType==='VIEW'"
        >
          <el-form-item label="问题描述" prop="title">
            <el-input v-model="formData.title" placeholder="请输入问题描述" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="知识分类" prop="type">
                <tree-dic-cascader v-model="formData.type" dic-key="faultClassification" class="w-100" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="故障原因" prop="causes">
                <dic-select v-model="formData.causes" class="w-100" type="string" dic-key="zskFaultReason" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="症状" prop="question">
            <el-input
              v-model="formData.question"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
          <el-form-item label="附件" prop="attrs">
            <upload v-model="formData.attrs" />
          </el-form-item>
          <el-form-item label="解决办法">
            <div v-if="operatorType!=='VIEW'" id="websiteEditorElem" />
            <div v-if="operatorType==='VIEW'" ref="viewAnswer" class="viewAnswer" v-html="decodeAnswer(formData.answer) " />
            <div v-if="operatorType!=='VIEW'">
              <div class="instruction">解决办法中插入图片支持的三种方式：</div>
              <div class="instruction">1.通过QQ截图, 然后复制粘贴到文本框中；</div>
              <div class="instruction">2.选中图片 (如: WORD文档, 图片查看), 然后复制粘贴到文本框中;</div>
              <div class="instruction">3.点击富文本控件中的倒数第二个按钮“<i class="w-e-icon-image" />”进行上传。</div>
            </div>

          </el-form-item>
        </el-form>

      </pure-card>
    </div>
    <div v-if="operatorType!=='VIEW'" class="footer">
      <pure-button
        label="保存"
        @click="onSubmit"
      />
      <pure-button
        v-if="operatorType==='UPDATE'"
        label="删除"
        type="sub-wire-frame"
        @click="onDelete"
      />
    </div>
  </div>
</template>

<script>
import KnowledgeBaseRetrievalApi from '../api';

import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import TreeDicCascader from '@/feat/system/dictionary/tree/component/treeDicCascader.vue';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import Upload from '@/components/upload';

import Editor from 'wangeditor';
import { Base64, } from 'js-base64';
import { mapState, } from 'vuex';

export default {

  components: {
    Upload,
    DicSelect,
    TreeDicCascader,
  },
  mixins: [FormDialog],
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  computed: {
    ...mapState('login', {
      token: 'accessToken',
    }),

  },
  data() {
    return {
      name: '知识',
      detailApi: KnowledgeBaseRetrievalApi.detail,
      formData: {
        title: null,
        type: null,
        causes: null,
        question: null,
        answer: null,
        attrs: null,

      },
      rules: {
        title: [
          { required: true, message: '请输入问题描述', trigger: 'blur', }
        ],
        type: [
          { required: true, message: '请选择知识分类', trigger: 'change', }
        ],
      },
      editor: '',
    };
  },

  async mounted() {
    const self = this;

    this.$nextTick(() => {
      if (this.operatorType === 'VIEW') {
        const viewAnswer = this.$refs.viewAnswer;
        setTimeout(() => {
          const allImgs = viewAnswer.querySelectorAll('img');
          for (let i = 0; i < allImgs.length; i++) {
            allImgs[i].src = allImgs[i].src.replace(/token=[^'"]+/g, `token=${this.token}`);
          }
        }, 100);
      }
    });

    if (this.operatorType !== OPERATOR_TYPES.VIEW) {
      this.editor = new Editor('#websiteEditorElem');
      // this.editor.config.uploadImgShowBase64 = true;
      this.editor.config.uploadImgParams = {
        token: this.token,
      };
      this.editor.config.uploadFileName = 'file';
      this.editor.config.uploadImgHooks = {
        // // 上传图片之前
        // before: function (xhr) {
        //   console.log(xhr);

        //   // 可阻止图片上传
        //   return {
        //     prevent: true,
        //     msg: '需要提示给用户的错误信息',
        //   };
        // },
        // 图片上传并返回了结果，图片插入已成功
        success: function (xhr) {
        },
        // 图片上传并返回了结果，但图片插入时出错了
        fail: function (xhr, editor, resData) {
          console.log('fail', resData);
        },
        // 上传图片出错，一般为 http 请求的错误
        error: function (xhr, editor, resData) {
          console.log('error', xhr, resData);
        },
        // 上传图片超时
        timeout: function (xhr) {
          console.log('timeout');
        },
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
        // result 即服务端返回的接口
          insertImgFn(`${process.env.VUE_APP_BASE_API}/busLocalFile/getFile/${result.body.url}?token=${self.token}`);
        },
      };
      this.editor.config.uploadImgServer = 'api/busLocalFile/upload';
      this.editor.config.showLinkImg = false;
      this.editor.config.showFullScreen = false;
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        // 'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        // 'table', // 表格
        // 'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];

      this.editor.create();
    }
  },
  methods: {
    decodeAnswer(value) {
      if (value) {
        return Base64.decode(value);
      }
      return value;
    },
    async afterFetchDetail() {
      if (this.editor) {
        let answer = Base64.decode((this.formData.answer));
        answer = answer.replace(/token=[^'"]+/g, `token=${this.token}`);
        this.editor.txt.html(answer);
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        this.formData.answer = Base64.encode(this.editor.txt.html());
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await KnowledgeBaseRetrievalApi.create(this.formData);
        } else {
          await KnowledgeBaseRetrievalApi.update(this.formData);
        }

        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onDelete() {
      try {
        await this.$confirm('确认删除本知识吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await KnowledgeBaseRetrievalApi.delete(this.id);
        this.$emit('done');
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
    height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
}
.title-desc {
  font-size: $--pure-little-font-size;
  font-weight: 400;
  color: #879bba;
  line-height: $--pure-little-font-size;
  margin-left: 24px;
  span {
    color: #2d405e;
  }
}
.instruction {
  font-size: 16px;
  color: #7d8db3;
}

/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol 样式 */
ul, ol {
  margin: 10px 0 10px 20px;
}
</style>
