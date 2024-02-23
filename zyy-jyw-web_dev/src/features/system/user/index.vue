<template>
  <hyy-view-layout>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onRest"
      >
        <el-form-item>
          <el-date-picker
            v-model="queryData.date"
            end-placeholder="创建时间"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="创建时间"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="changeTime"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryData.deptName"
            placeholder="请输入科室名称"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryData.userName"
            placeholder="请输入用户名称"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryData.phonenumber"
            placeholder="请输入手机号码"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.status"
            placeholder="用户状态"
          >
            <el-option
              disabled
              label="请选择"
              value=""
            />
            <el-option
              label="正常"
              value="0"
            />
            <el-option
              label="停用"
              value="1"
            />
          </el-select>
        </el-form-item>
        <template #customButton>
          <el-form-item>
            <pure-button
              v-auth="'system:user:add'"
              icon="add"
              label="新增"
              type="special"
              @click="onAdd"
            />
            <pure-button
              v-auth="'system:user:import'"
              icon="upload"
              label="导入"
              type="major"
              @click="onExport"
            />
          </el-form-item>

        </template>
      </query-panel>
    </template>
    <template #aside>
      <department-tree @node-click="choseDepartmentTree" />
    </template>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryData"
      selection
      @selection-change="onSelectionChange"
    >
      <template #indexColumn>
        序号
      </template>

      <el-table-column
        label="用户名称"
        prop="userName"
      />
      <el-table-column
        label="用户昵称"
        prop="nickName"
      />
      <el-table-column
        label="科室"
        prop="deptName"
        :show-overflow-tooltip="true"
      >
        <template #default="{row}">
          {{ row.deptName | dept }}
        </template>
      </el-table-column>
      <el-table-column
        label="电话号码"
        prop="phonenumber"
      />
      <el-table-column label="状态">
        <template slot-scope="{ row }">
          <el-switch
            :value="row.status"
            active-value="0"
            inactive-value="1"
            @change="onChangeStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
      />
      <el-table-column label="操作">
        <template #default="{ row }">
          <pure-more-button :slice-number="3">
            <pure-button
              v-auth="'system:user:edit'"
              label="修改"
              type="text"
              @click="onEdit(row)"
            />
            <pure-button
              v-auth="'system:user:remove'"
              label="删除"
              text-color="warning"
              type="text"
              @click="onDel(row)"
            />
            <pure-button
              v-auth="'system:user:resetPwd'"
              label="重置密码"
              type="text"
              @click="onResetPass(row)"
            />
            <pure-button
              v-auth="'system:user:authRole'"
              label="授权角色"
              type="text"
              @click="onSelectRole(row)"
            />
            <pure-button
              v-if="row.openid"
              v-auth="'system:user:unbind'"
              label="微信解绑"
              type="text"
              @click="onUnbinding(row)"
            />
          </pure-more-button>
        </template>
      </el-table-column>
      <template #leftFooter>
        <el-checkbox
          v-model="allChecked"
          :indeterminate="allCheckedIndeterminate"
          border
          label="全选"
          size="small"
          @change="onToggelAllCheck"
        />
        <el-button
          :disabled="!selectionValue.length"
          class="base-margin-left"
          icon="el-icon-delete"
          size="small"
          @click="onBatchDel"
        >批量删除
        </el-button>
        <span class="checked-num base-margin-left">已选：{{ selectionValue.length }}条</span>

      </template>
    </pure-table>
    <el-dialog title="重置密码" :width="'30%'" :visible.sync="resetPassVisible" @closed="onPassDialogClosed">
      <el-form ref="formRef" label-width="120px" :model="passFormData" :rules="rules">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passFormData.password" autocomplete="new-password" type="password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPassVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPass">确 定</el-button>
      </div>
    </el-dialog>

    <custom-drawer
      size="55%"
      :wrapper-closable="false"
      title="授权角色"
      :visible.sync="showSelectRole"
      @closed="onSelectRoleClosed"
    >
      <CompSelectRole ref="compSelectRoleRef" :current-data="userData" />
      <template v-slot:footer>
        <pure-button label="保存" @click="onSaveSelectRole" />
        <pure-button type="patch" label="取消" @click="showSelectRole = false" />
      </template>
    </custom-drawer>
  </hyy-view-layout>

</template>

