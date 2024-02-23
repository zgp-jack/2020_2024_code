<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 10:55:18
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-17 11:23:34
 * @Description:耗材申领
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="耗材申领" @click="handleApplyWithdraw" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              border
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
              />
              <el-table-column
                v-for="(item,index) in tableHeader"
                :key="index+item.prop"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <span v-if="item.prop === 'supplier'">
                    {{ convertSupplier(row.supplier) }}
                  </span>
                  <span v-else-if="item.prop === 'price'">
                    {{ row.price + '元' }}
                  </span>
                  <span v-else-if="item.prop === 'createTime'">
                    {{ row[item.prop]|timestamp }}
                  </span>

                  <span v-else-if="item.prop==='reviewTime'">
                    {{ row.reviewTime | timestamp }}
                  </span>
                  <span v-else-if="item.prop==='state'" :style="{color: color(row.state)}">
                    {{ convertState(row.state) }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="177">
                <template slot-scope="{row}">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleView(row)"
                  >查看</el-button>
                  <el-button
                    v-if="row.state===0"
                    size="mini"
                    type="text"
                    @click="handleUpdate(row)"
                  >编辑</el-button>
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
const _colorConfig = [{
  field: '2',
  color: 'f56c6c',
  memo: '红色',
}, {
  field: '3',
  color: '67c23a',
  memo: '绿色',
}];
const STATE_MAP = {
  0: '草稿',
  1: '待审批',
  2: '驳回',
  3: '通过',
};
import PaginationTable from '@/minxins/common/paginationTable';
import ReceiveApi from '@/apis/property/consumable/receive';
import ApplyForReceive from '@/views/property/consumable/dialog/applyForReceive.vue';
import ThirdPartApi from '@/apis/thirdPart';
import MinxinConsumable from '@/views/property/consumable/mixins/consumable';
import {
  find,
} from 'lodash';
export default {
  name: 'ZcHcglHcsl',
  mixins: [PaginationTable, MinxinConsumable],
  data() {
    return {
      listApi: ReceiveApi.list,
      supplierList: [],
      tableHeader: [{
        label: '申领单号',
        prop: 'serialNum',
      }, {
        label: '申请时间',
        prop: 'createTime',
      }, {
        label: '申请科室',
        prop: 'applyDeptToName',
      }, {
        label: '提供科室',
        prop: 'outDeptToName',
      }, {
        label: '申请人',
        prop: 'createUserToName',
      }, {
        label: '状态',
        prop: 'state',
      }, {
        label: '审批人',
        prop: 'reviewUserToName',
      }, {
        label: '审批时间',
        prop: 'reviewTime',
      }, {
        label: '审批意见',
        prop: 'reviewRemark',
      }],
    };
  },
  async created() {
    this.supplierList = await ThirdPartApi.supplierList();
    this.fetchData();
  },
  methods: {
    async handleUpdate(row) {
      this.$drawer({
        width: '1688px',
        component: () => <ApplyForReceive onDone={this.fetchData} operatorType='UPDATE' id={row.id}/>,
      });
    },
    handleView(row) {
      this.$drawer({
        width: '1688px',
        component: () => <ApplyForReceive onDone={this.fetchData} operatorType='VIEW' id={row.id}/>,
      });
    },
    convertSupplier(id) {
      return find(this.supplierList, { id, })?.name;
    },
    convertState(state) {
      return STATE_MAP[state];
    },
    color(text) {
      let rs = find(_colorConfig, (v, i) => {
        return v.field.includes(text.toString());
      });
      if (!rs) {
        rs = {
          color: '2D405E',
        };
      }
      return `#${rs.color}`;
    },
    handleApplyWithdraw() {
      this.$drawer({
        width: '1688px',
        component: () => <ApplyForReceive onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
