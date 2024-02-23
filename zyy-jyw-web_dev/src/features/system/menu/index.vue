<template>
  <el-container>
    <el-main class="main">
      <div class="table-layout-container">
        <div class="content-box">
          <div class="main-content">
            <div class="top-box">
              <div class="search-box">
                <div class="search-item">
                  <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称" prefix-icon="el-icon-search" />
                </div>
                <div class="search-item">
                  <el-select v-model="searchForm.status" placeholder="菜单状态" clearable>
                    <el-option label="正常" :value="0" />
                    <el-option label="停用" :value="1" />
                  </el-select>
                </div>
                <div class="search-item">
                  <pure-button type="minor" label="查询" icon="search" @click="onSearch" />
                  <pure-button type="patch" label="重置" icon="reset" @click="onReset" />
                </div>
              </div>
              <div class="operate-box">
                <pure-button v-auth="'system:menu:add'" type="special" label="新增" icon="add" @click="onAdd" />
                <pure-button
                  type="minor"
                  icon="arrow-down"
                  label="展开/折叠"
                  @click="toggleExpandAll"
                />
              </div>
            </div>

            <div class="table-box">
              <el-table
                v-if="refreshTable"
                v-loading="loading"
                :data="tableData"
                row-key="menuId"
                :default-expand-all="isExpandAll"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160" />
                <el-table-column prop="icon" label="图标" align="center" width="100">
                  <template slot-scope="scope">
                    <i :class="scope.row.icon" style="height: 25px;width: 16px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="orderNum" label="排序" width="60" />
                <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
                <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
                <el-table-column prop="status" label="状态" width="80">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0">正常</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="danger">停用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <pure-button
                      v-auth="'system:menu:edit'"
                      size="mini"
                      type="text"
                      @click="onEdit(scope.row)"
                    >修改</pure-button>
                    <pure-button
                      v-auth="'system:menu:add'"
                      size="mini"
                      type="text"
                      @click="handleAdd(scope.row)"
                    >新增</pure-button>
                    <pure-button
                      v-auth="'system:menu:remove'"
                      size="mini"
                      text-color="warning"
                      type="text"
                      @click="onDel(scope.row.menuId)"
                    >删除</pure-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
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
    </el-main>
  </el-container>
</template>

<script>
import pageMixin from '@/mixins/page';
import CompAddEdit from './components/add-edit.vue';
import { listMenu, removeId, addData, editData, } from './api';
import { convertToTree, } from '@/common/utils/convert';
import PureButton from '@/common/components/button/index.vue';

export default {
  components: {
    PureButton,
    CompAddEdit,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      searchForm: {},
      tableData: [],
      isExpandAll: false, // 是否展开，默认全部折叠
      refreshTable: true, // 重新渲染表格状态
      operateType: 'add',
      showAddEditDialog: false,
      currentData: {},
      addData: {
        menuType: 'M',
        isFrame: '1',
        isCache: '0',
        visible: '0',
        status: '0',
      },
      loading: false,
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '新增菜单',
        edit: '编辑菜单',
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
        ...rest,
      };
      listMenu(params).then((data) => {
        this.tableData = convertToTree(data, {
          id: 'menuId',
          parentId: 'parentId',
        });
      }).finally(() => {
        loading.close();
      });
    },
    onQuery() {
      this.getListData();
    },
    onReset() {
      this.searchForm = {};
      this.onSearch();
    },
    onAdd() {
      this.operateType = 'add';
      this.currentData = {
        ...this.addData,
      };
      this.showAddEditDialog = true;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.operateType = 'add';
      let parentId = 0;
      let parentName = '主目录';
      if (row != null && row.menuId) {
        parentId = row.menuId;
        parentName = row.menuName;
      }
      this.currentData = {
        ...this.addData,
        parentId: parentId,
        parentName: parentName,
      };
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
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
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
              this.$refs.compAddEditRef.reset(this.addData);
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
    submitDelete(id) {
      const loading = this.showLoading({ text: '操作中...', });
      removeId(id)
        .then(() => {
          // 处理最后一页最后一条数据删除分页显示问题
          this.calcLastPage(1);
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
          this.submitDelete(id);
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
.table-layout-container{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: auto;
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
