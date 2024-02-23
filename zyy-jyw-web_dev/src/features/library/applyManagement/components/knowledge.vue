<template>
  <!-- v-loading="loading" -->
  <div class="drawer">
    <div class="header">
      <div class="title">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="body">
      <div v-if="operatorType==='UPDATE'&& formData.applyStatus=== '4'" style="padding: 20px ">
        <el-descriptions
          :column="3"
          border
        >
          <el-descriptions-item :span="4" label="驳回原因">
            {{ formData.rejectReasonName }}
          </el-descriptions-item>
          <el-descriptions-item :span="4" label="说明">
            {{ formData.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="102px"
        size="mini"
        :rules="rules"
        :disabled="operatorType==='VIEW'"
      >
        <el-form-item label="知识标题:" prop="title">
          <el-input v-model="formData.title" placeholder="请输入知识标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="助记简拼:" prop="abbreviation">
          <el-input v-model="formData.abbreviation" placeholder="请输入助记简拼" maxlength="100" show-word-limit />
          <span>* 多个助记简拼之间用英文;隔开。</span>
        </el-form-item>
        <el-form-item label="故障分类:" prop="faultType">
          <fault-type-select
            v-model="formData.faultType"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="故障原因:" prop="faultCauses">
          <dic-select v-model="formData.faultCauses" class="w-100" dic-key="obs_fault_causes" />
        </el-form-item>
        <el-form-item label="症状:" prop="question">
          <el-input
            v-model="formData.question"
            type="textarea"
            :rows="2"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="附件:" prop="enclosure">
          <Upload v-model="formData.enclosure" />
        </el-form-item>
        <el-form-item label="解决办法:" prop="answer">
          <div v-if="operatorType!=='VIEW'" id="websiteEditorElem" ref="websiteEditorElem" />
          <div v-if="operatorType==='VIEW'" v-html="formData.answer" />
          <div v-if="operatorType!=='VIEW'">
            <div class="instruction">解决办法中插入图片支持的三种方式：</div>
            <div class="instruction">1.通过QQ截图, 然后复制粘贴到文本框中；</div>
            <div class="instruction">2.选中图片 (如: WORD文档, 图片查看), 然后复制粘贴到文本框中;</div>
            <div class="instruction">3.点击富文本控件中的倒数第二个按钮“<i class="w-e-icon-image" />”进行上传。</div>
          </div>
        </el-form-item>
      </el-form>
      <!-- </pure-card> -->
    </div>
    <div v-if="operatorType!=='VIEW'" class="footer">
      <template v-if="mode==='pass'">
        <pure-button
          label="通过"
          type="major"
          @click="passFun"
        />
      </template>
      <template v-else>
        <pure-button
          v-if="mode !== 'library'"
          label="提交"
          type="major"
          @click="onSubmit('submit')"
        />
        <pure-button
          label="保存"
          @click="onSubmit('save')"
        />
      </template>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </div>
  </div>
</template>

<script>
import Editor from 'wangeditor';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import KnowledgeApi from '../api.js';
import { OPERATOR_TYPES, } from '@/common/mixins/drawer.js';
import sysConfig from '@/config/index';

export default {
  components: {
    DicSelect,
    Upload: () => import('@/common/components/upload'),
    // PureCard: () => import('./pureCard.vue'),
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
  },
  props: {
    operatorType: {
      type: String,
      default: 'CREATE',
    },
    id: {
      type: Number,
      default: null,
    },
    mode: {
      type: String,
      default: '',
    },
    initData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      FILE_URL: sysConfig.BASE_FILE_URL,
      formData: {
        title: '',
        abbreviation: '',
        applyStatus: '',
        question: '',
        answer: '',
        enclosureId: '',
        enclosure: [],
        faultType: '',
        faultCauses: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入知识标题', trigger: 'blur', },
          { max: 100, message: '知识标题长度不超过100字符', },
        ],
        abbreviation: [
          { max: 100, message: '助记简拼长度不超过100字符', },
        ],
        question: [
          { max: 1000, message: '症状长度不超过100字符', },
        ],
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', },
        ],
      },
      editor: '',
    };
  },
  computed: {
    title() {
      if (this.mode === 'library') {
        return '编辑知识';
      }
      switch (this.operatorType) {
        case OPERATOR_TYPES.CREATE:
          return '新增知识';
        case OPERATOR_TYPES.UPDATE:
          return '编辑知识';
        case OPERATOR_TYPES.VIEW:
          return '查看知识';
        default:
          return '知识';
      }
    },
  },
  async created() {
    if (this.id) {
      const data = await KnowledgeApi.getDetailData(this.id);
      this.formData = Object.assign({}, data);
      this.formData.enclosure = this.formData.enclosure || [];
      this.editor && this.editor.txt.html(this.formData.answer);
    }
    if (this.initData) {
      this.formData = Object.assign({}, this.initData);
      this.formData.enclosure = this.formData.enclosure || [];
      this.editor && this.editor.txt.html(this.formData.answer);
    }
  },
  async mounted() {
    if (this.$refs.websiteEditorElem) {
      if (this.operatorType !== OPERATOR_TYPES.VIEW) {
        this.editor = new Editor(this.$refs.websiteEditorElem);
        // this.editor.config.uploadImgShowBase64 = true;
        this.editor.config.uploadImgHeaders = {
          Authorization: this.$store.state.APP_LOGIN.accessToken,
        };
        this.editor.config.placeholder = '请输入内容...';
        this.editor.config.uploadFileName = 'file';
        const fileUrl = this.FILE_URL;
        this.editor.config.uploadImgHooks = {
          // 图片上传并返回了结果，图片插入已成功
          success: function (xhr) {
            console.log('success', xhr);
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
            console.log('customInsert', result);
            console.log('url==', result.data[0].url);
            // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
            insertImgFn(fileUrl + result.data[0].url);
          },
        };
        this.editor.config.uploadImgServer = 'api/system/file/upload';
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
          'redo', // 重复
        ];
        this.editor.create();
      }
    }
  },
  methods: {
    async passFun() {
      await this.$refs.formRef.validate();
      let enclosureId = '';
      this.formData.answer = this.editor.txt.html();
      if (this.formData.enclosure.length) {
        this.formData.enclosure.forEach(item => {
          enclosureId += item.id;
        });
      }
      this.formData.enclosureId = enclosureId;
      KnowledgeApi.passKnowledge(this.formData).then(res => {
        this.$notify.success('通过成功');
        this.$emit('done');
      });
    },
    cancel() {
      this.$emit('done', true);
    },
    async onSubmit(type) {
      try {
        console.log('保存知识库');
        await this.$refs.formRef.validate();
        let enclosureId = '';
        this.formData.answer = this.editor.txt.html();
        this.formData.applyStatus = type === 'submit' ? 2 : 1;
        if (this.formData.enclosure.length) {
          this.formData.enclosure.forEach(item => {
            enclosureId += item.id;
          });
        }
        this.formData.enclosureId = enclosureId;
        if (this.mode === 'library') {
          await KnowledgeApi.updateKnowledgeEdit(this.formData);
        } else if (this.id) {
          await KnowledgeApi.updateknowledge(this.formData);
        } else {
          await KnowledgeApi.addKnowledgeData(this.formData);
        }
        this.$message({
          type: 'success',
          message: '操作成功！',
        });
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
        await KnowledgeApi.delete(this.id);
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
  font-size: 14px;
  font-weight: 400;
  color: #879bba;
  line-height: 14px;
  margin-left: 24px;
  span {
    color: #2d405e;
  }
}
.instruction {
  font-size: 16px;
  color: #757e7e;
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
