<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-19 18:39:58
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-19 18:57:33
 * @Description: 数据字典单选框
-->
<template>
  <el-radio-group
    v-model="selectedData"
    v-bind="$attrs"
  >
    <el-radio
      v-for="(item,index) in list"
      :key="index"
      :label="item.value"
    >{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    dicKey: {
      type: String,
      default: null,
    },
    // 字典值的类型 number,string
    type: {
      type: String,
      default: 'number',
    },
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    selectedData: {
      set(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      get() {
        return this.value;
      },
    },
  },
  created() {
    const data = this.$store.state['dictionary']['dicList'][this.dicKey] || [];
    switch (this.type) {
      case 'string':
        this.list = data.map(item => {
          return {
            label: item.name,
            value: item.value,
          };
        });
        break;
      case 'number':
        this.list = data.map(item => {
          return {
            label: item.name,
            value: Number(item.value),
          };
        });
        break;
    }
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
