/**
* @file index.vue
* @author huang
* @date 2023/10/26
* @description 耗材申领
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
        class="pureTable"
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
              <department-cascader
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
                format="yyyy-MM-dd"
                type="daterange"
                value-format="yyyy-MM-dd"
                @change="datePicker"
              />
            </el-form-item>
            <template #right>
              <pure-button
                icon="add"
                label="耗材申领"
                @click="apply"
              />

            </template>
          </query-panel>

        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          label="申请时间"
          prop="name"
        >
          <template #default="{row}">
            <pure-button
              :label="row.createTime"
              type="text"
              @click="onDetail(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="申请人"
          prop="createUserName"
        >
          <!--          -->
        </el-table-column>
        <el-table-column
          label="申请科室"
          prop="inDeptName"
        >
          <!--          -->
        </el-table-column>
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

        <el-table-column
          label="操作"
          prop=""
        >
          <template #default="{row}">
            <pure-button
              label="撤销"
              type="text"
              @click="revoke(row)"
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
import ApplyApi from './api.js';
import DrawerApply from './drawer/apply.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import DepartmentCascader from '@/features/system/departmentManagement/components/deptCascader.vue';
import {
  CONSUMABLE_APPLAY_AUDIT_STATE,
  CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
} from '@/features/asset/consumableManagement/config';
import DrawerDetail from './drawer/detail.vue';

export default {
  components: {
    DepartmentCascader,
    UserSelect,
    PureButton,
    QueryPanel,
  },
  data() {
    return {
      listApi: ApplyApi.getList,
      stateList: CONSUMABLE_APPLAY_AUDIT_STATE,
      CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
      queryData: {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
        // 申请科室
        inDept: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    datePicker(val) {
      if (val) {
        this.queryData.createStartTime = val[0] || '';
        this.queryData.createEndTime = val[1] || '';
      } else {
        this.queryData.createStartTime = '';
        this.queryData.createEndTime = '';
      }
    },
    onQuery() {
      this.init();
    },
    onReset() {
      this.queryData = {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
        // 申请科室
        inDept: null,
      };
      this.init();
    },
    // 初始化
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    // 撤销
    revoke(row) {
      this.$confirm('确认撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(async () => {
        try {
          await ApplyApi.revoke(row.id);
          this.init();
          this.$notify.success('撤销成功');
        } catch (err) {
          this.$notify.error(err);
        }
      });
    },
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerDetail data={row}
          onDone={this.init}
        />,
      });
    },
    // 登记
    handleCommand(command) {
      if (command === 'register') {
        this.register();
      }
    },

    // 申领
    apply() {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerApply onDone={this.init}/>,
      });
    },

  },
};
</script>
<style lang='scss'
  scoped
>

.pureTable {
  padding: 0 16px;
}
</style>
