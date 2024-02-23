<template>
  <el-container>
    <el-main class="main">
      <TableLayout :no-padding="true">
        <div class="content-box">
          <div class="main-content">
            <div class="table-box">
              <el-table ref="tableRef" :data="tableData" height="100%">
                <el-table-column label="告警内容" align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">你有{{ scope.row.count }}个工单30分钟内同时报修
                      【{{ scope.row.parentFaultTypeToName }}】，请谨慎</span>
                  </template>
                </el-table-column>
                <el-table-column label="工单数" align="center" prop="count" />
                <el-table-column label="故障分类" align="center" prop="faultTypeToName" />
                <el-table-column label="告警时间" align="center" prop="warningTime" />
              </el-table>
            </div>
            <div class="table-footer">
              <div class="operate-box" />
              <el-pagination
                :page-sizes="[20, 50, 100, 200]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </TableLayout>
    </el-main>
  </el-container>
</template>

<script>
import pageMixin from '@/mixins/page';
import { getOrderWarningList, } from '../api';

export default {
  components: {},
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      const loading = this.showLoading();
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      getOrderWarningList(params).then((data) => {
        const { rows, total, } = data;
        this.total = total;
        this.tableData = rows;
      }).finally(() => {
        loading.close();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-system-settings {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-box {
  height: 100%;
  flex: auto;
  display: flex;
  padding: 10px;
  background: #fff;

  .main-content {
    padding-left: 10px;
    flex: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .table-box {
      flex: auto;
      overflow: hidden;
      min-height: 100px;

      .operate-btn {
        margin-right: 16px;
        font-size: 14px;
        color: #006666;
        cursor: pointer;

        &.delete {
          color: #ff836b;
        }
      }
    }
  }
}
</style>
