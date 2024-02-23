/**
* @file index.vue
* @author huang
* @date 2023/8/14
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <hyy-view-layout>
    <template #header>

      <query-panel
        @query="onQuery"
        @reset="onReset"
      >
        <el-form-item>
          <el-input
            v-model="queryData.deptName"
            placeholder="部门名称"
            prefix-icon="el-icon-search"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryData.status"
            placeholder="部门状态"
          >
            <el-option
              label="启用"
              value="0"
            />
            <el-option
              label="停用"
              value="1"
            />
          </el-select>
        </el-form-item>
        <template #right>
          <pure-button
            v-auth="'system:dept:add'"
            icon="add"
            label="新增"
            size="small"
            @click="onAdd"
          />
          <pure-button v-auth="'system:dept:print'" :type="'minor'" :disabled="!selectionValues.length" @click="onPrint">
            打印
          </pure-button>
        </template>
      </query-panel>

    </template>
    <el-table
      ref="table"
      :data="data"
      :hide-index="true"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      default-expand-all
      height="100%"
      max-height="100%"
      row-key="deptId"
      @selection-change="selectionChange"
      @select-all="selectAll"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="部门名称"
        min-width="150px"
        prop="deptName"
      />
      <el-table-column
        label="排序"
        min-width="40px"
        prop="orderNum"
      />
      <el-table-column
        label="科室地址"
        min-width="80px"
        prop="deptPlace"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        min-width="40px"
        prop="status"
      >
        <template #default="{row}">
          <el-tag :type="row.status === '0' ? 'info':'danger' ">
            {{ row.status|deptStatus }}
          </el-tag>

        </template>

      </el-table-column>
      <el-table-column
        label="创建时间"
        min-width="80px"
        prop="createTime"
      />
      <el-table-column label="操作">
        <template #default="{row}">
          <pure-button
            v-auth="'system:dept:edit'"
            type="text"
            @click="onEdit(row)"
          >
            修改
          </pure-button>
          <pure-button
            v-auth="'system:dept:remove'"
            text-color="warning"
            type="text"
            @click="onDel(row)"
          >
            删除
          </pure-button>

        </template>
      </el-table-column>

    </el-table>

  </hyy-view-layout>

</template>

<script>

import QueryPanel from '@/common/components/query/queryPanel.vue';
import DialogUpdateDepartment from './dialog/addDeaprtment.vue';
import SystemDepartmentManagementApi from './api';
import { convertToTree, pxToPercentage, } from '@/common/utils/convert';
import { debounce, } from 'lodash';
import HyyViewLayout from '@/common/layout/viewLayout.vue';
import { filter, } from 'lodash-es';
import PureButton from '@/common/components/button/index.vue';
import DialogPrint from './dialog/print.vue';

export default {
  components: { PureButton, HyyViewLayout, QueryPanel, },
  data() {
    return {
      data: [],
      queryData: {
        deptName: '',
        status: '',
      },
      selectionValues: [],
      debounce: null,
    };
  },
  created() {
    this.debounce = debounce(this.updateDepartment, 300);
  },
  mounted() {
    this.init();
  },
  methods: {
    selectAll() {
      this.checkedKeys = !this.checkedKeys;
      this.splite(this.data, this.checkedKeys);
    },
    splite(data, flag) {
      data.forEach((row) => {
        this.$refs.table.toggleRowSelection(row, flag);
        if (row.children !== undefined) {
          this.splite(row.children);
        }
      });
    },
    selectionChange(val) {
      this.selectionValues = val;
    },
    // 打印
    onPrint() {
      if (this.selectionValues.length === 0) {
        this.$notify.error('请选择要打印的资产');
        return;
      }
      const assetIds = this.selectionValues.map(item => item.deptId);
      this.$dialog({
        component: () => <DialogPrint ids={assetIds}/>,
      });
    },
    // 查询
    onQuery() {
      this.init();
    },
    // 重置
    onReset() {
      this.queryData = {
        deptName: '',
        status: '',
      };
      this.init();
    },
    // 修改状态
    async updateDepartment(val, row) {
      try {
        row.status = val;
        await SystemDepartmentManagementApi.updateDepartment(row);
      } catch (err) {
        row.status = val === '0' ? '1' : '0';
        this.$message.error(err);
      }
    },
    // 初始化
    async init() {
      const rs = await SystemDepartmentManagementApi.getDepartmentList(this.queryData);
      const res = filter(rs, { deptType: 0, });
      this.data = convertToTree(res);
    },
    // 修改
    onEdit(row) {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogUpdateDepartment title={'修改科室'} data={row} onDone={this.init}/>,
      });
    },
    // 删除
    onDel(row) {
      this.$confirm(`正在删除[${row.deptName}]部门, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await SystemDepartmentManagementApi.deleteDepartment(row.deptId);
        await this.init();
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch();
    },
    // 新增
    onAdd() {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogUpdateDepartment title={'新增科室'} onDone={this.init}/>,
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
