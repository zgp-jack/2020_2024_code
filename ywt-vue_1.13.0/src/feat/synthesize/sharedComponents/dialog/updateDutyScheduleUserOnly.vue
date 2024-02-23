<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-12 18:04:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-08 16:00:06
 * @Description: 只可修改排班人员
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="120px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-form-item
      label-width="0px"
      class="form-item-wrapper"
    >
      <el-form-item label="值班人员" prop="user">
        <engineer-drag-select v-model="formData.user" />
      </el-form-item>
    </el-form-item>
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button size="mini" type="primary" @click="handleSaveScheduleUser">保存</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  components: {
    EngineerDragSelect: () => import('../select/engineerDragSelect'),
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
      formData: {},
      rules: {
        user: [{
          required: true, message: '请选择值班人员', trigger: 'change',
        }],
      },
    };
  },
  created() {
    this.formData = Object.assign({}, this.data);
  },
  methods: {
    async handleSaveScheduleUser() {
      try {
        await this.$refs.form.validate();
        this.$emit('done', [this.formData]);
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

</style>
