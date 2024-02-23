<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-19 11:16:51
 * @Description:我的工单
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <pure-button
              class="base-margin-right"
              label="通过"
              @click="multiPass"
            />
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="multipleTable"
              v-loading="loading"
              border
              align="left"
              :data="data"
              :max-height="tableMaxHeight"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" align="left" fixed />
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
                fixed
              />
              <el-table-column
                v-for="(item, index) in tableColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
                :width="item.width"
                :fixed="item.fixed"
              >
                <template slot-scope="{row}">
                  <div v-if="item.prop ==='recording'">
                    <my-audio
                      v-if="row.recording"
                      :key="row.recording"
                      :the-url="row.recording"
                    />
                  </div>
                  <span v-else-if="item.prop === 'type'" :class="'phoneState-'+row.type">
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
                  <span v-else-if="item.prop ==='source'">
                    {{ row[item.prop] | source }}
                  </span>
                  <span v-else-if="item.prop ==='degree'" :class="'degree--'+row.degree">
                    {{ row[item.prop] | degree }}
                  </span>
                  <span v-else-if="item.prop ==='rangeType'">
                    {{ row[item.prop] | range }}
                  </span>
                  <span v-else-if="item.prop ==='faultType'">
                    {{ row[item.prop] | faultTypes }}
                  </span>
                  <span v-else-if="item.prop ==='processState'" :class="'state--'+row.processState">
                    {{ row[item.prop] | orderState }}
                  </span>
                  <span v-else-if="item.prop==='faultRemark'">
                    <linked-button
                      v-if="row.hurryCount"
                      :type="1"
                      :count="row.hurryCount"
                      @click="onViewLinkedList(row, 1)"
                    />
                    <linked-button
                      v-if="row.repeatCount"
                      :count="row.repeatCount"
                      :type="2"
                      @click="onViewLinkedList(row,2)"
                    />
                    <linked-button
                      v-if="row.revokeCount"
                      :count="row.revokeCount"
                      :type="3"
                      @click="onViewLinkedList(row,3)"
                    />
                    <el-tooltip content="点击查看主工单" placement="top">
                      <pure-tag
                        v-if="row['orderNum'].includes('#')"
                        :label="'协'"
                        @click="onViewTicket(row.parentOrderNum)"
                      />
                    </el-tooltip>
                    {{ row[item.prop] }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="196" fixed="right">
                <template slot-scope="{row}">

                  <pure-button
                    type="text"
                    label="通过"
                    @click="handlePass(row)"
                  />
                  <pure-button
                    type="text"
                    label="未通过"
                    @click="handleUnpass(row)"
                  />
                  <pure-button
                    type="text"
                    label="查看"
                    @click="onViewTicket(row.orderNum)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>
    </el-main>

  </el-container>
</template>
<script>
import { passWorkOrder, } from '@/apis/reportFault/examine';
import MyAudio from '@/components/audio';
import NotPass from '../sharedComponents/dialog/notPass';
import PaginationTable from '@/minxins/common/paginationTable';
import TicketExamineApi from '@/apis/reportFault/examine';
import TicketMixin from '../mixin';
export default {
  name: 'BzGdsh',
  components: {
    MyAudio,
  },
  mixins: [PaginationTable, TicketMixin],
  data() {
    return {
      templateType: 11,
      tableColumn: [],
      selectData: null,
      multipleSelection: [],
      currentSelectOrderNum: null,
      listApi: TicketExamineApi.list,
    };
  },
  computed: {
    examineTableColumn() {
      return this.$store.state['reportFault/center'].examineTableColumn;
    },
  },
  created() {
    this.tableColumn = this.examineTableColumn;
    this.fetchData();
  },
  methods: {
    multiPass() {
      console.log(this.$refs['multipleTable'].selection);
      const orderNum = this.$refs['multipleTable'].selection
        .map((item) => item['orderNum'])
        .join(',');
      passWorkOrder({ orderNum, }).then((res) => {
        this.fetchData();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handlePass(row) {
      this.currentSelectOrderNum = row['orderNum'];
      passWorkOrder({ orderNum: this.currentSelectOrderNum, }).then((res) => {
        this.fetchData();
        this.currentSelectOrderNum = null;
      });
    },
    handleUnpass(row) {
      this.$dialog({
        title: '审核信息',
        width: '536px',
        top: '32vh',
        position: 'center',
        component: () => <NotPass orderNum={row['orderNum']} onDone={this.fetchData} />,
      });
    },
  },

};
</script>

<style lang='scss' scoped>

@import "~@/styles/ticket.scss";
</style>
