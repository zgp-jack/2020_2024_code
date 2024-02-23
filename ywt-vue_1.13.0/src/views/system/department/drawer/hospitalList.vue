<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-24 15:14:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-20 19:31:37
 * @Description: 院区维护
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
    <el-row class="flex">
      <el-col>
        <el-table
          ref="table"
          :data="list"
          border
          align="left"
          height="100%"
        >
          <el-table-column
            label="序号"
            type="index"
            align="left"
            width="85"
          />
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DepartmentApi from '@/apis/system/department';
export default {
  data() {
    return {
      departmentList: this.$store.state['dictionary'].departmentList,
      list: [],
      creating: false,
      hasEditRow: false,
    };
  },
  created() {
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
      this.list.push({
        dept_name: null,
        state: 1,
        abbreviation: null,
        edit: true,
      });
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
      });
    },

    async fetchData() {
      try {
        const { list, } = await DepartmentApi.list({ pageNum: 0, pageSize: 9999, deptType: 1, });
        this.list = list.filter(item => item.state !== -1)
          .map(item => {
            this.$set(item, 'edit', false);
            return item;
          });
        this.hasEditRow = false;
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
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
        this.list.pop();
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
  },
};
</script>

<style lang="scss" scoped>
  .flex{
    display: flex;
    flex: 1;
  }
  .drawer ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
// 滚动条的滑块
.drawer ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
</style>
