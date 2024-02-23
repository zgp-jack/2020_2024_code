<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-30 15:23:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-08 16:04:07
 * @Description: 排版规则列表
-->

<template>
  <div class="drawer">
    <div class="header">
      <span class="title">排班规则</span>
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd"
      >新增规则</el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="genDutyScheduleBtnDisabled"
        @click="handleGenDutySchedule"
      >生成排班</el-button>
    </div>
    <el-row class="flex">
      <el-col>
        <el-table
          :data="list"
          border
          height="100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column
            label="序号"
            type="index"
            align="left"
            width="77"
          />
          <el-table-column
            label="班次名称"
            property="dutyType"
            align="left"
            width="177"
          />
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import {
  getDutyScheduleRuleList,
  deleteDutyScheduleRule,
} from '@/apis/synthesize/workforceManagement';
import DutyScheduleRule from './dutyScheduleRuleNew';
import GenDutySchedule from './genDutySchedule';
export default {
  data() {
    return {
      list: [],
      selectedDutyScheduleRuleList: [],
    };
  },
  computed: {
    genDutyScheduleBtnDisabled() {
      return this.selectedDutyScheduleRuleList.length === 0;
    },
    selectedDutyScheduleRuleIds() {
      return this.selectedDutyScheduleRuleList.map(item => item.id).join(',');
    },
  },
  async mounted() {
    await this.reloadDutyScheduleRuleList();
  },

  methods: {
    // 删除排班规则
    async handleDelete(row) {
      try {
        await this.$confirm('确认删除此排班规则吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await deleteDutyScheduleRule(row.id);
        await this.reloadDutyScheduleRuleList();
        this.$message({
          type: 'success',
          message: '删除排班规则成功',
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
    async reloadDutyScheduleRuleList() {
      this.list = await getDutyScheduleRuleList();
    },
    handleSelectionChange(data) {
      this.selectedDutyScheduleRuleList = data;
    },
    async handleAdd() {
      this.$innerDrawer({
        title: '新增排班规则',
        width: '720px',
        component: () => <DutyScheduleRule type='create' onDone={this.reloadDutyScheduleRuleList}/>,
      });
    },
    handleEdit(row) {
      this.$emit('update', row);
      this.$innerDrawer({
        title: '编辑排班规则',
        width: '720px',
        component: () => <DutyScheduleRule type='update' data={row} onDone={this.reloadDutyScheduleRuleList}/>,
      });
    },

    handleGenDutySchedule() {
      if (!this.selectedDutyScheduleRuleList.length) {
        return;
      }
      this.$innerDialog({
        title: '生成排班',
        position: 'center',
        width: '688px',
        component: () => <GenDutySchedule data={this.selectedDutyScheduleRuleIds} />,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right {
  text-align: right;
}
.mb-16 {
  margin-bottom: 16px;
}
.el-table--border ::v-deep th,
.el-table--border ::v-deep td {
  border-right: 1px solid #ecf0f7;
}
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
