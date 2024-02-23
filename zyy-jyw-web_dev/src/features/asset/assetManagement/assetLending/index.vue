/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description  资产借用
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
                v-model="queryData.outDept"
                placeholder="出借科室"
              />
            </el-form-item>
            <el-form-item>
              <user-select
                v-model="queryData.createUser"
                collapse-tags
                multiple
                placeholder="申请人"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="queryData.state"
                placeholder="状态"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.state"
                  :label="item.label"
                  :value="item.state"
                />
              </el-select>

            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryData.time"
                end-placeholder="申请时间"
                format="yyyy-MM-dd"
                start-placeholder="申请时间"
                type="daterange"
                value-format="yyyy-MM-dd"
                @change="changeDate"
              />
            </el-form-item>
            <template #right>
              <pure-button
                label="借用申请"
                @click="onTransferApplication"
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
              :label="row.createTime |timeFormat"
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
          label="出借科室"
          prop="outDeptName"
        />
        <el-table-column
          label="调拨原因"
          prop="reason"
        />
        <el-table-column
          label="状态"
          prop="state"
        >
          <template #default="{row}">
            <pure-type-text
              :config="ASSET_BORROW_STATE_MAP"
              :type="row.state"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <pure-button
              label="撤销"
              type="text"
              @click="onRevoke(row)"
            />
            <pure-button
              v-if="row.state === '3'"
              label="归还"
              type="text"
              @click="onReturn(row)"
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
import AssetLendingApi from './api';
import DrawerAssetLending from './drawer/assetLending.vue';
import DrawerAssetLendingDetail from './drawer/assetLendingDetail.vue';
import DialogReturn from './dialog/return.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, } from 'lodash-es';
import {
  ASSET_BORROW_STATE,
  ASSET_BORROW_STATE_MAP,
} from '@/features/asset/assetManagement/config';

export default {
  components: { QueryPanel, DeptCascader, UserSelect, },
  data() {
    return {
      listApi: AssetLendingApi.getList,
      stateList: ASSET_BORROW_STATE,
      ASSET_BORROW_STATE_MAP,
      queryData: {
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 出借科室
        outDept: null,
        // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
        state: null,
      },
    };
  },
  computed: {},

  mounted() {
    this.init();
  },
  methods: {
    changeDate(time) {
      this.queryData.createStartTime = time[0] || '';
      this.queryData.createEndTime = time[1] || '';
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
        createUser: [],
        outDept: null,
        state: null,
      };
      this.init();
    },
    // 撤销
    onRevoke(row) {
      this.$confirm('确认撤销此条申请?', '提示', {}).then(async () => {
        try {
          await AssetLendingApi.revoke(row.id);
          this.init();
          this.$notify.success('撤销成功');
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch();
    },
    // 归还
    onReturn(row) {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogReturn data={row}
          onDone={this.init}
        />,
      });
    },
    // 资产调拨详情
    onAssetAllocationDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetLendingDetail data={row}
          onDone={this.init}
        />,
      });
    },
    //   转移申请
    onTransferApplication() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetLending onDone={this.init}/>,
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

