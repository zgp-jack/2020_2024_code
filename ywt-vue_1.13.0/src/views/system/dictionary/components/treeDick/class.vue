<!--  -->
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" size="mini">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="Code" prop="value">
      <el-input v-model="formData.value" />
    </el-form-item>
    <el-form-item label="额外参数" prop="parm">
      <el-input v-model="formData.parm" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="上级">
          <el-select v-model="formData.parentId" class="w-100" disabled>
            <el-option v-for="v in tableList" :key="v.id" :value="v.id" :label="v.name" />
          </el-select>
          <!-- <el-cascader
            v-model="formData.parentId"
            :options="cascaderList"
            @change="handleChange"
          /> -->
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
import { arrayToTree, } from '@/utils/common';
export default {
  name: 'FalultAddHyy',
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
        value: '',
        parm: '',
      },
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
        parm: [{
          required: false,
        }],
      },
    };
  },
  computed: {
    cascaderList() {
      return arrayToTree(this.tableList, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      });
    },

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
    handleChange(val) {

    },
    async submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.submitButtonLoading = true;
          try {
            let rs = null;
            rs = await DictionaryApi.DataApi.saveOrUpdateItem({
              catalogId: 3,
              ...this.formData,
            });

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
