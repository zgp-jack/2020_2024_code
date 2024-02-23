<template>
  <div class="page-login">
    <div class="login-form">
      <img src="./images/logo.png" alt="logo" class="logo">
      <p class="title">登录</p>
      <el-form ref="formRef" :model="formData" :rules="rules">
        <el-form-item prop="username">
          <div class="input-block">
            <img src="./images/icon-user.png" alt="icon-user" class="input-icon">
            <input v-model="formData.username" placeholder="请输入登录账号" class="input">
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="input-block">
            <img src="./images/icon-password.png" alt="icon-password" class="input-icon">
            <input v-model="formData.password" type="password" placeholder="请输入密码" class="input">
          </div>
        </el-form-item>
        <!--        <el-form-item prop="role">
          <div class="input-block">
            <img src="./images/icon-role.png" alt="icon-role" class="input-icon">
            <el-select v-model="formData.role" placeholder="选择角色" class="select">
              <el-option v-for="role in roleList" :key="role.id" />
            </el-select>
          </div>
        </el-form-item>-->
        <el-form-item>
          <pure-button type="major" label="登录" class="submit-btn" @click="onSubmit" />
        </el-form-item>
      </el-form>
      <div class="tips-box">
        <span>版本号：2.0.0</span>
        <!--  <pure-button type="text" label="忘记密码?" />-->
      </div>
    </div>
    <img src="./images/figure.png" alt="figure" class="figure">
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      formData: {
        username: '',
        password: '',
        role: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', },
        ],
        password: [
          { required: true, message: '请输入密码', },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$store.dispatch('APP_LOGIN/LOGIN', this.formData).then(async (res) => {
            await this.$store.dispatch('APP/ADD_MENU_A');
            this.$router.push('/');
          }).catch(error => {
            this.$message.error(error);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-login {
  height: 100%;
  display: flex;
  justify-content: space-between;
  background: #fff;
  .figure {
    height: 100%;
  }
  .login-form {
    width: 520px;
    padding-left: 180px;
    padding-top: 96px;
    .el-form-item {
      margin-bottom: 48px;
    }
    .logo {
      width: 520px;
      height: 100px;
      margin-bottom: 160px;
    }
    .title {
      line-height: 40px;
      font-size: 32px;
      color: #3D3D3D;
      font-weight: 700;
    }
    .input-block {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #BFCBD1;
      .input-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
      .input {
        flex: auto;
        line-height: 26px;
        font-size: 18px;
        color: #BFCBD1;
        border: none;
        outline: none;
        &::placeholder {
          font-size: 18px;
          color: #BFCBD1;
        }
      }
      .select {
        flex: auto;
        :deep(.el-input__inner) {
          padding: 0;
          border: none;
          font-size: 18px;
          color: #BFCBD1;
        }
        :deep(.el-select__caret) {
          font-size: 18px;
           color: #799F9F !important;
           font-weight: bold;
        }
      }
    }
    .submit-btn {
      width: 100%;
      height: 40px;
    }
  }
  .tips-box {
    display: flex;
    justify-content: space-between;
    line-height: 22px;
    font-size: 14px;
    color: #757E7E;
  }
}
</style>
