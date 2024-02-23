<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-30 15:19:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 16:50:30
 * @Description:
-->
<template>
  <div style="height:100%;" class="fuck">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="path" />
    </transition>
  </div>
</template>

<script>
import OtherSettingApi from '@/feat/system/otherSetting/api';
export default {
  data() {
    return {
      path: '/big-screen/ticket',
      loopPeriod: 3 * 60 * 1000,
      config: {

      },
    };
  },
  mounted() {
    this.fetchConfig();
  },
  methods: {
    async fetchConfig() {
      const loading = this.$loading({
        lock: true,
        text: '配置加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        const data = await OtherSettingApi.getBigScreenConfig();
        this.config = Object.assign({}, data);
        this.showBigScreenByConfig();
      } catch (error) {
        this.$message.error('配置加载失败');
      } finally {
        loading.close();
      }
    },
    showBigScreenByConfig() {
      const showItemsLen = this.config.showItems.length;
      if (showItemsLen > 1) {
        this.loopPeriod = this.config.interval * 60 * 1000;
        this.executeScheduledTask();
      } else if (showItemsLen === 1) {
        const item = this.config.showItems[0];
        switch (item) {
          case 'ticket':
            this.path = '/big-screen/ticket';
            break;
          case 'project':
            this.path = '/big-screen/project';
            break;
          default:
            this.$message.error('大屏配置错误,请联系管理员');
            break;
        }
        this.$router.push(this.path);
      }
    },
    executeScheduledTask() {
      this.path = '/big-screen/ticket';
      this.$router.push(this.path);
      setInterval(() => {
        this.path = this.path === '/big-screen/ticket' ? '/big-screen/project' : '/big-screen/ticket';
        this.$router.push(this.path);
        console.log('切换页面');
      }, this.loopPeriod);
    },
  },
};
</script>

<style lang="scss" scoped>
.fuck {
  background: url("~@/assets/bigScreen/bg.png") no-repeat;
}
</style>
