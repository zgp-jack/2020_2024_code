<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-14 16:23:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-14 17:04:13
 * @Description:类目弹窗
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
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="编码" prop="value">
        <el-input v-model="formData.value" :disabled="operatorType==='UPDATE'" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="formData.state" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" />
      </el-form-item>
      <div v-if="operatorType!=='VIEW'" class="align-right">
        <pure-button
          label="保存"
          @click="onSubmit"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import DicTreeApi from '@/apis/system/dictionary/tree';
export default {
  mixins: [FormDialog],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        id: null,
        name: '',
        value: '',
        state: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur', }
        ],
        value: [
          { required: true, message: '请输入编码', trigger: 'blur', }
        ],
      },
    };
  },
  created() {
    if (this.operatorType === OPERATOR_TYPES.UPDATE) {
      this.formData = Object.assign({}, this.data);
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await DicTreeApi.create(this.formData);
        } else if (this.operatorType === OPERATOR_TYPES.UPDATE) {
          await DicTreeApi.update(this.formData);
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
