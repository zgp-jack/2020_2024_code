/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description 资产转移
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
            <template #right>
              <pure-button
                label="转移申请"
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
import AssetTransferApi from './api';
import DrawerAssetTransfer from './drawer/assetTransfer.vue';
import DrawerAssetTransferDetail from './drawer/assetTransferDetail.vue';

import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, } from 'lodash-es';
import { ASSET_TRANSFER_AUDIT_STATE, ASSET_TRANSFER_AUDIT_STATE_MAP, } from '@/features/asset/assetManagement/config';

export default {
  components: { QueryPanel, DeptCascader, UserSelect, },
  data() {
    return {
      listApi: AssetTransferApi.getList,
      stateList: ASSET_TRANSFER_AUDIT_STATE,
      ASSET_TRANSFER_AUDIT_STATE_MAP,
      queryData: {
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: '',
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 转出科室
        outDept: null,
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
        auditState: null,
        createEndTime: '',
        createStartTime: '',
        createUser: null,
        outDept: null,
      };
      this.init();
    },
    // 撤销
    onRevoke(row) {
      this.$confirm('此操作将撤销该资产调拨, 是否继续?', '提示', {}).then(async () => {
        try {
          await AssetTransferApi.revoke(row.id);
          this.init();
          this.$notify.success('撤销成功');
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch();
    },

    // 资产调拨详情
    onAssetAllocationDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetTransferDetail data={row}
          onDone={this.init}
        />,
      });
    },
    //   转移申请
    onTransferApplication() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetTransfer onDone={this.init}/>,
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
