<template>
  <div>
    <div class="form-box">
      <div class="form-box-header">
        <div class="title">
          <div name="title">基本信息</div>
        </div>
      </div>
      <div class="form-box-body" style="padding: 0">
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">生效日期</div></el-col>
          <el-col :span="18" class="grid-content-col">
            <div v-if="formData.effectiveType==1" class="grid-content">立即生效</div>
            <div v-if="formData.effectiveType==2" class="grid-content">指定日期：{{ formData.effectiveStartDate }}至{{ formData.effectiveEndDate }}
              ；到期宽限{{ formData.graceDay==null? 0:formData.graceDay }}天</div>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">巡检责任人</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.inspectUserName }}</div></el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">是否上传图片</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.uploadPhoto==true ? '是':'否' }}</div></el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">异常处理办法</div></el-col>
          <el-col :span="18" class="grid-content-col">
            <div v-if="formData.deadlineRectify==true&&formData.workOrder==true" class="grid-content">限期整改，转工单</div>
            <div v-else-if="formData.deadlineRectify==true" class="grid-content">限期整改</div>
            <div v-else-if="formData.workOrder==true" class="grid-content">转工单</div>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">是否启用</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.isEnable==true ? '是':'否' }}</div></el-col>
        </el-row>
      </div>
    </div>

    <div class="form-box" style="margin-top: 20px">
      <div class="form-box-header">
        <div class="title">
          <div name="title">规则配置</div>
        </div>
      </div>
      <div class="form-box-body" style="padding: 0">
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">巡检周期</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.inspectionCycleName }}；{{ formData.weeklyName }}</div></el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">巡检次数</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.inspectionNum }}次</div></el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">是否固定时间</div></el-col>
          <el-col :span="18" class="grid-content-col">
            <div v-if="formData.isFixedTime==true" class="grid-content">是; {{ formData.executionTimeStr }}</div>
            <div v-if="formData.isFixedTime!=true" class="grid-content">否</div>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">到期宽限天数</div></el-col>
          <el-col :span="18" class="grid-content-col">
            <div v-if="formData.graceDay!=null" class="grid-content">{{ formData.graceDay }}天</div>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">特殊处理</div></el-col>
          <el-col :span="18" class="grid-content-col">
            <div v-if="formData.skipHoliday==true&&formData.skipWeekend==true" class="grid-content">跳过节假日，跳过周末</div>
            <div v-else-if="formData.skipHoliday==true" class="grid-content">跳过节假日</div>
            <div v-else-if="formData.skipWeekend==true" class="grid-content">跳过周末</div>
          </el-col>
        </el-row>
        <el-row class="row-box">
          <el-col :span="6" class="grid-row"><div class="grid-title">处理规则</div></el-col>
          <el-col :span="18" class="grid-content-col"><div class="grid-content">{{ formData.processingRuleName }}</div></el-col>
        </el-row>
      </div>
    </div>
    <div class="form-box" style="margin-top: 20px">
      <div class="form-box-header">
        <div class="title">
          <div name="title">巡检内容</div>
        </div>
      </div>
      <div class="form-box-body">
        <div class="table-box">
          <el-table ref="tableRef" :data="formData.planItemList" height="100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column label="巡检项名称" prop="itemName" />
            <el-table-column label="巡检项类型" prop="itemTypeName" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    currentData: {
      type: Object,
      default() {
        return {
        };
      },
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = newVal;
        }
      },
    },
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
.row-box{
  background: #f0f7f7;
}
.grid-row{
  border: 1px solid #dde9e8;
  border-bottom: none;
}
.grid-title{
  padding: 10px 0 10px 20px;
  color: #757e7e;
}
.grid-content-col{
  border: 1px solid #dde9e8;
  border-bottom: none;
  min-height: 38px;
  background-color: #ffffff;
}
.grid-content{
  padding: 10px 0 10px 20px;
}
.form-box {
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #dde9e8;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    background: #f0f7f7;
    font-size: 16px;
    color: #757e7e;

    .title {
      display: flex;

      &::before {
        display: inline-block;
        content: '';
        width: 6px;
        height: 20px;
        margin-right: 6px;
        background: #006666;
      }
    }
  }

  &-body {
    padding: 16px;
  }
}
.table-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}

</style>

