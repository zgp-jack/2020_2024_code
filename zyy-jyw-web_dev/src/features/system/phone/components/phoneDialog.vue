/**
* @file phoneDialog.vue
* @author zgp
* @date 2024/1/12
* @description 新增电话簿/IP
* @projectName
* @email
*/

<template>
  <dialog-template>
    <template #title>
      {{ title }}
    </template>
    <el-form v-if="handleType === 1" ref="formRef" :model="form" label-width="120px">
      <el-form-item
        label="所属科室"
        prop="deptId"
        :rules="[{
          required:true,
          message:'请选择所属科室',
        }]"
      >
        <dept-select v-model="form.deptId" placeholder="请选择所属科室" class="w100" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in form.subList"
        :key="index"
        :label="'科室电话'+(index+1)"
        required
      >
        <el-col :span="10">
          <el-form-item
            :prop="`subList[${index}].phone`"
            :rules="[{
              required:true,
              message:'请输入科室电话',
            },{ max: 50, message: '科室电话长度不超过50字符', },]"
          >
            <el-input v-model="item.phone" placeholder="请输入科室电话" />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item
            :prop="`subList[${index}].contacts`"
            :rules="[{ required: true, message: '请输入联系人', },{ max: 100, message: '联系人长度不超过100字符', },]"
          >
            <el-input v-model="item.contacts" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col v-if="title === '新增'" :span="4" :offset="1">
          <i v-if="index > 0" class="el-icon-minus  m-l-16" @click="delPhone(index)" />
          <i v-if="form.subList.length-1 === index " class="el-icon-plus m-l-16" @click="addPhone(index)" />
        </el-col>
      </el-form-item>
    </el-form>
    <el-form v-else ref="formRef" :model="formIp" label-width="120px">
      <el-form-item
        label="所属科室"
        prop="deptId"
        :rules="[{
          required:true,
          message:'请选择所属科室',
        }]"
      >
        <dept-select v-model="formIp.deptId" placeholder="请选择所属科室" class="w100" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in formIp.subList"
        :key="index"
        :label="'科室IP'+(index+1)"
        :prop="`subList[${index}].ipAddress`"
        :rules="[{
          required:true,
          message:'请输入科室IP',
        },{pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,message: '请输入正确的IP地址',},{ max: 50, message: '科室IP长度不超过50字符', }]"
      >
        <el-col :span="18">
          <el-input v-model="item.ipAddress" placeholder="请输入科室IP" />
        </el-col>
        <el-col v-if="title === '新增'" :span="4" :offset="2">
          <i v-if="index > 0" class="el-icon-minus  m-l-16" @click="delPhone(index)" />
          <i v-if="formIp.subList.length-1 === index " class="el-icon-plus m-l-16" @click="addPhone()" />
        </el-col>
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
// import DeptSelect from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
// import FormContactPerson from '@/features/system/thirdParty/form/contactPerson.vue';
export default {
  components: {
    DialogTemplate,
    DeptSelect: () =>
      import('@/features/system/departmentManagement/components/deptCascader.vue'),
  },
  props: {
    confirmFn: {
      type: Function,
      default: () => {
      },
    },
    data: {
      type: Object,
      default: () => {
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
      form: {
        id: '',
        deptId: '',
        subList: [
          {
            contacts: '',
            phone: '',
          },
        ],
      },
      formIp: {
        id: '',
        deptId: '',
        subList: [
          {
            ipAddress: '',
          },
        ],
      },
    };
  },
  async mounted() {
    if (this.title === '编辑') {
      if (this.handleType === 1) {
        this.form = {
          id: this.data.id,
          deptId: this.data.deptId,
          subList: [
            {
              contacts: this.data.contacts,
              phone: this.data.phone,
            },
          ],
        };
      } else {
        this.formIp = {
          id: this.data.id,
          deptId: this.data.deptId,
          subList: [
            {
              ipAddress: this.data.ipAddress,
            },
          ],
        };
      }
    }
  },
  methods: {
    delPhone(index) {
      if (this.handleType === 1) {
        this.form.subList.splice(index, 1);
      } else {
        this.formIp.subList.splice(index, 1);
      }
    },
    addPhone() {
      if (this.handleType === 1) {
        this.form.subList.push({
          contacts: '',
          phone: '',
        });
      } else {
        this.formIp.subList.push({
          ipAddress: '',
        });
      }
    },
    async confirm() {
      let confirmApi = this.handleType === 1 ? this.form : this.formIp;
      const valid = await this.$refs.formRef.validate();
      if (this.title !== '新增') {
        const { id, deptId, subList, } = confirmApi;
        confirmApi = {
          id,
          deptId,
          ...subList[0],
        };
      }
      try {
        if (valid) {
          await this.confirmFn(confirmApi);
          this.$emit('done');
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
.w100 {
  width: 100%;
}
</style>
