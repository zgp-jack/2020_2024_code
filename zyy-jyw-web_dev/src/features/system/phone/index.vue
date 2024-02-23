<template>
  <hyy-view-layout>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onRest"
      >
        <!-- <el-form-item>
          <el-date-picker
            v-model="queryData.time"
            end-placeholder="创建时间"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="创建时间"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="changeTime"
          />
        </el-form-item> -->
        <el-form-item>
          <el-input
            v-if="handleType === 1"
            v-model="queryData.phone"
            placeholder="请输入科室电话"
            prefix-icon="el-icon-search"
          />
          <el-input
            v-else
            v-model="queryData.ipAddress"
            placeholder="请输入科室IP"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <template #right>
          <el-form-item>
            <pure-button
              v-show="handleType === 1"
              v-auth="'system:dept:phone:add'"
              icon="add"
              label="新增"
              type="special"
              @click="onAddPhone"
            />
            <pure-button
              v-show="handleType === 2"
              v-auth="'system:dept:ip:add'"
              icon="add"
              label="新增"
              type="special"
              @click="onAddIP"
            />
            <!-- <pure-button
              icon="upload"
              label="导入"
              type="major"
              @click="onExport"
            /> -->
          </el-form-item>
        </template>
        <template #extra>
          <el-radio-group
            v-model="handleType"
            size="small"
            @change="changeHandleType"
          >
            <el-radio-button :label="1">电话簿</el-radio-button>
            <el-radio-button :label="2">IP</el-radio-button>
          </el-radio-group>
        </template>
      </query-panel>
    </template>
    <template #aside>
      <department-tree @node-click="choseDepartmentTree" />
    </template>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryData"
      @selection-change="onSelectionChange"
    >
      <template #indexColumn>
        序号
      </template>
      <el-table-column
        v-for="item in tableColumn"
        :key="item.prop"
        :column-key="item.prop"
        :fixed="item.fixed"
        :formatter="item.formatter"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
      />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <div v-show="handleType === 1">
            <pure-button
              v-auth="'system:dept:phone:edit'"
              label="修改"
              type="text"
              @click="onEditPhone(row)"
            />
            <pure-button
              v-auth="'system:dept:phone:remove'"
              label="删除"
              text-color="warning"
              type="text"
              @click="onDelPhone(row)"
            />
          </div>
          <div v-show="handleType === 2">
            <pure-button
              v-auth="'system:dept:ip:edit'"
              label="修改"
              type="text"
              @click="onEditIP(row)"
            />
            <pure-button
              v-auth="'system:dept:ip:remove'"
              label="删除"
              text-color="warning"
              type="text"
              @click="onDelIP(row)"
            />
          </div>
        </template>
      </el-table-column>
      <!-- <template #leftFooter>
        <el-checkbox
          v-model="allChecked"
          :indeterminate="allCheckedIndeterminate"
          border
          label="全选"
          size="small"
          @change="onToggelAllCheck"
        />
        <el-button
          :disabled="!selectionValue.length"
          class="base-margin-left"
          icon="el-icon-delete"
          size="small"
          @click="onBatchDel"
        >批量删除
        </el-button>
        <span class="checked-num base-margin-left">已选：{{ selectionValue.length }}条</span>
      </template> -->
    </pure-table>
  </hyy-view-layout>
</template>

