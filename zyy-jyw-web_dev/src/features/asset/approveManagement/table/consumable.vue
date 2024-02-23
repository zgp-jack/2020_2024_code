/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description  耗材申领
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
              <user-select
                v-model="queryData.createUser"
                collapse-tags
                multiple
                placeholder="申请人"
              />
            </el-form-item>
            <el-form-item>
              <dept-cascader
                v-model="queryData.inDept"
                placeholder="申请科室"
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
          label="申请时间"
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
          label="申请科室"
          prop="inDeptName"
        />

        <el-table-column
          label="状态"
          prop="auditState"
        >
          <template #default="{row}">
            <pure-type-text
              :config="CONSUMABLE_APPLAY_AUDIT_STATE_MAP"
              :type="row.auditState"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <pure-button
              v-if="row.auditState === '0'"
              label="通过"
              type="text"
              @click="onPass(row)"
            />

            <pure-button
              v-if="row.auditState === '0'"
              label="驳回"
              type="text"
              @click="onReject(row)"
            />

          </template>
        </el-table-column>

      </pure-table>
    </el-main>
  </el-container>

</template>
<script>

import QueryPanel from '@/common/components/query/queryPanel.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import ApproveApi from '../api';
import DrawerConsumableManagementDetail from '@/features/asset/consumableManagement/apply/drawer/detail.vue';
import DialogReject from '../dialog/reject.vue';
import DeptCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, map, } from 'lodash-es';
import {
  CONSUMABLE_APPLAY_AUDIT_STATE,
  CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
} from '@/features/asset/consumableManagement/config';

export default {
  components: { QueryPanel, UserSelect, DeptCascader, },
  data() {
    return {
      listApi: ApproveApi.getConsumableList,
      stateList: CONSUMABLE_APPLAY_AUDIT_STATE,
      CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
      queryData: {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: null,
        // 申请时间开始
        createStartTime: null,
        // 申请人
        createUser: [],
        // 申请科室
        inDept: null,
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
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: null,
        // 申请时间开始
        createStartTime: null,
        // 申请人
        createUser: [],
        // 申请科室
        inDept: null,
      };
      this.init();
    },
    // 通过
    async onPass(row) {
      const ids = this.sectionValues.length ? map(this.sectionValues, 'id') : [
        row.id,
      ];
      await ApproveApi.consumableAuditPass(ids);
      this.init();
    },
    // 驳回
    onReject(row) {
      this.$dialog({
        width: pxToPercentage(600),
        component: () => <DialogReject
          confirmFn={ApproveApi.consumableAuditReject}
          data={row}
          onDone={this.init}
        />,
      });
    },

    // 处置申请详情
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerConsumableManagementDetail data={row}
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

