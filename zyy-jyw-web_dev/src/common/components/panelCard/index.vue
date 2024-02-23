<template>
  <div class="pure-card">
    <div class="pure-card__header">
      <slot name="header" />
      <span
        v-if="showExpand"
        class="expand"
        @click="handleExpandChange"
      >
        {{ expand ? '收起' : '展开' }}
        <i
          :class="expand?'el-icon-arrow-up':'el-icon-arrow-down'"
        />
      </span>
    </div>

    <div
      v-if="$slots.subHeader"
      class="pure-card__sub__header"
    >
      <slot name="subHeader" />
    </div>
    <el-collapse-transition>
      <div
        v-show="expand"
        :class="{disabled:disabled}"
        class="pure-card__body"
      >
        <slot />
      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
export default {
  name: 'PurePanelCard',
  props: {
    showExpand: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultExpand: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      expand: this.defaultExpand,
    };
  },
  mounted() {
  },
  methods: {
    handleExpandChange() {
      this.expand = !this.expand;
      this.$emit('expandChange');
    },
  },

};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.pure-card {
  width: 100%;

  & + & {
    margin-top: 16px;
  }

  .pure-card__header, .pure-card__sub__header {
    padding: 0 16px;
    height: 36px;
  }

  .pure-card__header, .pure-card__sub__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .pure-card__header {
    @include background_color_imp('color-stroke');
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    @include font_color_imp('color-assist-gray');
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;

    &::before {
      content: '';
      width: 5px;
      height: 50%;
      margin-right: 6px;
      top: 0;
      left: 0;
      @include background_color_imp('color-primary');
    }

    .expand {
      color: #409EFF;
      cursor: pointer;
      font-weight: 400;
    }
  }

  .pure-card__sub__header {
    @include background_color_imp('color-assist-4');
    padding: 0 16px;
    font-size: 14px;
  }

  .pure-card__body {
    border-left: 1px solid #ECF0F7;
    border-right: 1px solid #ECF0F7;
    border-bottom: 1px solid #ECF0F7;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding-top: 16px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 6px;
      height: 50%;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #DEE2EE;
      border-radius: 3px;
    }

    &.disabled {
      background-color: #fafafa;
    }
  }
}

</style>
