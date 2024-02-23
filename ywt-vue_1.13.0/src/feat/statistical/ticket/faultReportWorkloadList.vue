<template>
  <el-container v-loading="loading">
    <el-main ref="main">
      <div ref="pureTop" class="pure-top">
        <div class="content">
          <el-row type="flex" align="middle">
            <el-col :span="12" :offset="0">
              <span class="title">{{ queryData.title || '' }}</span>
            </el-col>
            <el-col :span="12" style="text-align:right">
              <el-button
                size="mini"
                style="margin-right:48px"
                icon="el-icon-download"
                :disabled="downButtonDisable"
                @click="onDownExcel"
              />
            </el-col>

          </el-row>
        </div>
      </div>
      <div ref="tableWrapper" class="tableWrapper">
        <el-table
          ref="pureTable"
          class="table"
          :data="tableData"
          :max-height="tableMaxHeight"
        >
          <el-table-column
            v-for="(item, index) in filteredColumns"
            :key="index"
            :label="item.label"
            :prop="item.prop"
          >

            <template #default="{row}">
              <div v-if="item.prop === 'recording'">
                <my-audio
                  v-if="row.recording"
                  :key="row.recording"
                  :the-url="row.recording"
                />
                <span v-else>无录音信息</span>
              </div>
              <span
                v-else-if="item.prop === 'type'"
                :class="'call-type--' + row.type"
              >
                {{ row[item.prop] | phoneState }}
              </span>
              <div v-else-if="item.prop === 'linkedType'">
                <pure-button
                  v-if="row[item.prop]"
                  type="text"
                  :label="convertLinkedLabel(row[item.prop])"
                  @click="onViewTicket(row.linkedCode)"
                />
              </div>
              <span v-else-if="item.prop === 'source'">
                {{ row[item.prop] | source }}
              </span>
              <span
                v-else-if="item.prop === 'degree'"
                :class="'degree--' + row.degree"
              >
                {{ row[item.prop] | degree }}
              </span>
              <span v-else-if="item.prop === 'dealType'">
                {{ row[item.prop] | callRecordDealType }}
              </span>
              <span v-else-if="item.prop === 'rangeType'">
                {{ row[item.prop] | range }}
              </span>
              <span
                v-else-if="item.prop === 'currState'"
                :class="'state--' + row.currState"
              >
                {{ row[item.prop] | ticketState }}
              </span>
              <span v-else-if="item.prop === 'faultRemark'">
                <linked-button
                  v-if="row.hurryCount"
                  :type="1"
                  :count="row.hurryCount"
                  @click="onViewLinkedCallRecord(row, 1)"
                />
                <linked-button
                  v-if="row.repeatCount"
                  :count="row.repeatCount"
                  :type="2"
                  @click="onViewLinkedCallRecord(row, 2)"
                />
                <linked-button
                  v-if="row.revokeCount"
                  :count="row.revokeCount"
                  :type="3"
                  @click="onViewLinkedCallRecord(row, 3)"
                />
                <el-tooltip content="点击查看主工单" placement="top">
                  <pure-tag
                    v-if="row['orderNum'].includes('#')"
                    :label="'协'"
                    @click="onViewTicket(row.parentOrderNum)"
                  />
                </el-tooltip>
                {{ row[item.prop] | faultRemarkFormatter }}
              </span>
              <span v-else>
                {{ row[item.prop] }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="{row}">
              <pure-button
                type="text"
                label="查看"
                @click="onViewTicket(row.orderNum)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div ref="footer" class="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

    </el-main>
  </el-container>
</template>

<script>

import TicketMixin from '@/feat/ticket/mixin.js';
import TicketApi from '@/feat/statistical/ticket/api.js';
import MyAudio from '@/components/audio/audio';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import PureTag from '@/components/tag/tag.vue';

import {
  ticketState,
  callRecordDealType,
  faultRemarkFormatter,
} from '@/feat/ticket/filter.js';
import downLoadFile from '@/utils/downLoad';
import { mapState, } from 'vuex';
export default {
  name: 'FalutReportWorkLoadList',
  filters: {
    ticketState,
    callRecordDealType,
    faultRemarkFormatter,
  },
  components: {
    MyAudio,
    LinkedButton,
    PureTag,
  },
  mixins: [TicketMixin],
  data() {
    return {
      total: 0,
      // 每页显示条目个数
      pageSize: 10,
      // 每页显示个数选择器的选项设置
      pageSizes: [10, 20, 30, 40],
      // 当前页数
      currentPage: 0,
      // 页码按钮的数量，当总页数超过该值时会折叠
      pagerCount: 7,
      layout: 'total, sizes, prev, pager, next, jumper',
      loading: false,

      downButtonDisable: false,
      tableData: [],
      tableMaxHeight: 0,
      query: {
        title: '',
        startTime: null,
        endTime: null,
        type: null,
        id: null,
        status: null,
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  computed: {
    filteredColumns() {
      return this.ticketTableColumn.filter(item => item.checked).map(item => {
        return item;
      });
    },
    ticketTableColumn() {
      return this.$store.state.ticketMine.ticketTableColumn;
    },
    ...mapState('statistical/index', ['queryData']),
  },
  mounted() {
    this.loading = true;
    this.query = {
      ...this.queryData,
    };
    this.$nextTick(() => {
      this.tableMaxHeight = this.$refs.main.$el.clientHeight - this.$refs.pureTop.clientHeight - 16 - this.$refs.footer.clientHeight;

      this.init();
    });
  },
  methods: {
    async onDownExcel() {
      if (this.queryData.title === '') {
        this.$message.error('暂无对应的数据');
        return;
      }
      const load = this.$loading({
        lock: true,
        text: '正在导出...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        this.downButtonDisable = true;
        const res = await TicketApi.faultReportWorkloadListExport(this.queryData);
        const fileName = `${this.queryData.title || '统计'}.xlsx`;
        downLoadFile(res.url, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
        load.close();
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryData.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryData.pageNum = val;
      this.init();
    },
    async init() {
      if (this.queryData.title) {
        const res = await TicketApi.faultReportWorkloadList(this.queryData);
        this.total = res.total;
        this.tableData = res.list;
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    onQuery() {

    },
  },
};
</script>

<style lang="scss" scoped>
.pure-top {
  .title {
    font-size: 24px;
    margin-right: 48px;
  }
  height: 64px;
  background: #ffffff;
  width: calc(100% + 12px);
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  padding-top: 16px;
  z-index: 50;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.tableWrapper{
  background: #fff;
}

.footer{
    display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
  ::v-deep .el-pagination {
    padding:16px 0;
  }
}
 .table{
  margin-top: 70px;
 }
</style>
