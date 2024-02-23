/**
* @file edit.vue
* @author huang
* @date 2023/8/17
* @description 编辑弹窗
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form>
    <el-form-item label="名称">
      <el-input v-model="form.dictName" />
    </el-form-item>
    <el-form-item>
      <el-button>取消</el-button>
      <el-button @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import SystemDataDictionaryApi from '../api';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      form: {},
    };
  },
  created() {
    this.form = {
      ...this.data,
    };
  },
  methods: {
    async onSubmit() {
      await SystemDataDictionaryApi.updateDictionary(this.form);
    },

  },
};
</script>

<style lang="scss" scoped>

</style>
