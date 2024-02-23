<template>
  <div class="setting-mail" :style="{zIndex:zIndex}" @mouseover="showtrue" @mouseout="showfalse">
    <!-- <div class="setting-img">
      <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
    </div> -->
    <el-card v-show="true" class="setting-content">
      <div class="setting-data">
        <div class="setting-data-img">
          <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
        </div>
        <div>
          <p>{{ userInfo.name }}</p>
          <el-tooltip placement="top" :content="userInfo.deptName">
            <p>{{ userInfo.deptName }}</p>
          </el-tooltip>
        </div>
        <el-tooltip placement="top" :content="userInfo.roleName">
          <div class="setting-data-tag">{{ userInfo.roleName }}</div>
        </el-tooltip>
      </div>
      <div class="setting-change-pwd" @click="changePwd">修改密码</div>
      <div class="setting-sign-out" @click="signOut">
        <p>退出登录</p>
        <img src="../../assets/signOut.png">
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  removeToken,
} from '@/utils/auth';
import { PopupManager, } from 'element-ui/lib/utils/popup';
import * as sessionStorageUtil from '@/utils/sessionStorageUtil';
import LoginApi from '@/feat/login/api.js';
export default {
  props: {
    personalData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      show: false,
      zIndex: 20,
      userInfo: this.$store.state.login.userInfo,
    };
  },
  methods: {
    showtrue() {
      this.show = true;
      this.zIndex = PopupManager.nextZIndex();
    },
    showfalse() {
      this.show = false;
    },
    changePwd() {
      this.$emit('changePWD');
    },
    signOut() {
      this.$confirm('即将退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await LoginApi.loginOut();
          removeToken();
          sessionStorageUtil.removeJSON('mySeatPhone');
          location.reload();
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch(() => {
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-mail {
  // position: relative;
  font-weight: 500;
  z-index: 100;
  .setting-img {
    width: 44px;
    height: 44px;
    margin-top: 26px;
    border-radius: 50%;
    overflow: hidden;
    // float: right;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .setting-content {
    position: absolute;
    right: 0;
    top: 0px;
    ::v-deep .el-card__body {
      padding: 0;
    }
    .setting-data {
      margin: 15px;
      margin-bottom: 0;
      padding-bottom: 10px;
      display: flex;
      border-bottom: 1px solid #ccc;
      .setting-data-img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        width: 120px;
        padding: 0;
        margin: 0 10px 6px 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .setting-data-tag {
        width: 70px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border: 2px solid #6bc43f;
        color: #6bc43f;
        font-size: 14px;
        border-radius: 4px;
        margin-top: 15px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        padding: 0 5px;
      }
    }
    .setting-change-pwd {
      padding: 10px 15px;
      &:hover{
          background-color: #D9ECFF;
      }
    }
    .setting-sign-out {
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      img {
        object-fit: contain;
        height: 20px;
        width: 20px;
      }
      p {
        margin: 0;
        padding: 0;
      }
      &:hover{
          background-color: #D9ECFF;
      }
    }
  }
}
</style>
