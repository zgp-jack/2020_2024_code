<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-14 14:03:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-19 14:49:20
 * @Description: 编辑名称
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="108px"
      size="mini"
      :rules="rules"
    >
      <el-form-item label="字典名" prop="name">
        <el-input v-model="formData.name" maxlength="100" />
      </el-form-item>

      <div class="align-right">
        <pure-button label="取消" type="wire-frame" @click="$emit('cancel')" />
        <pure-button
          label="确定"
          @click="onSubmit"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import DictionaryApi from '../api';
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        name: this.name,
      },
      rules: {
        name: [
          { required: true, message: '请输入字典名', trigger: 'blur', }
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      await this.$refs.form.validate();
      await DictionaryApi.updateCategory({ id: this.id, ...this.formData, });
      this.$message.success('修改成功！');
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
