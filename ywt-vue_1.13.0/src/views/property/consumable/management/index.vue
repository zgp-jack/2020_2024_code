<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-08 17:48:43
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-17 11:06:15
 * @Description:耗材登记
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
            <pure-button label="添加耗材" @click="handleRegister" />
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
                  <span v-else-if="item.prop === 'patrolTemp'">
                    {{ convertInspectionTemId(row[item.prop]) }}
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
                    size="mini"
                    type="text"
                    @click="handleUpdate(row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="handleDelete(row)"
                  >
                    <el-button
                      slot="reference"
                      size="medium"
                      type="text"
                      style="margin-left: 10px"
                    >删除</el-button>
                  </el-popconfirm>
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
import ConsumableApi from '@/apis/property/consumable';
import ConsumableRegister from '@/views/property/consumable/dialog/register.vue';
import ThirdPartApi from '@/apis/thirdPart';
import MinxinConsumable from '@/views/property/consumable/mixins/consumable';
import {
  find,
} from 'lodash';
export default {
  name: 'ZcHcglHcgl',
  mixins: [PaginationTable, MinxinConsumable],
  data() {
    return {
      supplierList: [],
      listApi: ConsumableApi.list,
      tableHeader: [{
        label: '耗材名称',
        prop: 'name',
      }, {
        label: '规格型号',
        prop: 'model',
      }, {
        label: '单位',
        prop: 'unit',
      }, {
        label: '安全库存',
        prop: 'securityNum',
      }, {
        label: '单价',
        prop: 'price',
      }, {
        label: '供应商',
        prop: 'supplier',
      }, {
        label: '备注',
        prop: 'remark',
      }],
    };
  },

  async created() {
    this.supplierList = await ThirdPartApi.supplierList();
    this.fetchData();
  },
  methods: {
    async handleDelete(row) {
      await ConsumableApi.del(row.id);
      this.$message({
        type: 'success',
        message: '删除耗材成功！',
      });
      this.fetchData();
    },
    async handleUpdate(row) {
      this.$drawer({
        width: '580px',
        component: () => <ConsumableRegister onDone={this.fetchData} operatorType='UPDATE' id={row.id}/>,
      });
    },
    handleView(row) {
      this.$drawer({
        width: '580px',
        component: () => <ConsumableRegister onDone={this.fetchData} operatorType='VIEW' id={row.id}/>,
      });
    },
    convertSupplier(id) {
      return find(this.supplierList, { id, })?.name;
    },
    handleRegister() {
      this.$drawer({
        width: '580px',
        component: () => <ConsumableRegister onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

