<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:33:36
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-07-08 16:51:08
 * @Description:
-->
<template>
  <div class="pure-navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <el-tooltip effect="dark" content="待办事项" placement="left-start">
          <img src="@/assets/notebookIcon.svg" class="noteBookIcon" @click="goToNotebook">
        </el-tooltip>

        <div class="right-menu-item hover-effect"><svg-icon icon-class="big-screen" @click="onShowBigScreen" /></div>
        <!-- 消息 -->
        <el-badge :is-dot="true" class="badge-bell">
          <i class="el-icon-bell  icon-bell" @click="onMessageIcon" />
        </el-badge>

        <div class="right-menu-item hover-effect">
          <el-popover
            placement="top-start"
            width="200"
            trigger="click"
            :visible-arrow="false"
          >
            <Setting @changePWD="handleChangePWD" />
            <div slot="reference" class="avatar-container">
              <el-avatar shape="circle" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            </div>

          </el-popover>
        </div>

      </template>

    </div>
    <!-- 消息列表 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :modal="false"
      :show-close="false"
      @open="initAlertMessageData"
    >
      <template #title>
        <el-row class="custom-title">
          <el-col :span="12">
            <span>
              告警消息

            </span>
          </el-col>
          <el-col :span="12" style="text-align:right;color:#C0C4CC">
            <i class="el-icon-error" @click="onClose" />
          </el-col>
        </el-row>
      </template>
      <el-table
        v-loading="loadingMessageDataList"
        :data="messageDataList"
        max-height="516"
        :header-cell-style="{
          backgroundColor:'transparent',
          fontWeight: 500,
          fontSize: '14px',
          color: '#7D8DB3'
        }"
        :cell-style="{
          color:'#334266'
        }"
      >
        <el-table-column label="时间" prop="orderWarningTime" />
        <el-table-column label="工单数" prop="orderWarningCount" />
        <el-table-column label="故障分类" prop="faultTypeName" />
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, } from 'vuex';
import Breadcrumb from '@/components/breadcrumb/index.vue';
import Hamburger from '@/components/hamburger';
import Setting from '@/components/user/setting.vue';
import ChangePWD from './Panel/changePwd';
import BigScreenApi from '@/apis/bigScreen/index';
// import ErrorLog from '@/components/errorLog';
// import Screenfull from '@/components/screenfull';
// import SizeSelect from '@/components/sizeSelect';
// import Search from '@/components/headerSearch';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Setting,
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search,
  },
  data() {
    return {
      dialogVisible: false,
      loadingMessageDataList: true,
      messageDataList: [],
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
  },
  methods: {
    onClose() {
      this.dialogVisible = false;
    },
    onMessageIcon() {
      this.dialogVisible = true;
    },
    async initAlertMessageData() {
      this.loadingMessageDataList = true;
      const rs = await BigScreenApi.AlertMsgList({ pageNum: 1, pageSize: 9999, });
      this.messageDataList = rs.list || [];
      this.loadingMessageDataList = false;
    },

    goToNotebook() {
      this.$router.push({ path: '/synthesize/notebook', });
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    handleChangePWD() {
      this.$dialog({
        title: '修改密码',
        width: '312px',
        position: 'center',
        top: '32vh',
        component: () => <ChangePWD />,
      });
    },
    onShowBigScreen() {
      window.open('#/big-screen', '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table th.gutter{   /*解决el-table加了gutter后 边框出现白边*/
    display: table-cell!important;
    background: #fff !important;
}
::v-deep .el-dialog__body{
  padding: 0 20px 20px 20px ;
}
::v-deep .el-dialog__header{
  // padding: 20px 0px 0 0px;
}
.custom-title{
font-weight: 400;
font-size: 18px;
color: #334266;
// padding: 16px 16px 0 20px;
// border-bottom: 1px solid #E6EAF2;
}
.icon-bell{
  font-size: 22px;
  color: #5a5e66;

}
.badge-bell{
  margin-right: 38px;

}
.table-wrapper{
  overflow: auto;
  max-height: 516px;
}
.pure-navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #F4F6FA;
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.10);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

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
.noteBookIcon{
  cursor: pointer;
  width: 20px;
  height: 24px;
  line-height: 36px;
}
</style>
