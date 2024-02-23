<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-13 15:39:43
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:47
 * @Description:主观评价抽屉
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">{{ title }}</div>
    </div>
    <div class="body">
      <el-table
        ref="table"
        :data="data"
        border
        show-summary
        :summary-method="getSummaries"
        row-key="indexNum"
        default-expand-all
        height="99%"
        :indent="1"
      >
        <el-table-column
          label="序号"
          prop="indexNum"
          width="85px"
          align="left"
          fixed="left"
        >
          <template slot-scope="{row}">
            <span v-if="showReconsiderTag(row)" style="float:left">
              <el-tag>复</el-tag>
              {{ row.indexNum }}
            </span>
            <span v-else>{{ row.indexNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="一级指标"
          prop="nameToName"
          align="left"
          width="172px"
        />
        <el-table-column
          label="二级指标"
          prop="secondToName"
          align="left"
          width="172px"
        />
        <el-table-column
          label="指标描述"
          prop="indexDescription"
          width="537px"
          align="left"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.parentId&&!row.id" v-model="row.indexDescription" size="mini" />
            <span v-else>{{ row.indexDescription }} <span v-if="row.updateUserToName" style="color:#F56C6C">({{ row.updateUserToName }})</span></span>
          </template>
        </el-table-column>
        <el-table-column
          label="考核分值"
          prop="score"
          align="left"
          width="148px"
        />
        <el-table-column
          label="自评得分"
          prop="finalScore"
          align="left"
          width="148px"
        >
          <template slot-scope="{row}">
            <el-input-number v-if="row.parentId&&(row.editing||(actionType==='RECONSIDER_REVIEW'&&row.reconsiderState==='1'&&!row.reconsiderAuditState))" v-model="row.finalScore" style="width:100px" controls-position="right" size="mini" />
            <span v-else>{{ row.finalScore }}分</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-if="currentOperation === 'RECONSIDER'"
          label="复议"
          prop="reconsiderState"
          align="left"
        >
          <template slot-scope="{row}">
            <el-checkbox v-if="row.parentId&&!isSelfEvaluation(row)" label="" />
          </template>
        </el-table-column> -->

        <el-table-column
          label="备注/复议描述"
          prop="note"
          align="left"
          width="333px"
        >
          <template slot-scope="{row}">
            <el-input v-if="row.parentId&&row.editing" v-model="row.note" size="mini" />
            <span v-else>{{ row.note || row.reconsiderDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="operatorType==='UPDATE'"
          label="操作"
          align="left"
          width="140px"
          fixed="right"
        >
          <template slot-scope="{row,$index}">
            <template v-if="actionType==='EVALUATE'">
              <pure-button v-if="!row.indexNum.includes('.')" label="添加评分" :disabled="row.editing" type="text" @click="onAddEvaluation(row)" />

              <span v-else-if="row.editing">
                <pure-button v-if="!row.id" label="保存" type="text" @click="onSubmitEvaluation(row)" />
                <pure-button v-if="!row.id" label="取消" type="text" @click="onCancelEvaluation(row,$index)" />
              </span>
            </template>
            <template v-else-if="actionType==='RECONSIDER_REVIEW'&&row.parentId&&row.reconsiderState==='1'&&!row.reconsiderAuditState">
              <pure-button class="pass" label="通过" type="text" @click="onPassReconsider(row)" />
              <pure-button class="reject" label="驳回" type="text" @click="onRejectReconsider(row)" />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { showReconsiderTag, } from '../../utils';
import ReviewApi from '../api';
import MeritsApi from '@/feat/merits/api';
import MineApi from '@/feat/merits/mine/api';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
export default {
  mixins: [FormDialog],
  props: {
    // 需要执行的操作类型，异与operatorType 评价-EVALUATE，复议审核-RECONSIDER_REVIEW
    actionType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data: [],
      editingParentRow: {},
    };
  },
  computed: {
    title() {
      if (this.operatorType === OPERATOR_TYPES.VIEW) {
        return '主观评价-查看';
      }
      return this.actionType === 'RECONSIDER_REVIEW' ? '主观评价-复议审核' : '主观评价-评分';
    },
  },
  methods: {
    async fetchDetail() {
      try {
        this.loading = true;
        const data = await MeritsApi.subjectiveEvaluationDetail(this.id);
        this.data = data;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      } catch (error) {
        this.loadingText = '数据加载失败';
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    onAddEvaluation(row) {
      row.editing = true;

      row.children.push({
        indexNum: row.indexNum + '.' + (row.children.length + 1),
        parentId: row.id,
        editing: true,
        indexDescription: '',
        finalScore: null,
        note: '',
      });
      this.editingParentRow = row;
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, true);
      });
    },
    async onPassReconsider(row) {
      try {
        await ReviewApi.passReconsider({ gradeId: row.id, finalScore: row.finalScore, });
        row.reconsiderAuditState = '1';
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async onRejectReconsider(row) {
      try {
        await ReviewApi.rejectReconsider({ gradeId: row.id, finalScore: row.finalScore, });
        row.reconsiderAuditState = '2';
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
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
.pass {
  ::v-deep .label {
    color: #67C23A;
  }

}
.reject {
  ::v-deep .label {
    color: #F56C6C;
  }

}
</style>
