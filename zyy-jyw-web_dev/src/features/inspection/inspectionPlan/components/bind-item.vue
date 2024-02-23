<template>
  <div>
    <div style="height: 100%;">
      <div class="transfer">
        <div class="leftTransfer">
          <div class="leftTransfer_title">
            <span>全部资产</span>
          </div>

          <div style="margin: 5px 0" />

          <div class="table-box">
            <el-table ref="tableRef1" :data="unselectedTable" height="100%">
              <el-table-column type="selection" width="55" />
              <el-table-column label="巡检项名称" prop="itemName" />
              <el-table-column label="巡检项类型" prop="itemTypeName" />
            </el-table>
          </div>
          <el-pagination
            small
            background
            class="pagination"
            :pager-count="5"
            layout="prev, pager, next"
            :total="unselectedTotal"
            :current-page="currentPage1"
            :page-size="pageSize1"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
          />
        </div>
        <div class="transferButton">
          <el-button type="primary" @click="pushData">
            <i class="el-icon-arrow-right" />
            选择
          </el-button>
          <el-button type="primary" @click="delData">
            <i class="el-icon-arrow-left" />
            选择
          </el-button>
        </div>
        <div class="rightTransfer">
          <div class="rightTransfer_title">
            <span>已选资产</span>
            <div>
              <pure-button type="patch" style="font-size: 12px;padding: 5px 8px;" label="清除选中" @click="delData" />
            </div>
          </div>
          <div style="margin: 5px 0" />
          <div class="table-box">
            <el-table ref="tableRef2" :data="selectedTable" height="100%">
              <el-table-column type="selection" width="55" />
              <el-table-column label="巡检项名称" prop="itemName" />
              <el-table-column label="巡检项类型" prop="itemTypeName" />
            </el-table>
          </div>
          <el-pagination
            small
            background
            class="pagination"
            :pager-count="5"
            layout="prev, pager, next"
            :total="selectedTotal"
            :current-page="currentPage2"
            :page-size="pageSize2"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
          />
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import PlanApi from '../api';

export default {
  components: {
  },
  props: {
    selectData: {
      type: Array,
      default() {
        return [];
      },
    },
    currentData: {
      type: Object,
      default() {
        return {
          status: '0',
        };
      },
    },
  },
  data() {
    return {
      searchForm: {},
      formData: {},
      astIdList: [],
      // 穿梭框
      unselectedTotal: 0, // 未选
      unselectedTable: [],
      currentPage1: 1,
      pageSize1: 10,
      selectedTotal: 0, // 已选
      selectedTable: [],
      selectedAll: [], // 所有
      currentPage2: 1,
      pageSize2: 10,
    };
  },
  watch: {
    selectData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectedAll = newVal;
          this.skipPage();
        }
      },
    },
    currentData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = newVal;
        }
      },
    },
  },
  mounted() {
    this.getListData();
  },
  methods: {
    getListData() {
      const { ...rest } = this.searchForm;
      const ids = this.selectedAll.map(item => item.configItemId);
      const params = {
        pageNum: this.currentPage1,
        pageSize: this.pageSize1,
        businessId: this.formData.businessId,
        businessType: this.formData.businessType,
        itemIdList: ids,
        ...rest,
      };
      PlanApi.planItemList(params).then((data) => {
        const { rows, total, } = data;
        this.unselectedTotal = total;
        this.unselectedTable = rows;
      });
    },
    onSearch() {
      this.currentPage1 = 1;
      this.getListData();
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getListData();
    },
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this.currentPage1 = 1;
      this.getListData();
    },
    /* 添加到已选 */
    pushData() {
      const tableRef = this.$refs.tableRef1;
      const selected = tableRef.selection;
      this.selectedAll = [...this.selectedAll, ...selected,
      ].sort((a, b) => {
        return a['configItemId'] - b['configItemId'];
      });
      this.skipPage();
      this.getListData();
    },
    /* 清除已选 */
    delData() {
      const tableRef = this.$refs.tableRef2;
      const selected = tableRef.selection;
      const ids = selected.map(item => item.configItemId);
      // 删除选中的数据
      this.selectedAll = this.selectedAll.filter((item) => {
        if (!ids.includes(item['configItemId'])) {
          return item;
        }
      });
      this.skipPage();
      this.getListData();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.skipPage();
    },
    handleSizeChange2(val) {
      this.pageSize2 = val;
      this.currentPage2 = 1;
      this.skipPage();
    },
    /* 已选巡检项分页 */
    skipPage() {
      this.selectedTotal = this.selectedAll.length;
      const totalPage = Math.ceil((this.selectedTotal) / this.pageSize2);
      const currentPage =
        this.currentPage2 > totalPage ? totalPage : this.currentPage2;
      this.currentPage2 = currentPage < 1 ? 1 : currentPage;
      const page = this.currentPage2;
      const limit = this.pageSize2;
      const first = (page - 1) * limit;
      const last = page * limit;
      this.selectedTable = this.selectedAll.slice(first, last);
    },
    /* 返回选中的数据 */
    getSelectedData() {
      return this.selectedAll;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";

.table-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}

.search-box {
  flex: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  .search-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.transfer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;

  .transferButton {
    .el-button {
      display: block;
      margin: 10px 0;
    }
  }

  .el-checkbox {
    line-height: 30px;
  }

  .transfer_input {
    margin: 10px 15px 0 15px;
    width: 85%;

    .el-input--medium .el-input__inner {
      height: 36px;
      line-height: 36px;
      border-radius: 16px;
    }
  }

  .leftTransfer,
  .rightTransfer {
    height: 800px;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
    overflow: hidden;
    background: #ffffff;
    display: inline-block;
    vertical-align: middle;
    width: 400px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    margin: 0 0px;

    .el-checkbox {
      display: block;
    }

    .pagination {
      position: absolute;
      bottom: 8px;
      right: 0;
    }

    .leftTransfer_title,
    .rightTransfer_title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      background: #f5f7fa;
      margin: 0;
      padding-left: 15px;
      border-bottom: 1px solid #e6ebf5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #000000;
      padding-right: 15px;
      align-items: center;
    }
  }
}

.transfer_group {
  padding-left: 15px;
}
</style>
