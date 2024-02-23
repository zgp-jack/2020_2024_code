/**
* @file index.vue
* @author huang
* @date 2023/8/21
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>

  <hyy-view-layout>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onReset"
      >
        <el-form-item prop="name">
          <el-input
            v-model="queryData.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item prop="roleKey">
          <el-input
            v-model="queryData.roleKey"
            placeholder="请输入权限字符"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select
            v-model="queryData.status"
            placeholder="请选择状态"
          >
            <el-option
              label="启用"
              value="0"
            />
            <el-option
              label="停用"
              value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryData.rangeDate"
            end-placeholder="结束日期"
            range-separator="-"
            start-placeholder="开始日期"
            style="width: 400px"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          />
        </el-form-item>
        <template #right>
          <pure-button
            v-auth="'system:role:add'"
            icon="add"
            label="新增"
            @click="onAddRole"
          />
          <pure-button
            v-auth="'system:role:remove'"
            icon="delete"
            label="删除"
            type="minor"
            @click="handleDelete"
          />
        </template>
      </query-panel>
    </template>
    <pure-table
      ref="pureTable"
      :hide-index="true"
      :list-api="listApi"
      :query-condition="queryData"
      selection
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        label="角色编号"
        prop="roleId"
        width="120"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        label="角色名称"
        prop="roleName"
        width="300"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        label="权限字符"
        prop="roleKey"
        width="280"
      />
      <el-table-column
        label="显示顺序"
        prop="roleSort"
        width="100"
      />
      <el-table-column
        align="center"
        label="状态"
        width="100"
      >
        <template #default="{row}">
          <el-switch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        width="240"
      >
        <template #default="{row}">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
      >

        <template #default="{row}">
          <pure-button
            v-auth="'system:role:edit'"
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >
            修改
          </pure-button>
          <pure-button
            v-auth="'system:role:authorize'"
            size="mini"
            type="text"
            @click="handleAuthUser(row)"
          >
            分配用户
          </pure-button>
          <pure-button
            v-auth="'system:role:dataScope'"
            size="mini"
            type="text"
            @click="handleDataScope(row)"
          >
            数据权限
          </pure-button>
          <pure-button
            v-auth="'system:role:remove'"
            size="mini"
            type="text"
            text-color="warning"
            @click="handleDelete(row)"
          >
            删除
          </pure-button>
        </template>
      </el-table-column>
    </pure-table>
    <custom-drawer
      size="65%"
      :wrapper-closable="false"
      :title="roleUserDialogTitle"
      :visible.sync="showRoleUserDialog"
      @closed="onRoleUserClosed"
    >
      <RoleUser ref="roleUserRef" :current-data="currentData" />
      <template v-slot:footer>
        <pure-button type="patch" label="关闭" @click="showRoleUserDialog = false" />
      </template>
    </custom-drawer>
    <!--  新增修改  -->
    <custom-drawer
      size="45%"
      :wrapper-closable="false"
      :title="roleDialogTitle"
      :visible.sync="showRoleDialog"
      @closed="onDialogClosed"
    >
      <DialogNewRole ref="newRoleRef" :current-data="roleData" />
      <template v-slot:footer>
        <pure-button label="保存" @click="onSave" />
        <pure-button label="取消" type="patch" @click="showRoleDialog = false" />
      </template>
    </custom-drawer>
  </hyy-view-layout>

</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DialogNewRole from './dialog/newRole.vue';
import RoleUser from './authUser.vue';
import DialogDistributePermission from './dialog/distributePermission.vue';
import SystemRoleApi from './api';
import PureButton from '@/common/components/button/index.vue';
import HyyViewLayout from '@/common/layout/viewLayout.vue';

export default {
  components: {
    HyyViewLayout,
    PureButton,
    QueryPanel,
    RoleUser,
    DialogNewRole,
  },
  data() {
    return {
      listApi: SystemRoleApi.getRoleList,
      queryData: {
        roleName: '',
        roleKey: '',
        status: '',
        rangeDate: [],
        beginTime: '',
        endTime: '',
      },
      ids: '',
      roleUserDialogTitle: '用户角色',
      showRoleUserDialog: false,
      currentData: {},
      showRoleDialog: false, // 新增修改角色
      roleData: {},
      operateType: 'add',
    };
  },
  computed: {
    roleDialogTitle() {
      const titles = {
        add: '新增角色',
        edit: '编辑角色',
      };
      return titles[this.operateType];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.pureTable.fetchData();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId).join(',');
    },
    onQuery() {
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    changeDate(val) {
      this.queryData.beginTime = val ? val[0] : '';
      this.queryData.endTime = val ? val[1] : '';
    },
    onReset() {
      this.queryData = {
        roleName: '',
        roleKey: '',
        status: '',
        rangeDate: [],
        beginTime: '',
        endTime: '',
      };
      this.$nextTick(() => {
        this.onQuery();
      });
    },

    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.$dialog({
        component: () => <DialogDistributePermission title={'分配数据权限'}
          data={row}
          onDone={this.onDone}
        />,
      });
    },
    handleCommand(command, row) {
      switch (command) {
        case 'handleDataScope':
          this.handleDataScope(row);
          break;
        case 'handleAuthUser':
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    onRoleUserClosed() {
      this.$refs.roleUserRef.reset();
    },
    /** 分配用户操作 */
    handleAuthUser(row) {
      this.currentData = { ...row, };
      this.showRoleUserDialog = true;
    },
    onDone() {
      this.$refs.pureTable.fetchData();
    },
    /* 删除回调 */
    deleteFun() {
      this.$refs.pureTable.onDel();
    },
    // 新增角色
    onAddRole() {
      this.showRoleDialog = true;
      this.operateType = 'add';
      this.roleData = { status: '0', };
    },
    /** 修改角色 */
    handleUpdate(row) {
      this.showRoleDialog = true;
      this.operateType = 'edit';
      this.roleData = { ...row, };
    },
    //   删除角色
    handleDelete(row) {
      const roleIds = row?.roleId || this.ids;
      if (!roleIds) {
        this.$notify.warning('请选择需要删除的角色');
        return;
      }
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        SystemRoleApi.deleteRole(roleIds).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.deleteFun();
        }).catch((res) => {
          this.$message.error(res);
        });
      }).catch(() => {
      });
    },
    onDialogClosed() {
      this.$refs.newRoleRef.reset();
    },
    submitData() {
      const { valid, data, } = this.$refs.newRoleRef.validate();
      if (valid) {
        const request = this.operateType === 'edit' ? SystemRoleApi.updateRole : SystemRoleApi.addRole;
        request(data)
          .then(() => {
            this.$notify.success('操作成功!');
            this.showRoleDialog = false;
            this.init();
          });
      } else {
        this.$notify.error('请正确填写');
      }
    },
    onSave() {
      this.submitData();
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(() => {
        const data = {
          roleId: row.roleId,
          status: row.status,
        };
        SystemRoleApi.changeStatus(data);
        this.$message.success('操作成功');
      }).catch(() => {
        row.status = row.status === '0' ? '1' : '0';
      });
    },
  },

};
</script>

<style lang='scss'
  scoped
>

</style>
