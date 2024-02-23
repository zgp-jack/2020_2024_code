<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 09:50:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 14:22:46
 * @Description:
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      接听信息
    </div>
    <div slot="subHeader">
      <span v-if="formData.createTime" class="createTime">
        报修时间:
        <span>{{ formData.createTime }}</span>
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
      <el-form-item label="报修科室">
        <el-input v-model="formData.deptName " placeholder="" />
      </el-form-item>
      <el-form-item label="故障地址">
        <el-input v-model="formData.faultAddr " placeholder="" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人">
            <el-input v-model="formData.user" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
            <el-input v-model="formData.phone" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
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
        // 报修时间
        createTime: null,
        // 报修科室
        deptName: null,
        // 故障地址
        faultAddr: null,
        // 联系人
        user: null,
        // 联系电话
        phone: null,
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

</style>
