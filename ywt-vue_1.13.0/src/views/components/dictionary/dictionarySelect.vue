<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 17:39:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:34:01
 * @Description:字典数据下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    :placeholder="placeholder"
    :disabled="disabled"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="(item,index) in list"
      :key="index"
      :value="Number(item.value)"
      :label="item.name"
    />
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    dicKey: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: this.$store.state['dictionary'][this.dicKey],
    };
  },
  computed: {
    selectedData: {
      set(newVal) {
        let val;
        if (this.multiple) {
          val = newVal.join(',');
        }
        this.$emit('input', val);

        this.$emit('change', val);
      },
      get() {
        if (this.multiple) {
          return this.value ? this.value.split(',').map(item => Number(item)) : [];
        } else {
          return this.value;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
