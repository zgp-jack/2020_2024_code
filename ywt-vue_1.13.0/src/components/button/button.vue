<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-23 16:19:24
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-11 17:14:04
 * @Description:按钮组件
-->
<template>
  <el-button
    :class="[
      'pure-button',
      'pure-'+type,
      'pure-'+type+'--'+paddingType
    ]"
    :type="elType"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <span class="label">
      {{ label }}
    </span>

  </el-button>
</template>

<script>
export default {
  name: 'PureButton',
  props: {
    // 按钮类型 sub-wire-frame(次级线框按钮，黑字白底) primary(白字蓝底) (蓝字白底，固定宽度) (蓝字白底,按文本确定宽度) (蓝字浅蓝底)
    /**
     * 按钮类型
     * default (一般按钮, 白字蓝底)
     * sub-wire-frame (次级线框按钮，黑字白底)
     * wire-frame(线框按钮, 蓝字白底, 固定宽度)
     * wire-frame-auto (线框按钮, 蓝字白底,按文本确定宽度)
     * ghost (幽灵按钮,蓝字浅蓝底)
     * text (文本按钮)
     * error (错误按钮，红底白字)
     */
    type: {
      type: String,
      default: 'default',
    },
    label: {
      type: String,
      default: '阿牛哥哥',
    },
  },
  computed: {
    // 相对于el-button的类型
    elType() {
      let type = 'default';
      switch (this.type) {
        case 'default':
          type = 'primary';
          break;
        case 'sub-wire-frame':
          type = 'default';
          break;
        case 'wire-frame':
          type = '';
          break;
        case 'wire-frame-auto':
          type = '';
          break;
        case 'ghost':
          type = '';
          break;
        case 'text':
          type = 'text';
          break;
        case 'error':
          type = '';
          break;
      }
      return type;
    },
    // 根据按钮文本长度确定内边距类型
    paddingType() {
      const len = this.label.length;
      if (len > 4) {
        return 'auto';
      }
      return 'normal';
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-button {
  padding:6px 14px;
}
.label {
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
}
.pure-sub-wire-frame {
  .label {
    color: #4F5E7B;
  }
  &--normal {
    min-width:86px;
     padding:6px 14px;
  }
  &--auto {
    padding:6px 14px;
  }
}
.pure-text {
  padding: 0;
  .label {
    color: #426ED7;
  }
   &.is-disabled {
     .label {
        color: #C0C4CC;
     }

  }

}
.pure-default {
  background-color: #426ED7;
  border: 1px solid #426ED7;
  &--normal {
    min-width:86px;
     padding:6px 14px;
  }
  &--auto {
    padding:6px 14px;
  }
  &.is-disabled {
    color: #FFFFFF;
    background-color: #a1b7eb;
    border-color: #a1b7eb;
  }
}
.pure-wire-frame {
  border: 1px solid #426ED7;
  color: #426ED7;
  &--normal {
    min-width:86px;
     padding:6px 14px;
  }
  &--auto {
    padding:6px 14px;
  }
}
.pure-ghost {
  padding:6px 14px;
  background-color: #d7e5f9;
  border:unset;
  .label {
    color: #426ED7;
  }
}

.pure-wire-frame-auto {
  border: 1px solid #426ED7;
  color: #426ED7;
}
.pure-error {
  background-color: #F56C6C;
  color: #FFFFFF;
  border: 1px solid #F56C6C;
}
</style>
