<!--  -->
<template>
  <el-form ref="form" label-position="right" label-width="120px" size="mini" :model="formData" :rules="rules">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="简称">
          <el-input v-model="formData.abbreviation" />

        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="类型" prop="manufacturerType">
          <DicSelect v-model="formData.manufacturerType" dic-key="manufacturerType" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="主要联系人" prop="contact">
          <el-input v-model="formData.contact" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="备注">
      <el-input v-model="formData.remark" type="textarea" rows="4" :maxlength="50" />
    </el-form-item>
    <el-row v-for="(v, i) in formData.otherContacts" :key="++i">
      <el-col :span="10">
        <el-form-item :label="`联系人${i}`">
          <el-input v-model="v.name" style="width: 116px" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item :label="`联系电话${i}`">
          <el-input v-model="v.phone" />
        </el-form-item>
      </el-col>
      <el-col :span="4" class="t-r">
        <el-button size="mini" @click="clickDelContacts(i)"> 删除 </el-button>
      </el-col>
    </el-row>
    <el-form-item>
      <template #default>
        <el-button
          size="mini"
          type="primary"
          plain
          @click="clickAddPerson"
        >添加联系人</el-button>
      </template>
    </el-form-item>

    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import { phone_rules, } from '@/views/project/components/panels/config/form.rules';
import DictionaryApi from '@/apis/dictionary/center';
import _ from 'lodash';
export default {
  components: {
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
  },
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
        id: '',
        // 名称（长度限制50）
        name: '',
        // 简称（长度限制20）
        abbreviation: '',
        // 类型（数据字典：manufacturerType）
        manufacturerType: 1,
        // 主要联系人（长度限制20）
        contact: '',
        // 联系电话（长度限制20）
        phone: '',
        // 备注（长度限制50）
        remark: '',
        // 其它联系人JSON {\"contact\", \"联系人\", \"phone\":\"电话\"}
        otherContacts: [],
      },
      submitButtonLoading: false,
      rules: {
        name: [{
          required: true,
          type: 'string',
          max: 50,
          message: '名称不能为空',
          trigger: 'blur',
        }],
        manufacturerType: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change',
        }],
        contact: [{
          required: true,
          type: 'string',
          max: 20,
          message: '主要联系人不能为空',
          trigger: 'blur',
        }],
        phone: [{
          required: true,
          type: 'string',
          max: 20,
          message: '联系电话不能为空',
          trigger: 'blur',
        }, phone_rules],
      },
    };
  },
  computed: {
  },
  mounted() {
    if (Object.values(this.info).length) {
      this.formData = _.pick(this.info, Object.keys(this.formData));
      this.formData.otherContacts = JSON.parse(this.formData.otherContacts);
    }
  },
  methods: {
    submit() {
      const params = JSON.parse(JSON.stringify(this.formData));
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.submitButtonLoading = true;
            params.otherContacts = JSON.stringify(params.otherContacts);
            if (params.id) {
              await DictionaryApi.BrandApi.update(params);
            } else {
              await DictionaryApi.BrandApi.add(params);
            }
            this.formData = this.$options.data().formData;
            this.submitButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
    clickAddPerson() {
      this.formData.otherContacts.push({
        contact: '',
        phone: '',
      });
    },
    clickDelContacts(index) {
      this.formData.otherContacts.splice(index - 1, 1);
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
    text-align: right;
}
</style>
