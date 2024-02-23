<!-- 模板关联表格 -->
<template>
  <el-table
    :data="tablecolumnData"
    border
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
      label="按类别设置"
      align="left"
      width="140"
    >
      <template slot-scope="scope">
        <el-button v-if="scope.row.issetUp1" type="text" size="mini" @click="editInspection(scope.row, 1)">设置</el-button>
        <div v-else>
          <el-button type="text" size="mini" @click="seeinspection(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="editInspection(scope.row, 2)">编辑</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="按设备设置"
      align="left"
      width="140"
    >
      <template slot-scope="scope">
        <el-button v-if="scope.row.issetUp2" type="text" size="mini" @click="editInspection(scope.row, 1)">设置</el-button>
        <div v-else>
          <el-button type="text" size="mini" @click="seeinspection(scope.row)">查看</el-button>
          <el-button type="text" size="mini" @click="editInspection(scope.row, 2)">编辑</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import associationSettingDialog from '@/views/inspection/components/dialog/associationSettingDialog';
import { getRelatedTemplate, } from '@/apis/inspection/relatedTemplate/index'; // relatedTemplate,
export default {
  data() {
    return {
      tablecolumn: '',
      selectData: [],
      tablecolumnData: [
        {
          id: 1,
          issetUp1: true,
          issetUp2: false,
          name: '王小虎',
        }, {
          id: 2,
          issetUp1: false,
          issetUp2: true,
          name: '王小虎',
        }
      ],
      assetsIdAll: {
        assets_id: 2,
        assets_type_id: '',
        unit_id: '',
      },
    };
  },
  computed: {
    relationTableColumn() {
      return this.$store.state['inspection/center'].relationTableColumn;
    },
  },
  created() {
    this.tablecolumn = this.relationTableColumn;
    // this.getrelatedTemplateData();
  },
  methods: {
    // async getrelatedTemplateData() {
    //   const res = await relatedTemplate({ json: JSON.stringify({ assets_id: 0, }), });
    //   console.log(res, '关联资产或类别');
    // },
    async seeinspection(v) {
      let res = {};
      res = await getRelatedTemplate({ id: v.id, type: 0, });
      console.log(res, '6666666');
      res.openMode = 0;
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <associationSettingDialog informationData={res} onDone={this.outBtn} />,
      });
    },
    outBtn() {},
    async editInspection(v, x) {
      console.log(x, '00000000');
      let res = {};
      if (x === 2) {
        res = await getRelatedTemplate({ id: v.id, type: 0, });
        res.openMode = 1;
      } else {
        res.id = v; // 设置
        res.openMode = 2;
      }
      this.$drawer({
        width: '1400px',
        position: 'right-bottom',
        component: () => <associationSettingDialog informationData={res} onDone={this.saveBtn} />,
      });
    },
    saveBtn() {
      console.log('刷新表格');
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
