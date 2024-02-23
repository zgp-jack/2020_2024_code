<template>
  <TableLayout no-padding>
    <template v-slot:search>
      <div class="search-item">
        <el-input v-model="searchForm.userName" placeholder="请输入用户名称" prefix-icon="el-icon-search" />
      </div>
      <div class="search-item">
        <el-input v-model="searchForm.phonenumber" placeholder="请输入手机号码" prefix-icon="el-icon-search" />
      </div>
      <div class="search-item">
        <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
        <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
      </div>
    </template>
    <template v-slot:footer>
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
    </template>
    <el-table ref="tableRef" :data="tableData" height="100%">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户名称" prop="userName" />
      <el-table-column label="电话号码" prop="phonenumber" />
      <el-table-column label="用户昵称" prop="nickName" />
      <el-table-column label="科室" prop="deptName" :formatter="formatDept" />
      <el-table-column label="组长" prop="isLeader" :formatter="formatIsLeader" />
    </el-table>
  </TableLayout>
</template>

<script>
import pageMixin from '@/mixins/page';
import { getUserNotSelectList, } from '../api';

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
      teamId: '',
    };
  },
  watch: {
    currentData: {
      handler(newVal) {
        if (newVal) {
          this.teamId = newVal.teamId;
          this.getListData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    formatDept(row, col, val) {
      return val?.deptName ?? '-';
    },
    formatIsLeader(row, col, val) {
      return val === 1 ? '是' : '否';
    },
    getListData() {
      const loading = this.showLoading();
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        teamId: this.teamId,
        ...this.searchForm,
      };
      getUserNotSelectList({ ...params, }).then((data) => {
        if (data.rows) {
          const { rows, total, } = data;
          this.total = total;
          this.tableData = rows;
        }
      }).finally(() => {
        loading.close();
      });
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    getSelectedUser() {
      const userTableRef = this.$refs.tableRef;
      const selectedUser = userTableRef.selection;
      return selectedUser;
    },
  },
};
</script>
