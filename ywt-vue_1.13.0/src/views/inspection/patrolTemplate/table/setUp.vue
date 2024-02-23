<!-- 模板设置表格 -->
<template>
  <div class="setUp-main">
    <el-table
      :data="data"
      border
      max-height="590px"
    >
      <el-table-column
        label="序号"
        align="left"
        type="index"
        width="100"
      />
      <el-table-column
        v-for="(item, index) in tablecolumn"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        align="left"
        :show-overflow-tooltip="true"
        :filters="item.select && item.prop === 'department'? selectData: item.select && item.prop === 'enable' ? enableData: item.select && item.prop === 'treatment' ? treatmentData : null"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="item.prop === 'enable'"
            v-model="scope.row.isOpen"
            :active-value="1"
            :inactive-value="0"
          />
          <span v-else-if="item.prop === 'treatment'">
            <el-radio v-model="scope.row.errType" :label="0">限期整改</el-radio>
            <el-radio v-model="scope.row.errType" :label="1">转工单</el-radio>
          </span>
          <span v-else-if="item.prop==='inspectionFrequency'">
            {{ joinInspectionFrequency(scope.row) }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        width="140"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="seeinspection(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="editInspection(scope.row)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px;"
            @confirm="handleDeleteTemp(scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="text"
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import AddTemplateDialog from '@/views/inspection/components/dialog/addTemplateDialog';
import { getTemplates, getTemplate, } from '@/apis/inspection/patrolTemplate/index';
import InspectionTemplateApi from '@/apis/inspection/patrolTemplate';
export default {
  mixins: [PaginationTable],
  data() {
    return {
      deptId: '',
      tablecolumn: '',
      selectData: [],
      searchValue: '',
      queryCondition: null,
      enableData: [{ text: '启用', value: 1, }, { text: '不启用', value: 0, }],
      treatmentData: [{ text: '限期整改', value: 1, }, { text: '转工单', value: 0, }],
      tablecolumnData: null,
      templateData: null,
    };
  },
  computed: {
    setUpTableColumn() {
      return this.$store.state['inspection/center'].setUpTableColumn;
    },
  },
  created() {
    this.getTemplatesAll({ pageNum: this.pageNum, pageSize: this.pageSize, deptId: this.deptId, });
    this.tablecolumn = this.setUpTableColumn;
    this.fetchData();
  },
  methods: {
    async getTemplatesAll(data) {
      const res = await getTemplates(data);
      this.total = res.total;
      this.tablecolumnData = res.list;
      this.$store.state.dictionary.departmentList.forEach(item => {
        this.selectData.push({ text: item.dept_name, value: item.id, });
        this.tablecolumnData.forEach(i => {
          if (item.id === i.deptId) {
            i.department = item.dept_name;
          }
        });
      });
      this.tablecolumnData.forEach(item => {
        // eslint-disable-next-line eqeqeq
        item.frequencyDateType = item.frequencyDateType == 1 ? '天' : item.frequencyDateType == 2 ? '周' : item.frequencyDateType == 3 ? '月' : '年';
        item.inspectionFrequency = item.frequencyCount + '次/' + item.frequencyInterval + item.frequencyDateType;
      });
    },
    // 拼接巡检频次
    joinInspectionFrequency(row) {
      const period = `${row.frequencyInterval}${row.frequencyDateType}`;
      const count = `${row.frequencyCount}次`;
      return `${count}/${period}`;
    },
    async fetchData() {
      try {
        const { list, total, } = await InspectionTemplateApi.list({ pageNum: this.currentPage, pageSize: this.pageSize, });
        this.total = total;
        this.data = list;
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async handleDeleteTemp(row) {
      try {
        await InspectionTemplateApi.deleteTemp(row.id);
        this.$message({
          type: 'success',
          message: '成功删除模板',
        });
        await this.fetchData();
      } catch (error) {
        this.$message({
          type: 'error',
          message: '删除模板失败',
        });
      }
    },
    async seeinspection(e) {
      const res = await getTemplate({ id: e.id, });
      res.btnType = 1;
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <AddTemplateDialog templateData={res} onDone={this.dones}/>,
      });
    },
    setupGetData() {
      this.getTemplatesAll({ pageNum: this.pageNum, pageSize: this.pageSize, deptId: this.deptId, });
    },
    dones() {
      this.getTemplatesAll({ pageNum: this.pageNum, pageSize: this.pageSize, deptId: this.deptId, });
    },
    async editInspection(e) {
      const res = await getTemplate({ id: e.id, });
      res.btnType = 2;
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <AddTemplateDialog templateData={res} onDone={this.dones} />,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.setUp-main{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .block{
    margin:30px;
    display: flex;
    justify-content: flex-end;
  }
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
// 滚动条的滑块
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #D7E5F9;
  border-radius: 3px;
}
::v-deep .el-table {
  flex: none !important;
}
</style>
