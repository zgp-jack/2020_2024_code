/**
* @file template.vue.vue
* @author huang
* @date 2023/8/21
* @description dialog  模版文件
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="drawer">
    <div class="header">
      <div class="title">
        <slot name="title" />
      </div>
      <div class="sub-title">
        <slot name="sub-title" />
      </div>
    </div>
    <div class="body">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss'
  scoped
>
.body {
  padding: 16px;
  overflow: auto;
}
</style>
