<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-10 17:28:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-17 15:19:18
 * @Description:模板设置
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
            <pure-button label="新增模板" @click="handleCreateTemp" />
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
                v-for="(item,index) in columnConfig"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">

                  <span v-if="item.prop==='state'">
                    <el-switch
                      v-model="scope.row[item.prop]"
                      disabled
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleTempStateChange(scope.row)"
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
              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="text"
                    @click="handleView(scope.row)"
                  >查看</el-button>
                  <el-button
                    size="medium"
                    type="text"
                    @click="handleEdit(scope.row)"
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
import CreateTemplate from './dialog/createTemplate.vue';
import InspectionTempApi from '@/apis/inspection/template';

export default {
  name: 'XjXjmbszMbsz',
  mixins: [PaginationTable],
  data() {
    return {
      listApi: InspectionTempApi.tempList,
      frequencyUnitMap: {},
      columnConfig: [{

        label: '所属科室',
        prop: 'deptIdToName',
        select: true,
        width: 230,
        minWidth: 120,
      },
      {
        label: '模板名称',
        prop: 'name',
        width: 230,
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
        width: 230,
        minWidth: 120,
      },
      {
        label: '异常处置办法',
        prop: 'errorMake',
        select: true,
        width: 447,
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
    async handleView(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <CreateTemplate onReloadData={this.fetchData} tempId={row.id} type='view' />,
      });
    },
    async handleEdit(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <CreateTemplate onReloadData={this.fetchData} tempId={row.id} type='update' />,
      });
    },
    async handleCreateTemp() {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <CreateTemplate onReloadData={this.fetchData}/>,
      });
    },
    async handleTempStateChange(row) {
      try {
        await InspectionTempApi.changeState({ id: row.id, state: row.state, });
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
    // 转换巡检频次
    convertInspectionFrequency(row) {
      return `${row.frequencyTimer}次/${row.frequencyInterval}${this.frequencyUnitMap[row.frequencyUnit]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
