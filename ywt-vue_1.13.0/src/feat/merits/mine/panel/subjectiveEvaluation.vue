<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 16:09:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:41
 * @Description:主观评价面板
-->
<template>
  <div class="base-margin-top">
    <div class="base-margin-bottom flex space-between">
      <div>
        <span class="base-margin-right">主观评价</span>
        <pure-button v-if="currentOperation==='VIEW'" label="填写评价" type="wire-frame-auto" @click="currentOperation='EVALUATION'" />
        <pure-button v-if="currentOperation==='VIEW'" label="提出复议" type="wire-frame-auto" @click="currentOperation='RECONSIDER'" />
        <pure-button v-if="currentOperation==='RECONSIDER'" label="提交复议" @click="onSubmitReconsider" />
        <pure-button v-if="currentOperation!=='VIEW'" label="取消" type="wire-frame-auto" @click="currentOperation='VIEW'" />
      </div>

      <div><pure-button label="提交本月绩效" :disabled="currentOperation!=='VIEW'" @click="onSubmitMerits" /></div>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      border
      show-summary
      row-key="indexNum"
      :row-style="rowStyle"
      :summary-method="getSummaries"
    >
      <el-table-column
        label="序号"
        prop="indexNum"
        width="85px"
        align="left"
      />
      <el-table-column
        label="一级指标"
        prop="nameToName"
        align="left"
      />
      <el-table-column
        label="二级指标"
        prop="secondToName"
        align="left"
      />
      <el-table-column
        label="指标描述"
        prop="indexDescription"
        width="537px"
        align="left"
      >
        <template slot-scope="{row}">
          <el-tag v-if="showReconsiderTag(row)">复</el-tag>
          <el-input v-if="row.parentId&&(!row.id)" v-model="row.indexDescription" size="mini" />
          <span v-else>{{ row.indexDescription }} <span v-if="row.updateUserToName" style="color:#F56C6C">({{ row.updateUserToName }})</span></span>
        </template>
      </el-table-column>
      <el-table-column
        label="考核分值"
        prop="score"
        align="left"
      >
        <template slot-scope="{row}">
          {{ row.score?row.score+'分':'' }}
        </template>
      </el-table-column>
      <el-table-column
        label="自评得分"
        prop="finalScore"
        align="left"
      >
        <template slot-scope="{row}">
          <el-input-number v-if="row.parentId&&(row.editing)" v-model="row.finalScore" style="width:100px" controls-position="right" size="mini" />
          <span v-else>{{ row.finalScore||0 }}分</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentOperation === 'RECONSIDER'"
        label="复议"
        prop="reconsiderState"
        align="left"
      >
        <template slot-scope="{row}">
          <el-checkbox
            v-if="row.parentId&&!isSelfEvaluation(row)&&!row.reconsiderAuditState&&row.reconsiderState!=='1'"
            v-model="row.selected"
            label=""
            @change="onReconsiderCheckChange(row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="备注/复议描述"
        prop="note"
        align="left"
        width="333px"
      >
        <template slot-scope="{row}">
          <el-input v-if="row.parentId&&currentOperation==='EVALUATION'&&row.editing" v-model="row.note" size="mini" />
          <el-input v-else-if="row.parentId&&currentOperation==='RECONSIDER'&&row.selected" v-model="row.reconsiderDesc" size="mini" />

          <span v-else>{{ row.note||row.reconsiderDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentOperation==='EVALUATION'"
        label="操作"
        align="left"
      >
        <template slot-scope="{row,$index}">
          <pure-button v-if="!row.indexNum.includes('.')&&currentOperation==='EVALUATION'" label="添加评分" :disabled="row.editing" type="text" @click="onAddEvaluation(row)" />

          <span v-else-if="row.editing">
            <pure-button v-if="!row.id" label="保存" type="text" @click="onSubmitEvaluation(row)" />
            <pure-button v-if="!row.id" label="取消" type="text" @click="onCancelEvaluation(row,$index)" />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MineApi from '../api';
import { showReconsiderTag, } from '../../utils';
import { bus, } from '@/utils/bus';
import {
  mapGetters,
} from 'vuex';
export default {

  data() {
    return {
      tableData: [],
      performanceId: null,
      // 当前操作 查看-'VIEW'，评价-'EVALUATION'，复议-'RECONSIDER'
      currentOperation: 'VIEW',
      editing: false,
      // 待提交的复议数据
      reconsiderData: new Map(),
      editingParentRow: {},
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
  },
  methods: {
    async fetchData(performanceId) {
      try {
        performanceId && (this.performanceId = performanceId);
        const data = await MineApi.evaluationDetail({ indexType: '01', performanceId: this.performanceId, });
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
    // 判断是否自己评价的
    isSelfEvaluation(row) {
      return this.userInfo.id === row.updateUser;
    },
    async onSubmitMerits() {
      try {
        await this.$confirm(`
        在提交本月绩效后，将进入审核环节，在这过程中可以修改和继续提交本月绩效，<span style="color:#F56C6C">一旦审核通过，本月绩效将归档，并无法修改，只能查看，</span>请确保所有项均已填好。
        `,
        '提示',
        {
          confirmButtonText: '确定提交',
          showCancelButton: false,
          dangerouslyUseHTMLString: true,
          type: 'warning',
          closeOnClickModal: false,
        });
        await MineApi.submitMerits(this.performanceId);
        this.$message({
          type: 'success',
          message: '提交成功',
        });
        bus.$emit('merits-submit-success');
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    onAddEvaluation(row) {
      row.editing = true;
      row.children.push({
        indexNum: row.indexNum + '.' + (row.children.length + 1),
        parentId: row.id,
        editing: true,
        indexDescription: '',
        updateUserToName: null,
        updateUser: null,
        finalScore: null,
        note: '',
        reconsiderDesc: '',
      });
      this.editingParentRow = row;
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, true);
      });
    },
    onCancelEvaluation(row, index) {
      row.editing = false;
      if (!row.id) {
        this.editingParentRow.children.splice(index - 1, 1);
        this.editingParentRow.editing = false;
      }
    },
    async onSubmitEvaluation(row) {
      try {
        let data = {};
        if (row.id) {
          data = await MineApi.updateSubjectiveEvaluation(row);
        } else {
          data = await MineApi.createSubjectiveEvaluation(row);
        }
        const indexNum = row.indexNum;
        row = Object.assign(row, data);
        row.editing = false;
        row.indexNum = indexNum;
        this.editingParentRow.editing = false;
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    onReconsiderCheckChange(row) {
      if (row.selected) {
        this.reconsiderData.set(row.indexNum, row);
      } else {
        this.reconsiderData.delete(row.indexNum);
      }
    },
    async onSubmitReconsider() {
      try {
        if (this.reconsiderData.size === 0) {
          this.$message({
            type: 'warning',
            message: '请选择需要复议的项',
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
