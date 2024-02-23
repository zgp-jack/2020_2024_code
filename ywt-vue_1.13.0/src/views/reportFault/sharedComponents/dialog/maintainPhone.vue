<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-02 14:59:41
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:57
 * @Description:电话号码维护
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
    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用科室" prop="deptId">
            <department-cascader v-model="formData.deptId" />
          </el-form-item>
        </el-col></el-row>
    </el-form-item>
    <el-form-item label-width="0px" class="form-item-wrapper">
      <el-row>
        <el-col :span="12">
          <el-form-item label="报修人" prop="user">
            <el-input v-model="formData.user" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item
      label="报修地址"
      prop="place"
    >
      <el-input v-model="formData.place" />
    </el-form-item>
    <el-form-item label-width="0px" class="form-item-wrapper" style="text-align: right">
      <el-button type="primary" @click="submit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  components: {
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
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
        phone: null,
        deptId: null,
        user: null,
        place: null,
      },
      rules: {
        phone: [{
          required: true, message: '请输入电话号码', trigger: 'blur',
        }, {
          pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '手机格式不正确', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',
        }],
        user: [
          {
            required: true, message: '请输入报修人', trigger: 'blur',
          }
        ],
        place: [{
          required: true, message: '请输入报修地址', trigger: 'blur',
        }],
      },
    };
  },
  created() {
    this.formData = Object.assign({}, this.data);
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        this.$emit('done', this.formData);
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
