<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-25 17:59:53
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 15:14:45
 * @Description:完成
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="133px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
    style="position: relative;"
  >
    <el-form-item v-if="requiredDealTime" label="处理时间" required prop="createTime">
      <el-date-picker
        v-model="formData.createTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
      />
    </el-form-item>
    <el-form-item
      label="实际报修地址"
      class="special-item"
    >
      <dic-select
        v-model="formData.actualRepairPlace"
        dic-key="sjbxdz"
      />
    </el-form-item>
    <el-form-item key="faultType" label="实际故障分类" prop="faultType">
      <fault-type-select
        v-model="formData.faultType"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item key="faultRemark" label="实际故障" prop="faultRemark">
      <Q-paste-up
        ref="Q"
        :data-dom="formData.faultRemark"
        :disabled-fun="setDisabledFun"
        :html-hash-val="htmlHashVal"
        @isInputHashTrue="isInputHashTrue"
      >
        <el-card shadow="always" class="card-box">
          <div
            v-for="list in optionList"
            :key="list.id"
            :style="{ background: list.isActive ? '#f5f7fa' : '#fff' }"
            class="card-item"
            :disabled="list.title === '暂无数据...'"
            @click="changeItem(list)"
            @mouseenter="onMouseenter(list)"
            @mouseleave="omMouseleave(list)"
          >
            {{ list.title }}
          </div>
        </el-card>
      </Q-paste-up>
    </el-form-item>

    <el-form-item label="实际工时" prop="realTime">
      <el-input
        v-model="formData.realTime"
        class="halfW"
        @input="onInputRealTime"
      />
      <span class="unit">小时</span>
    </el-form-item>
    <el-form-item label="解决方法" prop="makeWay">
      <!-- <el-input
        v-model="formData.makeWay"
        type="textarea"
        :rows="4"
      /> -->
      <div id="websiteEditorElem" />
      <!-- <div v-if="operatorType==='VIEW'" v-html="formData.answer" /> -->
    </el-form-item>
    <el-form-item label="资产名称">
      <el-input v-model="formData.equipment" />
    </el-form-item>
    <el-form-item label="资产位置">
      <department-cascader
        v-model="formData.equipmentAddressId"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="附件">
      <el-col :span="22">
        <upload v-model="formData.processEnclosure" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';

import TicketApi from '@/feat/ticket/api';
import {
  limitNumberAfterPoint,
} from '@/utils/validator';
import KnowledgeBaseRetrievalApi from '@/feat/knowledgeBase/retrieval/api';
import Editor from 'wangeditor';
import { Base64, } from 'js-base64';
import moment from 'moment';
import { mapState, } from 'vuex';
export default {
  name: 'Complete',
  components: {
    DepartmentCascader,
    DicSelect,
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    Upload: () => import('@/components/upload'),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    faultInfo: {
      type: Object,
      default: () => ({}),
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
    operatorType: {
      type: String,
      default: null,
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        // 实际报修地址
        actualRepairPlace: '',
        // 故障分类
        faultType: this.faultInfo.faultType || null,
        // 故障描述
        faultRemark: this.faultInfo.faultRemark || null,
        // 实际工时
        realTime: 0,
        // 解决方法
        makeWay: null,
        // 附件
        processEnclosure: null,
        editor: '',
        // 资产名称
        equipment: '',
        // 资产位置
        equipmentAddressId: null,
        createTime: null,
      },
      rules: {
        faultType: [
          { required: true, message: '请选择故障分类', trigger: 'change', }
        ],
        faultRemark: [
          { required: true, message: '请输入故障描述', trigger: 'blur', }
        ],
        realTime: [
          {
            type: 'string', required: true, trigger: 'blur', validator: limitNumberAfterPoint('请输入实际耗时', 1),
          },
          { required: true, message: '不能为空', trigger: 'blur', }
        ],
      },
      htmlHashVal: {}, // 通过 # 选择的引用数据
      optionList: [],
    };
  },
  computed: {
    setDisabledFun() {
      if (this.formData.faultType) {
        return 'enable';
      } else {
        return 'disable';
      }
    },
    ...mapState('login', {
      token: 'accessToken',
    }),
  },
  watch: {
    faultInfo: {
      handler(val) {
        this.formData.faultType = val.faultType || null;
        this.formData.faultRemark = val.faultRemark || null;
        this.formData.equipment = val.equipment || null;
        this.formData.equipmentAddressId = val.equipmentAddressId || null;

        if (val.learningId && !val.makeWay) {
          this.fetchKnowledgeDetail(val.learningId);
        }

        if (val.makeWay) {
          this.editor.txt.html(Base64.decode((val.makeWay)));
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.formData = Object.assign({}, this.formData, this.defaultData);
    if (!this.formData.createTime) {
      this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
      //  console.log(this.formData.createTime)
    }
    this.editor = new Editor('#websiteEditorElem');

    // this.editor.config.uploadImgShowBase64 = true;
    this.editor.config.uploadImgParams = {
      token: this.$store.state.login.accessToken,
    };
    this.editor.config.uploadFileName = 'file';
    const that = this;
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

        // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
        // insertImgFn(that.$store.state.login.uriConfig.fileBaseUri + result.body.url);
        insertImgFn(`${process.env.VUE_APP_BASE_API}/busLocalFile/getFile/${result.body.url}?token=${that.token}`);
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
      // 'underline', // 下划线
      'strikeThrough', // 删除线
      // 'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      // 'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      // 'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ];

    this.editor.create();
    if (this.disabled) {
      this.editor.disable();
      this.editor.txt.html(Base64.decode((this.formData.makeWay)));
    }
  },
  methods: {
    async querySearch() {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        pageSize: 9999,
        type: this.formData.faultType,
      });
      list.length === 0 ? this.optionList = [{ title: '暂无数据...', id: new Date().getTime(), }] : this.optionList = list.slice(0, 6).map((item) => {
        item.isActive = false;
        return item;
      });
    },
    async isInputHashTrue(v, val) {
      v ? await this.querySearch() : (this.optionList = []);
    },
    changeItem(list) {
      JSON.stringify(this.htmlHashVal) === '{}'
        ? (this.htmlHashVal = list)
        : this.$confirm('将使用选择内容替换故障描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.htmlHashVal = list;
            this.formData.learningId = list.id;
          })
          .catch(() => {
            this.formData.learningId = null;
          });
      this.$refs['Q'].isSlotShow = false; // 隐藏引用选择框
    },
    onMouseenter(list) {
      list.isActive = true;
    },
    omMouseleave(list) {
      list.isActive = false;
    },
    async onSubmit(orderNum) {
      this.formData.faultRemark = this.$refs['Q'].convertBase64();
      await this.$refs.form.validate();
      this.formData.makeWay = Base64.encode(this.editor.txt.html());
      await TicketApi.complete({
        orderNum,
        ...this.formData,
        makeTime: this.formData.createTime,
      });
    },
    async fetchKnowledgeDetail(id) {
      const data = await KnowledgeBaseRetrievalApi.detail(id);
      this.editor.txt.html(Base64.decode((data.answer)));
    },
    onInputRealTime(value) {
      this.formData.realTime = value.replace(/[^0-9.]/g, '');
    },
  },
};
</script>

<style lang="scss" scoped>
.halfW {
  width: 160px;
}
.w100 {
  width: 100%;
}
.special-item{
  position: absolute;
  right: 0px;
  top: -48px;
  width: 325px;

}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner {
    padding: 0 16px;
  }
}
</style>
