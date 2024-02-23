/**
* @file index.vue
* @author huang
* @date 2023/8/29
* @description  E chart面板组件
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="chart-panel">
    <el-row class="header">
      <el-col
        :span="12"
        class="header-left"
      >
        <span class="title">
          {{ title }}
        </span>
        <span
          v-if="$slots.subTitle"
          class="sub-title"
        >
          <slot name="subTitle" />
        </span>
      </el-col>
      <el-col
        :span="12"
        class="header-right"
      >
        <span>
          <slot name="left" />
        </span>
        <svg-icon
          icon-class="download"
          style="cursor: pointer"
          @click="$emit('download')"
        />
      </el-col>
    </el-row>
    <el-row class="body">
      <el-col :span="24">
        <slot />
      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: 'title',
    },
  },

};
</script>

<style lang='scss'
  scoped
>
.chart-panel {
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
}

.header {
  padding: 8px 0px;

  &-left {
    display: flex;
    align-items: center;

    > .title {
      &:before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 20px;
        background: #006666;
        border-radius: 0px 0px 0px 0px;
        opacity: 1;
        margin-right: 8px;
      }

      display: inline-flex;
      align-items: center;
      margin-right: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #282827;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
