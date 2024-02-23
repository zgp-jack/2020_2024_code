<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 10:46:43
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:21
 * @Description:科室管理
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
            <div>
              <pure-button label="新增科室" @click="onCreateDepartment" />
              <pure-button label="打印" @click="onPrintQrCode" />
            </div>

          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              align="left"
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              selection
              @selection-change="onSelectionChange"
            >
              <el-table-column type="selection" align="left" />
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
                  <span v-if="item.prop==='contacts'">
                    {{ stringifyContacts(scope.row[item.prop]) }}
                  </span>
                  <span v-else-if="item.prop == 'state'">
                    <el-switch
                      v-model="scope.row[item.prop]"
                      :active-value="1"
                      :inactive-value="0"
                      @change="onDepartmentStateChange(scope.row)"
                    />
                  </span>
                  <span v-else>
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="left" width="170" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    style="margin-right: 20%"
                    size="medium  "
                    type="text"
                    @click="onUpdateDepartment(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="onDeleteDepartment(scope.row)"
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
          <pure-button
            label="院区管理"
            type="wire-frame"
            @click="handleHospitalClick"
          />
        </el-header>
        <el-main class="department-nav">
          <el-col :span="24" class="base-margin-top">
            <department-tree @node-click="onNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import DepartmentApi from './api';
import HosipitalManagementDrawer from './drawer/hospitalManagement.vue';
import DepartmentInfoDrawer from './drawer/department.vue';
import DepartmentTree from './component/departmentTree.vue';

import PaginationTable from '@/minxins/common/paginationTable';
import PrintDialog from '@/feat/system/department/dialog/print.vue';
export default {
  name: 'XtszKsgl',
  components: {
    DepartmentTree,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: DepartmentApi.list,
      multipleSelection: [],
    };
  },
  computed: {
    normalTableColumn() {
      return this.$store.state.systemDepartment.normalTableColumn;
    },
  },
  created() {
    this.tableColumn = this.normalTableColumn;
    this.queryCondition.parentId = null;
    this.queryCondition.isHideHospital = 1;
    this.queryCondition.state = 0;
    this.fetchData();
  },
  methods: {
    async handleHospitalClick() {
      this.$drawer({
        width: '720px',
        component: () => <HosipitalManagementDrawer onDone={this.fetchData}/>,
      });
    },
    async onDepartmentStateChange(row) {
      try {
        await DepartmentApi.update({ id: row.id, state: row.state, });
        this.$message({
          type: 'success',
          message: row.state === 1 ? '科室启用成功' : '科室停用成功',
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
        row.state = 1 ^ row.state;
      }
    },
    async onNodeClick(deptId) {
      try {
        this.currentPage = 0;
        this.queryCondition.parentId = deptId;
        this.queryCondition.pageNum = this.currentPage;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 转换联系人
    stringifyContacts(contacts) {
      try {
        const contactArr = JSON.parse(contacts) || [];
        return contactArr.reduce((prev, item) => `${prev}  ${item.user ? (item.user + ':') : ''}${item.phone}`, '');
      } catch (error) {
        console.error(error, contacts);
        return contacts;
      }
    },
    async onDeleteDepartment(row) {
      try {
        await DepartmentApi.delete(row.id);
        this.$message({
          type: 'success',
          message: '删除科室成功！',
        });
        this.fetchData();
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    onCreateDepartment() {
      this.$drawer({
        width: '688px',
        component: () => <DepartmentInfoDrawer onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    onUpdateDepartment(row) {
      this.$drawer({
        width: '688px',
        component: () => <DepartmentInfoDrawer id={row.id} onDone={this.fetchData} operatorType='UPDATE'/>,
      });
    },
    onSelectionChange(val) {
      this.multipleSelection = val;
    },
    onPrintQrCode() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要打印的科室',
        });
        return;
      }
      const deptIds = this.multipleSelection.map(item => item.id);
      this.$dialog({
        title: '科室二维码',
        component: () => <PrintDialog deptIds={deptIds}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.department-nav {
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
