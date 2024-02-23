<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 17:51:18
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:53:00
 * @Description:巡检模板设置模块
-->

<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right space-between">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="新增模板" @click="onCreateTemplate" />
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
                v-for="(item,index) in columnConfig"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">

                  <span v-if="item.prop==='state'">
                    <el-switch
                      v-model="scope.row[item.prop]"
                      :active-value="1"
                      :inactive-value="0"
                      @change="onChangeTempState(scope.row)"
                    />
                  </span>
                  <span v-else-if="item.prop==='inspectionFrequency'">
                    {{ convertInspectionFrequency(scope.row) }}
                  </span>
                  <span v-else-if="item.prop==='errorMake'">
                    <el-radio-group v-model="scope.row[item.prop]" disabled>
                      <el-radio :label="1">限期整改</el-radio>
                      <el-radio :label="2">转工单</el-radio>
                    </el-radio-group>
                  </span>
                  <span v-else>
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="197px">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="text"
                    @click="onViewTemplate(scope.row)"
                  >查看</el-button>
                  <el-button
                    size="medium"
                    type="text"
                    @click="onUpdateTemplate(scope.row)"
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
import InspectionTempSettingApi from './api';
import InspectionTempInfoDrawer from './drawer/template.vue';
import {
  convertInspectionFrequency,
} from '../../util';
import PaginationTable from '@/minxins/common/paginationTable';

export default {
  name: 'XjXjmbszMbsz',
  mixins: [PaginationTable],
  data() {
    return {
      listApi: InspectionTempSettingApi.list,
      frequencyUnitMap: {},
      columnConfig: [
        {
          label: '模板名称',
          prop: 'name',
          minWidth: 120,
        },
        {

          label: '所属科室',
          prop: 'deptIdToName',
          select: true,
          width: 300,
          minWidth: 120,
        },

        {
          label: '巡检频次',
          prop: 'inspectionFrequency',
          width: 230,
          minWidth: 120,
        },
        {
          label: '启用',
          prop: 'state',
          select: true,
          width: 130,
          minWidth: 120,
        },
        {
          label: '异常处置办法',
          prop: 'errorMake',
          select: true,
          width: 300,
          minWidth: 120,
        }
      ],
    };
  },

  created() {
    const frequencyUnitData = this.$store.state['dictionary']['dicList']['frequencyUnit'] || [];
    frequencyUnitData.map(item => {
      this.frequencyUnitMap[item.value] = item.name;
    });
    this.fetchData();
  },
  methods: {
    async onViewTemplate(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspectionTempInfoDrawer onReloadData={this.fetchData} tempId={row.id} type='view' />,
      });
    },
    async onUpdateTemplate(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspectionTempInfoDrawer onReloadData={this.fetchData} tempId={row.id} type='update' />,
      });
    },
    async onCreateTemplate() {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <InspectionTempInfoDrawer onReloadData={this.fetchData}/>,
      });
    },
    async onChangeTempState(row) {
      try {
        await InspectionTempSettingApi.changeState({ id: row.id, state: row.state, });
        this.$message({
          type: 'success',
          message: row.state === 1 ? '模板启用成功' : '模板停用成功',
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
        row.state = 1 ^ row.state;
      }
    },
    convertInspectionFrequency,
  },
};
</script>

<style lang="scss" scoped>
</style>
