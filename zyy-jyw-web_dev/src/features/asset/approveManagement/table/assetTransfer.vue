/**
* @file assetTransfer.vue
* @author huang
* @date 2023/11/7
* @description  审批管理-资产转移
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
              <dept-cascader
                v-model="queryData.outDept"
                placeholder="转出科室"
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
                v-model="queryData.auditState"
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
                format="yyyy-MM-dd"
                placeholder="申请时间"
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
          label="操作人"
          prop="createUserName"
        />
        <el-table-column
          label="转出科室"
          prop="outDeptName"
        />
        <el-table-column
          label="转移原因"
          prop="reason"
        />
        <el-table-column
          label="状态"
          prop="auditState"
        >
          <template #default="{row}">
            <pure-type-text
              :config="ASSET_TRANSFER_AUDIT_STATE_MAP"
              :type="row.auditState"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <template v-if="row.auditState === '0'">
              <pure-button
                label="通过"
                type="text"
                @click="onPass(row)"
              />
              <pure-button
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
import DrawerAssetTransferDetail from '@/features/asset/assetManagement/assetTransfer/drawer/assetTransferDetail.vue';
import DialogReject from '../dialog/reject.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, map, } from 'lodash-es';
import { ASSET_TRANSFER_AUDIT_STATE, ASSET_TRANSFER_AUDIT_STATE_MAP, } from '@/features/asset/assetManagement/config';
import PureButton from '@/common/components/button/index.vue';

export default {
  components: { PureButton, QueryPanel, DeptCascader, UserSelect, },
  data() {
    return {
      listApi: ApproveApi.getAssetTransferList,
      stateList: ASSET_TRANSFER_AUDIT_STATE,
      ASSET_TRANSFER_AUDIT_STATE_MAP,
      queryData: {
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 转出科室
        outDept: null,
      },
      sectionValues: [],
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
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 转出科室
        outDept: null,
      };
      this.init();
    },
    // 驳回
    async onReject(row) {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogReject
          confirmFn={ApproveApi.assetTransferAuditReject}
          data={row}
          onDone={this.init}
        />,
      });
    },
    // 通过
    async onPass(row) {
      const ids = this.sectionValues.length ? map(this.sectionValues, 'id') : [
        row.id,
      ];
      await ApproveApi.assetTransferAuditPass(ids);
      this.init();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.sectionValues = val;
    },

    // 详情
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetTransferDetail data={row}
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
