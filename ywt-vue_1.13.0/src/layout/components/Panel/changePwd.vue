<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-17 10:36:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 11:35:51
 * @Description:修改密码面板
-->
<template>
  <div>
    <el-form
      ref="form"
      label-position="right"
      label-width="95px"
      size="mini"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="formData.oldPwd" type="password" auto-complete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="pwd">
        <el-input v-model="formData.pwd" type="password" auto-complete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="formData.confirmPwd" type="password" auto-complete="off" />
      </el-form-item>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          @click="submit"
        >确认修改</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import LoginApi from '@/feat/login/api';
import {
  removeToken,
} from '@/utils/auth';
export default {
  data() {
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6-18位'));
      } else {
        callback();
      }
    };
    const validateConfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      formData: {
        pwd: '',
        oldPwd: '',
        confirmPwd: '',
      },
      rules: {
        oldPwd: [
          {
            required: true, message: '请输入旧密码', trigger: 'blur',
          }
        ],
        pwd: [
          { required: true, validator: validatePwd, trigger: 'blur', }

        ],
        confirmPwd: [
          { required: true, validator: validateConfirmPwd, trigger: 'blur', }

        ],
      },
    };
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        await LoginApi.changePWD(this.formData);
        removeToken();
        location.reload();
      } catch (error) {
        if (error) {
          this.$message({
            message: error,
            type: 'error',
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
