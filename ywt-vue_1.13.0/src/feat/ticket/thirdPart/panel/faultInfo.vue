<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 09:51:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 14:23:12
 * @Description:
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      故障信息
      <span
        v-if="formData.createUser"
        class="createUser"
      >建单人:
        <span>
          {{ formData.createUser }}
        </span>
      </span>
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
    >
      <el-form-item label="来源">
        <el-input v-model="formData.source " placeholder="" />
      </el-form-item>
      <el-form-item label="故障分类">
        <el-input v-model="formData.faultType " placeholder="" />
      </el-form-item>
      <el-form-item label="故障描述">
        <el-input v-model="formData.faultRemark " type="textarea" :rows="4" placeholder="" />
      </el-form-item>
      <el-form-item label="优先级">
        <el-input v-model="formData.degree " placeholder="" />
      </el-form-item>
      <el-form-item label="影响范围">
        <el-input v-model="formData.rangeType " placeholder="" />
      </el-form-item>
      <el-form-item label="是否终止">
        <el-input v-model="formData.stop " placeholder="" />
      </el-form-item>
      <el-form-item label="服务台解决">
        <el-input v-model="formData.deskSolution " placeholder="" />
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
    info: {
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
        // 建单人
        createUser: null,
        // 来源
        source: null,
        // 故障分类
        faultType: null,
        // 故障描述
        faultRemark: null,
        // 优先级
        degree: null,
        // 影响范围
        rangeType: null,
        // 是否终止
        stop: null,
        // 服务台解决
        deskSolution: null,
      },
    };
  },
  watch: {
    info: {
      handler(val) {
        this.formData = Object.assign({}, val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.disabled {
  background: #f7f7f7;
}
.createUser {
  padding-left: 36px;
}
</style>
