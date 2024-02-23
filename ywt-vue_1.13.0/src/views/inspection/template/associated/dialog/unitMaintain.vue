<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 17:31:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 14:52:19
 * @Description:单元目录维护
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">单元目录</span>
      <el-button
        size="mini"
        type="primary"
        :disabled="creating||hasEditRow"
        @click="handleCreateHospital"
      >
        新增目录
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
            width="77"
          />
          <el-table-column
            label="名称"
            property="name"
            align="left"
          >
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-input
                  v-model="row.name"
                  placeholder="请输入名称"
                  size="mini"
                />
              </template>
              <span v-else>{{ row.name }}</span>
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
                @change="handleUserStateChange(row)"
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
                  @click="handleSave(row)"
                >保存</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleCancel(row)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  size="mini"
                  type="text"
                  :disabled="hasEditRow||creating"
                  @click="handleEdit(row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="text"
                  :disabled="hasEditRow||creating"
                  @click="handleDelete(row)"
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
import InspectionUnitApi from '@/apis/inspection/unit';
export default {
  data() {
    return {
      list: [],
      creating: false,
      hasEditRow: false,
    };
  },
  computed: {

  },
  created() {
    this.fetchData();
  },
  methods: {
    async handleEdit(row) {
      if (this.hasEditRow || this.creating) {
        return;
      }
      row.edit = !row.edit;
      this.hasEditRow = true;
    },
    async handleCreateHospital() {
      if (this.hasEditRow) {
        return;
      }
      this.creating = true;
      this.list.push({
        name: null,
        state: 1,
        edit: true,
      });
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
      });
    },

    async fetchData() {
      try {
        const list = await InspectionUnitApi.parentList();
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
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除本目录吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await InspectionUnitApi.delParent(row.id);
        await this.fetchData();
        this.$message({
          type: 'success',
          message: '删除目录成功',
        });
        this.$emit('dataChange');
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async handleCancel(row) {
      if (this.creating) {
        this.list.pop();
        this.creating = false;
      } else {
        row.edit = !row.edit;
      }
      this.hasEditRow = false;
    },
    async handleSave(row) {
      try {
        if (!row.name) {
          throw new Error('请输入目录名');
        }

        if (this.creating) {
          const { name, state, } = row;
          await InspectionUnitApi.createParent({ name, state, });
          this.$message({
            type: 'success',
            message: '创建目录成功',
          });
          this.creating = false;
        } else {
          const { id, name, state, } = row;
          await InspectionUnitApi.updateParent({ id, name, state, });
          this.$message({
            type: 'success',
            message: '更新目录成功',
          });
        }
        this.$emit('dataChange');
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
    async handleUserStateChange(row) {
      if (row.id) {
        try {
          const { id, state, name, } = row;
          await InspectionUnitApi.updateParent({ id, state, name, });
          this.$message({
            type: 'success',
            message: '目录更新成功',
          });
          this.$emit('dataChange');
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
  height: 10px;
}
// 滚动条的滑块
.drawer ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
</style>
