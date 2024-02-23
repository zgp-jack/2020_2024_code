<template>
  <el-select v-bind="$attrs" filterable :filter-method="handleFilter" :value="value" @change="handleChange" @visible-change="handleVisibleChange">
    <el-option v-for="option in renderOptions" :key="option.value" :label="option.label" :value="option.value" />
  </el-select>
</template>

<script>
export default {
  name: 'BigDataSelect',
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 30,
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      renderOptions: [],
    };
  },
  watch: {
    options: {
      immediate: true,
      handler() {
        this.handleFilter();
      },
    },
    value() {
      this.addValueOptions();
    },
  },
  created() {
    this.handleFilter();
  },
  methods: {
    // 保证当前值的选项一定在renderOptions里
    addValueOptions() {
      if (this.value) {
        const target = this.options.find(item => item.value === this.value);
        if (target) {
          const isExist = this.renderOptions.some(item => item.value === target.value);
          if (!isExist) {
            this.renderOptions.unshift(target);
          }
        }
      }
    },
    // 每次过滤筛选时，保证精准匹配的选项一定在renderOptions里
    addFilterOptions(query) {
      const target = this.options.find(item => item.label === query);
      if (target) {
        const isExist = this.renderOptions.some(item => item.value === target.value);
        if (!isExist) {
          this.renderOptions.unshift(target);
        }
      }
    },
    // 处理筛选
    handleFilter(query = '') {
      const filtered = this.options.filter(item => item.label.includes(query));
      if (filtered.length > this.max) {
        this.renderOptions = filtered.slice(0, this.max);
        this.addFilterOptions(query);
      } else {
        this.renderOptions = filtered;
      }
    },
    handleChange(val) {
      this.$emit('input', val);
      if (!val) {
        this.handleFilter();
      }
    },
    handleVisibleChange(isVisible) {
      if (!isVisible) {
        this.handleFilter();
        this.addValueOptions();
      }
    },
  },
};
</script>

<style></style>
