<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in permission_routes"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './logo.vue';
import SidebarItem from './sidebarItem.vue';
import variables from '@/common/styles/variables.scss';
export default {
  components: {
    Logo,
    SidebarItem,
  },
  computed: {
    isCollapse() {
      return !this.$store.state.APP.sidebar.opened;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path, } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    permission_routes() {
      return this.$store.state.APP.a;
    },
    showLogo() {
      return true;
    },
  },

};
</script>

<style lang="scss" scoped>
</style>
