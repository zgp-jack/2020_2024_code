<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:55:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-13 16:04:08
 * @Description: 登录页面
-->

<template>
  <div class="login">
    <div class="login_bg">
      <div class="login-position-box">
        <div class="left-box">
          <img src="../../../public/images/logo.png">
        </div>
        <div class="right-box">
          <div style="width: 260px">
            <div v-show="!isDealForget" class="login-form">
              <el-form ref="form" :model="formData" :rules="rules">
                <el-form-item prop="userName">
                  <el-input
                    ref="userName"
                    v-model="formData.userName"
                    placeholder="请输入账号"
                    prefix-icon="el-icon-user-solid"
                    @keyup.enter.native="focusPassword"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    ref="password"
                    v-model="formData.password"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    type="password"
                    @blur="blurUserNameAndPassword"
                    @keyup.enter.native="blurUserNameAndPassword"
                  />
                </el-form-item>
                <el-row v-if="isNeedCatpcha">
                  <el-col :span="12">
                    <el-form-item prop="verCode">
                      <el-input
                        v-model="formData.verCode"
                        placeholder="验证码"
                        @blur="blurUserNameAndPassword"
                        @keyup.enter.native="blurUserNameAndPassword"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-image :src="codeImg" alt="验证码" @click="refreshCode">
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </el-col>
                </el-row>

                <el-form-item prop="permissionId">
                  <el-select
                    ref="permissionId"
                    v-model="formData.permissionId"
                    :placeholder="placeholder"
                    class="year2"
                    clearable
                    @change="changePermissionId"
                  >
                    <el-option
                      v-for="(item, index) in deptRoles"
                      :key="index"
                      :label="item.deptName+'-'+item.roleName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <el-button
                ref="loginBtn"
                class="login-btn"
                size="mini"
                :disabled="deptRoles.length<1"
                @click="onLoginWithDept"
              >
                登录
              </el-button>
              <div class="forget-pwd base-margin-top">
                <span class="forget-btn" @click="isDealForget=true">忘记密码?</span>
              </div>
            </div>
            <div v-show="isDealForget" class="forget-form">
              <i class="el-icon-arrow-left title-bar" @click="onBack">忘记密码</i>
              <div v-show="!isSendCaptcha">
                <el-form>
                  <el-form-item prop="account" :error="accountError">
                    <el-input
                      v-model="account"
                      placeholder="请输入账号"
                    />
                  </el-form-item>
                </el-form>
                <el-button
                  ref="nextBtn"
                  class="next-btn"
                  size="mini"
                  @click="onClickNext"
                >
                  下一步
                </el-button>
              </div>
              <div v-show="isSendCaptcha">
                <div class="tip">
                  验证码已发送至账号{{ account }}加入的企业微信
                </div>
                <el-form>
                  <el-form-item>
                    <div class="bind-code">
                      <el-form-item prop="verificationCode" :error="vCodeError">
                        <el-input v-model="verificationCode" placeholder="验证码" class="bind-code-input code" />
                        <span v-if="count>0" class="pure-code-btn">{{ count }}秒后重发</span>
                        <span v-else class="pure-code-resend-btn" @click="onResend">重新发送</span>
                      </el-form-item>

                    </div>

                  </el-form-item>

                  <el-form-item prop="newPwd" :error="newPwdError">
                    <el-input
                      ref="pwd"
                      v-model="newPwd"
                      placeholder="新密码"
                      show-password
                    />
                  </el-form-item>
                </el-form>
                <el-button
                  ref="completeBtn"
                  class="complete-btn"
                  size="mini"
                  @click="onUpdatePwd"
                >
                  完成
                </el-button>
              </div>
            </div>
            <div class="version">
              版本号：{{ version }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LoginApi from './api';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { mapActions, } from 'vuex';
const DelayCount = 60 * 5;
export default {
  name: 'LoginPage',
  data() {
    return {
      placeholder: '请选择登录权限',
      formData: {
        userName: null,
        password: null,
        permissionId: null,
        uuid: null,
        verCode: '',
      },
      account: '',
      accountError: null,
      newPwdError: null,
      vCodeError: null,
      count: DelayCount,
      timerInterval: null,
      msg: '',
      // 是否在进行忘记密码操作
      isDealForget: false,
      // 是否已发送验证码
      isSendCaptcha: false,
      verificationCode: null,
      newPwd: null,
      deptRoles: [],
      // 临时token
      tempRefreshToken: null,
      disableLoginButton: true,
      // 验证规则
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur', }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur', }],
        verCode: [{ required: true, message: '请输入验证码', trigger: 'change', }],
      },
      secondRules: {
        permissionId: [
          { required: true, message: '请选择登录权限', trigger: 'change', }
        ],
      },
      firstIn: true,
      version: '1.0.0',
      // 验证码
      codeImg: '',
      // 是否需要验证码
      isNeedCatpcha: false,
    };
  },
  watch: {
    'formData.userName': {
      handler(newV, oldV) {
        this.deptRoles = [];
        this.placeholder = '请选择登录权限';
        this.formData.password = null;
        this.formData.permissionId = null;
      },
    },
    'formData.password': {
      handler(newV, oldV) {
        this.deptRoles = [];
        this.placeholder = '请选择登录权限';
        this.formData.permissionId = null;
      },
    },
  },
  mounted() {
    this.version = Cookies.get('version');
    this.$refs.pwd.passwordVisible = true;
    this.getLoginConfig();
    this.GET_ENCRYPTION_KEY();
  },
  updated() {
    if (this.formData.userName === null || this.formData.password === null) {
      this.formData.userName = this.$refs.userName.value;
      this.formData.password = this.$refs.password.value;
    }
  },
  methods: {
    ...mapActions('login', ['GET_ENCRYPTION_KEY']),
    async  getLoginConfig() {
      const res = await LoginApi.getLoginSystemConfig();
      this.isNeedCatpcha = res?.value === '1';
      if (this.isNeedCatpcha) {
        this.getVerificationCode();
      }
      console.log(res, '登录系统配置');
    },
    // 刷新验证码
    refreshCode: _.debounce(function () {
      this.getVerificationCode();
    }, 300),

    // 获取验证码
    async getVerificationCode() {
      this.formData.verCode = '';
      const res = await LoginApi.getCodeImg();
      this.codeImg = res?.img || '';
      this.formData.uuid = res?.uuid || '';
    },

    focusPassword() {
      this.$refs.password.focus();
    },
    // blurUserNameAndPassword() {
    //   if (this.isNeedCatpcha) {
    //     if (this.formData.userName && this.formData.password && this.firstIn && this.formData.verCode) {
    //       this.firstIn = false; // 迂回处理 密码框内回车和密码框失焦触发两次下面方法
    //       this.handleLoginWithPWD();
    //     } else {
    //       this.firstIn = true;
    //     }
    //   } else {
    //     if (this.formData.userName && this.formData.password && this.firstIn) {
    //       this.firstIn = false;
    //       this.handleLoginWithPWD();
    //     } else {
    //       this.firstIn = true;
    //     }
    //   }
    // },
    blurUserNameAndPassword() {
      const isFormComplete = this.formData.userName && this.formData.password;
      const isVerCodePresent = this.isNeedCatpcha ? this.formData.verCode : true;
      if (this.isNeedCatpcha) {
        this.$refs.form.validateField('verCode');
      }
      if (isFormComplete && this.firstIn && isVerCodePresent) {
        this.firstIn = false;
        this.handleLoginWithPWD();
      } else {
        this.firstIn = true;
      }
    },
    changePermissionId(id) {
      this.formData.permissionId = id;
      this.onLoginWithDept();
    },
    countDown() {
      this.count = DelayCount;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.count > 0) {
          this.count--;
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
    async handleLoginWithPWD() {
      try {
        // await this.$refs.form.validate();
        this.placeholder = '获取权限中...';
        const { userName, password, uuid, verCode, } = this.formData;
        const { deptRoles, refreshToken, } = await this.$store.dispatch('login/LOGIN_WITH_PWD', { userName, password, uuid, verCode, });
        this.tempRefreshToken = refreshToken;
        this.deptRoles = deptRoles;
        this.rules = Object.assign({}, this.rules, this.secondRules);
        this.$nextTick(() => {
          this.deptRoles.length > 0 ? this.formData.permissionId = this.deptRoles[0].id : this.placeholder = '暂无权限,请联系管理员。';
          this.$refs.permissionId.toggleMenu();// 弹出权限下拉框 用户选择需要的权限登录
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
          this.deptRoles = [];
          this.formData.permissionId = null;
          // 刷新验证码
          this.refreshCode();
          this.placeholder = '暂无权限,请联系管理员';
        }
      }
    },
    async onLoginWithDept() {
      try {
        await this.$refs.form.validate();
        const { permissionId, } = this.formData;
        this.formData.permissionId && await this.$store.dispatch('login/LOGIN_WITH_DEPT', { id: permissionId, refreshToken: this.tempRefreshToken, });
        this.$router.push({
          path: '/',
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onClickNext() {
      this.accountError = null;
      if (!this.account) {
        this.accountError = '请输入账号';
        return;
      }
      try {
        await LoginApi.sendVerificationCode(this.account);
      } catch (error) {
        if (error?.message.includes('未加入企业微信')) {
          this.$alert('未加入企业微信,请联系管理员重置密码', '提示', {
            confirmButtonText: '知道了',
          });
          return;
        } else if (error?.message.includes('账号不存在')) {
          this.accountError = '账号不存在,请重新输入';
          return;
        }
      }

      this.isSendCaptcha = true;
      this.countDown();
    },
    async onUpdatePwd() {
      this.vCodeError = null;
      this.newPwdError = null;
      if (!this.verificationCode) {
        this.vCodeError = '请输入验证码';
        return;
      }
      if (!/^\d{4}$/.test(this.verificationCode)) {
        this.vCodeError = '验证码错误,请重新输入';
        return;
      }
      if (!this.newPwd) {
        this.newPwdError = '请输入新密码';
        return;
      }
      if (this.newPwd.toString().length < 6 || this.newPwd.toString().length > 18) {
        this.newPwdError = '密码长度为6-18位';
        return;
      }
      try {
        await LoginApi.resetPwd({ password: this.newPwd, userName: this.account, verificationCode: this.verificationCode, });
      } catch (error) {
        if (error?.message.includes('验证码错误')) {
          this.vCodeError = '验证码错误,请重新输入';
        } else if (error?.message.includes('验证码失效')) {
          this.vCodeError = '验证码失效';
        }
        return;
      }

      this.$message.success('密码修改成功！');
      this.onBack();
    },
    onBack() {
      this.isSendCaptcha = false;
      this.isDealForget = false;
    },
    async onResend() {
      await LoginApi.sendVerificationCode(this.account);
      this.countDown();
    },
  },
};
</script>
<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  .login_bg {
    width: 100%;
    height: 100%;
    background: url(../../../public/images/background.png);
    display: flex;
    justify-content: center;
    align-items: center;
    .login-position-box {
      width: 854px;
      height: 507px;
      display: flex;
      border-radius: 5px;
      .left-box {
        flex: 1;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius:  16px 0px 0px 16px;
        img {
          width: 225px;
          height: 106px;
        }
      }

      .right-box {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 0px 16px 16px 0px;
        position: relative;
        .login-btn ,.next-btn,.complete-btn{
          width: 100%;
          height: 36px;
          text-align: center;
          // line-height: 36px;
          color: #fff;
          font-size: 20px;
          letter-spacing: 10px;
          border-radius: 8px;
          background-color: #324470;
          border: none;
          margin-top: 30px;
          outline: none;
          &:focus {
            color: #409EFF;
          }
          div {
            width: 240px;
          }
        }
        .year {
          ::v-deep .el-input__inner {
            //如果你的style 加了scoped 需要加/deep/
            background: url("../../../public/images/search_icon.png") no-repeat; //引入icon
            background-size: 12px 12px; //这个是图片的大小，在这里不能直接设置width  height,设置宽高其实是select的宽高，图片可能会失真只设置宽度  高度auto也行
            background-position: 11px 11px; //在input中定位置  这两个参数是x  y坐标
            padding: 0 0 0 30px; //需要设置padding 把placeholder向右移
            box-sizing: border-box;
            font-size: 18px;
          }
        }
        .year2 {
          ::v-deep .el-input__inner {
            //如果你的style 加了scoped 需要加/deep/
            background: url("../../../public/images/dept_icon.png") no-repeat; //引入icon
            background-size: 12px 12px; //这个是图片的大小，在这里不能直接设置width  height,设置宽高其实是select的宽高，图片可能会失真只设置宽度  高度auto也行
            background-position: 11px 11px; //在input中定位置  这两个参数是x  y坐标
            padding: 0 0 0 30px; //需要设置padding 把placeholder向右移
            box-sizing: border-box;
            font-size: 18px;
          }
        }

        ::v-deep .el-input__inner {
          width: 260px;
          border-top-width: 0px;
          border-left-width: 0px;
          border-right-width: 0px;
          border-bottom-width: 1px;
          // outline: medium;
          border-radius: 0;
        }
        ::v-deep .el-form-item__error {
          left: 10px;
          padding-top: 0px;
          z-index: 99999;
        }
      }
    }
  }
  .version {
    text-align: center;
    color: #7D8DB3;
    font-size: $--pure-little-font-size;
    position: absolute;
    bottom: 16px;
    right: 0;
    left: 0;
  }
  .forget-pwd {
    text-align: right;
    .forget-btn {
      cursor: pointer;
      font-size: 14px;
      color: #334266;
    }
  }
  .forget-form {
    .title-bar {
      color: #334266;
      font-size: $--pure-base-font-size;
      cursor: pointer;
      margin-bottom: 48px;
    }
    .tip {
      margin-bottom:35px;
      color: #334266;
    }
    .next-btn {
      margin-bottom: 100px;
    }
  }
  .bind-code {
    position: relative;
    width: 300px;
  }
  .pure-code-btn,.pure-code-resend-btn {
    position: absolute;
    top: 7px;
    left: 139px;
    line-height: 24px;
    padding-left: 15px;
    border-left: 1px solid #334266;
    opacity: 0.4;

  }
  .pure-code-resend-btn {
    opacity: 1;
    padding-left: 30px;
    border-left: 1px solid #33426652;
    cursor: pointer;
  }
}
</style>
