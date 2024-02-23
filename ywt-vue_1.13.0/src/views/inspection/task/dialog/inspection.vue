<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-18 15:58:56
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 17:55:35
 * @Description:
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">巡检</span>
    </div>
    <div class="body">
      <inspection-info ref="inspectionInfo" class="card" v-bind="$attrs" />
    </div>
    <div class="footer">
      <el-button
        type="primary"
        size="mini"
        @click="handleSubmit"
      >提交</el-button>
      <el-button
        size="mini"
        class="btn"
        @click="handleSave"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import InspectionTaskApi from '@/apis/inspection/task';
export default {
  components: {
    InspectionInfo: () => import('../panel/inspectionInfo.vue'),
  },
  methods: {
    async handleSave() {
      try {
        const data = await this.$refs.inspectionInfo.check(false);
        await InspectionTaskApi.saveInspection(data);
        this.$message({
          type: 'success',
          message: '保存成功',
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
    async handleSubmit() {
      try {
        const data = await this.$refs.inspectionInfo.check();

        await InspectionTaskApi.submitInspection(data);
        this.$message({
          type: 'success',
          message: '提交成功',
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
    max-height:calc(100% - 50px);
    height: calc(100% - 50px);
  }
}
.btn {
  border: 1px solid #409eff;
  border-color: #409eff;
  color: #409eff;
  margin-left: 30px;
}
.btn.el-button--primary {
  color: white;
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
</style>
