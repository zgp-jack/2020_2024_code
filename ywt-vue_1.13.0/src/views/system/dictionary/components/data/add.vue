<!--  -->
<template>
  <el-form ref="form" label-position="right" label-width="100px" size="mini" :model="formData" :rules="rules">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="Code" prop="value">
      <el-input v-model="formData.value" />
    </el-form-item>
    <el-form-item label="额外参数" prop="parm">
      <el-input v-model="formData.parm" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import DictionaryApi from '@/apis/dictionary/center';
import _ from 'lodash';
export default {
  name: 'DataAddHyy',
  components: {

  },
  props: {
    maxOrderNumber: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      submitButtonLoading: false,
      formData: {
        id: '',
        catalogId: '',
        name: '',
        value: '',
        orderNum: '',
        parentId: '',
        parm: '',
      },
      rules: {
        name: [{
          required: true,
          message: '名称不能为空',
          tirgger: 'blur',
        }],
        value: [{
          required: true,
          message: 'Code不能为空',
          trigger: 'blur',

        }],
        parm: [{
          required: false,
        }],
      },
    };
  },
  computed: {
  },
  mounted() {
    if (this.options === 'edit') {
      if (Object.values(this.info).length) {
        this.formData = _.pick(this.info, Object.keys(this.formData));
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.submitButtonLoading = true;
            this.formData.catalogId = this.info?.catalogId || this.info.id;
            this.formData.orderNum = this.maxOrderNumber || 1;
            await DictionaryApi.DataApi.saveOrUpdateItem(this.formData);
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
