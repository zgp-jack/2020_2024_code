/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description  审批管理-资产借用
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
        selection
        @selection-change="handleSelectionChange"
      >
        <template #header>
          <query-panel
            @query="onQuery"
            @reset="onReset"
          >
            <el-form-item>
              <el-input
                v-model="queryData.keyword"
                placeholder="联系人/电话"
              />
            </el-form-item>

            <el-form-item>
              <dept-cascader
                v-model="queryData.inDept"
                placeholder="借入科室"
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
                clearable
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

          </query-panel>
          <pure-button
            :disabled="!sectionValues.length"
            class="base-margin-bottom"
            label="通过"
            type="minor"
            @click="onPass"
          />
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
              @click="onDetail(row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="申请人"
          prop="createUserName"
        />
        <el-table-column
          label="借入科室"
          prop="outDeptName"
        />
        <el-table-column
          label="联系人"
          prop="inUser"
        />
        <el-table-column
          label="联系电话"
          prop="inPhone"
        />
        <el-table-column
          label="预计归还日期"
          prop="estimateReturnDate"
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
            <template v-if="row.state === '1'">

              <pure-button
                label="通过"
                type="text"
                @click="onPass(row)"
              />
              <pure-button
                v-if="row.state "
                label="驳回"
                type="text"
                @click="onReject(row)"
              />
            </template>

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
import ApproveApi from '../api';
import DrawerAssetLendingDetail from '@/features/asset/assetManagement/assetLending/drawer/assetLendingDetail.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, map, } from 'lodash-es';
import DialogReject from '../dialog/reject.vue';

import {
  ASSET_BORROW_STATE,
  ASSET_BORROW_STATE_MAP,
} from '@/features/asset/assetManagement/config';

export default {
  components: { QueryPanel, DeptCascader, UserSelect, },
  data() {
    return {
      listApi: ApproveApi.getAssetBorrowList,
      stateList: ASSET_BORROW_STATE,
      ASSET_BORROW_STATE_MAP,
      queryData: {
        time: [],
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 借入科室
        inDept: null,
        // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
        state: null,
        keyword: '',
      },
      sectionValues: [],

    };
  },
  computed: {},

  mounted() {
    this.init();
  },
  methods: {
    handleSelectionChange(val) {
      this.sectionValues = val;
    },
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
        time: [],
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 借入科室
        inDept: null,
        // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
        state: null,
        keyword: '',
      };
      this.init();
    },
    // 通过
    async onPass(row) {
      const ids = this.sectionValues.length ? map(this.sectionValues, 'id') : [
        row.id,
      ];
      await ApproveApi.assetBorrowAuditPass(ids);
      this.init();
    },
    // 驳回
    async onReject(row) {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogReject
          confirmFn={ApproveApi.assetBorrowAuditReject}
          data={row}
          onDone={this.init}
        />,
      });
    },

    // 资产调拨详情
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetLendingDetail data={row}
          onDone={this.init}
        />,
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

