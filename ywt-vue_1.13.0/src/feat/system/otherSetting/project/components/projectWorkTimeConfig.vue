<!-- 项目工时任务配置 -->
<template>

  <el-row>
    <el-col :span="6">
      <el-form ref="form" size="mini" label-width="180px" :model="formData" :rules="rules">
        <el-form-item label="项目任务工时最高" prop="value">
          <el-input-number v-model="formData.value" :precision="1" :step="0.1" :min="0" :max="99999.9" />
          天
        </el-form-item>
        <el-form-item>
          <pure-button label="应用" @click="onSubmit" />
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import OtherSettingApi from '../../api';
export default {
  data() {
    return {
      formData: {
        value: '',
      },
      rules: {
        value: [{ required: true, trgger: 'change',
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('任务工时不能为0'));
            }
            callback();
          }, }],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async   init() {
      const res = await OtherSettingApi.getProjectWorkTime();
      this.formData.value = res.value;
    },
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await OtherSettingApi.updateProjectWorkTime(this.formData.value);
          this.$message.success('更新成功!');
          this.init();
        }
      });
    },
  },
};
</script>

<style></style>
