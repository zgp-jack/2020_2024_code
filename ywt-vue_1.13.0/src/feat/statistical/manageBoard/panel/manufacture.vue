<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-05 21:49:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-09 21:57:33
 * @Description:工作量统计-供应商
-->

<template>
  <el-card style="height:100%;">
    <el-row>
      <el-col :span="12">
        <span class="label">工作量统计</span>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

      </el-col>
    </el-row>
    <el-row class="base-margin-top" style="height:100%">
      <el-col :span="24" style="height:100%;position:absolute;padding-bottom:30px">
        <el-table
          ref="table"
          border
          :data="tableData"
          height="auto"
        >
          <el-table-column label="序号" type="index" width="70" />
          <el-table-column label="供应商" prop="name" show-overflow-tooltip="" />
          <el-table-column label="工单">
            <el-table-column label="完成" prop="orderComplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.orderComplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="未完成" prop="orderIncomplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.orderIncomplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="orderOvertime">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.orderOvertime }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="项目">
            <el-table-column label="完成" prop="demandComplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.demandComplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="未完成" prop="demandIncomplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.demandIncomplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="orderIncomplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.orderIncomplete }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="巡检">
            <el-table-column label="计划" prop="inspectionComplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.inspectionComplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="未完成" prop="inspectionComplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.inspectionComplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="inspectionOvertime">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.inspectionOvertime }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="任务">
            <el-table-column label="完成" prop="taskComplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.taskComplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="未完成" prop="taskIncomplete">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.taskIncomplete }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="超时" prop="taskOvertime">
              <template slot-scope="{row}">
                <el-tag size="mini" type="danger">{{ row.taskOvertime }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import downLoadFile from '@/utils/downLoad';
import ManageBoardApi from '../api';
export default {
  components: {
  },
  props: {
    queryCondition: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      tableData: [],
      groupBtnOptions: [{
        count: null,
        name: '按小组',
      }, {
        count: null,
        name: '按工程师',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1项目类型2项目负责人3项目级别4供应商
      nameLabel: '小组名',
      downButtonDisable: false,

    };
  },
  watch: {
    queryCondition: {
      handler() {
        console.log(this.queryCondition);
        this.changeQueryCondition(this.queryCondition);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const params = {
          startTime: this.startTime,
          endTime: this.endTime,
          template: this.template,
          type: '1',
        };

        const res = await ManageBoardApi.exportExcel(params);
        const fileName = `工作量统计-[${this.nameLabel}]-${this.startTime}-${this.endTime}.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.fetchData();
    },
    async fetchData() {
      this.tableData = await ManageBoardApi.workCountList({ startTime: this.startTime, endTime: this.endTime,
        type: '1',
      });
    },
    handleTabChange(val) {
      switch (val) {
        case '按小组':
          this.template = '1';
          this.nameLabel = '小组';
          break;
        case '按工程师':
          this.template = '2';
          this.nameLabel = '姓名';
          break;
      }

      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  height: 100%;
  padding: 16px;
}
::v-deep .el-table {
  height: 100% !important;
}
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
</style>
