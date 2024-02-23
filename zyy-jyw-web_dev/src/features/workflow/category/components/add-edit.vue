<template>
  <div>
    <el-form ref="formRef" label-width="120px" style="maxwidth: 480px" :model="formData" :rules="rules">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入分类编码" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

export default {
  props: {
    currentData: {
      type: Object,
      default() {
        return {
          status: '0',
        };
      },
    },
    operateType: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      formData: {
        unitCode: '',
        unitName: '',
        directory: '',
      },
    };
  },
  computed: {
    rules() {
      return {
        categoryName: [
          { required: true, message: '请输入分类名称', },
        ],
        code: [
          { required: true, message: '请输入分类编码', },
        ],
        unitAddress: [
          { max: 200, message: '单元所在位置不超过200字符', },
        ],
      };
    },
  },
  watch: {
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          const data = { ...rest, };
          this.formData = data;
          this.$nextTick(() => {
            this.$refs.formRef.clearValidate();
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    reset() {
      this.formData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    validate() {
      const result = {};
      this.$refs.formRef.validate(valid => {
        result.valid = valid;
        if (valid) {
          const data = { ...this.formData, };
          result.data = data;
        }
      });
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
