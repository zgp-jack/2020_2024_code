<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 17:55:47
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-27 16:45:06
 * @Description: 数据字典下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
    :clearable="clearable"
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
    clearable: {
      type: Boolean,
      default: true,
    },
    // 硬码字典
    hardList: {
      type: Array,
      default: function () {
        return [];
      },
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
    if (this.hardList.length > 0) {
      this.list = this.hardList;
    } else {
      this.genListByDic();
    }
  },
  mounted() {
  },
  methods: {
    // 通过数据字典生成选项
    genListByDic() {
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
  },
};
</script>

<style lang="scss" scoped>

</style>
