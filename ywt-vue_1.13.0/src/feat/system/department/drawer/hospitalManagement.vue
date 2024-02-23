<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 11:54:24
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:24
 * @Description:院区管理
-->

<template>
  <div class="drawer">
    <div class="header">
      <span class="title">院区</span>
      <el-button
        size="mini"
        type="primary"
        :disabled="creating||hasEditRow"
        @click="onCreateHospital"
      >
        新增院区
      </el-button>
    </div>
    <el-row class="flex base-margin-bottom">
      <pure-table-area>
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
            >
              <el-table-column
                label="名称"
                property="deptName"
                align="left"
                show-overflow-tooltip
              >
                <template slot-scope="{row}">
                  <template v-if="row.edit">
                    <el-input
                      v-model="row.deptName"
                      placeholder="请输入名称"
                      size="mini"
                    />
                  </template>
                  <span v-else>{{ row.deptName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="简码"
                property="abbreviation"

                align="left"
              >
                <template slot-scope="{row}">
                  <el-input
                    v-if="row.edit"
                    v-model="row.abbreviation"
                    placeholder="请输入简码"
                    size="mini"
                  />
                  <span v-else>{{ row.abbreviation }}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否厂家" align="left" property="operationGroup">
                <template slot-scope="{row}">
                  <el-select v-if="row.edit" v-model="row.operationGroup" size="mini">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                  </el-select>
                  <span v-else>{{ row.operationGroup===1?'是':'否' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="启用"
                property="state"
                align="left"
              >
                <template slot-scope="{row}">
                  <el-switch
                    v-model="row.state"
                    :active-value="1"
                    :inactive-value="0"
                    @change="onHospitalStateChange(row)"
                  />
                </template>

              </el-table-column>
              <el-table-column
                label="操作"
                property=""
                align="left"
              >
                <template slot-scope="{row}">
                  <template v-if="row.edit">
                    <el-button
                      size="mini"
                      type="text"
                      @click="onSubmit(row)"
                    >保存</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      @click="onCancel(row)"
                    >取消</el-button>
                  </template>
                  <template v-else>
                    <el-button
                      size="mini"
                      type="text"
                      :disabled="hasEditRow||creating"
                      @click="onUpdateHospital(row)"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      :disabled="hasEditRow||creating"
                      @click="onDeleteHospital(row)"
                    >删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer" />
      </pure-table-area>
    </el-row>
  </div>
</template>

<script>
import DepartmentApi from '../api';
import PaginationTable from '@/minxins/common/paginationTable';
export default {
  name: 'HospitalManagementDrawer',
  mixins: [PaginationTable],
  data() {
    return {
      listApi: DepartmentApi.list,
      creating: false,
      hasEditRow: false,
    };
  },
  created() {
    this.queryCondition.pageNum = 0;
    this.queryCondition.pageSize = 9999;
    this.queryCondition.deptType = 1;
    this.queryCondition.state = 0;
    this.fetchData();
  },
  methods: {
    async onUpdateHospital(row) {
      if (this.hasEditRow || this.creating) {
        return;
      }
      row.edit = !row.edit;
      this.hasEditRow = true;
    },
    async onCreateHospital() {
      if (this.hasEditRow) {
        return;
      }
      this.creating = true;
      this.data.push({
        dept_name: null,
        state: 1,
        abbreviation: null,
        edit: true,
        operationGroup: 0,
      });
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
      });
    },
    async onDeleteHospital(row) {
      try {
        await this.$confirm(`确认删除'${row.deptName}'院区吗?`, '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await DepartmentApi.delete(row.id);
        await this.fetchData();
        this.$message({
          type: 'success',
          message: `删除'${row.deptName}'院区成功`,
        });
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onCancel(row) {
      if (this.creating) {
        this.data.pop();
        this.creating = false;
      } else {
        row.edit = !row.edit;
      }
      this.hasEditRow = false;
    },
    async onSubmit(row) {
      try {
        if (!row.deptName) {
          throw new Error('请输入院区名');
        }
        if (!row.abbreviation) {
          throw new Error('请输入简码');
        }
        if (this.creating) {
          await DepartmentApi.createHospital(row);
          this.$message({
            type: 'success',
            message: '创建院区成功',
          });
          this.creating = false;
        } else {
          await DepartmentApi.updateHospital(row);
          this.$message({
            type: 'success',
            message: '更新院区成功',
          });
        }
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
    async onHospitalStateChange(row) {
      if (row.id) {
        try {
          await DepartmentApi.updateHospital(row);
          this.$message({
            type: 'success',
            message: '院区更新成功',
          });
        } catch (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async afterFetchData() {
      this.hasEditRow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .flex{
    display: flex;
    flex: 1;
    ::v-deep .table-area-body{
      padding:0;
    }
  }
//   .drawer ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//   width: 6px;
//   height: 6px;
// }
// // 滚动条的滑块
// .drawer ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
//   background-color: #D7E5F9;
//   border-radius: 3px;
// }
</style>
