<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-20 15:39:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:02:29
 * @Description:科室弹窗
-->
<template>
  <div v-loading="loading" class="drawer">
    <div class="header">
      <div class="title">{{ title }}</div>

    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">科室信息</div>
        <el-form
          ref="form"
          :model="formData"
          label-width="120px"
          label-position="right"
          size="mini"
          :rules="rules"
        >
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="科室名称" prop="deptName">
                <el-input v-model="formData.deptName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级科室">
                <department-cascader v-model="formData.parentId" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="科室编号" prop="deptCode">
                <el-input v-model="formData.deptCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="科室简称">
                <el-input v-model="formData.abbreviation" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="科室地址" prop="deptPlace">
            <el-input v-model="formData.deptPlace" />
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="院区" prop="hospital">
                <hosipital-area-select v-model="formData.hospital" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="默认报修人" prop="defaultUser">
                <engineer-select v-model="formData.defaultUser" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="运维小组" prop="teamId">
                <group-select v-model="formData.teamId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否启用" prop="state">
                <el-switch
                  v-model="formData.state"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  active-text="是"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
          <div class="department-phone">科室电话</div>
          <template v-for="(k, index) in formData.contacts">
            <el-form-item :key="index" label-width="0px" class="form-item-wrapper">
              <el-col :span="10">
                <el-form-item
                  :ref="index+'user'"
                  label="联系人"
                  :prop="'contacts.'+index+'.user'"
                  :rules="{ required: true, message: '请输入联系人', trigger: 'blur' }"
                >
                  <el-input v-model="k.user" />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item
                  label="联系电话"
                  :prop="'contacts.'+index+'.phone'"
                  :rules="[{ required: true, message: '请输入联系电话', trigger: 'blur' },{ pattern: /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/, message: '非有效手机或座机号', trigger: 'blur' }]"
                >
                  <el-input v-model="k.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button
                  v-if="index!==0"
                  style="margin-left:16px"
                  @click="onDeleteContact(index)"
                >删除</el-button>
              </el-col>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              @click="onAddContact()"
            >添加联系人</el-button>
          </el-form-item>
        </el-form>
      </pure-card>
    </div>
    <div class="footer">
      <pure-button
        label="保存"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import DepartmentApi from '@/apis/system/department';
import {
  isArray,
} from 'lodash';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import EngineerSelect from '@/views/reportFault/sharedComponents/select/engineerSelect';
import HosipitalAreaSelect from '@/views/system/sharedComponnets/select/hosipitalAreaSelect';
import GroupSelect from '@/views/components/group/groupSelect.vue';
export default {
  components: {
    DepartmentCascader,
    EngineerSelect,
    HosipitalAreaSelect,
    GroupSelect,
  },
  mixins: [FormDialog],
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
      },
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
      },
    };
  },
  computed: {
    title() {
      switch (this.operatorType) {
        case OPERATOR_TYPES.CREATE:
          return '新增科室';
        case OPERATOR_TYPES.UPDATE:
          return '编辑科室';
        case OPERATOR_TYPES.VIEW:
          return '查看科室';
        default:
          return '科室';
      }
    },
  },
  async created() {
    if (this.operatorType === OPERATOR_TYPES.CREATE) {
      this.formData = Object.assign({
        state: 1,
        contacts: [{ user: '', phone: '', }], }, this.data);
    } else {
      if (!this.data.contacts) {
        this.formData = Object.assign({}, this.data);
        this.formData.contacts = [{ user: '', phone: '', }];
      } else {
        this.formData = Object.assign({}, this.data);
        try {
          this.formData.contacts = JSON.parse(this.formData.contacts);
          this.formData.contacts = isArray(this.formData.contacts) ? this.formData.contacts : [{ user: '', phone: '', }];
        } catch (error) {
          this.formData.contacts = [{ user: '', phone: '', }];
        }
      }
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await DepartmentApi.create(this.formData);
        } else {
          await DepartmentApi.update(this.formData);
        }
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
    async onAddContact() {
      this.formData.contacts.push({
        user: '',
        phone: '',
      });
    },
    async onDeleteContact(index) {
      this.formData.contacts.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
    height: 100%;
    .card {
        height: 100%;
    }
     &::v-deep .pure-card__body {
      max-height:calc(100% - 34px);
      height: calc(100% - 34px);
  }
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .form-item-wrapper {
    padding: 0;
    margin-bottom: 0;
}
.department-phone {
    font-size: 18px;
    font-weight: 500;
    color: #2d405e;
}
</style>
