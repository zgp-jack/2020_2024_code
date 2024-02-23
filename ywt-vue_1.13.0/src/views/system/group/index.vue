
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
            <pure-button label="新增分组" @click="openCreateEmptyUserDialog" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="data"
              border
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
                    {{ convertFiled(item.prop,scope.row[item.prop]) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="170">
                <template slot-scope="scope">
                  <el-button
                    style="margin-right: 20%"
                    size="medium  "
                    type="text"
                    @click="openEditDeptDialog(scope.row)"
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
import CreateGroup from './dialog/createGroupNew';
import {
  deleteGroup,
} from '@/apis/system/group';
import {
  bus,
} from '@/utils/bus';
import {
  staffId,
} from '@/filters';
import GroupApi from '@/apis/system/group';
import PaginationTable from '@/minxins/common/paginationTable';
export default {
  name: 'XtszFzgl',
  components: {
    Today,
    DepartmentTree: () => import('@/feat/system/department/component/departmentTree.vue'),
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: GroupApi.list,
    };
  },
  computed: {
    normalTableColumn() {
      return this.$store.state['group/center'].normalTableColumn;
    },
  },

  created() {
    this.tableColumn = this.normalTableColumn;
    this.queryCondition.deptId = null;
    this.fetchData();
  },
  methods: {
    convertFiled(prop, value) {
      let data = '';
      switch (prop) {
        case 'leader':
          data = staffId(value);
          break;
        case 'users':
          data = value?.split(',')
            .map((item) => {
              return staffId(Number(item));
            })
            .join(',');
          break;
        default:
          data = value;
          break;
      }
      return data;
    },
    async handleNodeClick(id) {
      this.currentPage = 0;
      this.queryCondition.deptId = id;
      this.queryCondition.pageNum = this.currentPage;
      await this.fetchData();
    },
    async handleDelete(row) {
      try {
        await deleteGroup(row.id);
        this.$message({
          type: 'success',
          message: '删除运维小组成功',
        });
        bus.$emit('updateGroupTree');
        await this.fetchData();
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    openEditDeptDialog(row) {
      this.$drawer({
        width: '688px',
        component: () => <CreateGroup type='update' data={row} onDone={this.fetchData}/>,
      });
    },
    openCreateEmptyUserDialog() {
      this.$drawer({
        width: '688px',
        component: () => <CreateGroup onDone={this.fetchData}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.department-nav {
  padding: 0 16px;
}

</style>
