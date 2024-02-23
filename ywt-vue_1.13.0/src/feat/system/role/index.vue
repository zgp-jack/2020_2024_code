<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-27 16:34:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-28 15:48:36
 * @Description:角色管理
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right space-between">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="新增角色" @click="onCreateRole" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              border
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
              />
              <el-table-column
                v-for="(item, index) in tableColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="177">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="text"
                    style="margin-right: 20%"
                    @click="onUpdateRole(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="onDeleteRole(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      size="medium"
                      type="text"
                    >删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>
    </el-main>
    <el-aside style="width: 288px; height: 100%">
      <el-container>
        <el-header class="aside-header" height="42px">
          科室
        </el-header>
        <el-main class="role-nav">
          <el-col :span="24" class="base-margin-top">
            <department-tree @node-click="onNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>
<script>
import RoleApi from './api';
import RoleInfoDrawer from './drawer/role.vue';

import DepartmentTree from '@/feat/system/department/component/departmentTree';
import PaginationTable from '@/minxins/common/paginationTable';

export default {
  name: 'XtszJsgl',
  components: {
    DepartmentTree,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: RoleApi.list,
    };
  },
  computed: {
    normalTableColumn() {
      return this.$store.state['roles/center'].normalTableColumn;
    },
  },
  created() {
    this.tableColumn = this.normalTableColumn;
    this.queryCondition.deptNo = null;
    this.fetchData();
  },
  methods: {
    async onNodeClick(deptId, deptNo) {
      try {
        this.currentPage = 0;
        this.queryCondition.deptNo = deptNo;
        this.queryCondition.pageNum = this.currentPage;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    onCreateRole() {
      this.$drawer({
        width: '1688px',
        component: () => <RoleInfoDrawer onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    onUpdateRole(row) {
      this.$drawer({
        width: '1688px',
        component: () => <RoleInfoDrawer id={row.id} onDone={this.fetchData} operatorType='UPDATE'/>,
      });
    },
    async onDeleteRole(row) {
      try {
        await RoleApi.delete(row.id);
        this.$message({
          type: 'success',
          message: '删除角色成功！',
        });
        this.fetchData();
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.role-nav {
  padding: 0 16px;
}
.aside-header {
  background: #e2e3e7;
  font-size: $--pure-base-font-size;
  text-align: left;
  padding: 5px 16px;
  color: #334266;
  line-height: 32px;
  font-family:AlibabaPuHuiTi-2-55-Regular, PingFangSC, PingFangSC-Regular, Neue, Helvetica, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  display: flex;
  justify-content: space-between;
}
</style>
