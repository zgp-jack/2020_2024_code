<template>
  <el-container>
    <el-main class="main">
      <div class="table-layout-container">
        <div class="content-box">
          <div class="page-system-settings-group">
            <div class="left">
              <CompGroupManage @teamChange="onTeamChange" />
            </div>
            <div class="right">
              <TableLayout no-padding>
                <template v-slot:search>
                  <div class="search-item">
                    <el-input v-model="searchForm.userName" placeholder="请输入用户名称" prefix-icon="el-icon-search" />
                  </div>
                  <div class="search-item">
                    <el-input
                      v-model="searchForm.phonenumber"
                      placeholder="请输入手机号码"
                      prefix-icon="el-icon-search"
                    />
                  </div>
                  <div class="search-item">
                    <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
                    <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
                  </div>
                </template>
                <template v-slot:operate>
                  <pure-button v-auth="'system:user:team:add'" type="special" label="新增用户" icon="add" @click="onAdd" />
                </template>
                <template v-slot:footer>
                  <div class="table-footer">
                    <div class="operate-box">
                      <div class="operate-item">
                        <el-checkbox
                          v-model="allChecked"
                          label="全选"
                          :indeterminate="allCheckedIndeterminate"
                          @change="onToggelAllCheck"
                        />
                      </div>
                      <div class="operate-item" @click="onBatchDel">
                        <i class="el-icon-delete" />
                        <span>批量移除</span>
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
                <el-table ref="tableRef" :data="tableData" height="100%" @selection-change="onSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column type="index" label="序号" width="60" />
                  <el-table-column label="用户名称" prop="userName" />
                  <el-table-column label="用户昵称" prop="nickName" />
                  <el-table-column label="手机号码" prop="phonenumber" />
                  <el-table-column label="科室" prop="deptName" />
                  <el-table-column label="组长" prop="isLeader" :formatter="formatIsLeader" />
                  <el-table-column label="操作">
                    <template slot-scope="{ row }">
                      <span v-auth="'system:user:team:remove'" class="operate-btn delete" @click="onDel(row.id)">移除</span>
                      <span
                        v-if="row.isLeader === 0"
                        v-auth="'system:user:team:edit'"
                        class="operate-btn"
                        @click="onSetLeader(row.id, 1)"
                      >设为组长</span>
                      <span
                        v-if="row.isLeader === 1"
                        v-auth="'system:user:team:edit'"
                        class="operate-btn"
                        @click="onSetLeader(row.id, 0)"
                      >取消组长</span>
                    </template>
                  </el-table-column>
                </el-table>
              </TableLayout>
            </div>
            <custom-drawer
              size="60%"
              :wrapper-closable="false"
              :title="dialogTitle"
              :visible.sync="showSelectUser"
              @closed="onDialogClosed"
            >
              <CompSelectUser ref="compSelectUserRef" :current-data="currentData" :operate-type="operateType" />
              <template v-slot:footer>
                <pure-button label="保存" @click="onSave" />
                <pure-button type="patch" label="取消" @click="showSelectUser = false" />
              </template>
            </custom-drawer>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import pageMixin from '@/mixins/page';
import CompGroupManage from './components/group-manage.vue';
import CompSelectUser from './components/select-user.vue';
import { getTeamUserList, addTeamUser, removeTeamUser, setLeader, } from './api';

export default {
  components: {
    CompGroupManage,
    CompSelectUser,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      currentTeamId: null,
      searchForm: {},
      tableData: [],
      checkedNum: 0,
      allChecked: false,
      allCheckedIndeterminate: false,
      operateType: 'add',
      showSelectUser: false,
      currentData: {},
      loading: false,
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '添加用户',
        edit: '编辑用户',
      };
      return titles[this.operateType];
    },
  },
  methods: {
    onTeamChange(teamId) {
      if (teamId) {
        this.currentTeamId = teamId;
        this.searchForm = {};
        this.getListData();
      }
    },
    formatIsLeader(row, col, val) {
      return val === 1 ? '是' : '否';
    },
    getListData() {
      const loading = this.showLoading();
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        teamId: this.currentTeamId,
        ...this.searchForm,
      };
      getTeamUserList(params).then((data) => {
        const { rows, total, } = data;
        this.total = total;
        this.tableData = rows;
      }).finally(() => {
        loading.close();
      });
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    onDialogClosed() {
      this.$refs.compSelectUserRef.onReset();
    },
    onSelectionChange(selection) {
      this.checkedNum = selection.length;
      if (selection.length === 0) {
        this.allChecked = false;
        this.allCheckedIndeterminate = false;
      } else if (selection.length < this.tableData.length) {
        this.allChecked = false;
        this.allCheckedIndeterminate = true;
      } else {
        this.allChecked = true;
        this.allCheckedIndeterminate = false;
      }
    },
    onToggelAllCheck() {
      this.$refs.tableRef.toggleAllSelection();
    },
    onAdd() {
      this.currentData = {
        teamId: this.currentTeamId,
      };
      this.showSelectUser = true;
    },
    submitData(userIdList) {
      this.loading = true;
      const params = {
        teamId: this.currentTeamId,
        userIdList,
      };
      addTeamUser(params)
        .then(() => {
          this.$message.success('操作成功');
          this.getListData();
          this.showSelectUser = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSave() {
      const selectedUser = this.$refs.compSelectUserRef.getSelectedUser();
      if (!selectedUser.length) {
        this.$message.error('请至少选中一个用户');
        return false;
      }
      const userIdList = selectedUser.map(item => item.userId);
      this.loading = true;
      this.submitData(userIdList);
    },
    sumbitDelete(ids) {
      const loading = this.showLoading({ text: '操作中...', });
      removeTeamUser(ids.join())
        .then(() => {
          // 处理最后一页最后一条数据删除分页显示问题
          this.calcLastPage(ids.length);
          this.getListData();
          this.$message({
            type: 'success',
            message: '移除小组成功',
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    onDel(id) {
      this.$confirm('此操作将移除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.sumbitDelete([
            id,
          ]);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    onBatchDel() {
      const tableRef = this.$refs.tableRef;
      const selected = tableRef.selection;
      if (!selected.length) {
        this.$message.error('请至少选中一个用户');
        return false;
      }
      const userIds = selected.map(item => item.id);
      this.$confirm('此操作将移除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.sumbitDelete(userIds);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    sumbitSetLeader(data) {
      const loading = this.showLoading({ text: '操作中...', });
      setLeader(data)
        .then(() => {
          this.getListData();
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    onSetLeader(id, isLeader) {
      const tips = isLeader === 1 ? '设为组长' : '取消组长';
      this.$confirm(`确认将该用户${tips}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.sumbitSetLeader({
            id,
            isLeader,
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-system-settings-group {
  height: 100%;
  display: flex;

  .left {
    flex: 0 0 300px;
    margin-right: 20px;
    padding: 16px;
    border-right: 1px solid #eeeeee;
    background: #fff;
  }

  .right {
    flex: auto;
    padding: 16px;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
}

.table-layout-container {
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
