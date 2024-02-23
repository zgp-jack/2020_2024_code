<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-27 15:41:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-10 09:58:50
 * @Description: 抽屉弹窗
-->
<template>
  <div class="drawer__wrapper">

    <div
      v-show="closeBtnVisible"
      class="close-btn"
      :style="closeBtnStyle"
      @click="onCancel"
    >
      <i class="el-icon-error" />
    </div>
    <el-drawer
      :visible.sync="visible"
      :show-close="false"
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
    </el-drawer>
  </div>

</template>

<script>
import { Drawer, } from 'element-ui';
export default {
  components: {
    [Drawer.name]: Drawer,
  },
  props: {
    width: {
      type: [String, Number],
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
      return `right: calc(${this.realWidth} - 1.042vw);z-index: ${this.zIndex}`;
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
      this.$store.dispatch('app/closeDialog');
    },
    handleComponentDone() {
      if (this.closeAfterDone) this.close();
    },
    handlleComponentCancel() {
      this.close();
    },
    close(done) {
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
  .close-btn {
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    background-color: white;
    align-items: center;
    justify-content: center;
    z-index: 2001;
    position: absolute;
    top: 30px;
    i {
      font-size: 26px;
      color: #dee2ee;
      cursor: pointer;
    }
  }
  .drawer__wrapper {
      width:0px;
      height: 0px;

    ::v-deep .el-drawer__body {
      padding: 16px 16px 0 16px;
      box-sizing: border-box;
      height: 100%;
    }
  }

</style>
