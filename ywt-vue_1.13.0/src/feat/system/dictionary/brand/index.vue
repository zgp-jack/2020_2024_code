<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 16:38:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:30
 * @Description:厂家品牌
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
            <pure-button label="新增厂家" @click="onCreateBrand" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="data"
              border
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
                v-for="(item, index) in tableColumn"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span v-if="item.prop == 'manufacturerType'">
                    {{ scope.row[item.prop]|dicValueToKey('manufacturerType') }}
                  </span>
                  <span v-else>
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="170">
                <template slot-scope="scope">
                  <el-button
                    style="margin-right: 20%"
                    size="medium  "
                    type="text"
                    @click="onUpdateBrand(scope.row)"
                  >编辑</el-button>
                  <el-popconfirm
                    title="确定删除吗？"
                    @confirm="onDeleteBrand(scope.row)"
                  >
                    <el-button
                      slot="reference"
                      size="medium"
                      type="text"
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
import BrandInfoDrawer from './drawer/brand.vue';
import BrandApi from './api';

import PaginationTable from '@/minxins/common/paginationTable';

export default {
  name: 'XtszZdwhCjpp',

  mixins: [PaginationTable],
  data() {
    return {
      listApi: BrandApi.list,
      tableColumn: [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '简称',
          prop: 'abbreviation',
        },
        {
          label: '类型',
          prop: 'manufacturerType',
        },
        {
          label: '主要联系人',
          prop: 'contact',
        },
        {
          label: '联系电话',
          prop: 'phone',
        }
      ],
    };
  },
  created() {
    this.queryCondition.deptId = null;
    this.fetchData();
  },
  methods: {

    async onNodeClick(id) {
      this.currentPage = 0;
      this.queryCondition.deptId = id;
      this.queryCondition.pageNum = this.currentPage;
      await this.fetchData();
    },
    async onDeleteBrand(row) {
      try {
        await BrandApi.delete(row.id);
        this.$message({
          type: 'success',
          message: '删除运维小组成功',
        });
        await this.fetchData();
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    onUpdateBrand(row) {
      this.$drawer({
        width: '720px',
        component: () => <BrandInfoDrawer id={row.id} onDone={this.fetchData} operatorType='UPDATE'/>,
      });
    },
    onCreateBrand() {
      this.$drawer({
        width: '720px',
        component: () => <BrandInfoDrawer onDone={this.fetchData} operatorType='CREATE'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
