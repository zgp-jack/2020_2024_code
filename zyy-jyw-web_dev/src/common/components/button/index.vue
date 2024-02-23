<template>
  <el-button
    :class="[
      'pure-button',
      'pure-'+type,
      'text-color-'+textColor,
    ]"
    :type="type==='text'?'text':''"
    v-bind="$attrs"

    v-on="$listeners"
  >
    <svg-icon
      v-if="icon && iconPosition==='left'"
      :icon-class="icon"
      class="icon left"
    />
    <span class="label"> <slot> {{ label }}</slot></span>
    <svg-icon
      v-if="icon && iconPosition==='right'"
      :icon-class="icon"
      class="icon right"
    />
  </el-button>
</template>

<script>
export default {
  name: 'PureButton',
  props: {
    // 按钮类型 special(特殊按钮) major(主要按钮) minor(次要按钮) patch(第二次要按钮) text(文本按钮)
    type: {
      type: String,
      default: 'special',
    },
    label: {
      type: String,
      default: '按钮',
    },
    icon: {
      type: String,
      default: '',
    },
    iconPosition: {
      type: String,
      default: 'left',
    },
    // 文本按钮颜色 normal,warning
    textColor: {
      type: String,
      default: 'normal',
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.pure-button {
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid;
  padding: 7px 10px;

  .icon {
    &.left {
      margin-right: 6px;
    }

    &.right {
      margin-left: 6px;
    }
  }

  &.is-disabled {
    opacity: 0.5;
  }

  &:hover:not(.is-disabled) {
    opacity: 0.9;
  }
}

.pure-special {
  @include background_color_imp('button-special-background-color');
  @include font_color_imp('color-text-main');
  @include border_color_imp('button-special-background-color')
}

.pure-major {
  @include background_color_imp('color-primary');
  @include font_color_imp('color-white');
}

.pure-minor {
  @include background_color_imp('color-white');
  @include font_color_imp('color-primary');
  @include border_color_imp('color-primary')
}

.pure-patch {
  @include background_color_imp('color-white');
  @include font_color_imp('color-assist-gray');
  @include border_color_imp('color-assist-gray')
}

.pure-text {
  border: unset;
  padding: 0px;

  &.text-color {
    &-normal {
      @include font_color_imp('color-primary');
    }

    &-warning {
      @include font_color_imp('color-decorate-red');
    }
  }

}
</style>