<script>
import pageMixin from '@/mixins/page';
import SystemUserApi from './api';
import PureButton from '@/common/components/button/index.vue';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import DrawerUpdateUser from './drawer/updateUser.vue';
import CommonUploadDialog from '@/common/components/dialog/upload.vue';
import CompSelectRole from './drawer/select-role.vue';
export default {
  filters: {
    dept: (val) => {
      return val || '-';
    },
  },
  components: {
    CompSelectRole,
    DepartmentTree,
    QueryPanel,
    PureButton,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      listApi: SystemUserApi.getList,
      queryData: {
        userName: '',
        nickName: '',
        phonenumber: '',
        deptId: '',
        beginTime: '',
        endTime: '',
        time: [],

      },
      selectionValue: [],
      allChecked: false,
      allCheckedIndeterminate: false,
      operateType: 'add',
      showAddEditDialog: false,
      currentData: {},
      loading: false,
      resetPassVisible: false, // 重置密码
      passFormData: {},
      showSelectRole: false, // 角色授权
      userData: {},
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '新增用户',
        edit: '编辑用户',
      };
      return titles[this.operateType];
    },
    rules() {
      return {
        password: [
          { required: true, message: '请输入新密码', },
          { max: 50, message: '新密码不超过50字符', },
        ],
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    onUnbinding(row) {
      this.$confirm('解绑微信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await SystemUserApi.unBind({ data: row.userId, });
          this.$refs.pureTable.fetchData();
          this.$message({
            type: 'success',
            message: '解绑成功',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    changeTime(time) {
      this.queryData['endTime'] = time ? time[1] : '';
      this.queryData['beginTime'] = time ? time[0] : '';
    },
    init() {
      this.$refs.pureTable.fetchData();
    },
    onQuery() {
      this.$refs.pureTable.onSearch();
    },
    onExport() {
      this.$dialog({
        component: () => <CommonUploadDialog title={'用户导入'} importApi={SystemUserApi.userImport} downloadTemplateApi={SystemUserApi.userImportTemplate} onDone={this.init}/>,
      });
    },
    onRest() {
      this.queryData = {
        userName: '',
        nickName: '',
        phonenumber: '',
        deptId: '',
        time: [],
        beginTime: '',
        endTime: '',

      };
      this.$nextTick(() => {
        this.onQuery();
      });
    },
    // 选中部门树
    choseDepartmentTree(node) {
      this.queryData.deptId = node?.deptId || null;
      this.$nextTick(() => {
        this.onQuery();
      });
    },

    onAdd() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerUpdateUser title={'新增用户'} operateType={'add'}
          onDone={this.init}
        />,
      });
    },
    onEdit(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerUpdateUser data={row}
          title={'修改用户'} operateType={'edit'}
          onDone={this.init}
        />,
      });
    },

    onSelectionChange(selection) {
      this.selectionValue = selection || [];
      if (selection.length === 0) {
        this.allChecked = false;
        this.allCheckedIndeterminate = false;
      } else if (selection.length < this.$refs.pureTable.data.length) {
        this.allChecked = false;
        this.allCheckedIndeterminate = true;
      } else {
        this.allChecked = true;
        this.allCheckedIndeterminate = false;
      }
    },
    onToggelAllCheck(checked) {
      this.$refs.pureTable.$refs.table.toggleAllSelection();
    },
    async onChangeStatus(data) {
      const { userId, status, } = data;
      const newStatus = status === '1' ? '0' : '1';
      const params = {
        userId,
        status: newStatus,
      };
      try {
        await SystemUserApi.changeStatus(params);
        this.init();
        this.$notify.success('操作成功!');
      } catch (err) {
        this.$notify.error(err);
      }
    },
    /* 删除回调 */
    deleteFun() {
      this.$refs.pureTable.onDel();
    },
    onDel(row) {
      this.$confirm('此操作将删除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await SystemUserApi.del(row.userId);
            this.deleteFun();
            this.$notify.success('删除成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }).catch(() => {
        });
    },
    onBatchDel() {
      if (!this.selectionValue.length) {
        this.$message.error('请至少选中一个用户');
        return false;
      }
      const userIds = this.selectionValue.map(item => item.userId);
      this.$confirm('此操作将删除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await SystemUserApi.del(userIds.join(','));
            this.deleteFun();
            this.$notify.success('删除成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }).catch(() => {
        });
    },
    /*  重置密码*/
    onResetPass(row) {
      this.passFormData = {
        userId: row.userId,
      };
      this.resetPassVisible = true;
    },
    onPassDialogClosed() {
      this.updatePassReset();
    },
    updatePassReset() {
      this.passFormData = {};
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    /* 重置密码  */
    resetPass() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const data = { ...this.passFormData, };
          SystemUserApi.resetPwd(data)
            .then(() => {
              this.$message.success('操作成功');
              this.resetPassVisible = false;
              this.init();
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      });
    },
    /* 角色授权 */
    onSelectRole(row) {
      this.userData = { ...row, };
      this.showSelectRole = true;
    },
    /* 角色授权关闭回调 */
    onSelectRoleClosed() {
      this.$refs.compSelectRoleRef.reset();
    },
    onSaveSelectRole() {
      const selectedRole = this.$refs.compSelectRoleRef.getSelectedRole();
      SystemUserApi.updateAuthRole(selectedRole).then(() => {
        this.$notify.success('操作成功!');
        this.init();
        this.showSelectRole = false;
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.checked-num {
  font-size: 14px;
  font-weight: 400;
  color: #799F9F;
}
</style>
