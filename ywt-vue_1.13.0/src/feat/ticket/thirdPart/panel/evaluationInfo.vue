<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 09:51:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 14:23:02
 * @Description:
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      评价
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
    >
      <el-form-item label="评价时间">
        <span> {{ formData.evaluateTime }}</span>

      </el-form-item>
      <el-form-item label="服务态度">
        <el-rate v-model="formData.serviceAttitude " :max="5" />
      </el-form-item>
      <el-form-item label="技术水平">
        <el-rate v-model="formData.technicalLevel " :max="5" />
      </el-form-item>
      <el-form-item label="处理速度">
        <el-rate v-model="formData.processSpeed " :max="5" />
      </el-form-item>
      <el-form-item label="评价人">
        <span> {{ formData.evaluateUser }}</span>
      </el-form-item>
      <el-form-item label="评价结果">
        <span> {{ formData.evaluateResult }}</span>
      </el-form-item>

    </el-form>
  </pure-card>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    ss: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        // 评价时间
        evaluateTime: null,
        // 服务态度
        serviceAttitude: null,
        // 技术水平
        technicalLevel: null,
        // 处理速度
        processSpeed: null,
        // 评价人
        evaluateUser: null,
        // 评价结果
        evaluateResult: null,
      },
    };
  },
  watch: {
    ss: {
      handler(val) {
        console.log(val);
        this.formData = Object.assign({}, val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-rate {
  display: inline-block;
}
.max-height ::v-deep .el-form-item__content {
  line-height: 32px;
}
</style>
