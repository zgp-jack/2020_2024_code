<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper  PDialog_wrapper"
      @click.self="handleWrapperClick"
    >
      <div
        :key="key"
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog',
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass,
        ]"
        :style="style"
      >
        <div v-if="!showClose" class="icon__wrapper" @click="handleClose">
          <i class="el-icon-error icon" />
        </div>
        <div class="el-dialog__header  PDialog__header " :class="showClose ?'PDialog_wraper-header':'' " style="padding:0 8px 0 16px">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
            <span class="codeName">{{ nameCode }}</span>
          </slot>
          <slot name="titleButton">
            <button
              v-if="showClose"
              type="button"
              aria-label="Close"
              class="p-dialog-button"
              @click="handleClose"
            >
              <!-- <i class="el-dialog__close el-icon el-icon-close" /> -->
              <i class=" el-dialog__close el-icon  el-icon-error" />
            </button>
          </slot>
        </div>

        <div
          v-if="rendered"
          class="el-dialog__body "
          :style="bodyStyle"
        >
          <slot />
        </div>
        <template v-if="showFooter">
          <div v-if=" !isLook " class="el-dialog__footer" :style="footerStyle">
            <slot name="footer">
              <el-button type="primary" size="mini" @click="submit">提交</el-button>
              <el-button v-if="hiddenSaveButton" size="mini" plain type="primary" class="PDialog-save-button" @click="save">保存</el-button>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/src/utils/popup';
import Migrating from 'element-ui/src/mixins/migrating';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'PElDialog',

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: '',
    },

    modal: {
      type: Boolean,
      default: true,
    },

    modalAppendToBody: {
      type: Boolean,
      default: true,
    },

    appendToBody: {
      type: Boolean,
      default: false,
    },

    lockScroll: {
      type: Boolean,
      default: true,
    },

    closeOnClickModal: {
      type: Boolean,
      default: false,
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    nameCode: String,
    width: {
      type: String,
      default: 'auto',
    },

    fullscreen: {
      type: Boolean,
      default: false,
    },

    customClass: {
      type: String,
      default: '',
    },

    top: {
      type: String,
      default: '0',
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false,
    },

    showClose: {
      type: Boolean,
      default: false,
    },
    hiddenSaveButton: {
      type: Boolean,
      default: true,
    },
    destroyOnClose: Boolean,
    showFooter: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      closed: false,
      key: 0,
    };
  },

  computed: {
    style() {
      const style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        if (this.width) {
          style.width = this.width;
        }
        if (!this.showClose) {
          style.position = 'absolute';
          style.top = '0';
          style.right = '0';
          style.height = ' 100%';
        }
      }
      return style;
    },
    bodyStyle() {
      const style = {};
      if (!this.showClose) {
        style.height = 'calc(100% - 48px - 60px)';
        style.maxHeight = 'calc(100% - 48px - 60px)';
        style.padding = ' 0';
      }
      return style;
    },
    footerStyle() {
      const style = {};
      if (!this.showClose) {
        style.textAlign = 'left';
        style.height = '60px';
        style.lineHeight = '60px';
      }
      return style;
    },
    isLook() {
      return this.$store.state['project/index'].isLook;
    },
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    },
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },

  methods: {
    submit() {
      this.$emit('submit');
    },
    save() {
      this.$emit('save');
    },
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.',
        },
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('closed');
    },
  },
};
</script>
<style lang="scss" scoped>

.icon__wrapper {
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: -20px;
  top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  > .icon {
    font-size: 26px;
    color: #dee2ee;
    border-radius: 50%;
    cursor: pointer;
  }
}
.PDialog_wraper-header{
  display: flex;
  // justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 0px #ecf0f7
}
.PDialog__header{
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  color: #2D405E;
  >.p-dialog-button{
    flex: 1;
    // text-align: center;
    text-align: right;
    background: #fff;
    border: 0;
    >i{
      color: #CCC;
      &:hover{
        color: #1890ff;
      }
    }
  }
}
.codeName {
  font-size: 14px;
  color: #879bba;
  margin-left: 36px;
}

.PDialog-save-button{
  background: #fff;

}
</style>
