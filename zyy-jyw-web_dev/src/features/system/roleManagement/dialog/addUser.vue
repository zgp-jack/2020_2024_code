/**
* @file addUser.vue
* @author huang
* @date 2023/8/23
* @description 添加用户
* @projectName
* @email newflyhuang@gmail.com
*/

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
      <el-table-column
        label="用户名称"
        prop="userName"
      />
      <el-table-column
        label="用户昵称"
        prop="nickName"
      />
      <el-table-column
        label="所属科室"
        prop="deptName"
      />
      <el-table-column
        label="手机"
        prop="phonenumber"
      />
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template #default="{row}">
          <pure-type-text
            :config="ROLE_TYPE"
            :type="row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
    </el-table>
  </TableLayout>
</template>

<script>
import SystemRoleApi from '../api';
import { ROLE_TYPE, } from '../config';
import pageMixin from '@/mixins/page';

export default {
  mixins: [
    pageMixin,
  ],
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
      searchForm: {
        userName: '',
        phonenumber: '',
        roleId: '',
      },
      tableData: [],
      roleInfo: {},
      selectUserIds: [],
    };
  },
  computed: {
    checkedNum() {
      return this.selectUserIds.length;
    },
  },
  watch: {
    currentData: {
      handler(newVal) {
        if (newVal) {
          const { ...rest } = newVal;
          this.roleInfo = { ...rest, };
          this.getListData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getListData() {
      const loading = this.showLoading();
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        roleId: this.roleInfo.roleId,
        ...this.searchForm,
      };
      SystemRoleApi.getNotAssignedUserRoleList(params).then((data) => {
        if (data.rows) {
          const { rows, total, } = data;
          this.total = total;
          this.tableData = rows;
          this.$nextTick(() => {
            this.tableData.forEach((row) => {
              const hasVal = this.selectUserIds.find(id => id === row.userId);
              if (hasVal) {
                this.$refs.tableRef.toggleRowSelection(row);
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
      this.selectUserIds = [];
    },
    /* 清空选择 */
    onBatchDel() {
      this.$refs.tableRef.clearSelection();
      this.selectUserIds = [];
    },
    // 单条选中
    handleSelect(selection, row) {
      const checkedVal = selection.find(x => x.userId === row.userId);
      if (checkedVal) {
        if (!this.selectUserIds.includes(row.userId)) {
          this.selectUserIds.push(row.userId);
        }
      } else {
        const sIndex = this.selectUserIds.indexOf(row.userId);
        if (sIndex > -1) {
          // 删除选中的数据
          this.selectUserIds.splice(sIndex, 1);
        }
      }
    },
    // 全选触发
    handleSelectAll(selection) {
      if (selection.length === 0) {
        // 全部都不勾选
        this.tableData.forEach((x) => {
          const sIndex = this.selectUserIds.indexOf(x.userId);
          if (sIndex > -1) {
            this.selectUserIds.splice(sIndex, 1);
          }
        });
      } else {
        // 全选
        this.tableData.forEach((x) => {
          if (!this.selectUserIds.includes(x.userId)) {
            this.selectUserIds.push(x.userId);
          }
        });
      }
    },
    /* 选择用户校验 */
    selectValidate() {
      const result = {};
      result.valid = false;
      if (this.selectUserIds.length > 0) {
        result.valid = true;
        const userList = [];
        this.selectUserIds.forEach((userId) => {
          userList.push({
            userId: userId,
          });
        });
        const data = { roleId: this.roleInfo.roleId, grantUserList: userList, };
        result.data = data;
      }
      return result;
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
