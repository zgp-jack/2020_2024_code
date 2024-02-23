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
      return this.$store.state.APP.cachedTagViews;
    },
    key() {
      return this.$route.path;
    },
  },
  mounted() {
    this.$store.dispatch('APP/UPDATE_MSGVALUE_ACTION');
    this.timer = setInterval(() => {
      this.$store.dispatch('APP/UPDATE_MSGVALUE_ACTION');
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
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

   > .el-container {
     padding: 12px 0 0 12px;
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
