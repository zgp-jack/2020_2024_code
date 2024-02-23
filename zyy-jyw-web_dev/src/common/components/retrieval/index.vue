<template>
  <el-input
    v-model="retrieveValue"
    size="mini"
    class="border"
    v-bind="$attrs"
    @input="onInput"
  >
    <i slot="prefix" class="el-icon-search el-input__icon" />
  </el-input>
</template>
<script>
import {
  debounce,
} from 'lodash-es';
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // retrieveValue: '',
    };
  },
  computed: {
    retrieveValue: {
      get() {
        return this.value;
      },
    },
  },
  methods: {

    onInput: debounce(function (val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }, 1000),
  },

};
</script>
<style lang="scss" scoped>
.border ::v-deep .el-input__inner{
  border-radius: 4px;
}

</style>
