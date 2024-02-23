<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 14:03:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-05-27 17:33:15
 * @Description:库存查询
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
            <el-form
              ref="form"
              size="mini"
              inline
            >
              <el-form-item label="所在科室">
                <department-cascader v-model="queryCondition.deptId" clearable @change="fetchData" />
              </el-form-item>
              <el-form-item label="供应商">
                <supplier-select v-model="queryCondition.supplier" clearable @change="fetchData" />
              </el-form-item>
            </el-form>
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
                  <span v-if="item.prop === 'price'">
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
import QueryApi from '@/apis/property/consumable/query';
import ApplyForReceive from '@/views/property/consumable/dialog/applyForReceive.vue';
import MinxinConsumable from '@/views/property/consumable/mixins/consumable';
import ConsumableApi from '@/apis/property/consumable';
import ConsumableRegister from '@/views/property/consumable/dialog/register.vue';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import SupplierSelect from '@/views/components/other/supplierSelect.vue';
import {
  find,
} from 'lodash';
export default {
  name: 'ZcHcglKccx',
  components: {
    DepartmentCascader,
    SupplierSelect,

  },
  mixins: [PaginationTable, MinxinConsumable],
  data() {
    return {
      listApi: QueryApi.list,
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
        label: '数量',
        prop: 'deptQuantity',
      }, {
        label: '安全库存',
        prop: 'securityNum',
      }, {
        label: '单价',
        prop: 'price',
      }, {
        label: '所在科室',
        prop: 'deptIdToName',
      }, {
        label: '供应商',
        prop: 'supplierToName',
      }, {
        label: '备注',
        prop: 'remark',
      }],
    };
  },
  async created() {
    this.fetchData();
  },
  methods: {
    async handleUpdate(row) {
      this.$drawer({
        width: '580px',
        component: () => <ConsumableRegister onDone={this.fetchData} operatorType='UPDATE' id={row.id}/>,
      });
    },
    async handleDelete(row) {
      await ConsumableApi.del(row.id);
      this.$message({
        type: 'success',
        message: '删除耗材成功！',
      });
      this.fetchData();
    },
    handleView(row) {
      this.$drawer({
        width: '580px',
        component: () => <ConsumableRegister onDone={this.fetchData} operatorType='VIEW' id={row.id}/>,
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
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>
