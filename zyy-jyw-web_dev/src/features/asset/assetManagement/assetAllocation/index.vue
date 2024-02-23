/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description 资产调拨
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
      >
        <template #header>
          <query-panel
            @query="onQuery"
            @reset="onReset"
          >
            <el-form-item>
              <dept-cascader
                v-model="queryData.inDept"
                placeholder="调入科室"
              />
            </el-form-item>
            <el-form-item>
              <user-select
                v-model="queryData.createUser"
                multiple
                collapse-tags
                placeholder="操作人"
              />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryData.time"
                type="daterange"
                format="yyyy-MM-dd"
                placeholder="操作时间"
                value-format="yyyy-MM-dd"
                @change="changeDatePicker"
              />
            </el-form-item>
            <template #right>
              <pure-button
                label="资产调拨"
                @click="onAssetAllocation"
              />
            </template>
          </query-panel>
        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          label="操作时间"
          prop="createTime"
        >
          <template #default="{row}">
            <pure-button
              :label="row.createTime"
              type="text"
              @click="onAssetAllocationDetail(row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="操作人"
          prop="createUserName"
        />
        <el-table-column
          label="调入科室"
          prop="inDeptName"
        />
        <el-table-column
          label="调拨原因"
          prop="reason"
        />
        <el-table-column label="操作">
          <template #default="{row}">
            <pure-button
              label="撤销"
              type="text"
              @click="onRevoke(row)"
            />

          </template>
        </el-table-column>

      </pure-table>
    </el-main>
  </el-container>

</template>
<script>

import QueryPanel from '@/common/components/query/queryPanel.vue';
import DeptCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import PureButton from '@/common/components/button/index.vue';
import AssetAllocationApi from './api';
import DrawerAssetAllocation from './drawer/assetAllocation.vue';
import DrawerAssetAllocationDetail from './drawer/assetAllocationDetail.vue';

import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, } from 'lodash-es';

export default {
  components: { PureButton, QueryPanel, DeptCascader, UserSelect, },
  data() {
    return {
      listApi: AssetAllocationApi.getList,
      queryData: {
        time: null,
        // 操作时间结束
        createEndTime: '',
        // 操作时间开始
        createStartTime: '',
        // 操作人
        createUser: null,
        // 调入科室
        inDept: '',
      },
    };
  },

  mounted() {
    this.init();
  },
  methods: {
    changeDatePicker(time) {
      this.queryData.createStartTime = time ? time[0] : null;
      this.queryData.createEndTime = time ? time[1] : null;
    },
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    onQuery: debounce(function () {
      this.init();
    }, 300),
    onReset() {
      this.queryData = {
        createEndTime: '',
        createStartTime: '',
        createUser: null,
        inDept: '',
      };
      this.init();
    },
    // 撤销
    onRevoke(row) {
      this.$confirm('此操作将撤销该资产调拨, 是否继续?', '提示', {}).then(async () => {
        try {
          await AssetAllocationApi.revoke(row.id);
          this.$notify.success('撤销成功');
          this.init();
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch();
    },

    // 资产调拨详情
    onAssetAllocationDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetAllocationDetail data={row}
          onDone={this.init}
        />,
      });
    },
    //   资产调拨
    onAssetAllocation() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetAllocation onDone={this.init}/>,
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.table-area {
  padding: 16px;
}
</style>
