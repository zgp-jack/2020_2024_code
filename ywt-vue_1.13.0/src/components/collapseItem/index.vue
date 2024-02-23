<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-28 10:37:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-28 17:24:18
 * @Description:
-->
<template>
  <section class="collapse-item" :style="OneCollapseItemStyle">
    <div class="collapse-item-header">
      <el-row>
        <el-col :span="20">
          <span>
            <slot name="title" />
          </span>
          <small class="collapse-item-header-info">
            <slot name="labelText" />
            <b class="collapse-item-header-info-value">
              <slot name="labelValue" />
            </b>
          </small>
          <small class="collapse-item-header-info">
            <slot name="labelTime" />
            <b class="collapse-item-header-info-value">
              <slot name="labelTimeValue" />
            </b>
          </small>
        </el-col>
        <el-col v-if="showExpand" :span="4" class="expand-wrapper">
          <el-button :icon="Icon" size="mini" type="text" @click="onExpand">
            {{ IsActive ? "收起" : "展开" }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="$slots.bottom" class="collapse-item-bottom">
      <slot name="bottom" />
    </div>
    <el-collapse-transition>
      <div
        v-show="IsActive"
        class="collapse-item-body-box"
        :style="StyleBody"
      >
        <div class="collapse-item-body-box-content" :style="StyleContent">
          <slot name="default" />
        </div>
      </div>
    </el-collapse-transition>
  </section>
</template>

<script>
export default {
  name: 'CollapseItem',
  componentName: 'CollapseItem',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: [String, Number],
      default() {
        return this._uid;
      },
    },
    showExpand: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['collapse'],
  data() {
    return {
      // expand: true,
    };
  },
  computed: {
    IsActive() {
      if (this.showExpand) {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      }
      return !this.showExpand;
    },
    Height() {
      if (this.showExpand) {
        return this.collapse.collapseItemHeight + 'px';
      }
      return '100%';
    },
    // 处理只存在一个子面板的高度控制
    OneCollapseItemStyle() {
      if (this.showExpand) {
        return {};
      }
      return {
        height: '100%',
      };
    },
    Icon() {
      return `el-icon-arrow-${this.IsActive ? 'down' : 'up'}`;
    },
    StyleContent() {
      return {
        height: this.Height,
      };
    },
    StyleBody() {
      return {
        backgroundColor: this.disabled ? '#f7f7f7' : '#ffff',
      };
    },
  },
  mounted() {
    // console.log(this.collapse, 'collapse');
  },
  methods: {

    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    onExpand() {
      this.dispatch('Collapse', 'item-click', this);
      this.$emit('onExpand',);
    },
  },
};
</script>
<style lang="scss" scoped>
.expand-wrapper {
  text-align: right;
  padding-right: 16px;
}
.collapse{
  &-item{
    display: flex;
    flex-direction: column;
    width: 100%;
    // height: 100%;
    // flex: 1;
    // flex-basis: auto;
    box-sizing: border-box;
    // min-width: 0;
    &+&{
      margin-top: 16px;
    }
    &-header {
      height: 34px;
      background: #e2e3e7;
      border-radius: 4px 4px 0px 0px;
      line-height: 34px;
      padding: 0 0 0 16px;
      &-info {
        margin: 0 0 0 28px;
        font-size: 14px;
        font-weight: 400;
        color: #879bba;
        &-value {
          margin: 0 0 0 2px;
          color: #2d405e;
        }
      }
    }
    &-bottom {
      height: 30px;
      display: flex;
      line-height: 30px;
      background: #f0f1f5;
      padding-left: 16px;
      > span {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #879bba;
        > b {
          font-size: 14px;
          font-weight: 400;
          color: #334266;
        }
      }
    }
    &-body {
      &-box {
        box-sizing: border-box;
        // box-shadow: inset 0 0 0px 1px #ecf0f7;
        border: 1px solid #ecf0f7;
        border-top: none;
        border-radius: 0px 0px 4px 4px;
        display: block;
        flex: 1;
        flex-basis: auto;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 10px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #e2e3e7;
          border-radius: 3px;
        }

        &-content {
          padding: 16px 16px 0px 16px;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 6px;
            height: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #e2e3e7;
            border-radius: 3px;
          }
        }
      }
    }
  }
}

</style>
