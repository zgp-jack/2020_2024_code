<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-18 15:59:16
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 17:56:30
 * @Description:
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">
        巡检
      </span>
    </div>
    <div class="body">
      <el-row
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <el-col :span="20">
          <inspection-info ref="inspectionInfo" class="inspection-info" v-bind="$attrs" />
        </el-col>
        <el-col :span="4">
          <history class="history" v-bind="$attrs" @view="handleViewInspection" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    History: () => import('../panel/history.vue'),
    InspectionInfo: () => import('@/views/inspection/task/panel/inspectionInfo.vue'),
  },
  async created() {

  },
  methods: {
    async handleViewInspection(id) {
      this.$refs.inspectionInfo.fetchDataWhenView(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.inspection-info {
  height: 100%;
  &::v-deep .pure-card__body {
  height: calc(100% - 50px);
  }
}
.history {
  height: 100%;
  &::v-deep .pure-card__body{
    height: calc(100% - 50px);
  }
}
.body .el-row {
  height: 100%;
}
</style>
