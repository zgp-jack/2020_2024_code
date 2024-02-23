<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-30 17:42:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-17 10:47:15
 * @Description:台账管理
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
            <pure-button label="资产登记" @click="handleRegister" />
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
                fixed
              />
              <el-table-column
                v-for="(item,index) in tableHeader"
                :key="index"
                :label="item.name"
                :prop="item.prop"
                align="left"
                width="140px"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <span v-if="item.prop === 'assetsType'">
                    {{ row[item.prop]|dicValueToKey('assetsType') }}
                  </span>
                  <span v-else-if="item.prop === 'manufacturer'">
                    {{ row[item.prop]|dicValueToKey('manufacturer') }}
                  </span>
                  <span v-else-if="item.prop === 'patrolTemp'">
                    {{ convertInspectionTemId(row[item.prop]) }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="177" fixed="right">
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
    <el-aside style="width:288px;height:100%" class="right-side">
      <el-tabs type="border-card">
        <el-tab-pane label="资产类型">
          资产类型
        </el-tab-pane>
        <el-tab-pane label="使用科室">使用科室</el-tab-pane>
        <el-tab-pane label="巡检单元">巡检单元</el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>
<script>
import Register from './dialog/register.vue';
import View from './dialog/view.vue';
import Update from './dialog/update.vue';
import PropertyManagementApi from '@/apis/property/propertyManagement';
import InspectionTemplateApi from '@/apis/inspection/template';
import {
  find,
} from 'lodash';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import PaginationTable from '@/minxins/common/paginationTable';
export default {
  name: 'ZcZcglTzgl',
  mixins: [PaginationTable],
  data() {
    return {
      tableHeader: [],
      inspectionTemplateList: [],
      maintainPopoverVisible: false,
      meteringPopoverVisible: false,
      listApi: PropertyManagementApi.list,
      popoverFormData: {
        month: 0,
      },
      popoverFormRule: {
        month: [{
          required: true, message: '请输入临期月数', trigger: 'blur',
        }],
      },
    };
  },

  async created() {
    this.queryCondition.maintainMonth = this.getMaintainMonth();
    this.queryCondition.meteringMonth = this.getMeteringMonth();
    this.tableHeader = this.$store.state['property/propertyManagement'].ledgerTableColumn;
    this.inspectionTemplateList = await InspectionTemplateApi.tempListForSelect();
    await this.fetchData();
  },
  methods: {
    // 打开编辑资产弹窗
    async handleUpdate(row) {
      this.$drawer({
        width: '1688px',
        component: () => <Update data={row} onDone={this.fetchData}/>,
      });
    },
    // 打开查看资产弹窗
    async handleView(row) {
      this.$drawer({
        width: '1688px',
        component: () => <View data={row}/>,
      });
    },
    // 打开资产登记弹窗
    async handleRegister() {
      this.$drawer({
        width: '1688px',
        component: () => <Register onDone={this.fetchData}/>,
      });
    },
    // 获取维保临期
    getMaintainMonth() {
      return getJSON(`${this.name}-maintainMonth`) || 0;
    },
    // 设置维保临期
    setMaintainMonth(value) {
      this.queryCondition.maintainMonth = value;
      setJSON(`${this.name}-maintainMonth`, value);
    },
    // 获取计量临期
    getMeteringMonth() {
      return getJSON(`${this.name}-meteringMonth`) || 0;
    },
    // 设置计量临期
    setMeteringMonth(value) {
      this.queryCondition.meteringMonth = value;
      setJSON(`${this.name}-meteringMonth`, value);
    },
    // 修改计量临期
    async handleUpdateMetering() {
      try {
        await this.$refs.meteringPopoverForm.validate();
        this.setMeteringMonth(this.popoverFormData.month);
        this.meteringPopoverVisible = false;
        this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 修改维保临期
    async handleUpdateMaintain() {
      try {
        await this.$refs.meteringPopoverForm.validate();
        this.setMaintainMonth(this.popoverFormData.month);
        this.maintainPopoverVisible = false;
        this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 打开维保临期修改弹窗时处理
    async handleMaintainPopoverShow() {
      this.popoverFormData.month = this.queryCondition.maintainMonth;
    },
    // 打开计量临期修改弹窗时处理
    async handleMeteringPopoverShow() {
      this.popoverFormData.month = this.queryCondition.meteringMonth;
    },
    // 巡检模板id转名字
    convertInspectionTemId(id) {
      return find(this.inspectionTemplateList, { id, })?.name;
    },
  },

};
</script>

<style lang="scss" scoped>
.right-side {
  ::v-deep .el-tabs {
    height:100%;
    border: unset;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      flex: 1;
      overflow:scroll;
      padding: unset;
      margin: 5px;
      margin-left: 24px;
      &::-webkit-scrollbar{
        width:6px;
        height:50%;
      }
      &::-webkit-scrollbar-thumb{
        background-color: #DEE2EE;
        border-radius: 3px;
      }
    }
  }
}
</style>
