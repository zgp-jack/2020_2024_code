<template>
  <drawer-template>
    <template #title>
      消息详情
    </template>
    <el-descriptions
      :column="2"
      border
    >
      <el-descriptions-item label="发送人">
        {{ formDetail.sender }}
      </el-descriptions-item>
      <el-descriptions-item label="发送时间">
        {{ formDetail.sendingTime }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="是否阅读">
        {{ formDetail.reading === 1 ? '是' : '否' }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="阅读时间">
        {{ formDetail.readingTime }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="消息类型">
        {{ formDetail.messageTypeName }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="接收人">
        {{ formDetail.receiverName }}
      </el-descriptions-item>
      <el-descriptions-item :span="2" label="类型">
        {{ formDetail.type === 1 ? 'PC' : '微信' }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="answer">
      <el-scrollbar>
        <div class="answer-title">消息内容</div>
        <div class="anser-content" v-html="formDetail.messageContent" />
      </el-scrollbar>
    </div>
    <template #footer>
      <!-- <pure-button
        v-if="(formDetail.applyStatus == '1' || formDetail.applyStatus == '4') && formDetail.applicant"
        label="编辑"
        @click="editFun(formDetail)"
      /> -->
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
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
      formDetail: {
        receiverName: '',
      },
    };
  },
  computed: {},
  mounted() {
    this.formDetail = { ...this.data, };
  },
  methods: {
    async init() {
      // this.formDetail = await AssetLendingApi.borrowDetail(this.data.id);
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
  margin-top: 10px;
  padding: 0 16px;
}
</style>
