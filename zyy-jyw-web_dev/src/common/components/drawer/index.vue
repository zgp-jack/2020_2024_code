<template>
  <div class="drawer__wrapper">
    <el-drawer
      :visible.sync="visible"
      :show-close="true"
      :size="realWidth"
      :modal="true"
      :with-header="false"
      :wrapper-closable="false"
      :close-on-press-escape="false"
      @opened="closeBtnVisible=true"
      @close="closeBtnVisible=false"
      @closed="handleClosed"
    >
      <component :is="_component" ref="component" />
      <div
        v-show="closeBtnVisible"
        class="close-btn"
        :style="closeBtnStyle"
        @click="onCancel"
      >
        <svg-icon icon-class="multiple" />
      </div>
    </el-drawer>

  </div>

</template>

<script>
import { Drawer, } from 'element-ui';
export default {
  name: 'PureDrawer',
  components: {
    [Drawer.name]: Drawer,
  },
  props: {
    width: {
      type: [
        String,
        Number,
      ],
      default: '50%',
    },
    component: {
      type: Function,
      required: true,
    },
    closeAfterDone: {
      type: Boolean,
      default: true,
    },
    cancelConfirm: {
      type: Boolean,
      default: false,
    },
    cancelConfirmText: {
      type: String,
      default: '未提交数据，确定关闭？',
    },
  },
  data() {
    return {
      visible: true,
      closeBtnVisible: true,
      zIndex: 2000,
      cancel: null,
    };
  },
  computed: {
    realWidth() {
      const width = parseInt(this.width);
      return width > 1000 ? (width * 100 / 1920) + '%' : this.width;
    },
    closeBtnStyle() {
      return `z-index: ${this.zIndex}`;
    },
    _component() {
      const fn = this.component;
      let vNode;
      const that = this;
      return {
        name: 'drawer-wrapper',
        render() {
          // 控制取消按钮显示层级
          const zIndex = that.$children[0].$el.style.zIndex;
          that.zIndex = parseInt(zIndex) + 1;
          vNode = fn();
          if (that.closeAfterDone) {
            if (!vNode.componentOptions) {
              return vNode;
            }
            let listeners = vNode.componentOptions.listeners;
            if (!listeners) {
              listeners = {};
              vNode.componentOptions.listeners = listeners;
            }
            const orginDoneHandler = listeners.done;
            listeners.done = function (...p) {
              if (orginDoneHandler) {
                orginDoneHandler(...p);
                that.handleComponentDone(...p);
              }
            };
            const orginCancelHandler = that.cancel = listeners.cancel;
            /* eslint-disable func-names */
            listeners.cancel = function (...p) {
              if (orginCancelHandler) orginCancelHandler(...p);
              that.close();
            };
            const orginRefreshHandler = listeners.refresh;
            listeners.refresh = function (...p) {
              if (orginRefreshHandler) {
                orginRefreshHandler(...p);
              }
            };
          }
          return vNode;
        },
      };
    },
  },

  methods: {
    async onCancel() {
      try {
        if (this.cancelConfirm) {
          await this.$confirm(this.cancelConfirmText, '提示', { confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning', });
          this.close();
        } else {
          this.close();
        }
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message.error(error);
        }
      }
    },
    handleClosed() {
      this.display = false;
      // this.$store.dispatch('app/closeDialog');
    },
    handleComponentDone() {
      if (this.closeAfterDone) this.close();
    },
    handleComponentCancel() {
      this.close();
    },
    close(done, refresh) {
      this.cancel && this.cancel();
      if (this.beforeClose) {
        this.beforeClose();
      }
      if (done) {
        done();
      } else {
        this.visible = false;
      }
      this.$refs.component.$destroy();
    },
    show() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2001;
    position: absolute;
    @include font_color_imp('color-text-placeholder');
    top: 12px;
    right: 20px;
    cursor: pointer;

  }
  .drawer__wrapper {
      width:0px;
      height: 0px;

    ::v-deep .el-drawer__body {
      padding: 0;
      box-sizing: border-box;
      height: 100%;
    }
  }

</style>
