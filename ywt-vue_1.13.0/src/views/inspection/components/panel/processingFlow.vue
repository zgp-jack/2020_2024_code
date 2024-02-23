<!-- 处理流程 -->
<template>
  <el-card
    style="width:270px;height:100%;"
    shadow="never"
  >
    <div slot="header">
      <el-row class="title-row" type="flex" align="middle">
        <el-col :span="24">处理流程</el-col>
      </el-row>
    </div>
    <div>
      <el-timeline style="padding:0;">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
        >
          <p style="margin-top:0;color:#ccc;"> {{ activity.time }}</p>
          <el-button size="mini" type="primary" plain>{{ activity.status }}</el-button>
          <p>{{ activity.name }} {{ activity.status }}</p>
          <p>原因：{{ activity.reason }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      activities: [{
        time: '2018-04-15',
        status: '终止工单',
        name: '雷管二',
        reason: '报修人已解决',
      }, {
        time: '2018-04-13',
        status: '终止工单',
        reason: '报修人已解决',
        name: '雷管二',
      }, {
        time: '2018-04-11',
        reason: '巡检异常',
        status: '转工单',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        status: '终止工单',
        reason: '报修人已解决',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        status: '终止工单',
        reason: '报修人已解决',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        status: '终止工单',
        reason: '报修人已解决',
        name: '雷管二',
      }],

    };
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  padding: 0 16px 0 0;
}
.el-card ::v-deep .el-card__header {
  padding: 0;
}
.el-card ::v-deep .el-card__body {
  padding: 20px;
  height:  90%;
  overflow-y: scroll;
}
::v-deep .el-card__body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::v-deep .el-card__body::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
.el-card {
  overflow: unset;
  margin-bottom: 16px;
  height: 100%;
  width: 270px;
}
.title-row {
  height: 32px;
  background: #d7e5f9;
  border-radius: 4px 4px 0 0;
  padding: 6px 12px;
  :nth-child(1) {
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  :nth-child(2), :nth-child(3){
    font-size: 12px;
    font-weight: 500;
    color: #879bba;
    span {
      opacity: 1;
      font-size: 12px;
      font-weight: 400;
      color: #2d405e;
    }
  }
}
</style>
