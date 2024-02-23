<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-21 19:12:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:44
 * @Description:分组管理
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
            <pure-button label="新增分组" @click="onCreateGroup" />
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
                    @click="onUpdateGroup(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="onDeleteGroup(scope.row)"
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
        <el-main class="group-nav">
          <el-col :span="24" class="base-margin-top">
            <department-tree @node-click="onNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>
<script>
import GroupInfoDrawer from './drawer/group.vue';
import GroupApi from './api';

import PaginationTable from '@/minxins/common/paginationTable';
import DepartmentTree from '@/feat/system/department/component/departmentTree';
import {
  bus,
} from '@/utils/bus';
import {
  staffId,
} from '@/filters';

export default {
  name: 'XtszFzgl',
  components: {
    DepartmentTree,
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
    async onNodeClick(id) {
      this.currentPage = 0;
      this.queryCondition.deptId = id;
      this.queryCondition.pageNum = this.currentPage;
      await this.fetchData();
    },
    async onDeleteGroup(row) {
      try {
        await GroupApi.delete(row.id);
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
    onUpdateGroup(row) {
      this.$drawer({
        width: '720px',
        component: () => <GroupInfoDrawer id={row.id} onDone={this.fetchData} operatorType='UPDATE'/>,
      });
    },
    onCreateGroup() {
      this.$drawer({
        width: '720px',
        component: () => <GroupInfoDrawer onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-nav {
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
