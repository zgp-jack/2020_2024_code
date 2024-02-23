<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-13 10:28:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-20 14:59:50
 * @Description: 资产管理
-->
<template>
  <div class="container">
    <div class="left-aside">
      <div><today /></div>
      <el-row type="flex" class="row-bg" justify="space-around" style="margin-top:27px">
        <el-col :span="20">
          <span class="label">维保临期：</span>
          <span class="num">{{ maintainMonth }}</span>
        </el-col>
        <el-col :span="4">

          <i v-popover:maintainPopover class="el-icon-edit" />
        </el-col>

      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around" style="margin-top:38px">
        <el-col :span="20">
          <span class="label">计量临期：</span>
          <span class="num">{{ meteringMonth }}</span>
        </el-col>
        <el-col :span="4">
          <i v-popover:meteringPopover class="el-icon-edit" />
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <el-container>
        <el-header style="height:120px;margin-left:26px">
          <div style="margin-top:20px" />
          <el-row>
            <pure-btn-group :options="btnOptions" />
          </el-row>
          <el-row style="margin-top:27px">
            <el-col :span="3">
              <search v-model="searchValue" />
            </el-col>
            <el-col :span="21" style="text-align:right">
              <el-button size="mini">打印</el-button>
              <el-button size="mini"> 资产导入</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleRegister"
              >资产登记</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-container>
            <el-aside style="width:26px"><i class=" icon-setting" /></el-aside>
            <el-main>
              <el-table
                v-loading="loading"
                border
                align="left"
                height="96.5%"
                :data="list"
                :empty-text="emptyText"
              >
                <el-table-column
                  label="序号"
                  align="left"
                  type="index"
                  width="78px"
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
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>

        </el-main>
        <el-footer height="44px" style="text-align: right">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-footer>
      </el-container>
    </div>
    <div class="right-aside">

      <el-tabs type="border-card">
        <el-tab-pane label="资产类型">

          资产类型
        </el-tab-pane>
        <el-tab-pane label="使用科室">使用科室</el-tab-pane>
        <el-tab-pane label="巡检单元">巡检单元</el-tab-pane>
      </el-tabs>
    </div>
    <el-popover
      ref="maintainPopover"
      v-model="maintainPopoverVisible"
      placement="bottom-end"
      @show="handleMaintainPopoverShow"
    >
      <el-form
        ref="maintainPopoverForm"
        label-position="right"
        label-width="50px"
        size="mini"
        :rules="popoverFormRule"
        :model="popoverFormData"
      >
        <el-form-item label="临期" prop="month">
          <el-input-number
            v-model="popoverFormData.month"
            controls-position="right"
            class="w70"
            :min="0"
            :max="120"
          /><span class="unit">个月</span>
        </el-form-item>
        <el-row style="margin-bottom:10px">
          <el-col style="text-align: right">
            <el-button size="mini" type="text" @click="maintainPopoverVisible=false">取消</el-button>
            <el-button size="mini" type="primary" @click="handleUpdateMaintain">确认</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-popover>
    <el-popover
      ref="meteringPopover"
      v-model="meteringPopoverVisible"
      placement="bottom-end"
      @show="handleMeteringPopoverShow"
    >
      <el-form
        ref="meteringPopoverForm"
        label-position="right"
        label-width="50px"
        size="mini"
        :rules="popoverFormRule"
        :model="popoverFormData"
      >
        <el-form-item label="临期" prop="month">
          <el-input-number
            v-model="popoverFormData.month"
            controls-position="right"
            class="w70"
            :min="0"
            :max="120"
          /><span class="unit">个月</span>
        </el-form-item>
        <el-row style="margin-bottom:10px">
          <el-col style="text-align: right">
            <el-button size="mini" type="text" @click="meteringPopoverVisible=false">取消</el-button>
            <el-button size="mini" type="primary" @click="handleUpdateMetering">确认</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-popover>
  </div>
</template>

