<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-18 11:35:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-18 14:29:16
 * @Description:模糊查询搜索框
-->

<template>
  <el-row align="middle">
    <el-col :span="24">
      <el-input
        v-model="retrieveValue"
        size="mini"
        class="border"
        v-bind="$attrs"
        @input="onInput"
      >
        <i slot="prefix" class="el-icon-search el-input__icon" />
      </el-input>
    </el-col>
  </el-row>
</template>
<script>
import { delayCallBack, } from '@/utils/common';
export default {
  props: {
    debounce: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      retrieveValue: '',
    };
  },
  methods: {
    onInput(val) {
      delayCallBack(this.debounce, () => {
        this.$emit('input', val);
        this.$emit('change', val);
      });
    },
  },

};
</script>
<style lang="scss" scoped>
.border ::v-deep .el-input__inner{
  border-radius: 4px;
}
</style>
