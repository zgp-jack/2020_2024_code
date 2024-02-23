<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-03 15:15:01
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-08 13:51:15
 * @FilePath: \ywt-vue-qp\src\components\btns\index.vue
 * @Description:按钮组件
-->
<template>
  <div :style="btnsStyle">
    <el-button
      v-for="button in buttons.filter(button => typeof button.show ==='function' ? button.show(button) : button.show)"
      :key="button.value"
      :style="button.style"
      :type="button.type"
      :size="button.size"
      :icon="button.icon"
      :disabled="typeof button.disabled ==='function' ? button.disabled() : button.disabled"
      :loading="button.loading"
      @click="button.click"
    >
      {{ button.label }}<i :class="button.class" />
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'Btns',
  inheritAttrs: false,
  props: {
    buttons: {
      type: Array,
      required: true,
    },
    btnsStyle: {
      type: String,
      default: '',
    },
  },
};
</script>
