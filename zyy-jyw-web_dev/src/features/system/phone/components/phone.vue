<template>
  <dialog-template>
    <template #title>
      {{ title }}
    </template>

    <el-form v-if="handleType === 1" ref="formRef" :model="form" label-width="120px">
      <el-form-item
        label="科室电话"
        prop="phone"
        :rules="[{
          required:true,
          message:'请输入科室电话',
        }]"
      >
        <el-input v-model="form.phone" placeholder="请输入科室电话" />
      </el-form-item>
      <el-form-item
        label="所属科室"
        prop="deptList"
        :rules="[{
          required:true,
          message:'请选择所属科室',
        }]"
      >
        <dept-select v-model="form.deptList" collapse-tags :props="{multiple: true,}" placeholder="请选择所属科室" />
      </el-form-item>
      <el-form-item
        label="联系人"
        prop="user"
        :rules="[{
          required:true,
          message:'请输入联系人',
        }]"
      >
        <el-input v-model="form.user" placeholder="联系人" />
      </el-form-item>
    </el-form>
    <template #footer>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
      <pure-button
        label="确定"
        type="major"
        @click="confirm"
      />
    </template>
  </dialog-template>
</template>
<script>
import DialogTemplate from '@/common/components/dialog/template.vue';
import DeptSelect from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
// import FormContactPerson from '@/features/system/thirdParty/form/contactPerson.vue';
export default {
  components: {
    DialogTemplate,
    DeptSelect,
  },
  props: {
    confirmFn: {
      type: Function,
      default: () => {
      },
    },
    form: {
      type: Object,
      default: () => {
        return {
          deptList: [],
        };
      },
    },
    title: {
      type: String,
      default: '新增',
    },
    handleType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      // form: {
      //   id: '',
      //   phone: '',
      //   deptId: '',
      //   contacts: '',
      // },
    };
  },
  methods: {
    async confirm() {
      const valid = await this.$refs.formRef.validate();
      const confirmApi = {
        phone: this.form.phone,
        contacts: this.form.user,
        deptIdList: this.form.deptList,
      };
      try {
        if (valid) {
          await this.confirmFn(confirmApi);
          this.$emit('done', confirmApi.phone);
          this.$notify.success(`${this.title}成功`);
        }
      } catch (err) {
        this.$notify.error(err);
      }
    },
    cancel() {
      this.$emit('done');
    },
  },

};
</script>

<style lang='scss'
  scoped
>
.m-l-16{
  cursor: pointer;
  margin-left: 16px;
  margin-top: 8px;
}
</style>
