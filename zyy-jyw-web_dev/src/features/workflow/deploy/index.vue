<template>
  <div class="page-system-settings">
    <TableLayout>

      <div class="content-box">
        <div class="main-content">
          <div class="top-box">
            <div class="search-box">
              <div class="search-item">
                <el-input v-model="searchForm.modelKey" placeholder="请输入流程标识" prefix-icon="el-icon-search" />
              </div>
              <div class="search-item">
                <el-input v-model="searchForm.modelName" placeholder="请输入流程名称" prefix-icon="el-icon-search" />
              </div>
              <div class="search-item">
                <el-select v-model="searchForm.category" placeholder="请选择" clearable style="width:100%">
                  <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.code" />
                </el-select>
              </div>
              <div class="search-item">
                <el-select v-model="searchForm.state" size="small" clearable placeholder="请选择状态">
                  <el-option :key="1" label="激活" value="active" />
                  <el-option :key="2" label="挂起" value="suspended" />
                </el-select>
              </div>
              <div class="search-item">
                <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
                <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
              </div>
            </div>
            <div class="operate-box" />
          </div>

          <div class="table-box">
            <el-table ref="tableRef" :data="tableData" height="100%" @selection-change="onSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="模型标识" align="center" prop="processKey" />
              <el-table-column label="模型名称" align="center" prop="processName" />
              <el-table-column label="流程分类" align="center" prop="categoryName" :formatter="categoryFormat" />
              <el-table-column label="流程版本" align="center">
                <template slot-scope="scope">
                  <el-tag size="medium">v{{ scope.row.version }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <el-tag v-if="!scope.row.suspended" type="success">激活</el-tag>
                  <el-tag v-if="scope.row.suspended" type="warning">挂起</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <span class="operate-btn" @click="handlePublish(row)">版本历史</span>
                  <span class="operate-btn delete" @click="onDel(row.id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-footer">
            <div class="operate-box">
              <div class="operate-item">
                <el-checkbox
                  v-model="allChecked"
                  label="全选"
                  :indeterminate="allCheckedIndeterminate"
                  @change="onToggleAllCheck"
                />
              </div>
              <div class="operate-item" @click="onBatchDel">
                <i class="el-icon-delete" />
                <span>批量删除</span>
              </div>
              <span class="checked-num">已选：{{ checkedNum }}条</span>
            </div>
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
    <!-- 版本管理 -->
    <el-dialog title="版本管理" :visible.sync="publish.open" width="50%" append-to-body>
      <el-table v-loading="publish.loading" :data="publish.dataList">
        <el-table-column label="流程标识" align="center" prop="processKey" :show-overflow-tooltip="true" />
        <el-table-column label="流程名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="handleProcessView(scope.row)">
              <span>{{ scope.row.processName }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="流程版本" align="center">
          <template slot-scope="scope">
            <el-tag size="medium">v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="!scope.row.suspended" type="success">激活</el-tag>
            <el-tag v-if="scope.row.suspended" type="warning">挂起</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="publishTotal > 0"
        :total="publishTotal"
        :page.sync="publishQueryParams.pageNum"
        :limit.sync="publishQueryParams.pageSize"
        @pagination="getPublishList"
      />
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '@/mixins/page';
import { pageList, removeIds, addUnit, editUnit, getAllList, getPublishList, } from './api';

export default {
  components: {
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      searchForm: {},
      tableData: [],
      checkedNum: 0,
      allChecked: false,
      allCheckedIndeterminate: false,
      operateType: 'add',
      showAddEditDialog: false,
      currentData: {},
      loading: false,
      categoryList: [],
      publish: {
        open: false,
        loading: false,
        dataList: [],
      },
      publishTotal: 0,
      publishQueryParams: {
        pageNum: 1,
        pageSize: 10,
        processKey: '',
      },
    };
  },
  created() {
    this.getListData();
    this.getCategoryList();
  },
  methods: {
    getListData() {
      const loading = this.showLoading();
      const { ...rest } = this.searchForm;
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        ...rest,
      };
      pageList(params).then((data) => {
        const { rows, total, } = data;
        this.total = total;
        this.tableData = rows;
      }).finally(() => {
        loading.close();
      });
    },
    getCategoryList() {
      getAllList().then((data) => {
        this.categoryList = data;
      });
    },
    handlePublish(row) {
      this.publishQueryParams.processKey = row.processKey;
      this.publish.open = true;
      this.getPublishList();
    },
    getPublishList() {
      this.publish.loading = true;
      getPublishList(this.publishQueryParams).then(response => {
        this.publish.dataList = response.rows;
        this.publishTotal = response.total;
        this.publish.loading = false;
      });
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    onEdit(data) {
      this.operateType = 'edit';
      this.currentData = { ...data, };
      this.showAddEditDialog = true;
    },
    onCancel() {
      this.showAddEditDialog = false;
    },
    onDialogClosed() {
      this.$refs.compAddEditRef.reset();
    },
    /* 选择改变 */
    onSelectionChange(selection) {
      this.checkedNum = selection.length;
      if (selection.length === 0) {
        this.allChecked = false;
        this.allCheckedIndeterminate = false;
      } else if (selection.length < this.tableData.length) {
        this.allChecked = false;
        this.allCheckedIndeterminate = true;
      } else {
        this.allChecked = true;
        this.allCheckedIndeterminate = false;
      }
    },
    /* 全选 */
    onToggleAllCheck(checked) {
      this.$refs.tableRef.toggleAllSelection();
    },
    submitData() {
      this.loading = true;
      const { valid, data, } = this.$refs.compAddEditRef.validate();
      if (valid) {
        const request = this.operateType === 'edit' ? editUnit : addUnit;
        request(data)
          .then(() => {
            this.$message.success('操作成功');
            this.getListData();
            if (this.continueAdd) {
              this.$refs.compAddEditRef.reset();
            } else {
              this.showAddEditDialog = false;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.loading = false;
        this.$message.error('请正确填写');
      }
    },
    onSave() {
      this.continueAdd = false;
      this.submitData();
    },
    onSaveThenAdd() {
      this.continueAdd = true;
      this.submitData();
    },
    submitDelete(ids) {
      const loading = this.showLoading({ text: '操作中...', });
      removeIds(ids.join())
        .then(() => {
          // 处理最后一页最后一条数据删除分页显示问题
          this.calcLastPage(ids.length);
          this.getListData();
          this.$message({
            type: 'success',
            message: '删除用户成功',
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    onDel(id) {
      this.$confirm('此操作将删除选中巡检单元, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.submitDelete([
            id,
          ]);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    onBatchDel() {
      const tableRef = this.$refs.tableRef;
      const selected = tableRef.selection;
      if (!selected.length) {
        this.$message.error('请至少选中一个巡检单元');
        return false;
      }
      const ids = selected.map(item => item.id);
      this.$confirm('此操作将删除选中巡检单元, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.submitDelete(ids);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    categoryFormat(row) {
      return this.categoryList.find(k => k.code === row.category)?.categoryName ?? '';
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

  .tree {
    flex: 0 0 260px;
    border-right: 1px solid #dde9e8;
  }

  .main-content {
    padding-left: 10px;
    flex: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .top-box {
      flex: none;
      display: flex;
      justify-content: space-between;

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

      .operate-box {
        flex: none;
        margin-left: 20px;
      }
    }

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
