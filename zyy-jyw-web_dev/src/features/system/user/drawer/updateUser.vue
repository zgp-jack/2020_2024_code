/**
* @file updateUser.vue
* @author huang
* @date 2023/11/16
* @description  新增,编辑用户
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      {{ title }}
    </template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      style="maxwidth: 480px"
    >
      <el-form-item
        label="用户名称"
        prop="userName"
      >
        <el-input
          v-model="formData.userName"
          autocomplete="new-userName"
          placeholder="请输入用户名称"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        v-if="operateType == 'add'"
        label="用户密码"
        prop="password"
      >
        <el-input
          v-model="formData.password"
          placeholder="请输入用户密码"
          autocomplete="new-password"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="用户昵称"
        prop="nickName"
      >
        <el-input
          v-model="formData.nickName"
          placeholder="请输入用户昵称"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="归属科室" prop="deptId">
        <use-department-list1 v-model="formData.deptId" style="width: 100%" />
      </el-form-item>
      <el-form-item label="其他科室" prop="otherDeptId">
        <dept-cascader
          v-model="formData.deptIdList"
          :props="{
            multiple:true,
          }"
          class="w-100"
          collapse-tags
        />

      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="formData.phonenumber"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio
          v-model="formData.status"
          label="0"
        >正常
        </el-radio>
        <el-radio
          v-model="formData.status"
          label="1"
        >停用
        </el-radio>
      </el-form-item>
    </el-form>

    <template #footer>
      <pure-button
        label="保存"
        @click="submit"
      />
      <pure-button
        label="取消"
        type="patch"
        @click="cancel"
      />

    </template>
  </drawer-template>
</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import DeptCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import SystemUserApi from '../api';
import PureButton from '@/common/components/button/index.vue';
import { pick, } from 'lodash-es';

export default {
  components: {
    PureButton,
    DrawerTemplate,
    DeptCascader,
    UseDepartmentList1: () => import('@/features/system/departmentManagement/components/cascaderDepartmentList.vue'),
  },
  props: {
    title: {
      type: String,
      default: '新增',
    },
    operateType: {
      type: String,
      default: 'add',
    },
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      formData: {
        deptId: '',
        nickName: '',
        deptIdList: [],
        userName: '',
        status: '0',
        phonenumber: '',
      },
    };
  },
  computed: {
    rules() {
      return {
        nickName: [
          { required: true, message: '请输入用户昵称', },
        ],
        userName: [
          { required: true, message: '请输入用户名称', },
        ],
        phonenumber: [
          { required: true, message: '请输入手机号码', },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请填写符合要求的11位手机号码', },
        ],
        password: [
          { required: true, message: '请输入用户密码', },
          { max: 50, message: '用户密码不超过50字符', },
        ],
        deptId: [
          { required: true, message: '请选择归属科室', },
        ],
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getDetail();
    });
  },
  methods: {
    async getDetail() {
      if (this.data?.userId) {
        const res = await SystemUserApi.getUserDetail(this.data.userId);
        this.formData = pick(res, Object.keys(this.formData));
        console.log(this.formData);
      }
    },
    cancel() {
      this.$emit('done');
    },
    submit() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          try {
            const data = { ...this.formData, };
            if (this.data?.userId) {
              Object.assign(data, { userId: this.data.userId, });
              await SystemUserApi.edit(data);
            } else {
              await SystemUserApi.add(data);
            }
            this.$emit('done');
            this.$notify.success('保存成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
