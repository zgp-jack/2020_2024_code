<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-30 18:11:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-17 11:03:47
 * @Description:资产处置
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
            <pure-button label="处置申请" @click="handleCreate" />
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
                :key="index"
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
                  <span v-else-if="item.prop === 'assetsMakeType'">
                    {{ row[item.prop]|dicValueToKey('assetsMakeType') }}
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
import PaginationTable from '@/minxins/common/paginationTable';
import DisposalsApi from '@/apis/property/propertyManagement/disposals';
import Disposals from '@/views/property/propertyManagement/propertyDisposals/dialog/disposals.vue';

import {
  find,
} from 'lodash';
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
export default {
  name: 'ZcZcglZccz',
  mixins: [PaginationTable],
  data() {
    return {
      listApi: DisposalsApi.list,
      tableHeader: [],
    };
  },

  async created() {
    this.tableHeader = this.$store.state['property/propertyManagement'].disposalsTableColumn;
    this.fetchData();
  },
  methods: {
    handleView(row) {
      this.$drawer({
        width: '1688px',
        component: () => <Disposals onDone={this.fetchData} id={row.id} operatorType='VIEW'/>,
      });
    },
    handleCreate() {
      this.$drawer({
        width: '1688px',
        component: () => <Disposals onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
    handleUpdate(row) {
      this.$drawer({
        width: '1688px',
        component: () => <Disposals onDone={this.fetchData} id={row.id} operatorType='UPDATE'/>,
      });
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
  },
};
</script>

<style lang="scss" scoped>
</style>

