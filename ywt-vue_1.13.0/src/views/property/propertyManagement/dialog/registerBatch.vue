<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-16 18:05:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-19 16:06:27
 * @Description: 批量添加
-->
<template>
  <div>
    <el-form
      ref="form"
      label-position="right"
      label-width="120px"
      size="mini"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产编号前缀">
              <dictionary-select
                v-model="formData.codePrefix"
                :disabled="true"
                :dic-key="'codePrefixList'"
                placeholder="请选择资产编号前缀"
                class="w100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数量" prop="amount">
              <el-input v-model="formData.amount" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          @click="submit"
        >确定</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import PropertyManagementApi from '@/apis/property/propertyManagement';
export default {
  components: {
    DictionarySelect: () => import('@/views/components/dictionary/dictionarySelect.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        amount: 1,
      },
      rules: {
        amount: [{
          pattern: /^([1-9]|[1-9]\\d|100)$/, message: '数量范围1-100', trigger: 'blur',
        }],
      },
    };
  },
  async created() {
    this.formData = Object.assign({}, this.formData, this.data);
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        await PropertyManagementApi.register(this.formData);
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
