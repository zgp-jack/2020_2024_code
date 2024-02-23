<template>
  <el-drawer
    ref="drawer"
    v-colseBtn="closeDrawer"
    title=""
    custom-class="project-panel"
    append-to-body
    :visible.sync="visible"
    :with-header="false"
    destroy-on-close
    :wrapper-closable="false"
    v-bind="$attrs"
    :data-width="$attrs.size"
  >
    <el-container class="drawer-container">
      <el-header class="drawer-header" height="50px">
        <span class="title">
          <slot name="title" />
        </span>
        <span class="code">
          <slot name="codeText" />
        </span>
      </el-header>
      <el-main class="drawer-main">
        <slot />
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
export default {
  directives: {
    colseBtn: {
      // https://segmentfault.com/a/1190000017166675
      inserted: function (el, bind, vnode) {
        const closeHtml = document.createElement('div');
        const icon = document.createElement('i');
        icon.className = 'el-icon-close';
        icon.style.fontSize = '30px';
        icon.style.color = '#C9E5FF';
        icon.style.fontWeight = 900;
        closeHtml.className = 'colse-button';
        closeHtml.style.cursor = 'pointer';
        closeHtml.style.position = 'absolute';
        closeHtml.style.width = '60px';
        closeHtml.style.height = '60px';
        closeHtml.style.display = 'flex';
        closeHtml.style.justifyContent = 'center';
        closeHtml.style.alignItems = 'center';
        closeHtml.style.background = 'linear-gradient(270deg,#01070d, #020e1a)';
        closeHtml.style.border = '1px solid';
        closeHtml.style.borderImage = 'linear-gradient(90deg, rgba(24,144,255,0.5) 34%, rgb(0 0 0 / 80%) 58%, rgb(0 0 0) 42%, rgb(17 19 17) 66%) 1 1';
        closeHtml.style.color = ' #c9e5ff';
        closeHtml.style.zIndex = '9999';
        closeHtml.style.boxShadow =
          '-20px 0px 40px 10px #000c1a, -10px 0px 20px 0px rgba(24,144,255,0.05)';
        closeHtml.style.top = '50px';
        if (/%/.test(el.dataset.width)) {
          closeHtml.style.right = parseFloat(el.dataset.width) - 0.4 + '%';
        } else {
          closeHtml.style.right = parseInt(el.dataset.width) - 10 + 'px';
        }

        closeHtml.appendChild(icon);
        el.children[0].append(closeHtml);
        function clickHandler(e) {
          if (bind.expression) {
            bind.value(e);
          }
        }
        el.__vueClickOutSide__ = clickHandler;
        closeHtml.addEventListener('click', clickHandler);
      },

      unbind: function (el, bind) {
        document.removeEventListener('click', el.__vueClickOutSide__);
        delete el.__vueClickOutSide__;
      },
    },
  },
  props: {
    visible: Boolean,
    itemCode: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    codeText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    closeDrawer() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss">
@import "~@/feat/bigScreen/style/linearGradient.scss";

.project {
  &-panel {
    background: linear-gradient(270deg, #01070d, #020e1a) !important;
    border: 1px solid;
    @extend .boderLinearGradient;
    box-shadow: -20px 0px 40px 10px #000c1a,
      -10px 0px 20px 0px rgba(24, 144, 255, 0.05);
  }
}
</style>

<style lang="scss" scoped>
.drawer {
  &-container{
    padding: 0 20px;
  }

  &-header {
    position: relative;
    line-height: 50px;
    span.title {
      font-size: 20px;
      font-family: AlibabaPuHuiTi_2_65_Medium,
        AlibabaPuHuiTi_2_65_Medium-Regular;
      font-weight: 400;
      color: #ffffff;
    }
    span.code {
      margin-left: 60px;
      display: inline-block;
      font-size: 16px;
      font-family: AlibabaPuHuiTi_2_55_Regular,
        AlibabaPuHuiTi_2_55_Regular-Regular;
      font-weight: 400;
      text-align: left;
      color: #c9e5ff;
      line-height: 16px;
    }
    border-bottom: 1px solid #263341;
    &::before {
      content: "";
      position: absolute;
      right: 0;
      width: 15px;
      bottom: -2px;
      height: 3px;
      opacity: 0.8;
      background: #ffffff;
    }
  }

}
</style>
