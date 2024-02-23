<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-12 19:51:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-05-12 19:51:39
 * @Description:转交原因单选框
-->
<template>
  <el-radio-group v-model="selectedData">
    <el-radio
      v-for="item in list"
      :key="item.id"
      :label="item.value"
    >{{ item.name }}
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].transReasonList,
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        this.$emit('change', newVal);
        this.$emit('input', newVal);
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
//控制radio
.el-radio {
  margin-right: 14px;
  margin-bottom: 16px;
}
.el-radio ::v-deep .el-radio__label {
  padding-left: 4px;
}
.el-radio-group {
  vertical-align: text-top;
}
</style>
