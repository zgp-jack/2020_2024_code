<template>
  <div class="comp-check-box">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{ checkAllLabel }}</el-checkbox>
    <el-divider />
    <el-checkbox-group v-model="checked" @change="handleCheckedChange">
      <div v-for="item in checkList" :key="item[itemProps.value]" class="check-item">
        <el-checkbox :label="item[itemProps.value]">{{ item[itemProps.label] }}</el-checkbox>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checkedData',
    event: 'change',
  },
  props: {
    checkAllLabel: {
      type: String,
      default: '全选',
    },
    checkList: {
      type: Array,
      default() {
        return [];
      },
    },
    itemProps: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
        };
      },
    },
    checkedData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checked: [],
    };
  },
  watch: {
    checkedData: {
      handler(value) {
        this.checked = value;
        this.handleCheckAllShow(value);
      },
      immediate: true,
    },
  },
  methods: {
    handleCheckAllChange(value) {
      let checkedData = [];
      if (value) {
        checkedData = this.checkList.map(item => item[this.itemProps.value]);
      }
      this.$emit('change', checkedData);
      this.isIndeterminate = false;
    },
    handleCheckAllShow(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.checkList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
    },
    handleCheckedChange(value) {
      this.handleCheckAllShow(value);
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-check-box {
  .check-item {
    margin-bottom: 16px;
  }
}
</style>
