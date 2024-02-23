<template>
  <div class="pure-navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebarStatus"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="home_header_right">
      <div class="home_user_bar">
        <!-- <div class="msg_item panel_item" @click="onShowMsg">
          <i class="el-icon-bell" />
        </div> -->
        <el-badge :value="msgValue" :hidden="msgValue > 0 ? false : true" :max="99" class="msg_item_panel_item">
          <i class="el-icon-bell" @click="onShowMsg" />
        </el-badge>
        <!--        <div class="panel_item">
          <el-dropdown trigger="click">
            <div>
              <span>{{ userData.deptName }}-{{ userData.roleName }}</span>
              <i class="el-icon-arrow-down" style="margin-right: 15px;margin-left: 15px" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(departs,index) in deptRoleList" :key="index">
                <el-dropdown placement="right-start">
                  <div class="dept_user_box">
                    {{ departs.deptName }} <i class="el-icon-arrow-down el-icon&#45;&#45;right" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(role,index1) in departs.children" :key="index1">
                      <div class="dept_user_item" @click="switchDepart(role)">
                        {{ role.roleName }}
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>-->
        <div class="panel_item">
          <el-dropdown trigger="click">
            <div style="cursor: pointer;display: flex;align-items: center;height: 100%;">
              <div class="item_user_avatar">
                <img v-if="userData.avatar" :src="userData.avatar">
                <img v-else :src="defaultHeader">
              </div>
              <span>{{ userData.nickName }}</span>
              <i class="el-icon-arrow-down" style="margin-right: 15px;margin-left: 15px" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="user_avatar_box">
                  <div class="user_avatar_body">
                    <div class="user_avatar_left">
                      <img v-if="userData.avatar" :src="userData.avatar">
                      <img v-else :src="defaultHeader">
                    </div>
                    <div class="user_avatar_right">
                      <div class="user_avatar_right_name">
                        {{ userData.nickName }}
                      </div>
                      <div class="user_avatar_right_dept">
                        {{ userData.deptName }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="user_avatar_item_box" @click="onUpdatePass">
                  <i class="iconfont icon-suo" />
                  修改密码
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="user_avatar_item_box" @click="toLogout">
                  <i class="iconfont icon-tuichu" />
                  退出系统
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <el-dialog title="修改密码" :width="'30%'" :visible.sync="dialogPassVisible" @closed="onPassDialogClosed">
      <el-form ref="formRef" label-width="120px" :model="passFormData" :rules="rules">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passFormData.oldPassword" autocomplete="old-password" type="password" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passFormData.newPassword" autocomplete="new-password" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passFormData.confirmPassword" autocomplete="confirm-password" type="password" placeholder="请输入确认密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Hamburger from '@/common/components/hamburger';
import { logout, updatePwd, updateDeptRole, } from './api';
import { mapGetters, } from 'vuex';
import LoginApi from '@/features/login/api';

export default {
  components: {
    Hamburger,
  },
  data() {
    return {
      dialogVisible: false,
      loadingMessageDataList: true,
      messageDataList: [],
      deptRoleList: [],
      defaultHeader: require('@/assets/images/defaultUserProfile.jpg'),
      dialogPassVisible: false,
      passFormData: {},
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    msgValue() {
      return this.$store.state.APP.msgValue || 0;
    },
    userData() {
      return this.userInfo;
    },
    sidebarStatus() {
      return this.$store.state.APP.sidebar.opened;
    },
    rules() {
      const checkPassword = (rule, value, callback) => {
        const confirmPassword = this.passFormData.confirmPassword;
        const newPassword = this.passFormData.newPassword;
        if (newPassword !== confirmPassword) {
          callback(new Error('确认密码和新密码不一致'));
        } else {
          callback();
        }
      };
      return {
        oldPassword: [
          { required: true, message: '请输入当前密码', },
          { max: 50, message: '当前密码不超过50字符', },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', },
          { max: 50, message: '新密码不超过50字符', },
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', },
          { validator: checkPassword, },
          { max: 50, message: '确认密码不超过50字符', },
        ],
      };
    },
  },
  mounted: function () {
    this.getDeptRoleList();
  },
  methods: {
    async getDeptRoleList() {
      // const data = await getDeptRoleList();
      // this.deptRoleList = this.handleData(data, 'deptName');
      this.deptRoleList = [];
    },
    handleData(list, key) {
      // 得到数据的主键列表
      const keysArr = list.map(item => item[key]);
      const keys = [...new Set(keysArr),
      ];
      const newList = keys.map(item => {
        return {
          // 这里写新的 数据结构 如下是整体复制
          [key]: item,
          children: list.filter(i => i[key] === item),
        };
      });
      return newList;
    },
    onClose() {
      this.dialogVisible = false;
    },
    onMessageIcon() {
      this.dialogVisible = true;
    },
    toggleSideBar() {
      this.$store.dispatch('APP/TOGGLE_SIDEBAR');
    },
    /* 切换部门角色 */
    switchDepart(data) {
      updateDeptRole(data.id).then(() => {
        this.$message.success('操作成功');
        LoginApi.getUserInfo().then((data) => {
          this.$store.commit('APP_LOGIN/SET_USER_INFO', {
            user: data.user,
          });
          location.reload();
        });
      })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    /* 点击消息 */
    onShowMsg() {
      this.$router.push({ path: '/message', });
    },
    /*  修改密码*/
    onUpdatePass() {
      this.dialogPassVisible = true;
    },
    onPassDialogClosed() {
      this.updatePassReset();
    },
    updatePassReset() {
      this.passFormData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    updatePass() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const data = { ...this.passFormData, };
          updatePwd(data)
            .then(() => {
              this.$message.success('操作成功');
              this.dialogPassVisible = false;
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      });
    },
    toLogout() {
      this.$confirm('确认退出当前用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        logout().then(() => {
          this.$message({
            type: 'success',
            message: '退出成功',
          });
          // 清理掉个人的一些信息
          this.$store.commit('APP_LOGIN/SET_USER_INFO', {
            user: null,
          });
          this.$router.push({ path: '/login', });
        })
          .catch(() => {
            // 清理掉个人的一些信息
            this.$store.commit('APP_LOGIN/SET_USER_INFO', {
              user: null,
            });
            this.$router.push({ path: '/login', });
            location.reload();
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出',
        });
      });
    },
    onShowBigScreen() {
      window.open('#/big-screen', '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
::v-deep .el-table th.gutter { /*解决el-table加了gutter后 边框出现白边*/
  display: table-cell !important;
  background: #fff !important;
}

::v-deep .el-dialog__body {
  padding: 0 20px 20px 20px;
}

::v-deep .el-dialog__header {
  // padding: 20px 0px 0 0px;
}

.custom-title {
  font-weight: 400;
  font-size: 18px;
  color: #334266;
  // padding: 16px 16px 0 20px;
  // border-bottom: 1px solid #E6EAF2;
}
.msg_item_panel_item {
  display: flex;
  cursor: pointer;
}
.icon-bell {
  font-size: 22px;
  color: #5a5e66;

}

.badge-bell {
  margin-right: 38px;

}

.table-wrapper {
  overflow: auto;
  max-height: 516px;
}

.pure-navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #F4F6FA;
  display: flex;
  justify-content: space-between;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      // height: 100%;
      font-size: 24px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      display: flex;
      height: 100%;
      align-items: center;

    }
  }
}

.noteBookIcon {
  cursor: pointer;
  width: 20px;
  height: 24px;
  line-height: 36px;
}
/* 右上角 下拉*/
.dept_user_box{
  @include font_color_imp('color-primary');
  padding: 2px 12px;
}
.dept_user_item{
  @include font_color_imp('color-primary');
  padding: 4px 12px;
}

/*顶部右上角*/
.home_header_right {
  display: flex;
  align-items: center;
  height: 64px;
  line-height: 64px;
}

.home_user_bar {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 18px;
}

.panel_item {
  padding: 0 10px;
  cursor: pointer;
}

// .user_avatar {
//   font-size: 20px;
// }

.user_avatar_item_box {
  padding: 2px 10px;
}

.user_avatar_box {
  height: 62px;
  width: 100%;
}

.user_avatar_body {
  display: flex;
  padding: 8px 12px;
}

.user_avatar_left {
  position: absolute;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    line-height: 1.2;
  }
}
.item_user_avatar {
  height: 100%;
  padding: 0 12px;
  img {
    width: 32px;
    height: 32px;
    vertical-align: -10px;
    border-radius: 50%;
  }
}

.user_avatar_right {
  margin-left: 60px;
  padding: 0 6px;
}

.user_avatar_right_name {
  font-size: 13px;
  line-height: 24px;
  font-weight: bold;
}

.user_avatar_right_dept {
  font-size: 12px;
  line-height: 24px;
}

/*消息*/
.msg_item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
