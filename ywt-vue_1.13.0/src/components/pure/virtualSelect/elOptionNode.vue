<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-04-17 10:04:24
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-17 14:42:49
 * @Description:
-->
<template>
  <el-option :key="source[value]" :label="source[label]" :value="source[value]">
    <span>{{ source[label] }}</span>
    <span v-if="isRight" style="float:right;color:#939393">{{ source[value] }}</span>
  </el-option>
</template>
<script>
export default {
  name: 'ElOptionNode',
  props: {
    index: {
      type: Number,
    }, // 每一行的索引
    source: {
      type: Object,
      default() {
        return {};
      },
    }, // 每一行的内容
    label: {
      type: String,
    }, // 需要显示的名称
    value: {
      type: String,
    }, // 绑定的值
    isRight: {
      type: Boolean,
      default() {
        return false;
      },
    }, // 右侧是否显示绑定的值
  },
};
</script>
