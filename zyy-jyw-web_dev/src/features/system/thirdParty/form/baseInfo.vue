/**
* @file baseInfo.vue
* @author huang
* @date 2023/10/27
* @description 基础信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item
      label="名称"
      prop="deptName"
    >
      <el-input v-model="form.deptName" />
    </el-form-item>
    <el-form-item
      label="编号"
      prop="deptCode"
    >
      <el-input v-model="form.deptCode" />
    </el-form-item>
    <el-form-item
      label="地址"
      prop="deptPlace"
    >
      <el-input v-model="form.deptPlace" />
    </el-form-item>
    <el-form-item
      label="说明"
      prop="deptRemark"
    >
      <el-input v-model="form.deptRemark" />
    </el-form-item>
  </el-form>
</template>
<script>
import { isEmpty, } from 'lodash-es';

export default {
  name: 'BaseInfo',
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      rules: {
        deptCode: [
          { required: false, message: '请输入部门编号', trigger: 'blur', },
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur', },
        ],
        deptPlace: [
          { required: false, message: '请输入部门地址', trigger: 'blur', },
        ],
        deptRemark: [
          { required: false, message: '请输入备注', trigger: 'blur', },
        ],
      },
      form: {
        'deptCode': '',
        'deptName': '',
        'deptPlace': '',
        'deptRemark': '',
      },
    };
  },
  watch: {
    'data': {
      handler(val) {
        if (!isEmpty(val)) {
          this.form = {
            ...val,
          };
        }
      },
    },
    deep: true,
  },
  mounted() {
  },
  methods: {
    async submit(cb) {
      let valid = false;
      try {
        valid = await this.$refs.form.validate();
      } catch (err) {
        valid = err;
      }
      return {
        valid,
        form: this.form,
      };
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
