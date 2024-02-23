<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-15 15:49:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-03 10:32:10
 * @Description:审批管理
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <el-row class="base-margin-top base-margin-left">
            <pure-btn-group :options="btnOptions" default-active="资产转移" @change="handleTabChange" />
          </el-row>
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
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
                width="78px"
              />
              <el-table-column
                v-for="(item,index) in tableHeader"
                :key="item.prop+index"
                :label="item.name"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <span v-if="item.prop === 'assetsType'">
                    {{ row[item.prop]|dicValueToKey('assetsType') }}
                  </span>
                  <span v-else-if="item.prop === 'manufacturer'">
                    {{ row[item.prop]|dicValueToKey('manufacturer') }}
                  </span>
                  <span v-else-if="item.prop === 'backTime'">
                    {{ row[item.prop]|timestamp }}
                  </span>
                  <span v-else-if="item.prop === 'createTime'">
                    {{ row[item.prop]|timestamp }}
                  </span>
                  <span v-else-if="item.prop === 'assetsMakeType'">
                    {{ row[item.prop]|dicValueToKey('assetsMakeType') }}
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
                    v-if="hasApprovePermission&&row.state===1"
                    size="mini"
                    type="text"
                    @click="handleApprove(row)"
                  >审批</el-button>
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
import PaginationTable from '@/minxins/common/paginationTable';
import PropertyTransferApi from '@/apis/property/propertyManagement/transfer';
import PropertyBorrowApi from '@/apis/property/propertyManagement/borrow';
import PropertyDisposalsApi from '@/apis/property/propertyManagement/disposals';
import ConsumableDepositApi from '@/apis/property/consumable/deposit';
import ConsumableWithdrawApi from '@/apis/property/consumable/withdraw';
import ConsumableReceiveApi from '@/apis/property/consumable/receive';
import PureBtnGroup from '@/components/button/buttonGroup.vue';
import Approve from './dialog/approve.vue';
import {
  find,
} from 'lodash';
import {
  mapGetters,
} from 'vuex';
const STATE_MAP = {
  0: '草稿',
  1: '待审批',
  2: '驳回',
  3: '通过',
};
const _colorConfig = [{
  field: '2',
  color: 'f56c6c',
  memo: '红色',
}, {
  field: '3',
  color: '67c23a',
  memo: '绿色',
}];
const MODULES = {
  '资产转移': {
    label: 'PropertyTransfer',
  },
  '资产借用': {
    label: 'PropertyBorrow',
  },
  '资产处置': {
    label: 'PropertyDisposals',
  },
  '耗材入库': {
    label: 'ConsumableDeposit',
  },
  '耗材出库': {
    label: 'ConsumableWithdraw',
  },
  '耗材申领': {
    label: 'ConsumableReceive',
  },
};
export default {
  name: 'ZcSpgl',
  components: {
    PureBtnGroup,
  },
  mixins: [PaginationTable],
  data() {
    return {
      searchValue: '',
      currentTabName: '资产转移',
      moduleName: 'PropertyTransfer',
      btnOptions: [{
        count: null,
        name: '资产转移',
      }, {
        count: null,
        name: '资产借用',
      }, {
        count: null,
        name: '耗材入库',
      }, {
        count: null,
        name: '耗材出库',
      }, {
        count: null,
        name: '耗材申领',
      }],
      hasApprovePermission: false,
    };
  },
  computed: {
    tableHeader() {
      let result = [];
      switch (this.currentTabName) {
        case '资产转移':
          result = this.$store.state['property/propertyManagement'].transferTableColumn;
          break;
        case '资产借用':
          result = this.$store.state['property/propertyManagement'].borrowTableColumn;
          break;
        case '资产处置':
          result = this.$store.state['property/propertyManagement'].disposalsTableColumn;
          break;
        case '耗材入库':
          result = this.$store.state['property/consumableManagement'].depositTableColumn;
          break;
        case '耗材出库':
          result = this.$store.state['property/consumableManagement'].withdrawTableColumn;
          break;
        case '耗材申领':
          result = this.$store.state['property/consumableManagement'].receiveTableColumn;
          break;
      }
      return result;
    },
    listApi() {
      let result = null;
      switch (this.currentTabName) {
        case '资产转移':
          result = PropertyTransferApi.list;

          break;
        case '资产借用':
          result = PropertyBorrowApi.list;
          break;
        case '资产处置':
          result = PropertyDisposalsApi.list;
          break;
        case '耗材入库':
          result = ConsumableDepositApi.list;
          break;
        case '耗材出库':
          result = ConsumableWithdrawApi.list;
          break;
        case '耗材申领':
          result = ConsumableReceiveApi.list;
          break;
      }
      return result;
    },
    ...mapGetters(['userInfo']),
  },

  async created() {
    this.queryCondition.isReview = 1;
    this.fetchData();
    this.hasApprovePermission = this.userInfo.permissions.includes('RESOURCE_AUDIT');
  },
  methods: {
    async handleApprove(row) {
      this.$drawer({
        width: '1688px',
        component: () => <Approve id={row.id} onDone={this.fetchData} module={MODULES[this.currentTabName].label}/>,
      });
    },
    async handleView(row) {
      this.$drawer({
        width: '1688px',
        component: () => <Approve id={row.id} operatorType='VIEW' module={MODULES[this.currentTabName].label}/>,
      });
    },
    handleTabChange(tabName) {
      this.currentTabName = tabName;
      this.fetchData();
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
    convertState(state) {
      return STATE_MAP[state];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