<script>
import Register from './dialog/register.vue';
import View from './dialog/view.vue';
import Update from './dialog/update.vue';
import PropertyManagementApi from '@/apis/property/propertyManagement';
import InspectionTemplateApi from '@/apis/inspection/template';
import { delayCallBack, } from '@/utils/common';
import {
  find,
} from 'lodash';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
export default {
  name: 'PropertyManagement',
  components: {
    PureBtnGroup: () => import('@/components/button/buttonGroup.vue'),
    Search: () => import('@/components/input/search.vue'),
    Today: () => import('@/components/today'),
  },
  data() {
    return {
      pageNum: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      emptyText: '暂无数据',
      searchValue: '',
      tableHeader: [],
      maintainMonth: 0,
      meteringMonth: 0,
      inspectionTemplateList: [],
      list: [],
      maintainPopoverVisible: false,
      meteringPopoverVisible: false,
      btnOptions: [{
        count: null,
        name: '台账管理',
      }, {
        count: null,
        name: '资产转移',
      }, {
        count: null,
        name: '资产借用',
      }, {
        count: null,
        name: '资产处置',
      }],
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
  watch: {
    searchValue(newVal) {
      delayCallBack(1000, () => {
        this.pageNum = 0;
        this.fetchData(newVal);
      });
    },
  },
  async created() {
    this.meteringMonth = this.getMeteringMonth();
    this.maintainMonth = this.getMaintainMonth();
    this.tableHeader = this.$store.state['property/propertyManagement'].ledgerTableColumn;
    this.inspectionTemplateList = await InspectionTemplateApi.list();
    await this.fetchData();
  },
  methods: {
    async handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    async handleCurrentChange(val) {
      this.pageNum = val;
      this.fetchData();
    },
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
    // 获取列表数据
    async fetchData(query) {
      try {
        this.loading = true;
        const { list, total, } = await PropertyManagementApi.list({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          query: query,
          meteringMonth: this.meteringMonth,
          maintainMonth: this.maintainMonth,
        });
        this.list = list;
        this.total = total;
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
      this.loading = false;
    },
    // 获取维保临期
    getMaintainMonth() {
      return getJSON(`${this.name}-maintainMonth`) || 0;
    },
    // 设置维保临期
    setMaintainMonth(value) {
      this.maintainMonth = value;
      setJSON(`${this.name}-maintainMonth`, value);
    },
    // 获取计量临期
    getMeteringMonth() {
      return getJSON(`${this.name}-meteringMonth`) || 0;
    },
    // 设置计量临期
    setMeteringMonth(value) {
      this.meteringMonth = value;
      setJSON(`${this.name}-meteringMonth`, value);
    },
    // 修改计量临期
    async handleUpdateMetering() {
      try {
        await this.$refs.meteringPopoverForm.validate();
        this.meteringMonth = this.popoverFormData.month;
        this.setMeteringMonth(this.meteringMonth);
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
        this.maintainMonth = this.popoverFormData.month;
        this.setMaintainMonth(this.maintainMonth);
        this.maintainPopoverVisible = false;
        this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    // 打开维保临期修改弹窗时处理
    async handleMaintainPopoverShow() {
      this.popoverFormData.month = this.maintainMonth;
    },
    // 打开计量临期修改弹窗时处理
    async handleMeteringPopoverShow() {
      this.popoverFormData.month = this.meteringMonth;
    },
    // 巡检模板id转名字
    convertInspectionTemId(id) {
      return find(this.inspectionTemplateList, { id, })?.templateName;
    },
  },

};
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        .left-aside {

            width: 240px;
            padding:0 24px;
            box-sizing: border-box;
            background-color: white;
            margin-right: 12px;

            .label {
              font-weight: 500;
              font-size: 14px;
              color:#2d405e;
            }
            .num {
              font-weight: 400;
              font-size: 14px;
              color: #409eff;
            }
            .el-icon-edit {
              cursor: pointer;
              color: #879bba;
            }
        }
        .main {
            flex: 1;
            background-color: white;
            padding-right: 24px;
        }
        .right-aside {
            width: 356px;
            background-color: white;
            margin-left: 12px;
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
    }
.unit {
  font-size: 14px;
  color: #879BBA;
  padding-left: 7px;
}
</style>
