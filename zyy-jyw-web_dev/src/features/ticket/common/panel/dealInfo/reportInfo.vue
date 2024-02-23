<template>
  <pure-panel-card class="panel-card">
    <div slot="header">
      报修信息
    </div>
    <div slot="subHeader">

      <span v-if="reportInfo.createTime" class="createTime">
        报修时间:
        <span>{{ reportInfo.createTime }}</span>
      </span>
    </div>
    <el-descriptions
      :column="2"
      border
      :colon="false"
      :label-style="{ width: '120px' }"
    >
      <el-descriptions-item label="报修人">
        {{ reportInfo.user }}
      </el-descriptions-item>
      <el-descriptions-item label="报修电话">
        {{ reportInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item label="报修科室" :span="2">
        {{ reportInfo.deptName }}
      </el-descriptions-item>
      <el-descriptions-item label="报修地址" :span="2">
        {{ reportInfo.place }}
      </el-descriptions-item>
      <el-descriptions-item label="故障地址" :span="2">
        {{ reportInfo.faultAddress }}
      </el-descriptions-item>
      <el-descriptions-item label="报修IP" :span="2">
        {{ reportInfo.ipAddress }}
      </el-descriptions-item>
      <el-descriptions-item label="录音" :span="2">
        <pure-audio
          v-if="reportInfo.recording"
          :key="reportInfo.recording"
          :the-url="reportInfo.recording"
        />
      </el-descriptions-item>
    </el-descriptions>
  </pure-panel-card>
</template>

<script>
import PureAudio from '@/common/components/audio';
export default {
  components: {
    PureAudio,
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      reportInfo: {
        createTime: null,
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.reportInfo = Object.assign({}, val.info);
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
</style>
