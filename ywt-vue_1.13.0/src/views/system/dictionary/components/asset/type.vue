<!--  -->
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" size="mini">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="上级">
          <el-select v-model="formData.parentId" class="w-100" disabled>
            <el-option v-for="v in tableList" :key="v.id" :value="v.id" :label="v.name" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否启用">
          <el-switch v-model="formData.state" :inactive-value="0" :inactive-text="'禁用'" :active-value="1" :active-text="'启用'" />
        </el-form-item>
      </el-col>

    </el-row>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import DictionaryApi from '@/apis/dictionary/center';
import _ from 'lodash';
export default {
  name: 'AssetsAddHyy',
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    changeOptionsName: {
      type: String,
      default: 'add',
    },
    tableList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      submitButtonLoading: false,
      formData: {
        name: '',
        parentId: '',
        id: '',
        state: 1,
      },
      rules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur',
        }],
      },
    };
  },
  computed: {
  },
  mounted() {
    if (this.changeOptionsName === 'child') {
      this.formData.parentId = this.info.id || 0;
    }
    if (Object.values(this.info).length && this.changeOptionsName === 'edit') {
      this.formData = _.pick(this.info, Object.keys(this.formData));
    }
  },
  methods: {
    async submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.submitButtonLoading = true;
          try {
            let rs = null;
            if (this.formData.id) {
              rs = await DictionaryApi.AssetApi.update(this.formData);
            } else {
              rs = await DictionaryApi.AssetApi.add(this.formData);
            }
            this.submitButtonLoading = false;
            this.$emit('done', rs);
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
.w-100{
  width: 100%;
}

</style>
