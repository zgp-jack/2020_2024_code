<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:31:36
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-20 11:35:25
 * @Description:
-->
<template>
  <section class="pure-app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-app-main {
  /* 50= navbar  50  */
  max-height: calc(100vh - 48px);
  height: calc(100vh - 48px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 12px 0 0 12px;
   > .el-container {
     padding-right:12px;
  }
  ::v-deep .el-container {
    .el-aside {
      margin: 0 0px 0 12px;
      background: white;
    }
  }
}

.fixed-header+.pure-app-main {
  padding-top: 50px;
}

.hasTagsView {
  .pure-app-main {
    /* 84 = navbar + tags-view = 48 + 40 */
    max-height: calc(100vh - 88px);
    height: calc(100vh - 88px);
  }

  .fixed-header+.pure-app-main {
    padding-top: 88px;
  }
}

</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
