<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-30 05:01:25
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:56:09
 * @Description: 基础面板
-->

<template>
  <div class="pure-card">
    <div class="pure-card__header">
      <slot name="header" />
      <span v-if="showExpand" class="expand" @click="handleExpandChange">
        {{ expand?'收起':'展开' }}
        <i
          :class="expand?'el-icon-arrow-up':'el-icon-arrow-down'"
        />
      </span>
    </div>

    <div v-if="$slots.subHeader" class="pure-card__sub__header">
      <slot name="subHeader" />
    </div>
    <el-collapse-transition>
      <div v-show="expand" class="pure-card__body" :class="{disabled:disabled}">
        <slot />
      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
export default {
  name: 'PureCard',
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

<style lang="scss" scoped>
    .pure-card {
        width: 100%;
        .pure-card__header, .pure-card__sub__header,.pure-card__body {
            padding: 0 16px;
        }
        .pure-card__header, .pure-card__sub__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: $--pure-little-font-size;
        }
        .pure-card__header {
            height: 34px;
            background-color: #E2E3E7;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;

            font-size: 18px;
            font-weight: 500;
            line-height: 18px;
            .expand {
                color: #409EFF;
                cursor: pointer;
                font-weight: 400;
            }
        }
        .pure-card__sub__header {
            height: 30px;
            background-color: #F0F1F5;
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
            overflow: scroll;
            &::-webkit-scrollbar{
                width:6px;
                height:50%;
            }
            &::-webkit-scrollbar-thumb{
                background-color: #DEE2EE;
                border-radius: 3px;
            }
            &.disabled {
              background-color:  #fafafa;
            }
        }
    }

</style>
