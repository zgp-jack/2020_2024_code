<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 16:08:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:38
 * @Description:客观评价面板
-->
<template>
  <div class="base-margin-top">
    <div class="base-margin-bottom">
      <span class="base-margin-right">客观评价</span>
      <pure-button v-if="currentOperation==='VIEW'" label="提出复议" type="wire-frame-auto" @click="currentOperation='RECONSIDER'" />
      <pure-button v-if="currentOperation==='RECONSIDER'" label="提交复议" @click="onSubmit" />
      <pure-button v-if="currentOperation!=='VIEW'" label="取消" type="wire-frame-auto" @click="currentOperation='VIEW'" />
    </div>
    <el-table
      ref="table"
      :data="tableData"
      border
      show-summary
      row-key="indexNum"
      :row-style="rowStyle"
      :summary-method="getSummaries"
      :span-method="arraySpanMethod"
    >
      <el-table-column
        label="序号"
        prop="indexNum"
        width="85px"
        align="left"
        fixed="left"
      />
      <el-table-column
        label="一级指标"
        prop="nameToName"
        align="left"
        fixed="left"
        width="119px"
      />
      <el-table-column
        label="二级指标"
        prop="secondToName"
        align="left"
        fixed="left"
        width="119px"
      />
      <el-table-column
        label="指标描述"
        prop="indexDescription"
        width="537px"
        align="left"
      >
        <template slot-scope="{row}">
          <el-tag v-if="showReconsiderTag(row)">复</el-tag>
          <span>{{ row.indexDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="objectiveState" align="left" />
      <el-table-column label="要求完成时间" prop="requireDate" align="left" width="155px" />
      <el-table-column label="实际完成时间" prop="completeDate" align="left" width="155px" />
      <el-table-column label="分值" prop="score" align="left" fixed="right">
        <template slot-scope="{row}">
          <span>{{ row.score }}分</span>
        </template>
      </el-table-column>
      <el-table-column label="最终得分" prop="finalScore" align="left" fixed="right">
        <template slot-scope="{row}">
          <span>{{ row.finalScore }}分</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentOperation === 'RECONSIDER'"
        label="复议"
        prop="reconsiderState"
        align="left"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-checkbox
            v-if="row.parentId&&!row.reconsiderAuditState&&row.reconsiderState!=='1'"
            v-model="row.selected"
            label=""
            @change="onChangeCheck(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="复议描述 " width="248px" prop="reconsiderDesc" align="left" fixed="right">
        <template slot-scope="{row}">
          <el-input v-if="row.parentId&&row.selected" v-model="row.reconsiderDesc" size="mini" />
          <span v-else>{{ row.reconsiderDesc }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import MineApi from '../api';
import { showReconsiderTag, } from '../../utils';
export default {
  data() {
    return {
      tableData: [],
      performanceId: null,
      // 当前操作 查看-'VIEW'，复议-'RECONSIDER'
      currentOperation: 'VIEW',
      // 已选中需要复议的数据
      reconsiderData: new Map(),
    };
  },
  methods: {
    async fetchData(performanceId) {
      try {
        performanceId && (this.performanceId = performanceId);
        const data = await MineApi.evaluationDetail({ indexType: '02', performanceId: this.performanceId, });
        this.tableData = data;
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    rowStyle({ row, }) {
      let color = null;
      const passColor = 'rgba(247,252,245,1)';
      const rejectColor = 'rgba(254,247,247,1)';
      if (this.showReconsiderTag(row)) {
        if (row.reconsiderAuditState === '1') {
          color = passColor;
        } else if (row.reconsiderAuditState === '2') {
          color = rejectColor;
        }
      }
      return {
        'background': color,
      };
    },
    async onSubmit() {
      try {
        if (this.reconsiderData.size === 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要复议的数据',
          });
          return;
        }
        const reconsiderData = Array.from(this.reconsiderData.values()).map(item => {
          return {
            gradeId: item.id,
            reconsiderDesc: item.reconsiderDesc,
          };
        });
        await MineApi.reconsider(reconsiderData);
        this.reconsiderData.clear();
        this.currentOperation = 'VIEW';
        this.fetchData();
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    onChangeCheck(row) {
      if (row.selected) {
        this.reconsiderData.set(row.indexNum, row);
      } else {
        this.reconsiderData.delete(row.indexNum);
      }
    },
    arraySpanMethod({ row, column, }) {
      if (!row.parentId) {
        if (column.property === 'indexDescription') {
          return [1, 4];
        } else if (['objectiveState', 'requireDate', 'completeDate'].includes(column.property)) {
          return [0, 0];
        }
      }
    },
    getSummaries(param) {
      const { columns, data, } = param;
      const sums = [];
      const sumColumns = ['score', 'finalScore'];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (!sumColumns.includes(column.property)) {
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 分';
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    showReconsiderTag,
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  border-radius: 50%;
  padding: 4px;
  height: 24px;
  line-height: 14px;
  border: 1px solid rgba(245,108,108,0.50);
  background: rgba(245,108,108,0.10);
  color: #f56c6c;
  cursor: pointer;
}
</style>
