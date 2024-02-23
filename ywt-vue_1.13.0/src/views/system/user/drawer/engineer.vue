<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-21 15:39:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-21 17:23:04
 * @Description:用户信息弹窗
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">基本信息</div>
        <el-form
          ref="form"
          :inline="true"
          label-width="80px"
          label-position="right"
          size="mini"
          :model="formData"
          :rules="rules"
          :disabled="formData.id&&!editEngineer"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formData.userName" />
          </el-form-item>
          <el-form-item label="手机号" prop="mblNo">
            <el-input v-model="formData.mblNo" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formData.password"
              type="text"
              show-password
              autocomplete="new-password"
              onfocus="this.type='password'"
              :disabled="operatorType==='UPDATE'"
            />
          </el-form-item>
          <el-form-item label="是否启用" label-width="108px">
            <el-switch
              v-model="formData.state"
              :active-value="1"
              :inactive-value="0"
              inactive-text="否"
              active-text="是"
            />
          </el-form-item>
        </el-form>
        <el-row>
          <el-col>

            <pure-button
              v-if="editEngineer"
              label="保存"
              @click="onSubmit"
            />
            <pure-button
              v-if="!editEngineer&&formData.id"
              label="编辑"
              @click="editEngineer=!editEngineer"
            />

          </el-col>
        </el-row>
        <empty-row />
      </pure-card>
      <empty-row />
      <el-button
        type="primary"
        size="mini"
        :disabled="!formData.id"
        @click="onCreatePermission"
      >添加权限</el-button>

      <empty-row />
      <el-table
        border
        :data="formData.roles"
      >
        <el-table-column
          label="序号"
          type="index"
          align="left"
          width="78px"
        />
        <el-table-column
          label="科室"
          align="left"
          prop="deptName"
        />
        <el-table-column
          label="角色"
          align="left"
          prop="roleName"
        />
        <el-table-column
          label="开始时间"
          align="left"
          prop="startDate"
        >
          <template slot-scope="{row}">
            {{ row.startDate||'-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          align="left"
          prop="endDate"
        >
          <template slot-scope="{row}">
            {{ row.endDate||'-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="启用"
          align="left"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.state"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="默认"
          align="left"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.primary"
              :active-value="1"
              :inactive-value="0"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="onUpdatePermission(row)"
            >编辑</el-button>

            <el-popconfirm
              title="确定删除吗？"
              @confirm="onDeletePermission(row)"
            >
              <el-button
                slot="reference"
                size="medium"
                type="text"
                style="margin-left:5px"
              >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  bus,
} from '@/utils/bus';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import emptyRow from '@/components/emptyRow.vue';
import PermissionDialog from '../dialog/permission.vue';
import EngineerApi from '@/apis/system/engineer';
import * as Regex from '@/utils/regex';
export default {
  components: { emptyRow, },
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
        roles: [],
        name: '',
        userName: '',
        mblNo: '',
        password: '',
        id: null,
      },
      rules: {
        name: [{
          required: true, message: '请输入姓名', trigger: 'blur',
        }],
        userName: [{
          required: true, message: '请输入用户名', trigger: 'blur',

        },
        { min: 4, max: 20, message: '用户名长度在4到20个字符', trigger: 'blur', }],
        mblNo: [{
          required: true, message: '请输入手机号', trigger: 'blur',
        }, {
          pattern: Regex.phone, message: '请输入有效手机号码', trigger: 'blur',
        }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur',
        }],
      },
      editEngineer: false,
    };
  },
  computed: {
    title() {
      switch (this.operatorType) {
        case OPERATOR_TYPES.CREATE:
          return '新增用户';
        case OPERATOR_TYPES.UPDATE:
          return '编辑用户';
        case OPERATOR_TYPES.VIEW:
          return '查看用户';
        default:
          return '用户';
      }
    },
  },
  async created() {
    this.formData = Object.assign({}, this.formData, this.data);
    if (this.operatorType === OPERATOR_TYPES.CREATE) {
      this.editEngineer = true;
      this.formData.state = 1;
    } else {
      this.editEngineer = false;
      this.formData.password = 'test';
    }
  },
  methods: {
    // 新增或修改用户
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        if (this.formData.id) {
          await EngineerApi.update(this.formData);
          this.$message({
            type: 'success',
            message: '修改用户成功',
          });
        } else {
          const id = await EngineerApi.create(this.formData);
          this.formData.id = id;
          this.$message({
            type: 'success',
            message: '新增用户成功',
          });
        }
        this.editEngineer = false;
        bus.$emit('reloadUserList');
      } catch (error) {
        console.log(error);
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onDeletePermission(row) {
      try {
        await EngineerApi.deleteRole(row.id);
        const result = await EngineerApi.roleList(this.formData.id);
        this.formData.roles = result.roles;
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onUpdatePermission(row) {
      this.$dialog({
        title: '编辑权限',
        width: '688px',
        position: 'center',
        component: () => <PermissionDialog data={row} engineerId={this.formData.id} onDone={this.afterAddedPermission}/>,
      });
    },
    async onCreatePermission() {
      this.$dialog({
        title: '添加权限',
        width: '688px',
        position: 'center',
        component: () => <PermissionDialog engineerId={this.formData.id} onDone={this.afterAddedPermission}/>,
      });
    },
    // 添加权限成功后的处理
    async afterAddedPermission(data) {
      try {
        const result = await EngineerApi.roleList(this.formData.id);
        this.formData.roles = result.roles;
        bus.$emit('reloadUserList');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
