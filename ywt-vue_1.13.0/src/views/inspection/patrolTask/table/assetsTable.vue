<!-- 资产科室表格 -->
<template>
  <el-table
    border
    :data="tablecolumnData"
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
      :filters="item.select?selectData:null"
    />
    <el-table-column
      label="操作"
      align="left"
      width="140"
    >
      <template>
        <el-button type="text" size="mini" @click="seeinspection">查看</el-button>
        <el-button type="text" size="mini" @click="inspection">巡检</el-button>
        <el-button type="text" size="mini" @click="editInspection">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import seeInspectionDialog from '@/views/inspection/components/dialog/seeInspectionDialog';
import inspectionDialog from '@/views/inspection/components/dialog/inspectionDialog';
import associationSettingDialog from '@/views/inspection/components/dialog/associationSettingDialog';
export default {
  data() {
    return {
      tablecolumn: '',
      selectData: [],
      activities: [{
        status: '正常',
        timestamp: '2018-04-15 00:00:00',
        name: '王小虎',
      }, {
        status: '异常',
        timestamp: '2018-04-15 00:00:00',
        name: '王小虎',
      }, {
        status: '正常',
        timestamp: '2018-04-15 00:00:00',

        name: '王小虎',
      }],
      tablecolumnData: [
        {
          name: '王小虎',
          recentInspection: '2018-04-15 00:00:00',

        }, {
          name: '王小虎',
          recentInspection: '2021-06-01 00:00:00',
        }
      ],
    };
  },
  computed: {
    assetsTableColumn() {
      return this.$store.state['inspection/center'].assetsTableColumn;
    },
  },
  created() {
    this.tablecolumn = this.assetsTableColumn;
  },
  methods: {
    inspection() {
      this.$drawer({
        title: '巡检',
        width: '1400px',
        position: 'right-bottom',
        component: () => <inspectionDialog />,
      });
    },
    seeinspection() {
      this.$drawer({
        title: '查看',
        width: '1400px',
        position: 'right-bottom',
        component: () => <seeInspectionDialog />,
      });
    },
    editInspection() {
      this.$drawer({
        title: '编辑',
        width: '1400px',
        position: 'right-bottom',
        component: () => <associationSettingDialog />,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
