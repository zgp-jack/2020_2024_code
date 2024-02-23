<!--
    目录数据添加
 -->
<template>
  <el-form ref="form" label-position="right" label-width="180px" size="mini" :model="formData" :rules="rules">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="Code(不可重复)" prop="value">
      <el-input v-model="formData.value" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="formData.state" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import DictionaryApi from '@/apis/dictionary/center';
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        name: '',
        value: '',
        id: '',
        state: 1,
      },
      submitButtonLoading: false,
      rules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur',
        }],
        value: [{
          required: true,
          message: 'Code不能为空',
          trigger: 'blur',

        }],
        state: [{
          required: false,
        }],
      },
    };
  },
  computed: {
  },
  mounted() {
    if (Object.values(this.info).length) {
      this.formData = this.info;
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.submitButtonLoading = true;
            await DictionaryApi.DataApi.saveOrUpdateCatalog(this.formData);
            this.submitButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
    text-align: right;
}
</style>
