<template>
  <JYWPanel
    title="需求分配"
  >
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
    </el-form>

  </JYWPanel>
</template>

<script>
import ProjectAPI from '@/apis/project';
import { mixins_base, } from '@/minxins/project';

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
    };
  },

  methods: {

    open() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
      });
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            let params = {};
            params = {
              itemCode: this.itemCode,
              users: this.formData.users,
              principal: this.formData.principal,
            };
            try {
              await ProjectAPI.demand.setAssign(params);
              this.$message.success('分配成功!');
              resolve();
            } catch (e) {
              this.$message.error(e);
              reject(e);
            }
          } else {
            reject('表单验证未通过');
          }
        });
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
