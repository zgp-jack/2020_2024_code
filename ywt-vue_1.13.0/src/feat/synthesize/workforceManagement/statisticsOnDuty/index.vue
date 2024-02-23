<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-10-09 14:09:14
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-10-13 17:34:25
 * @FilePath: \华西二院\ywt-vue\src\feat\synthesize\workforceManagement\statisticsOnDuty\index.vue
 * @Description:值班统计
-->
<!--  -->
<template>
  <el-container class="statistics">
    <el-main>
      <el-row class="base-margin-left  base-margin-top">
        <el-col :span="24">
          <el-form inline size="small" :model="searchForm">
            <el-form-item class="search-input">
              <el-input v-model="searchForm.name" placeholder="姓名/用户名" />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="beginAndEndTime"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="q-date-picker"
              />
            </el-form-item>
            <el-form-item>
              <pure-button type="wire-frame" label="查询" @click="onSearch" />
            </el-form-item>
            <el-form-item>
              <el-button type="text" @click="onClear">清空查询条件</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <Q-table
        v-if="tableColumn.length"
        :table-data="tableData"
        :columns="tableColumn"
        :pagination="pagination"
        :total="count"
        :page-sizes="pageSizes"
        :current-change="currentChange"
        :size-change="sizeChange"
        :renderheader="renderheader"
        class="container-table"
      />
    </el-main>
  </el-container>
</template>

<script>
import {
  getTableHead,
  getDutyStatistics,
} from '@/apis/synthesize/workforceManagement';
export default {
  name: 'StatisticsOnDuty',
  components: {
  },
  data() {
    return {
      searchForm: {
        name: '',
        beginDate: '',
        endDate: '',
      },
      beginAndEndTime: [],
      tableData: [],
      tableColumn: [],
      pageSizes: [20, 30, 40],
      pagination: {
        pageNum: 1,
        pageSize: 20,
      },
      count: 0,
    };
  },
  computed: {},

  watch: {

  },
  created() {
    this.getTableHeadData();
  },
  mounted() {

  },

  methods: {
    onClear() {
      if (!!this.searchForm.name || !!this.beginAndEndTime.length) {
        this.searchForm = {
          name: '',
          beginDate: '',
          endDate: '',
        };
        this.beginAndEndTime = [];
        this.onSearch();
      }
    },
    // 查询
    onSearch() {
      this.getDutyStatisticsData();
    },
    // 每页数量改变
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getDutyStatisticsData();
    },
    // 当前页改变
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getDutyStatisticsData();
    },
    // 定制化表头，默认通过 | 分割
    renderheader(h, { column, $index, }) {
      return h('div', { style: 'font-size:14px;line-height:14px', }, [
        h('span', {}, column.label.split('&')[0]),
        h('br'),
        h('span', {}, column.label.split('&')[1])
      ]);
    },
    // 处理动态表头
    handleTableHead(severTableHead) {
      const tableHead = [...severTableHead];
      tableHead.forEach(item => {
        if (item.children.length) {
          item.children.forEach(el => {
            const propKey = el.prop.split('.');
            el.formatter = function (row) {
              if (row[propKey[0]]?.[propKey[1]]) {
                return `${row[propKey[0]][propKey[1]]}天`;
              } else {
                return '--';
              }
            };
          });
        }
      });
      tableHead.push({
        label: '值班费',
        prop: 'charge',
        formatter: function (row) {
          if (!row.charge) {
            return '--';
          } else {
            return `${row.charge}元`;
          }
        },
      });
      tableHead.unshift(
        { label: '序号', type: 'index', width: '100px', },
        {
          label: '姓名',
          prop: 'userName',
        },
      );
      return tableHead;
    },
    // 获取动态表头
    async getTableHeadData() {
      try {
        const tableHead = await getTableHead();
        this.tableColumn = this.handleTableHead(tableHead);
        this.getDutyStatisticsData();
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 获取列表数据
    async getDutyStatisticsData() {
      try {
        this.searchForm.beginDate = this.beginAndEndTime[0];
        this.searchForm.endDate = this.beginAndEndTime[1];
        const data = {
          ...this.searchForm,
          pageNo: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
        };
        const res = await getDutyStatistics(data);
        this.count = res?.total;
        this.tableData = res?.list || [];
        console.log(res);
      } catch (error) {
        if (error) {
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
<style lang='scss' scoped>
.statistics{
  background: #fff;
}
.q-date-picker {
  width: 278px;
  ::v-deep .el-range-input {
    font-size: 18px !important;
  }
}
.container-table {
  padding:0 16px;
  height: calc(100% - 74px);
}
</style>
