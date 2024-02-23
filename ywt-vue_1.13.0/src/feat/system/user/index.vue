<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-27 19:11:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:47
 * @Description:用户管理
-->
<template>
  <el-container class="no-padding-right">
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right space-between">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="新增用户" @click="onCreateEngineer" />
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
                fixed
              />
              <el-table-column
                v-for="(item, index) in tableColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                :fixed="item.fixed"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span v-if="item.prop == 'state'">
                    <el-switch
                      v-model="scope.row[item.prop]"
                      :active-value="1"
                      :inactive-value="0"
                      @change="onEngineerStateChange(scope.row)"
                    />
                  </span>
                  <span v-else>
                    {{ convertFiled(item.prop,scope.row[item.prop]) }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="left" width="270" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="text"
                    style="margin-right:5px"
                    @click="onUpdateEngineer(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定重置密码吗？"
                    @confirm="onResetPwd(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      size="medium"
                      type="text"
                    >重置密码</el-button>
                  </el-popconfirm>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="onDeleteEngineer(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      size="medium"
                      type="text"
                      style="margin-left:5px"
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
        <el-main class="user-nav">
          <el-col :span="24" class="base-margin-top">
            <department-tree @node-click="onNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>
<script>

import EngineerInfoDrawer from './drawer/engineer.vue';
import EngineerApi from './api';

import PaginationTable from '@/minxins/common/paginationTable';
import DepartmentTree from '@/feat/system/department/component/departmentTree';
import {
  bus,
} from '@/utils/bus';
export default {
  name: 'XtszYhgl',
  components: {
    DepartmentTree,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: EngineerApi.list,
    };
  },
  computed: {
    normalTableColumn() {
      return this.$store.state['user/center'].normalTableColumn;
    },
  },
  created() {
    this.tableColumn = this.normalTableColumn;
    this.queryCondition.deptNo = null;
    this.queryCondition.states = '1,0';
    this.fetchData();
    bus.$on('reloadUserList', this.fetchData);
  },
  methods: {
    convertFiled(prop, value) {
      let data = '';
      switch (prop) {
        case 'leader':
        case 'mpBind':
        case 'miniProgramBind':
          data = value === 1 ? '是' : '否';
          break;
        default:
          data = value;
          break;
      }
      return data;
    },
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

    async onResetPwd(row) {
      try {
        await EngineerApi.resetPwd(row.id);
        this.$message({
          type: 'success',
          message: '密码已重置为默认密码！',
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: `重置密码失败：${error}`,
        });
      }
    },
    onCreateEngineer() {
      this.$drawer({
        width: '1688px',
        component: () => <EngineerInfoDrawer onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    onUpdateEngineer(row) {
      this.$drawer({
        width: '1688px',
        component: () => <EngineerInfoDrawer id={row.id} onDone={this.fetchData} operatorType='UPDATE'/>,
      });
    },
    async onEngineerStateChange(row) {
      if (row.state) {
        await EngineerApi.unlock(row.id);
        this.$message({
          type: 'success',
          message: '成功启用用户!',
        });
      } else {
        await EngineerApi.lock(row.id);
        this.$message({
          type: 'success',
          message: '成功停用用户!',
        });
      }
    },
    async onDeleteEngineer(row) {
      await EngineerApi.delete(row.id);
      this.$message({
        type: 'success',
        message: '成功删除用户',
      });
      await this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-nav {
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
