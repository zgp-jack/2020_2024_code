<template>
  <el-container>
    <el-main class="main">
      <pure-table
        ref="pureTable"
        :list-api="listApi"
        :query-condition="queryData"
        class="pureTable"
        selection
        @selection-change="onSelectionChange"
      >
        <template #header>
          <query-panel
            @query="onQuery"
            @reset="onReset"
          >
            <el-form-item>
              <el-select
                v-model="queryData.reading"
                placeholder="请选择是否已读"
                clearable
              >
                <el-option
                  :value="0"
                  label="否"
                />
                <el-option
                  :value="1"
                  label="是"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryData.time"
                format="yyyy-MM-dd"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="发送开始日期"
                end-placeholder="发送结束日期"
                @change="datePicker"
              />
            </el-form-item>
            <template #right>
              <pure-button
                :disabled="!selectionValue.length"
                label="标记已读"
                type=""
                @click="selectionFun"
              />
              <pure-button
                label="全部已读"
                type="major"
                @click="allSelectionFun"
              />
            </template>
          </query-panel>
        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          label="发送人"
          prop="sender"
          show-overflow-tooltip
        />
        <el-table-column
          label="发送时间"
          prop="sendingTime"
        />
        <el-table-column
          label="类型"
          prop="messageTypeName"
        />
        <el-table-column
          label="内容"
          prop="messageContent"
        />
        <el-table-column
          label="是否已读"
          prop="reading"
        >
          <template #default="{row}">
            <span :class="[row.reading === 1 ? 'readN': 'readY']">{{ row.reading | readF }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop=""
        >
          <template #default="{row}">
            <span class="operate-btn" @click="viewFun(row)">详情</span>
          </template>
        </el-table-column>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import pageMixin from '@/mixins/page';
import { getMessageList, batchRead, allRead, } from '../api';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import DrawerKnowledgeDetail from './detail.vue';
export default {
  components: {
    QueryPanel,
  },
  filters: {
    readF: (val) => {
      return val === 1 ? '是' : '否';
    },
  },
  mixins: [
    pageMixin,
  ],
  data() {
    return {
      listApi: getMessageList,
      tableData: [],
      loading: false,
      total: 0,
      queryData: {
        reading: '',
      },
      selectionValue: [],
    };
  },
  mounted() {
    // this.getListData();
    this.init();
  },
  methods: {
    viewFun(row, type) {
      batchRead(row.id);
      this.$store.dispatch('APP/UPDATE_MSGVALUE_ACTION');
      this.updateData();
      this.$drawer({
        width: '860px',
        component: () => <DrawerKnowledgeDetail data={row}
          onDone={this.cancel}
        />,
      });
    },
    cancel() {},
    allSelectionFun() {
      this.$confirm('确认标记全部已读?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        try {
          await allRead();
          this.$message({
            type: 'success',
            message: '操作成功！',
          });
          this.$store.dispatch('APP/UPDATE_MSGVALUE_ACTION');
          this.updateData();
        } catch (err) {
          this.$notify.error(err);
        }
      });
    },
    async selectionFun() {
      const params = this.selectionValue.map(item => {
        return item.id;
      });
      await batchRead(params.join(','));
      this.$message({
        type: 'success',
        message: '操作成功！',
      });
      this.$store.dispatch('APP/UPDATE_MSGVALUE_ACTION');
      this.updateData();
    },
    onSelectionChange(selection) {
      this.selectionValue = selection || [];
    },
    updateData() {
      this.$refs.pureTable.fetchData();
    },
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    datePicker(val) {
      if (val) {
        this.queryData.startDate = val[0] || '';
        this.queryData.endDate = val[1] || '';
      } else {
        this.queryData.endDate = '';
        this.queryData.startDate = '';
      }
    },
    onQuery() {
      this.init();
    },
    onReset() {
      this.queryData = {
        reading: '',
      };
      this.init();
    },
    getListData() {
      // const loading = this.showLoading();
      // const params = {
      //   pageNum: this.currentPage,
      //   pageSize: this.pageSize,
      // };
      // getOrderWarningList(params).then((data) => {
      //   const { rows, total, } = data;
      //   this.total = total;
      //   this.tableData = rows;
      // }).finally(() => {
      //   loading.close();
      // });
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
.readY {
  display: inline-block;
  padding: 2px 10px;
  color: #ff4949;
  background: #ffeded;
  border-color: #ffb6b6;
}
.readN {
  display: inline-block;
  padding: 2px 10px;
  color: #006666;
  background: #e6f0f0;
  border-color: #99c2c2;
}
.pureTable {
  padding: 0 16px;
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

    }
  }
}
.operate-btn {
  margin-right: 16px;
  font-size: 14px;
  color: #006666;
  cursor: pointer;

  &.delete {
    color: #ff836b;
  }
}
</style>
