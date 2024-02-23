<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-30 11:38:06
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-23 11:51:21
 * @Description:
-->
<template>
  <div v-show="closeBtnVisible" :class="customClass" class="pure-dialog">
    <el-dialog
      :class="position"
      :visible.sync="visible"
      :width="width"
      :close-on-click-modal="closeOnClickModal"
      :show-close="showClose"
      :before-close="close"
      :lock-scroll="lockScroll"
      :append-to-body="appendToBody"
      :top="top"
      :fullscreen="fullscreen"
      :custom-class="customClass"
      @opened="closeBtnVisible=true"
      @close="closeBtnVisible=false"
      @closed="handleClosed"
    >
      <div v-if="title" slot="title" class="title">
        <span class="main">{{ title }}</span>
        <span class="sub">{{ subTitle }}</span>
      </div>
      <component :is="_component" ref="component" />
    </el-dialog>
  </div>
</template>

<script>
import { Dialog, } from 'element-ui';
export default {
  components: {
    [Dialog.name]: Dialog,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: null,
    },
    width: {
      type: String,
      default: '50%',
    },
    top: {
      type: String,
      default: '15vh',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: 'pure-dialog',
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closed: {
      type: Function,
      default: function () {},
    },
    beforeClose: {
      type: Function,
      default: null,
    },
    lockScroll: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'right',
    },
    // 动态component完成自己的任务后是否关闭弹窗，默认为是
    closeAfterDone: {
      type: Boolean,
      default: true,
    },
    // 返回jsx的函数
    component: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      visible: true,
      closeBtnVisible: true,
    };
  },

  computed: {
    _component() {
      // 这一步很重要，让component收集到了这个计算属性的依赖，否则当component变化时不会重新渲染组件
      const fn = this.component;
      let vNode;
      // 返回vue选项对象
      const that = this;
      return {
        name: 'dynamic-wrapper',
        render() {
          // fn的运行一定要在render函数中，也是为了挂载依赖
          vNode = fn();
          // 在vNode上手动添加done事件和cancel事件，使弹窗自动关闭
          if (that.closeAfterDone) {
            // 直接写jsx的
            if (!vNode.componentOptions) {
              return vNode;
            }
            /* eslint-disable */
            let listeners = vNode.componentOptions.listeners;
            if (!listeners) {
              listeners = {};
              vNode.componentOptions.listeners = listeners;
            }
            // 添加done
            const orginDoneHandler = listeners.done;
            /* eslint-disable func-names */
            listeners.done = function (...p) {
              if (orginDoneHandler) orginDoneHandler(...p);
              that.handleComponentDone(...p);
            };
            // 添加cancel
            const orginCancelHandler = listeners.cancel;
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
       handleClosed() {
      this.display = false;
      this.$store.dispatch('app/closeDialog');
    },
    // 组件处理完自己的事情触发，默认关闭弹窗
    handleComponentDone() {
      if (this.closeAfterDone) this.close();
    },
    handleComponentCancel() {
      this.close();
    },
    close(done) {
      if (this.beforeClose) {
        this.beforeClose();
      }
      // 从handleComponentDone处调用的close没有done参数
      if (done) {
        done();
      } else {
        this.visible = false;
      }
      // this.$store.dispatch('app/closeDialog');
      this.$refs.component.$destroy();
    },
    show() {
      this.visible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/special-dialog.scss';
@import '~@/styles/alert-dialog.scss';


</style>
<style>

.el-dialog{
    display: flex;
    display: -ms-flex; /* 兼容IE */
    flex-direction: column;
    -ms-flex-direction: column; /* 兼容IE */
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
.el-dialog .el-dialog__body{
    max-height: 100%;
    flex: 1;
    -ms-flex: 1 1 auto; /* 兼容IE */
    overflow-y: auto;
    overflow-x: hidden;
}

.el-dialog__wrapper {
    /*隐藏ie和edge中遮罩的滚动条*/
    overflow: hidden;
}
</style>
