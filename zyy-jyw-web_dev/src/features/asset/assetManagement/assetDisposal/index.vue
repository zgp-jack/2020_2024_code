/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description  资产处置
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
                label="处置申请"
                @click="onApplication"
              />
            </template>
          </query-panel>
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
              @click="onAssetDetail(row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="申请人"
          prop="createUserName"
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
              v-handle="{
                match:[1,2],
                value: Number(row.auditState)
              }"
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
import UserSelect from '@/features/system/user/components/userSelect.vue';
import AssetDisposalApi from './api';
import DrawerAssetDisposal from './drawer/assetDisposal.vue';
import DrawerAssetDisposalDetail from './drawer/assetDisposalDetail.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import { debounce, } from 'lodash-es';
import {
  ASSET_TRANSFER_AUDIT_STATE,
  ASSET_TRANSFER_AUDIT_STATE_MAP,
} from '@/features/asset/assetManagement/config';

export default {
  components: { QueryPanel, UserSelect, },
  data() {
    return {
      listApi: AssetDisposalApi.getList,
      stateList: ASSET_TRANSFER_AUDIT_STATE,
      ASSET_TRANSFER_AUDIT_STATE_MAP,
      queryData: {
        time: [],
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
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
        time: [],
        // 审核状态(0未审核,1驳回,2已完成)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
      };
      this.init();
    },
    // 撤销
    onRevoke(row) {
      this.$confirm('确认撤销此条申请?', '提示', {}).then(async () => {
        try {
          await AssetDisposalApi.revoke(row.id);
          this.init();
          this.$notify.success('撤销成功');
        } catch (err) {
          this.$notify.error(err);
        }
      }).catch(() => {
      });
    },

    // 处置申请详情
    onAssetDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetDisposalDetail data={row}
          onDone={this.init}
        />,
      });
    },
    //   处置申请
    onApplication() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerAssetDisposal onDone={this.init}/>,
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

