<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-12 19:42:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-05-12 19:49:02
 * @Description:暂停原因单选框
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
      list: this.$store.state['dictionary'].suspendReasonList,
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
