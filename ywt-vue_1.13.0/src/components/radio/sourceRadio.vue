<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 22:04:08
 * @Description:故障来源单选框
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
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'].sourceList,
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
}
.el-radio ::v-deep .el-radio__label {
  padding-left: 4px;
}
</style>
