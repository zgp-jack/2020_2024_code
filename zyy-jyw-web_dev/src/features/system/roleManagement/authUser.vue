<!--/**-->
<!--* @file authUser.vue-->
<!--* @author huang-->
<!--* @date 2023/8/21-->
<!--* @description 分配用户-->
<!--* @projectName-->
<!--* @email newflyhuang@gmail.com-->
<!--*/-->

<template>
  <el-container>
    <el-main class="main">
      <div class="table-layout-container">
        <div class="content-box">
          <pure-table ref="pureTable" selection :list-api="listApi" :hide-index="true" :query-condition="queryCondition" @selection-change="handleSelectionChange">
            <template #header>
              <query-panel @query="handleQuery" @reset="resetQuery">
                <el-form-item prop="userName">
                  <el-input
                    v-model="queryParams.userName"
                    placeholder="请输入用户名称"
                    clearable
                    style="width: 240px"
                  />
                </el-form-item>
                <el-form-item prop="phonenumber">
                  <el-input
                    v-model="queryParams.phonenumber"
                    placeholder="请输入手机号码"
                    clearable
                    style="width: 240px"
                  />
                </el-form-item>

                <template #extra>
                  <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="openSelectUser"
                  >授权用户</el-button>
                  <el-button
                    type="danger"
                    plain
                    icon="el-icon-circle-close"
                    size="mini"
                    :disabled="multiple"
                    @click="cancelAuthUserAll"
                  >批量取消授权</el-button>
                </template>
              </query-panel>
            </template>

            <el-table-column label="用户名称" prop="userName" />
            <el-table-column label="用户昵称" prop="nickName" />
            <el-table-column label="所属科室" prop="deptName" />
            <el-table-column label="手机" prop="phonenumber" width="140" />
            <el-table-column label="状态" align="center" prop="status" width="80">
              <template #default="{row}">
                <pure-type-text :config="ROLE_TYPE" :type="row.status" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="220">
              <template #default="{row}">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="{row}">
                <pure-button
                  size="mini"
                  type="text"
                  label="取消授权"
                  @click="cancelAuthUser(row)"
                />
              </template>
            </el-table-column>
          </pure-table>
        </div>
      </div>
      <custom-drawer
        size="60%"
        :wrapper-closable="false"
        :append-to-body="true"
        title="授权用户"
        :visible.sync="showAddUserDialog"
        @closed="onDialogClosed"
      >
        <DialogAddUser ref="addUserRef" :current-data="addUserData" />
        <template v-slot:footer>
          <pure-button label="保存" @click="onSave" />
          <pure-button label="取消" type="patch" @click="showAddUserDialog = false" />
        </template>
      </custom-drawer>
    </el-main>
  </el-container>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import SystemRoleApi from './api';
import DialogAddUser from './dialog/addUser.vue';
import { ROLE_TYPE, } from './config';
import PureButton from '@/common/components/button/index.vue';

export default {
  name: 'AuthUser',
  components: { PureButton, QueryPanel, DialogAddUser, },
  props: {
    currentData: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      ROLE_TYPE,
      listApi: SystemRoleApi.getAssignedUserRoleList,
      // 选中用户组
      users: [],
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        phonenumber: undefined,
      },
      queryCondition: {},
      roleInfo: {},
      showAddUserDialog: false, // 授权用户
      addUserData: {},
    };
  },
  watch: {
    currentData: {
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          this.roleInfo = { ...rest, };
          this.initList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initList() {
      this.queryParams.roleId = this.roleInfo.roleId;
      this.queryCondition = {
        ...this.queryParams,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryCondition = {
        ...this.queryParams,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        userName: '',
        phonenumber: '',
        roleId: this.roleInfo.roleId,
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.users = selection.map(item => {
        return {
          userName: item.userName,
          deptId: item.deptId,
          userId: item.userId,
        };
      });
      this.multiple = !selection.length;
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.addUserData = { ...this.roleInfo, };
      this.showAddUserDialog = true;
    },
    reset() {
      this.queryParams = {};
    },
    /* 确认授权 */
    onSave() {
      const { valid, data, } = this.$refs.addUserRef.selectValidate();
      if (valid) {
        SystemRoleApi.multipleAuthorization(data)
          .then(() => {
            this.$notify.success('操作成功!');
            this.showAddUserDialog = false;
            this.initList();
          });
      } else {
        this.$notify.error('请选择要授权的用户');
        return;
      }
    },
    onDialogClosed() {
      this.$refs.addUserRef.reset();
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      this.$confirm(`确认要取消该用户"${row.userName}"角色吗？`).then(async () => {
        await SystemRoleApi.multipleCancelAuthorization({ grantUserList: [
          {
            userId: row.userId,
          },
        ], roleId: this.queryParams.roleId, });
        this.initList();
      }).catch(() => {});
    },
    /** 批量取消授权按钮操作 */
    cancelAuthUserAll() {
      const names = this.users.map(item => item.userName).join(',');
      this.$confirm(`确认要取消该用户"${names}"角色吗？`).then(async () => {
        await SystemRoleApi.multipleCancelAuthorization({ grantUserList: this.users, roleId: this.queryParams.roleId, });
        this.initList();
      }).catch(() => {});
    },
  },
};
</script>
<style lang='scss' scoped>
.table-layout-container{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  padding: 10px;
  background: #fff;
}
</style>
