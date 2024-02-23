<template>
  <div :class="['pure-tag',type]" @click.stop="$emit('click')">
    <span>
      <svg-icon v-if="icon" :icon-class="icon" class="icon" />
      <span :data-attr="content" class="content" />
    </span>

  </div>
</template>

<script>
export default {
  name: 'PureTag',
  props: {
    label: {
      type: [
        String,
        Number,
      ],
      default: '标签',
    },
    icon: {
      type: String,
      default: '',
    },
    // primary, warning, danger
    type: {
      type: String,
      default: 'primary',
    },
    max: {
      type: Number,
      default: null,
    },
  },
  computed: {
    content() {
      const value = this.label;
      const max = this.max;
      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-tag {
  display: inline-block;
  padding: 5px;
  border: 1px solid;
  border-radius: 4px;
  .content {
    &::before {
      content: attr(data-attr);
    }
  }
  .icon {
    margin-right: 6px;
  }
  & + .pure-tag {
    margin-left: 6px;
  }

  &.primary {
    @include font_color_imp('color-primary');
    @include background_color_opacity_imp('color-primary',0.06);
    @include border_color_imp('color-primary');
  }
  &.warning {
     @include font_color_imp('color-assist-yellow');
    @include background_color_opacity_imp('color-assist-yellow',0.06);
    @include border_color_imp('color-assist-yellow');
  }
  &.danger {
 @include font_color_imp('color-decorate-red');
    @include background_color_opacity_imp('color-decorate-red',0.06);
    @include border_color_imp('color-decorate-red');
  }

}
</style>
