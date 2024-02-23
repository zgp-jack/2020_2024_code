
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="新增角色" @click="openCreateEmptyRoleDialog" />
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
                    @click="openEditRoleDialog(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="handleDelete(scope.row)"
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
        <el-header>
          <Today />
        </el-header>
        <el-main class="department-nav">
          <el-col :span="24">
            <department-tree @node-click="handleNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>
<script>
import Today from '@/components/today';
import {
  deleteRole,
} from '@/apis/system/role';
import CreateRole from './dialog/createRole';
import RoleApi from '@/apis/system/role';
import PaginationTable from '@/minxins/common/paginationTable';
export default {
  name: 'XtszJsgl',
  components: {
    Today,
    DepartmentTree: () => import('@/feat/system/department/component/departmentTree.vue'),
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
    async handleNodeClick(deptId, deptNo) {
      try {
        this.currentPage = 0;
        this.queryCondition.deptNo = deptNo;
        this.queryCondition.pageNum = this.currentPage;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    openCreateEmptyRoleDialog() {
      this.$drawer({
        width: '1688px',
        component: () => <CreateRole onDone={this.fetchData}/>,
      });
    },
    openEditRoleDialog(row) {
      this.$drawer({
        width: '1688px',
        component: () => <CreateRole roleId={row.id} onDone={this.fetchData}/>,
      });
    },
    async handleDelete(row) {
      try {
        await deleteRole(row.id);
        this.$message({
          type: 'success',
          message: '删除角色成功！',
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
      deleteRole({ id: row.id, });
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.department-nav {
  padding: 0 16px;
}
</style>
