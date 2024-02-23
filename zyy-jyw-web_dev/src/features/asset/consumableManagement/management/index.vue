/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description 耗材管理
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container>
    <el-aside
      class="aside"
      width="320px"
    >
      <dic-tree
        dic-key="ast_consumable_type"
        @node-click="clickTree"
      />
    </el-aside>
    <el-main>
      <pure-table
        ref="pureTable"
        :list-api="listApi"
        :query-condition="queryData"
        class="pureTable"
        selection
        @selection-change="handleSelectionChange"
      >
        <template #header>
          <query-panel @query="onQuery" @reset="onReset">
            <el-form-item>
              <el-input v-model="queryData.keyword" placeholder="耗材名称/规格型号" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryData.reserveState" placeholder="库存情况">
                <el-option
                  v-for="item in consumableReserveStateList"
                  :key="item.state"
                  :label="item.label"
                  :value="item.state"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <company-select v-model="queryData.supplierId" placeholder="供应商" />
            </el-form-item>
            <template #right>
              <el-dropdown @command="handleCommand">
                <pure-button
                  icon="arrow-down"
                  label="耗材登记"
                />

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="register">单耗材登记</el-dropdown-item>
                  <el-dropdown-item command="import">耗材导入</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </query-panel>

          <div class="base-margin-bottom">

            <pure-button
              label="申领"
              type="patch"
              @click="toApply"
            />
            <pure-button
              label="入库"
              type="major"
              @click="enterWarehouse"
            />
            <pure-button
              label="出库"
              type="major"

              @click="outWarehouse"
            />
            <pure-button
              :disabled="!selectionValues.length"
              label="删除"
              type="minor"
              @click="del"
            />
          </div>

        </template>
        <el-table-column
          label="名称"
          prop="name"
        >
          <template #default="{row}">
            <pure-button
              :label="row.name"
              type="text"
              @click="onDetail(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="规格型号"
          prop="model"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="实际库存"
          prop="realReserve"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="冻结库存"
          prop="frostReserve"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="可用库存"
          prop="usefulReserve"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="单价"
          prop="price"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="供应商"
          prop="supplierName"
        >
          <!--          -->
        </el-table-column>

        <el-table-column
          label="操作"
          prop=""
        >
          <template #default="{row}">
            <pure-button
              label="编辑"
              @click="edit(row)"
            />
          </template>
        </el-table-column>
      </pure-table>
    </el-main>
  </el-container>
</template>
<script>
import DicTree from '@/features/system/dataDictionary/components/dicTree.vue';
import QueryPanel from '@/common/components/query/queryPanel.vue';
import CompanySelect from '@/features/system/thirdParty/components/selectCompany.vue';
import PureButton from '@/common/components/button/index.vue';
import DrawerConsumableRegister from './drawer/register.vue';
import DrawerEnterWarehouse from './drawer/enterWarehouse.vue';
import DrawerOutWarehouse from './drawer/outWarehouse.vue';
import ConsumableApi from './api.js';
import DrawerDetail from './drawer/detail.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import DialogUploadTemplate from '@/common/components/dialog/upload.vue';
import { map, } from 'lodash-es';
import { CONSUMABLE_RESERVE_STATE, } from '../config';
export default {
  components: {
    PureButton,
    QueryPanel,
    DicTree,
    CompanySelect,

  },
  data() {
    return {
      listApi: ConsumableApi.getList,
      consumableReserveStateList: CONSUMABLE_RESERVE_STATE,
      queryData: {
        keyword: '',
        // 库存情况 1正常 2达到预警值 3无库存
        reserveState: null,
        supplierId: null,
        type: null,
      },
      selectionValues: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    onQuery() {
      this.init();
    },
    onReset() {
      this.queryData = {
        keyword: '',
        // 库存情况 1正常 2达到预警值 3无库存
        reserveState: null,
        supplierId: null,
        type: null,
      };
      this.init();
    },
    // 耗材申领
    toApply() {
      this.$router.push('/asset/consumableManagement/apply');
    },
    clickTree(node) {
      console.log(node);
      this.queryData.type = node.dictValue;
      this.init();
    },
    // 初始化
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    // 删除
    del() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        try {
          await ConsumableApi.deleteConsumable(map(this.selectionValues, 'id'));
          this.init();
          this.$notify.success('撤销成功');
        } catch (err) {
          this.$notify.error(err);
        }
      });
    },
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerDetail data={row}
          onDone={this.init}
        />,
      });
    },
    // 登记
    handleCommand(command) {
      if (command === 'register') {
        this.register();
      } else {
        //   导入
        this.importConsumable();
      }
    },
    // 耗材导入
    importConsumable() {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogUploadTemplate importApi={ConsumableApi.importConsumable}
          fileName={'耗材导入模版'}
          downloadTemplateApi={ConsumableApi.downloadTemplate}
          onDone={this.init}
        />,
      });
    },
    // 入库
    enterWarehouse() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerEnterWarehouse onDone={this.init}/>,
      });
    },
    // 出库
    outWarehouse() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerOutWarehouse onDone={this.init}/>,
      });
    },
    // 耗材登记
    register() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerConsumableRegister onDone={this.init}/>,
      });
    },
    // 编辑耗材
    edit(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerConsumableRegister data={row}
          onDone={this.init}
        />,
      });
    },
    // 耗材选择
    handleSelectionChange(val) {
      this.selectionValues = val;
    },
  },
};
</script>
<style lang='scss'
  scoped
>
.aside {
  padding: 16px;
  box-shadow: inset -1px 0px 0 #F0F7F7
}

.pureTable {
  padding: 0 16px;
}
</style>
