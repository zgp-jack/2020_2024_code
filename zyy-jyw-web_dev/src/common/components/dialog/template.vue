/**
* @file template.vue.vue
* @author huang
* @date 2023/8/21
* @description dialog  模版文件
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <div class="dialog">
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
    <div class="footer align-right">
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
//.body{
//  padding: 16px;
//}
</style>
