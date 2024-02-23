<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-10 10:36:06
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-10 20:25:16
 * @Description: 数据字典下拉框（新）
-->
<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
    clearable
  >
    <el-option
      v-for="(item, index) in list"
      :key="index"
      :value="item.value"
      :label="item.label"
      :disabled="disabledList.includes(item.value)"
    />
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
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
    disabledList: {
      type: Array,
      default: function () {
        return [];
      },
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
  mounted() {
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
