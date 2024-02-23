<template>
  <el-form ref="form" :rules="rules" :model="formData" size="small" label-width="100px">
    <el-form-item label="终止原因" prop="remark">
      <el-input v-model="formData.remark" type="textarea" />
    </el-form-item>
    <el-form-item style="text-align:right">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ProjectAPI from '@/apis/project/index';
export default {
  props: {
    itemCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rules: {
        remark: [{ required: true, message: '请填写终止原因', }],
      },
      formData: {
        remark: '',
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await ProjectAPI.impose.termination({
            itemCode: this.itemCode,
            ...this.formData,
          });
          this.$message.success({
            message: '终止成功!',
            onClose: () => {
              this.$emit('done');
            },
          });
        }
      });
    },
  },
};
</script>

<style>

</style>
