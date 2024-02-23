/**
* @file addDeaprtment.vue
* @author huang
* @date 2023/8/15
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/
<template>
  <dialog-template>
    <template #title>
      {{ title }}
    </template>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="140px"
      size="small"
    >
      <el-form-item
        label="上级部门"
        prop="parentId"
      >
        <cascader-department-list v-model="formData.parentId" />

      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="部门名称"
            prop="deptName"
          >
            <el-input
              v-model="formData.deptName"
              placeholder="请输入部门名称"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="显示排序"
            prop="orderNum"
          >
            <el-input-number
              v-model="formData.orderNum"
              :max="9999"
              :min="0"
              placeholder="请输入排序"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="科室地址"
        prop="deptPlace"
      >
        <el-input
          v-model="formData.deptPlace"
          placeholder="请输入科室地址"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        v-if="isStatus"
        label="部门状态"
        prop="status"
      >
        <el-radio-group v-model="formData.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button
        type="primary"
        @click="submit"
      >提交
      </el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
  </dialog-template>

</template>

<script>
import SystemDepartmentManagementApi from '../api';
import CascaderDepartmentList from '../components/cascaderDepartmentList.vue';
import DialogTemplate from '@/common/components/dialog/template.vue';

export default {
  components: { CascaderDepartmentList, DialogTemplate, },
  props: {
    isStatus: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {
        return {
          ancestors: '',
          children: '',
          createBy: '',
          createTime: '',
          delFlag: '',
          deptId: '',
          deptName: '',
          email: '',
          leader: '',
          orderNum: '',
          params: '',
          parentId: '',
          parentName: '',
          phone: '',
          remark: '',
          status: '0',
          updateBy: '',
          updateTime: '',
        };
      },
    },
  },
  data() {
    return {
      parentList: [],
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur', },
        ],
        orderNum: [
          { required: false, message: '请输入排序', trigger: 'blur', },
        ],
        parentId: [
          { required: false, message: '请选择上级部门', trigger: 'blur', },
        ],
        status: [
          { required: false, message: '请选择部门状态', trigger: 'blur', },
        ],
      },
      formData: {
        // 部门名称
        deptName: '',
        // 显示排序
        orderNum: '',
        // 上级科室
        parentId: '',
        // 部门状态 0正常,1停用
        status: '0',
      },
    };
  },
  watch: {
    // data: {
    //   immediate: true,
    //   handler(nv, ov) {
    //     console.log(nv, ov);
    //     if (nv) {
    //       this.formData = {
    //         ...nv,
    //       };
    //     }
    //   },
    //   deep: true,
    // },
  },
  async mounted() {
    if (this.data.deptId) {
      const res = await SystemDepartmentManagementApi.getDepartmentDetail(this.data.deptId);
      this.formData = {
        ...res,
      };
    }
  },
  methods: {
    cancel() {
      this.$emit('done');
    },

    // 提交
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.formData?.deptId) {
            await SystemDepartmentManagementApi.updateDepartment(this.formData);
          } else {
            await SystemDepartmentManagementApi.addDepartment(this.formData);
          }
          this.$message({
            message: '提交成功',
            type: 'success',
          });
          this.$emit('done', this.formData);
        } else {
          this.$message({
            message: '请正确填写',
            type: 'error',
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.w-100 {
  width: 100%;
}
</style>
