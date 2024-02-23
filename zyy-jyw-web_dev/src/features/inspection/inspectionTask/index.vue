<template>
  <div class="bg-container">
    <TableLayout>

      <div class="content-box">
        <el-tabs
          v-model="currentTab"
          type="border-card"
          @tab-click="tabChange"
        >
          <el-tab-pane
            label="资产类型"
            name="0"
          >
            <dic-tree
              dic-key="ast_asset_type"
              @node-click="astNodeClick"
            />
          </el-tab-pane>
          <el-tab-pane
            label="科室"
            name="1"
          >

            <department-tree @node-click="deptNodeClick" />
          </el-tab-pane>
          <el-tab-pane
            label="巡检单元"
            name="2"
          >
            <dic-tree
              dic-key="ins_unit_directory"
              @node-click="unitNodeClick"
            />

          </el-tab-pane>
        </el-tabs>

        <div class="main-content">
          <div class="top-box">
            <div class="search-box">
              <div class="search-item">
                <el-input
                  v-model="queryData.keyword"
                  :placeholder="placeholder"
                  prefix-icon="el-icon-search"
                />
              </div>
              <div class="search-item">
                <el-select
                  v-model="queryData.state"
                  placeholder="任务状态"
                >
                  <el-option
                    disabled
                    label="请选择"
                    value=""
                  />
                  <el-option
                    label="待巡检"
                    value="0"
                  />
                  <el-option
                    label="已超时"
                    value="1"
                  />
                </el-select>
              </div>
              <div class="search-item">
                <user-select
                  v-model="queryData.inspectUserIdList"
                  collapse-tags
                  multiple
                  placeholder="巡检人"
                  style="width: 100%"
                />
              </div>
              <div class="search-item">
                <pure-button
                  icon="search"
                  label="查询"
                  type="minor"
                  @click="onQuery"
                />
                <pure-button
                  icon="reset"
                  label="重置"
                  type="patch"
                  @click="onReset"
                />
              </div>
            </div>
            <div class="operate-box" />
          </div>
          <div class="table-box">
            <pure-table
              ref="pureTable"
              :current-row-key="currentTab"
              :list-api="listApi"
              :query-condition="queryData"
              :row-key="currentTab"
              :selection="selection"
              height="100%"
            >
              <template #header />
              <template #indexColumn>
                序号
              </template>
              <el-table-column
                v-for="item in tableColumn "
                :key="item.prop"
                :column-key="item.prop"
                :fixed="item.fixed"
                :label="item.label "
                :prop="item.prop"
                :width="item.width"
                show-overflow-tooltip
              >
                <template
                  v-if="item.prop==='state'||item.prop==='name'||item.prop==='unitName'"
                  #default="{row}"
                >
                  <template v-if="item.prop === 'unitName'">
                    <span
                      class="row-detail"
                      @click="onDetails(row)"
                    >
                      {{ row.unitName }}
                    </span>
                  </template>
                  <template v-if="item.prop === 'name'">
                    <span
                      class="row-detail"
                      @click="onDetails(row)"
                    >
                      {{ row.name }}
                    </span>
                  </template>
                  <template v-if="item.prop === 'state'">
                    <div v-if="row.state ===0">
                      <span class="badge-dot bg-yellow" />
                      待巡检
                    </div>
                    <div v-if="row.state ===1">
                      <span class="badge-dot bg-orange" />
                      已超时
                    </div>
                  </template>
                </template>

              </el-table-column>
              <template #operationColumn="{row}">
                <span
                  class="operate-btn"
                  @click="onEdit(row)"
                >去巡检</span>
                <span
                  class="operate-btn"
                  @click="onTransmit(row)"
                >转交</span>
              </template>
            </pure-table>
          </div>
        </div>
      </div>
    </TableLayout>
    <custom-drawer
      :title="dialogTitle"
      :visible.sync="showAddEditDialog"
      :wrapper-closable="false"
      size="65%"
      @closed="onDialogClosed"
    >
      <CompAddEdit
        ref="compAddEditRef"
        :current-data="currentData"
        :operate-type="operateType"
      />
      <template v-slot:footer>
        <div>
          <pure-button
            label="保存"
            @click="onSave"
          />
          <pure-button
            v-if="operateType === 'add'"
            label="保存并继续新增"
            type="major"
            @click="onSaveThenAdd"
          />
          <pure-button
            label="取消"
            type="patch"
            @click="onCancel"
          />
        </div>
      </template>
    </custom-drawer>
    <custom-drawer
      :title="detailsTitle"
      :visible.sync="showDetailsDialog"
      :wrapper-closable="false"
      size="45%"
    >
      <CompDetails
        ref="compDetailsRef"
        :current-data="detailsData"
      />
    </custom-drawer>

    <custom-drawer
      :visible.sync="showSelectUser"
      :wrapper-closable="false"
      size="60%"
      title="选择人员"
      @closed="onUserDialogClosed"
    >
      <CompSelectUser
        ref="compSelectUserRef"
        :selected-user="staffList"
      />
      <template v-slot:footer>
        <pure-button
          label="保存"
          @click="onSaveUser"
        />
        <pure-button
          label="取消"
          type="patch"
          @click="showSelectUser = false"
        />
      </template>
    </custom-drawer>
  </div>
