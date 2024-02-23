<!-- 历史记录 -->
<template>
  <el-card shadow="never" style="max-width:255px;height:100%;">
    <div slot="header">
      <el-row class="title-row" type="flex" align="middle">
        <el-col :span="24">历史记录</el-col>
      </el-row>
    </div>
    <div>
      <el-timeline style="padding:0;">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
        >
          <p style="margin-top:0;color:#ccc;"> {{ activity.time }}</p>
          <p>{{ activity.name }} {{ activity.normal }}</p>
          <p v-if="activity.normal !== '正常'">{{ activity.processingmethod }} ：{{ activity.rectification }}</p>
          <el-button size="mini" type="primary" plain @click="seeWorkOrder">查看</el-button>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<script>
import viewWorkOrder from '../dialog/viewWorkOrder';
export default {
  data() {
    return {
      activities: [{
        time: '2018-04-15',
        normal: '正常',
        name: '雷管二',
        processingmethod: '',
        rectification: '',
      }, {
        time: '2018-04-13',
        normal: '异常',
        processingmethod: '转工单',
        rectification: '156465123165165',
        name: '雷管二',
      }, {
        time: '2018-04-11',
        normal: '异常',
        processingmethod: '转工单',
        rectification: '156465123165165',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        normal: '正常',
        processingmethod: '限期整改',
        rectification: '2018-04-11',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        normal: '异常',
        processingmethod: '限期整改',
        rectification: '2018-04-11',
        name: '雷管二',
      }, {
        time: '2018-04-13',
        normal: '异常',
        processingmethod: '限期整改',
        rectification: '2018-04-11',
        name: '雷管二',
      }],

    };
  },
  methods: {
    seeWorkOrder() {
      this.$innerDrawer({
        title: '工单信息',
        width: '1200px',
        position: 'right-bottom',
        component: () => <viewWorkOrder />,
      });
    },
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
  margin-left: 10px;
  width: 300px;
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
