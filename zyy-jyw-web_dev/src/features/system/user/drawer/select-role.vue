<template>
  <TableLayout no-padding>
    <template v-slot:search>
      <div class="search-item">
        <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" prefix-icon="el-icon-search" />
      </div>
      <div class="search-item">
        <el-input v-model="searchForm.roleKey" placeholder="请输入角色权限" prefix-icon="el-icon-search" />
      </div>
      <div class="search-item">
        <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
        <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
      </div>
    </template>
    <template v-slot:footer>
      <div class="table-footer">
        <div class="operate-box">
          <div class="operate-item" @click="onBatchDel">
            <i class="el-icon-delete" />
            <span>清空选择</span>
          </div>
          <span class="checked-num">已选：{{ checkedNum }}条</span>
        </div>
        <el-pagination
          :page-sizes="pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <el-table ref="tableRef" :data="tableData" height="100%" @select="handleSelect" @select-all="handleSelectAll">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="角色权限" prop="roleKey" />
      <el-table-column label="创建时间" prop="createTime" />
    </el-table>
  </TableLayout>
</template>

<script>
import pageMixin from '@/mixins/page';
import { getUserRoleSelect, getUserRoles, } from '../api';

export default {
  mixins: [
    pageMixin,
  ],
  props: {
    currentData: {
      type: Object,
      default() {
        return {
        };
      },
    },
  },
  data() {
    return {
      searchForm: {},
      tableData: [],
      userId: '',
      roleIds: [],
      selectRoleIds: [],
    };
  },
  computed: {
    checkedNum() {
      return this.selectRoleIds.length;
    },
  },
  watch: {
    currentData: {
      handler(newVal) {
        if (newVal) {
          this.userId = newVal.userId;
          this.getUserRoles();
          this.getListData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getUserRoles() {
      getUserRoles(this.userId).then((data) => {
        if (data) {
          this.selectRoleIds = data;
        }
      });
    },
    getListData() {
      const loading = this.showLoading();
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        userId: this.userId,
        ...this.searchForm,
      };
      getUserRoleSelect({ ...params, }).then((data) => {
        if (data.rows) {
          const { rows, total, } = data;
          this.total = total;
          this.tableData = rows;
          this.$nextTick(() => {
            this.tableData.forEach((row) => {
              const hasVal = this.selectRoleIds.find(id => id === row.roleId);
              if (hasVal) {
                this.$refs.tableRef.toggleRowSelection(row);
              } else {
                if (row.flag) {
                  this.selectRoleIds.push(row.roleId);
                  this.$refs.tableRef.toggleRowSelection(row);
                }
              }
            });
          });
        }
      }).finally(() => {
        loading.close();
      });
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    reset() {
      this.searchForm = {};
      this.currentPage = 1;
      this.selectRoleIds = [];
    },
    /* 清空选择 */
    onBatchDel() {
      this.$refs.tableRef.clearSelection();
      this.selectRoleIds = [];
    },
    // 单条选中
    handleSelect(selection, row) {
      const checkedVal = selection.find(x => x.roleId === row.roleId);
      if (checkedVal) {
        if (!this.selectRoleIds.includes(row.roleId)) {
          this.selectRoleIds.push(row.roleId);
        }
      } else {
        const sIndex = this.selectRoleIds.indexOf(row.roleId);
        if (sIndex > -1) {
          // 删除选中的数据
          this.selectRoleIds.splice(sIndex, 1);
        }
      }
    },
    // 全选触发
    handleSelectAll(selection) {
      if (selection.length === 0) {
        // 全部都不勾选
        this.tableData.forEach((x) => {
          const sIndex = this.selectRoleIds.indexOf(x.roleId);
          if (sIndex > -1) {
            this.selectRoleIds.splice(sIndex, 1);
          }
        });
      } else {
        // 全选
        this.tableData.forEach((x) => {
          if (!this.selectRoleIds.includes(x.roleId)) {
            this.selectRoleIds.push(x.roleId);
          }
        });
      }
    },
    getSelectedRole() {
      const userId = this.userId;
      const roleIds = this.selectRoleIds.join(',');
      const result = {
        userId: userId,
        roleIds: roleIds,
      };
      return result;
    },
  },
};
</script>
