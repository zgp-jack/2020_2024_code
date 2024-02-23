<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div :class="{'has-tags-view':needTagsView}" class="main-container">
      <div :class="{'pure-fixed-header': fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import AppMain from './components/appMain.vue';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar.vue';
import TagsView from './components/tagsView';
import { mapState, } from 'vuex';
export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView,
  },
  data() {
    return {
      fixedHeader: false,
      needTagsView: true,
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.APP.sidebar,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      };
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "~@/common/styles/mixin.scss";
  @import "~@/common/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .pure-fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .pure-fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .pure-fixed-header {
    width: 100%;
  }
</style>
