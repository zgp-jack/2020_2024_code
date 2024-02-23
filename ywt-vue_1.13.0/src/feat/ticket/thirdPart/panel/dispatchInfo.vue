<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 10:40:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 14:22:58
 * @Description:派单信息面板
-->
<template>
  <pure-card class="max-height" :disabled="disabled" :show-expand="showExpand" v-bind="$attrs">
    <div slot="header">
      派单信息
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
      :disabled="disabled"
    >

      <el-row>
        <el-col :span="12">
          <el-form-item label="派单人">
            <el-input v-model="formData.dispatchUser" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="派单方式">
            <el-input v-model="formData.dispatchMethod" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="派单时间">
        <el-input v-model="formData.sendTime" placeholder="" />
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
        // 派单人
        dispatchUser: null,
        // 派单方式
        dispatchMethod: null,
        // 派单时间
        sendTime: null,

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