</template>

<script>
import pageMixin from '@/mixins/page';
import CompAddEdit from './components/add-edit.vue';
import CompDetails from './components/details.vue';
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import TaskApi from './api';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import CompSelectUser from '@/features/system/otherConfig/components/select-user.vue';

export default {
  components: {
    CompSelectUser,
    UserSelect,
    DepartmentTree, DicTree,
    CompAddEdit,
    CompDetails,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      selection: true,
      listApi: TaskApi.taskAstList,
      currentTab: '0',
      placeholder: '资产名称/资产编号',
      tableColumn: [], // 列表头
      queryData: {},
      taskAstColumn: [
        {
          label: '资产名称',
          prop: 'name',
          fixed: true,
          width: 120,
        },
        {
          label: '资产编号',
          prop: 'assetsCode',
          width: 120,
        },
        {
          label: '规格型号',
          prop: 'model',
          width: 120,
        },
        {
          label: '任务开始时间',
          prop: 'inspectStartTime',
          width: 140,
        },
        {
          label: '任务结束时间',
          prop: 'inspectEndTime',
          width: 140,
        },
        {
          label: '资产所在位置',
          prop: 'place',
          width: 140,
        },
        {
          label: '使用科室',
          prop: 'useDeptName',
          width: 140,
        },
        {
          label: '巡检人',
          prop: 'inspectUserName',
          width: 140,
        },
        {
          label: '任务状态',
          prop: 'state',
          width: 140,
        },
      ],
      taskUnitColumn: [
        {
          label: '单元名称',
          prop: 'unitName',
          fixed: true,
          width: 120,
        },
        {
          label: '单元编号',
          prop: 'unitCode',
          width: 120,
        },
        {
          label: '任务开始时间',
          prop: 'inspectStartTime',
          width: 140,
        },
        {
          label: '任务结束时间',
          prop: 'inspectEndTime',
          width: 140,
        },
        {
          label: '单元所在位置',
          prop: 'unitAddress',
          width: 140,
        },
        {
          label: '使用科室',
          prop: 'useDepartName',
          width: 140,
        },
        {
          label: '巡检人',
          prop: 'inspectUserName',
          width: 140,
        },
        {
          label: '任务状态',
          prop: 'state',
          width: 140,
        },
      ],
      operateType: 'add',
      showAddEditDialog: false,
      showSelectUser: false, // 转交选人
      staffList: [], // 选择人员
      receiveTaskId: '',
      currentData: {},
      detailsData: {},
      detailsTitle: '查看',
      showDetailsDialog: false,
      loading: false,
    };
  },
  computed: {
    dialogTitle() {
      const titles = {
        add: '巡检',
        edit: '巡检',
      };
      return titles[this.operateType];
    },
  },
  mounted() {
    this.tableColumn = this.taskAstColumn;
    this.$nextTick(() => {
      this.$refs.pureTable.beforeFetchData = this.beforeFetchData;
      this.init();
    });
  },
  created() {
  },
  methods: {
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    beforeFetchData() {
      if (this.currentTab === '0' || this.currentTab === '1') {
        this.listApi = TaskApi.taskAstList;
      } else {
        // 巡检单元
        this.listApi = TaskApi.taskUnitList;
      }
    },
    tabChange(tab) {
      const tabIndex = tab.name;
      if (tabIndex === '0' || tabIndex === '1') {
        this.placeholder = '资产名称/资产编号';
        this.tableColumn = this.taskAstColumn;
      } else {
        this.placeholder = '单元名称/单元编号';
        this.tableColumn = this.taskUnitColumn;
      }
      this.$refs.pureTable.fetchData(1);
    },
    /* 资产节点点击 */
    astNodeClick(row) {
      this.queryData.assetsType = row.dictValue;
      this.onQuery();
    },
    /* 科室节点点击 */
    deptNodeClick(row) {
      this.queryData.useDept = row.deptId;
      this.onQuery();
    },
    /* 单元节点点击 */
    unitNodeClick(row) {
      this.queryData.directory = row.dictValue;
      this.onQuery();
    },
    /* 查询 */
    onQuery() {
      this.init();
    },
    /* 重置 */
    onReset() {
      this.queryData = {};
      this.init();
    },
    /* 转交 */
    onTransmit(row) {
      this.receiveTaskId = row.id;
      this.showSelectUser = true;
      this.$nextTick(() => {
        this.$refs.compSelectUserRef.toggleSelection(this.staffList);
      });
    },
    /* 关闭选择 */
    onUserDialogClosed() {
      this.$refs.compSelectUserRef.onReset();
    },
    /* 保存转交 */
    onSaveUser() {
      const selectedUser = this.$refs.compSelectUserRef.getSelectedUser();
      if (selectedUser.length !== 1) {
        this.$message.error('请选中一个用户');
        return false;
      }
      const params = {
        taskId: this.receiveTaskId,
        receiveUserId: selectedUser[0].userId,
      };
      TaskApi.transmit(params).then(() => {
        this.$message.success('操作成功');
        this.$refs.pureTable.fetchData(1);
        this.showSelectUser = false;
      });
    },
    /* 查看详情 */
    onDetails(data) {
      TaskApi.getInfo(data.id).then((res) => {
        const resData = res.data;
        this.detailsData = {
          ...resData,
        };
        this.showDetailsDialog = true;
      });
    },
    onEdit(data) {
      this.operateType = 'edit';
      TaskApi.getInfo(data.id).then((res) => {
        const resData = res.data;
        this.currentData = {
          ...resData,
        };
        this.showAddEditDialog = true;
      });
    },
    onCancel() {
      this.showAddEditDialog = false;
    },
    onDialogClosed() {
      this.$refs.compAddEditRef.reset();
    },
    submitData() {
      this.loading = true;
      const { valid, data, } = this.$refs.compAddEditRef.validate();
      if (valid) {
        TaskApi.editTask(data).then(() => {
          this.$notify.success('操作成功');
          this.$refs.pureTable.fetchData(1);
          if (this.continueAdd) {
            this.$refs.compAddEditRef.reset();
          } else {
            this.showAddEditDialog = false;
          }
        }).catch((err) => {
          this.$notify.error(err);
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
  },
};
</script>

<style lang='scss'
  scoped
>
.bg-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.badge-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  font-size: 12px;
  text-align: center;
}

.bg-yellow {
  background-color: #ffb800 !important;
  color: #fff !important;
}

.bg-orange {
  background-color: #ff5722 !important;
  color: #fff !important;
}

.row-detail {
  color: #006666;
  cursor: pointer;
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