<script>
import { debounce, } from 'lodash-es';
import pageMixin from '@/mixins/page';
import ApproveApi from './api';
import PureButton from '@/common/components/button/index.vue';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DepartmentTree from '@/features/system/departmentManagement/components/departmentTree.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import PhoneDialog from './components/phoneDialog.vue';
export default {
  filters: {
    dept: (val) => {
      return val || '-';
    },
  },
  components: {
    DepartmentTree,
    QueryPanel,
    PureButton,
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      listApi: ApproveApi.getPhoneBook,
      queryData: {
        phone: '',
        ipAddress: '',
        beginTime: '',
        endTime: '',
        time: [],
      },
      formData: {},
      handleType: 1, // 1 电话簿  2 IP
      selectionValue: [],
      allChecked: false,
      allCheckedIndeterminate: false,
      operateType: 'add',
      tableColumn: [],
      phoneTableColumn: [
        {
          label: '科室电话',
          prop: 'phone',
          fixed: true,
        },
        {
          label: '联系人',
          prop: 'contacts',
          fixed: true,
        },
        {
          label: '所属科室',
          prop: 'deptName',
          fixed: true,
        },
      ],
      ipTableColumn: [
        {
          label: '科室IP',
          prop: 'ipAddress',
          fixed: true,
        },
        {
          label: '所属科室',
          prop: 'deptName',
          fixed: true,
        },
      ],
    };
  },
  computed: {
    dialogTitle() {
      return this.operateType === 'edit' ? '编辑' : '新增';
    },
    saveBtnText() {
      return this.operateType === 'edit' ? '确认修改' : '确认';
    },
  },
  created() {
  },
  mounted() {
    this.tableColumn = this.phoneTableColumn;
    this.init();
  },
  methods: {
    changeHandleType: debounce(function (val) {
      this.handleType = val;
      if (val === 1) {
        this.tableColumn = this.phoneTableColumn;
        this.listApi = ApproveApi.getPhoneBook;
      } else {
        this.tableColumn = this.ipTableColumn;
        this.listApi = ApproveApi.getIpAddress;
      }
      // 此处处理切换tab时，表格数据出现异步的问题
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    }, 300),
    changeTime(time) {
      this.queryData['endTime'] = time ? time[1] : '';
      this.queryData['beginTime'] = time ? time[0] : '';
    },
    onQuery() {
      this.$refs.pureTable.onSearch();
    },
    onRest() {
      this.queryData = {
        phone: '',
        ipAddress: '',
        beginTime: '',
        endTime: '',
        time: [],
      };
      this.$nextTick(() => {
        this.init();
      });
    },
    // 选中部门树
    choseDepartmentTree(node) {
      this.queryData.deptId = node?.deptId || null;
      this.init();
    },
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    cancel() {
      this.$refs.pureTable.fetchData();
    },
    onAddPhone() {
      const confirmApi = ApproveApi.submitPhone;
      this.$dialog({
        width: pxToPercentage(700),
        component: () => <PhoneDialog
          confirmFn={confirmApi}
          // data={row}
          onDone={this.cancel}
          title={'新增'}
          handleType={this.handleType}
        />,
      });
    },
    onAddIP() {
      const confirmApi = ApproveApi.submitIpAddress;
      this.$dialog({
        width: pxToPercentage(700),
        component: () => <PhoneDialog
          confirmFn={confirmApi}
          // data={row}
          onDone={this.cancel}
          title={'新增'}
          handleType={this.handleType}
        />,
      });
    },
    onEditPhone(row) {
      const confirmApi = ApproveApi.updatePhoneBook;
      this.$dialog({
        width: pxToPercentage(700),
        component: () => <PhoneDialog
          confirmFn={confirmApi}
          data={row}
          onDone={this.cancel}
          title={'编辑'}
          handleType={this.handleType}
        />,
      });
    },
    onEditIP(row) {
      const confirmApi = ApproveApi.updateIpAddress;
      this.$dialog({
        width: pxToPercentage(700),
        component: () => <PhoneDialog
          confirmFn={confirmApi}
          data={row}
          onDone={this.cancel}
          title={'编辑'}
          handleType={this.handleType}
        />,
      });
    },

    onSelectionChange(selection) {
      this.selectionValue = selection || [];
      if (selection.length === 0) {
        this.allChecked = false;
        this.allCheckedIndeterminate = false;
      } else if (selection.length < this.$refs.pureTable.data.length) {
        this.allChecked = false;
        this.allCheckedIndeterminate = true;
      } else {
        this.allChecked = true;
        this.allCheckedIndeterminate = false;
      }
    },
    onToggelAllCheck(checked) {
      this.$refs.pureTable.$refs.table.toggleAllSelection();
    },
    deleteFun() {
      this.$refs.pureTable.onDel();
    },
    onDelPhone(row) {
      this.$confirm('此操作将删除选中科室电话薄, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ApproveApi.delPhoneBook(row.id);
            this.deleteFun();
            this.$notify.success('删除成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }).catch(() => {
        });
    },
    onDelIP(row) {
      this.$confirm('此操作将删除选中科室IP, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            await ApproveApi.delIpAddress(row.id);
            this.deleteFun();
            this.$notify.success('删除成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }).catch(() => {
        });
    },
    onBatchDel() {
      if (!this.selectionValue.length) {
        this.$message.error('请至少选中一个用户');
        return false;
      }
      const userIds = this.selectionValue.map(item => item.userId);
      this.$confirm('此操作将删除选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            if (this.handleType === 1) {
              await ApproveApi.delPhoneBook(userIds.join(','));
            } else {
              await ApproveApi.delIpAddress(userIds.join(','));
            }
            this.cancel();
            this.$notify.success('删除成功!');
          } catch (err) {
            this.$notify.error(err);
          }
        }).catch(() => {
        });
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.checked-num {
  font-size: 14px;
  font-weight: 400;
  color: #799F9F;
}
</style>
