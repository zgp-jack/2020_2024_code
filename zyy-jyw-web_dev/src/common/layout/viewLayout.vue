/**
* @file viewLayout.vue
* @author huang
* @date 2023/11/16
* @description 通用视图布局
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container class="view-layout-container">
    <template v-if="model === 'model1' ">
      <el-header
        v-if="$slots.header"
        class="view-layout-header"
        height="auto"
      >
        <slot name="header" />
      </el-header>
      <el-container>
        <el-aside
          v-if="$slots.aside"
          class="view-layout-aside"
        >
          <slot name="aside" />
        </el-aside>
        <el-main class="view-layout-main">
          <slot />
        </el-main>
      </el-container>
    </template>
    <template v-else>
      <el-aside
        v-if="$slots.aside"
        class="view-layout-aside"
        :width="asideWidth"
      >
        <slot name="aside" />
      </el-aside>
      <el-container>
        <el-header
          class="view-layout-header"
          height="auto"
        >
          <slot name="header" />
        </el-header>
        <el-main class="view-layout-main">
          <slot />
        </el-main>
      </el-container>
    </template>

  </el-container>
</template>
<script>
// h-a-m
export default {
  name: 'HyyViewLayout',
  props: {
    model: {
      type: String,
      // 布局模式
      default: '',
    },
    asideWidth: {
      type: String,
      default: '320px',
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang='scss'
  scoped
>

.view {
  &-layout {
    &-container {
      background-color: #F0F7F7;
    }

    &-header {
      padding: 0 16px;
      background-color: #fff;
    }

    &-main {
      padding: 0 16px;
      background-color: #fff;

    }

    &-aside {
      background-color: #fff;
      margin: 0 !important;
      padding: 16px;
      border-right: 1px solid #ccc;
    }
  }
}
</style>
