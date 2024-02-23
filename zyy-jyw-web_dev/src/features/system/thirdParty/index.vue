/**
* @file index.vue
* @author huang
* @date 2023/10/27
* @description  第三方
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container>
    <el-main>
      <pure-table
        ref="pureTable"
        :list-api="listApi"
        :query-condition="queryData"
        style="padding: 16px 10px;"
      >
        <template #header>
          <query-panel :show-query-button="false">
            <el-form-item>
              <el-input
                v-model="queryData.keyword"
                @input="changeInput"
              />
            </el-form-item>
            <template #right>
              <pure-button
                icon="add"
                label="新增第三方"
                type="major"
                @click="handleAdd"
              />
            </template>
          </query-panel>
        </template>
        <el-table-column
          label="名称"
          prop="deptName"
        />
        <el-table-column
          label="编号"
          prop="deptCode"
        />
        <el-table-column
          label="地址"
          prop="deptPlace"
        />
        <el-table-column
          label="说明"
          prop="deptRemark"
        />
        <el-table-column
          label="创建/修改时间"
          prop="createTime"
        />
        <el-table-column label="操作">
          <template #default="{row}">
            <pure-button
              label="编辑"
              type="text"
              @click="handleEdit(row)"
            />
            <pure-button
              label="删除"
              type="text"
              @click="handleDel(row)"
            />

          </template>
        </el-table-column>

      </pure-table>
    </el-main>
  </el-container>

</template>
<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import PureButton from '@/common/components/button/index.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import DrawerAddThirdParty from './drawer/addThirdParty.vue';
import ThirdPartyApi from './api';
import { debounce, } from 'lodash-es';

export default {
  components: { PureButton, QueryPanel, },
  data() {
    return {
      queryData: {
        keyword: '',
      },
      listApi: ThirdPartyApi.getThirdList,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    changeInput: debounce(function (val) {
      this.$refs.pureTable.fetchData(1);
    }, 300),
    init() {
      this.$refs.pureTable.fetchData(1);
    },
    handleAdd() {
      this.$drawer({
        width: pxToPercentage(600),
        component: () => <DrawerAddThirdParty onDone={this.init}/>,
      });
    },
    // 编辑
    handleEdit(row) {
      this.$drawer({
        width: pxToPercentage(600),
        component: () => <DrawerAddThirdParty data={row}
          onDone={this.init}
        />,
      });
    },
    // 删除
    handleDel(row) {
      this.$confirm(`是否删除 [${row.deptName}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await ThirdPartyApi.delThird(row.deptId);
      }).catch(() => {
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
