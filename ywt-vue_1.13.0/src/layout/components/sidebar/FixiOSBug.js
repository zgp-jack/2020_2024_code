/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:58:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 16:58:00
 * @Description:
 */
export default {
  computed: {
    device() {
      return this.$store.state.app.device;
    },
  },
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS();
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu;
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave;
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return;
          }
          handleMouseleave(e);
        };
      }
    },
  },
};
