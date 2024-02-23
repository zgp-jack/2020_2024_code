<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-26 15:50:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-21 17:49:19
 * @Description: 科室维护
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="122px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="科室名称" prop="deptName">
          <el-input v-model="formData.deptName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="科室编号" prop="deptCode">
          <el-input v-model="formData.deptCode" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="科室电话" prop="phone">
      <el-input v-model="formData.phone" />
    </el-form-item>
    <el-form-item label="科室地址" prop="deptPlace">
      <el-input v-model="formData.deptPlace" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="院区" prop="hospital">
          <hosipital-area-select v-model="formData.hospital" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上级科室">
          <department-cascader v-model="formData.parentId" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0px" class="form-item-wrapper" style="text-align: right">
      <pure-button type="default" label="确定" @click="submit" />
    </el-form-item>
  </el-form>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import DepartmentApi from '@/apis/system/department';
export default {
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    HosipitalAreaSelect: () => import ('../../sharedComponnets/select/hosipitalAreaSelect'),
  },
  mixins: [FormDialog],
  props: {
    deptId: {
      type: Number,
      default: null,
    },
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
        deptName: null,
        parentId: null,
        deptCode: null,
        deptPlace: null,
        hospital: null,
        phone: null,
      },
      needFetchDetail: false,
      rules: {
        deptName: [
          {
            required: true, message: '请输入科室名称', trigger: 'blur',
          }
        ],
        deptPlace: [
          {
            required: true, message: '请输入科室地址', trigger: 'blur',
          }
        ],
        hospital: [
          {
            required: true, message: '请选择院区', trigger: 'change',
          }
        ],
        deptCode: [
          {
            required: true, message: '请输入科室编号', trigger: 'blur',
          }
        ],
        phone: [{ required: true, message: '请输入科室电话', trigger: 'blur', },
          { pattern: /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/, message: '非有效手机或座机号', trigger: 'blur',
          }],
      },
    };
  },
  async created() {
    if (this.operatorType !== OPERATOR_TYPES.CREATE) {
      const data = await DepartmentApi.detail(this.data.deptId);
      this.formData = Object.assign({}, this.formData, data);
    }
    if (this.data.place) {
      this.formData.deptPlace = this.data.place;
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        let id;
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          id = await DepartmentApi.create({
            state: 1,
            contacts: JSON.stringify([{ place: '', phone: this.formData.phone, }]),
            deptName: this.formData.deptName,
            deptPlace: this.formData.deptPlace,
            deptCode: this.formData.deptCode,
            parentId: this.formData.parentId,
            hospital: this.formData.hospital,
          });
        } else {
          id = await DepartmentApi.update({
            id: this.data.deptId,
            state: 1,
            contacts: JSON.stringify([{ place: '', phone: this.formData.phone, }]),
            deptName: this.formData.deptName,
            deptPlace: this.formData.deptPlace,
            deptCode: this.formData.deptCode,
            parentId: this.formData.parentId,
            hospital: this.formData.hospital,
          });
        }
        this.$message({
          type: 'success',
          message: this.operatorType === OPERATOR_TYPES.CREATE ? '新增科室成功' : '修改科室成功',
        });
        this.$emit('done', { place: this.formData.deptPlace, deptId: id, });
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
 .form-item-wrapper {
    padding: 0;
    margin-bottom: 0;
    .el-col-12 {
      padding:0;
    }
  }
</style>
