<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:55:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:58:23
 * @Description: 登录页面
-->

<template>
  <div class="login">
    <div class="login_bg">
      <div class="login_positionbox">
        <div class="Leftbox">
          <img src="../../../public/images/logo.png">
        </div>
        <div class="Rightbox">
          <div style="width: 240px">
            <el-form ref="form" :model="formData" :rules="rules">
              <el-form-item prop="userName">
                <el-input
                  v-model="formData.userName"
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user-solid"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="formData.password"
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  type="password"
                  @keyup.enter.native="handleLoginWithPWD"
                />
              </el-form-item>
              <el-form-item prop="permisstionId">
                <el-select
                  v-model="formData.permisstionId"
                  placeholder="请选择权限"
                  class="year2"
                  :disabled="deptRoles.length<1"
                  clearable
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
            <button
              ref="loginBtn"
              class="loginbtn"
              :disabled="deptRoles.length<1"
              @click="handleLoignWithDept"
            >
              登录
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        userName: null,
        passowrd: null,
        permisstionId: null,
      },
      deptRoles: [],
      // 临时token
      tempRefreshToken: null,
      disableLoginButton: true,
      // 验证规则
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur', }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur', }],
      },
      secondRules: {
        permisstionId: [
          { required: true, message: '请选择登录权限', trigger: 'change', }
        ],
      },
    };
  },
  methods: {
    async handleLoginWithPWD() {
      try {
        await this.$refs.form.validate();
        const { userName, password, } = this.formData;
        const { deptRoles, refreshToken, } = await this.$store.dispatch('login/LOGIN_WITH_PWD', { userName, password, });
        this.tempRefreshToken = refreshToken;
        this.deptRoles = deptRoles;
        if (this.deptRoles.length > 0) {
          this.formData.permisstionId = this.deptRoles[0].id;
        }
        this.rules = Object.assign({}, this.rules, this.secondRules);
        this.$nextTick(() => {
          this.$refs.loginBtn.focus();
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
    async handleLoignWithDept() {
      try {
        await this.$refs.form.validate();
        const { permisstionId, } = this.formData;
        await this.$store.dispatch('login/LOGIN_WITH_DEPT', { id: permisstionId, refreshToken: this.tempRefreshToken, });
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
    .login_positionbox {
      width: 854px;
      height: 507px;
      display: flex;
      border-radius: 5px;
      .Leftbox {
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

      .Rightbox {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 0px 16px 16px 0px;
        .loginbtn {
          width: 100%;
          height: 36px;
          text-align: center;
          line-height: 36px;
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
          width: 220px;
          border-top-width: 0px;
          border-left-width: 0px;
          border-right-width: 0px;
          border-bottom-width: 1px;
          // outline: medium;
          border-radius: 0;
        }
        ::v-deep .el-form-item__error {
          left: 10px;
        }
      }
    }
  }
}
</style>
