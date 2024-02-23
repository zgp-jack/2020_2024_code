<!-- 模块关联（按巡检单元） -->
<template>
  <div class="moduleAssociation-main">
    <el-table
      :data="tablecolumnData"
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
      />
      <el-table-column
        label="操作"
        align="left"
        width="148"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="seeAssociation">查看</el-button>
          <el-button type="text" size="mini" @click="editAssociation(scope.$index)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10%;"
            @confirm="delTableData(scope.$index)"
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
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import addUnitDialog from '@/views/inspection/components/dialog/addUnitDialog';
import seeAssociationDialog from '@/views/inspection/components/dialog/seeAssociationDialog';
import { getUnitList, delUnit, getUnit, } from '@/apis/inspection/InspectionUnit/index';
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: null,

      tablecolumnData: [
        { name: 'aaa', }
      ],
      tablecolumn: null,

    };
  },
  computed: {
    moduleAssociationTableColumn() {
      return this.$store.state['inspection/center'].moduleAssociationTableColumn;
    },
  },
  created() {
    this.tablecolumn = this.moduleAssociationTableColumn;
    this.getUnitList();
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},

    async getUnitList() {
      const res = await getUnitList();
      console.log(res, 111);
    },
    delTableData(e) {
      delUnit({ id: e, });
    },
    seeAssociation() {
      this.$drawer({
        title: '巡检',
        width: '1400px',
        component: () => <seeAssociationDialog />,
      });
    },
    editAssociation(e) {
      const res = getUnit({ id: e, });
      res.istype = 1;
      this.$drawer({
        width: '1400px',
        component: () => <addUnitDialog onDone={this.addDone} unitData={res} />,
      });
    },
    addDone() {
    },
  },
};
</script>

<style lang="scss" scoped>
.moduleAssociation-main{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ::v-deep .el-table{
    flex: none;
  }
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
</style>
