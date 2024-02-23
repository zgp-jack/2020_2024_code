<template>
  <div class="page-system-settings">
    <TableLayout>

      <div class="content-box">
        <div class="main-content">
          <div class="top-box">
            <div class="search-box">
              <div class="search-item">
                <el-input v-model="searchForm.categoryName" placeholder="请输入分类名称" prefix-icon="el-icon-search" />
              </div>
              <div class="search-item">
                <el-input v-model="searchForm.code" placeholder="请输入分类编码" prefix-icon="el-icon-search" />
              </div>
              <div class="search-item">
                <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
                <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
              </div>
            </div>
            <div class="operate-box">
              <pure-button type="special" label="添加" icon="add" @click="onAdd" />
            </div>
          </div>

          <div class="table-box">
            <el-table ref="tableRef" :data="tableData" height="100%" @selection-change="onSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="分类名称" align="center" prop="categoryName" />
              <el-table-column label="分类编码" align="center" prop="code" />
              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <span class="operate-btn" @click="onEdit(row)">修改</span>
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
    <custom-drawer
      size="45%"
      :wrapper-closable="false"
      :title="dialogTitle"
      :visible.sync="showAddEditDialog"
      @closed="onDialogClosed"
    >
      <CompAddEdit
        ref="compAddEditRef"
        :current-data="currentData"
        :operate-type="operateType"
      />
      <template v-slot:footer>
        <div>
          <pure-button label="保存" @click="onSave" />
          <pure-button v-if="operateType === 'add'" label="保存并继续新增" type="major" @click="onSaveThenAdd" />
          <pure-button label="取消" type="patch" @click="onCancel" />
        </div>
      </template>
    </custom-drawer>
  </div>
</template>

<script>
import pageMixin from '@/mixins/page';
import CompAddEdit from './components/add-edit.vue';
import { removeIds, addData, editData, pageList, } from './api';

export default {
  components: {
    CompAddEdit,
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
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '新增流程分类',
        edit: '编辑流程分类',
      };
      return titles[this.operateType];
    },
  },
  created() {
    this.getListData();
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
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    onAdd() {
      this.operateType = 'add';
      this.currentData = {};
      this.showAddEditDialog = true;
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
        const request = this.operateType === 'edit' ? editData : addData;
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
            message: '删除成功',
          });
        })
        .finally(() => {
          loading.close();
        });
    },
    onDel(id) {
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
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
        this.$message.error('请至少选中一个数据');
        return false;
      }
      const ids = selected.map(item => item.id);
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
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
