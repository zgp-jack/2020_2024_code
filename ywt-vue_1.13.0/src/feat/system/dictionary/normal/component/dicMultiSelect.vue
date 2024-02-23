<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-07 11:36:16
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-27 17:41:11
 * @Description: 数据字典多选下拉框
-->
<template>
  <el-select
    v-model="selectedData"
    v-bind="$attrs"
    :filterable="true"
    multiple
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
      default: 'string',
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
        this.$emit('input', val.join(','));
        this.$emit('change', val.join(','));
      },
      get() {
        return this.value ? this.value.split(',') : [];
      },
    },
  },
  created() {
    if (this.hardList.length > 0) {
      this.genList(this.hardList);
    } else {
      const data = this.$store.state['dictionary']['dicList'][this.dicKey] || [];
      this.genList(data);
    }
  },
  mounted() {
  },
  methods: {
    // 通过数据源生成选项
    genList(data) {
      switch (this.type) {
        case 'string':
          this.list = data.map(item => {
            return {
              label: item.name,
              value: String(item.value),
            };
          });
          break;
        case 'number':
          console.warn('多选下拉框类型只能是string');
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
