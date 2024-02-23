<template>
  <drawer-template>
    <template #title>
      基础信息
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="申请人">
        {{ formDetail.submitUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ formDetail.createTime }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="状态">
        {{ formDetail.applyStatusName }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="知识标题">
        {{ formDetail.title }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="助记简拼">
        {{ formDetail.abbreviation }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="故障分类">
        {{ formDetail.faultTypeName }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="故障原因">
        {{ formDetail.faultCausesName }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="症状">
        {{ formDetail.question }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="附件">
        <!-- {{ formDetail.enclosureId }} -->
        <pure-attachment-list :list="formDetail.enclosure" />
      </el-descriptions-item>
    </el-descriptions>
    <div class="answer">
      <el-scrollbar>
        <div class="answer-title">解决办法</div>
        <div class="anser-content" v-html="formDetail.answer" />
      </el-scrollbar>
    </div>
    <template #footer>
      <!-- <pure-button
        v-if="(formDetail.applyStatus == '1' || formDetail.applyStatus == '4') && formDetail.applicant"
        label="编辑"
        @click="editFun(formDetail)"
      /> -->
      <template v-if="type !== 'view'">
        <pure-button
          v-if="formDetail.applyStatus == '2' && formDetail.reviewer"
          label="通过"
          type="major"
          @click="passFun"
        />
        <pure-button
          v-if="formDetail.applyStatus == '2' && formDetail.reviewer"
          label="修改后通过"
          @click="editFun(formDetail)"
        />
        <pure-button
          v-if="formDetail.applyStatus == '2' && formDetail.reviewer"
          label="驳回"
          @click="onReject(formDetail)"
        />
      </template>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </template>
  </drawer-template>
</template>

<script>
import DialogReject from './reject.vue';
import DrawerTemplate from '@/common/components/drawer/template.vue';
import KnowledgeDrawer from './knowledge.vue';
import KnowledgeApi from '../api';
export default {
  components: {
    DrawerTemplate,
  },
  filters: {},
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      formDetail: {},
    };
  },
  computed: {},
  mounted() {
    this.formDetail = { ...this.data, };
  },
  methods: {
    onReject(row) {
      this.$dialog({
        width: '600px',
        component: () => <DialogReject
          rejectApi={KnowledgeApi.rejectKnowledge}
          id={row.id}
          isCancel={true}
          onDone={this.cancel}
        />,
      });
    },
    passFun() {
      KnowledgeApi.passKnowledge(this.formDetail).then(res => {
        this.$notify.success('通过成功');
        this.$emit('done');
      });
    },
    editFun(row) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' mode='pass' id={row.id} onDone={this.init}/>,
        width: '900px',
      });
    },
    async init(val) {
      console.log('是否关闭外部审核弹窗', !val);
      if (!val) {
        this.cancel();
      }
    },
    cancel() {
      this.$emit('done');
    },

  },
};

</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table {
  margin-top: 16px;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray') ;

      font-size: 16px !important;

      th.el-table__cell {
        @include background_color_imp('color-assist-4') ;
      }
    }

  }
}
.answer {
  width: 100%;
  height: 300px;
  margin-top: 16px;
  border: 1px solid #DCDFE6;
}
.answer-title {
  padding: 16px;
  background-color: #F0F7F7;
  font-weight: bold;
  border-bottom: 1px solid #DCDFE6;
}
.anser-content {
  padding: 0 16px;
}
</style>
