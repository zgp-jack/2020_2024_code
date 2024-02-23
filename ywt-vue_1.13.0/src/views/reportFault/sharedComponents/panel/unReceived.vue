<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-11-08 10:48:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-09 14:51:22
 * @Description:未接来电
-->
<template>
  <el-card v-show="visible" class="unrecieved">
    <div slot="header" class="clearfix">
      <span class="title"><i class="el-icon-phone-outline shake" />新来电提醒</span>
      <i class="el-dialog__close el-icon el-icon-close " style="float: right; padding: 3px 0" @click="onClose" />
    </div>
    <div v-for="(item,index) in list" :key="index" class="item">
      <div class="detail">
        <div class="timestamp">{{ item.time }}</div>
        <div class="user">{{ item.deptId | deptId }} {{ item.user }}<span v-if="!item.deptId&&!item.user">{{ item.phone }}</span></div>
      </div>
      <div class="btn"> <pure-button
        type="text"
        label="建单"
        @click="onCreateOrder(index)"
      /></div>
    </div>

  </el-card>
</template>

<script>
import CreateWorkOrder from '@/views/reportFault/sharedComponents/dialog/createWorkOrder.vue';
export default {
  computed: {
    visible() {
      return this.$store.state.app.unrevivedData.length > 0;
    },
    list() {
      return this.$store.state.app.unrevivedData;
    },
  },
  methods: {
    onClose() {
      this.$store.state.app.unrecivedPanelVisible = false;
      this.$store.state.app.unrevivedData = [];
    },
    async onCreateOrder(index) {
      try {
        if (this.$store.state.app.openedDrawerOrDialogCount > 0) {
          await this.$confirm('检测到您有打开的弹窗,是否覆盖该弹窗！', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          });
          this.$store.state.app.openedDrawerOrDialogCount = 0;
        }
        const data = this.$store.state.app.unrevivedData.splice(index, 1);
        console.log(data[0]);
        this.$drawer({
          width: '1688px',
          component: () => <CreateWorkOrder type='pop' onDone={this.onDone} data={data[0]?.orign}/>,
        });
      } catch (error) {
        if (error && error !== 'cancel') {
          console.log(error);
        }
      }
    },

    onDone() {

    },
  },
};
</script>

<style lang="scss" scoped>
 .clearfix:after {
    clear: both
  }
.unrecieved {
  width: 268px;
  position: fixed;
  bottom: 40px;
  right:12px;
  z-index: 99999;
  ::v-deep .el-card__body {
    padding: 0px;
  }
  .title {
    font-size: 20px;
    color: #F56C6C;
    opacity: 0.8;
  }
  .el-icon-close::before {
    content: "\e79d";
    }
  .el-dialog__close {
    color: #dee2ee;
    &:hover {
      color: #1890ff;
  }
  }
}
.unrecieved ::v-deep .el-card__header {
  padding: 16px 18px;
}
.item {
  display: flex;
  width: 100%;
  border-bottom: solid  rgba(38,38,38,0.14) 1px;
  padding: 16px;
  .btn {
    width:36px;
    padding: 16px;
    padding-right: 0px;
    font-size: $--pure-base-font-size;
    box-sizing: content-box;
  }
  .detail {
    flex: 1;
    font-size: $--pure-base-font-size;
    .timestamp {
      color: #7D8DB3;
    }
    .uesr {
      color: #334266;
    }
     div+div {
      padding-top: 12px;
    // margin-top: 12px;
  }
  }

}
.shake {
  font-size: 20px;
  animation: shake 1s linear infinite;
}
@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg) scale(0.8);
  }

  10% {
    transform: rotate(20deg);
    transform: scale(1.5);
  }

  15%,
  25%,
  35% {
    transform: rotate(-15deg);
  }

  20%,
  30%,
  40% {
    transform: rotate(20deg);
  }

  45% {
    transform: rotate(-12deg);
  }

  50% {
    transform: rotate(12deg);
  }

  55%,
  90% {
    transform: rotate(0deg);
  }
}
</style>
