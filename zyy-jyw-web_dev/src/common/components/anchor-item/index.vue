/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="anchor-item-wrapper">
    <el-row
      :id="elId"
      class="anchor-item-header"
    >
      <el-col :span="12">
        <span
          ref="item-title"
          class="anchor-item-header-label"
        >{{ title }}
        </span>
        <slot name="subTitle" />
      </el-col>
      <el-col :span="12">
        <slot name="right" />
      </el-col>

    </el-row>
    <div class="anchor-item-content">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题',
    },
    itemData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      elId: this._uid,
    };
  },
};
</script>

<style lang='scss'
  scoped
>
.anchor {
  &-item {
    &-wrapper {
      margin-left: 16px;
      background: #FFFFFF;
      border-radius: 4px 4px 0px 0px;
      opacity: 1;
      border: 1px solid #DDE9E8;

      & + & {
        margin-top: 16px;
      }
    }

    &-content {
      background-color: #fff;
      padding: 16px;
    }

    &-header {
      height: 36px;
      line-height: 36px;
      background: #F0F7F7;
      border-radius: 4px 4px 0px 0px;
      border-bottom: 1px solid #DDE9E8;

      &-label {
        font-size: 16px;
        font-weight: 400;
        color: #757E7E;
        position: relative;
        margin-left: 22px;

        &::before {
          //margin-left: 6px;

          position: absolute;
          left: -12px;
          top: 0;
          content: '';
          width: 6px;
          height: 20px;
          background-color: #006666;
          border-radius: 0px 0px 0px 0px;
        }
      }
    }
  }
}

</style>
