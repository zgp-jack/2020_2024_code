<template>
  <pure-panel-card class="panel-card">
    <div slot="header">
      评价信息
    </div>
    <div slot="subHeader">
      <span
        v-if="evaluate.createUserName"
        class="createUser"
      >评价人:
        <span>
          {{ evaluate.createUserName }}
        </span>
      </span>
      <span v-if="evaluate.createTime" class="createTime">
        评价时间时间:
        <span>{{ evaluate.createTime }}</span>
      </span>

    </div>
    <el-descriptions
      :column="1"
      border
      :colon="false"
    >
      <el-descriptions-item label="服务态度">
        <el-rate
          v-model="evaluate.serviceAttitude"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        />
      </el-descriptions-item>
      <el-descriptions-item label="服务质量">
        <el-rate
          v-model="evaluate.serviceQuality"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        />
      </el-descriptions-item>
      <el-descriptions-item label="响应时效">
        <el-rate
          v-model="evaluate.responsePrescription"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}"
        />
      </el-descriptions-item>
      <el-descriptions-item label="评价结果">
        {{ evaluate.evaluateResultToName }}
      </el-descriptions-item>
      <el-descriptions-item label="意见与建议">
        {{ evaluate.commentSuggestion }}
      </el-descriptions-item>
      <el-descriptions-item label="签名">
        <img v-if="evaluate.autograph" class="autograph-img" :src="FILE_URL+evaluate.autograph">
      </el-descriptions-item>
      <el-descriptions-item label="附件">
        <pure-attachment-list :list="evaluate.enclosure" />
      </el-descriptions-item>
    </el-descriptions>
  </pure-panel-card>
</template>

<script>
import sysConfig from '@/config/index';
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {

        };
      },
    },
  },
  data() {
    return {
      FILE_URL: sysConfig.BASE_FILE_URL,
      evaluate: {
        createTime: null,
        serviceAttitude: 0,
        serviceQuality: 0,
        responsePrescription: 0,
        evaluateResultToName: '',
        autograph: '',
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.evaluate = Object.assign({}, val.evaluate);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-card {
  ::v-deep .pure-card__body {
    padding: 0;
    // overflow: unset;
  }
}
.createUser,
.createTime {
  color: #879bba;
  margin-right: 10px;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
:deep(.el-descriptions__body) {
  .el-descriptions-item__content {
    min-width: 120px;
    max-width: 500px;
    word-break: break-all; // 让内容超出列宽时自动换行显示
    word-wrap: break-word;
  }
}
.autograph-img{
  width: 100%;
  height: 160px;
}
</style>
