<!-- 需求分配 -->
<template>
  <el-form
    ref="ruleForm"
    :model="formData"
    label-position="rigth"
    label-width="120px"
    :rules="rules"
    size="small"
  >
    <el-form-item label="调研负责人" prop="principal">
      <UserSelect v-model="formData.principal" :disabled-value="formData.users" />
    </el-form-item>
    <el-form-item label="调研成员">
      <UserSelect v-model="formData.users" multiple :disabled-value="formData.principal" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button type="primary" size="mini" :loading="submitButtonLoading" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  name: 'Assign',
  mixins: [mixins_base],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        principal: [{
          required: true,
          message: '请选择调研负责人',
          trigger: 'change',
        }],
      },
      formData: {
        principal: '',
        users: '',
      },
      submitButtonLoading: false,

    };
  },

  methods: {

    open() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
      });
    },
    submit() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let params = {};
          params = {
            itemCode: this.itemCode,
            users: this.formData.users,
            principal: this.formData.principal,
          };
          try {
            this.submitButtonLoading = true;
            await ProjectAPI.demand.setAssign(params);
            this.$message.success('分配成功!');
            this.submitButtonLoading = false;
            this.$emit('done');
          } catch (e) {
            this.submitButtonLoading = false;
            this.$message.error(e);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.t-r {
  text-align: right;
}
.w-100{
  width: 100%;
}

</style>
