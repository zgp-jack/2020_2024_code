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
              <el-input v-model="queryData.title" placeholder="知识标题" prefix-icon="el-icon-search" />
            </el-form-item>
            <el-form-item>
              <fault-type-select
                v-model="queryData.faultType"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="queryData.applyStatus"
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
              <user-select
                v-model="queryData.submitUser"
                collapse-tags
                multiple
                placeholder="申请人"
              />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="queryData.time"
                format="yyyy-MM-dd"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="申请开始日期"
                end-placeholder="申请结束日期"
                @change="datePicker"
              />
            </el-form-item>
            <template #right>
              <pure-button
                v-auth="'kl:apply:add'"
                icon="add"
                label="新增"
                @click="applyFun('add')"
              />
            </template>
          </query-panel>
        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          label="知识标题"
          prop="title"
          show-overflow-tooltip
        >
          <template #default="{row}">
            <span class="operate-btn" @click="revoke(row, 'view')">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="故障分类"
          prop="faultTypeName"
        />
        <el-table-column
          label="申请人"
          prop="submitUserName"
        />
        <el-table-column
          label="申请时间"
          prop="createTime"
        />
        <el-table-column
          label="状态"
          prop="applyStatus"
        >
          <template #default="{row}">
            <pure-type-text
              :config="CONSUMABLE_APPLAY_AUDIT_STATE_MAP"
              :type="row.applyStatus"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="附件"
          width="100"
        >
          <template #default="{row}">
            <IconFile :data="row.enclosure || [] " />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop=""
        >
          <template #default="{row}">
            <span v-if="(row.applyStatus == '1' || row.applyStatus == '4') && row.applicant" v-auth="'kl:apply:edit'" class="operate-btn" @click="editFun(row)">编辑</span>
            <span v-if="row.applyStatus == '2' && row.reviewer" v-auth="'kl:apply:audit'" class="operate-btn" @click="revoke(row)">去审核</span>
            <span v-if="(row.applyStatus == '1' || row.applyStatus == '4') && row.applicant" v-auth="'kl:apply:remove'" class="operate-btn delete" @click="onDelete(row.id)">删除</span>
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
import UserSelect from '@/features/system/user/components/userSelect.vue';
import {
  CONSUMABLE_APPLAY_AUDIT_STATE,
  CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
} from '../config';
import KnowledgeDrawer from './components/knowledge.vue';
import DrawerKnowledgeDetail from './components/knowledgeDetail.vue';
import KnowledgeApi from './api.js';
import IconFile from '@/common/components/attachment/tableCellFile.vue';

export default {
  components: {
    IconFile,
    UserSelect,
    PureButton,
    QueryPanel,
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
  },
  data() {
    return {
      listApi: KnowledgeApi.getApplyListData,
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
        submitUser: null,
        // 申请科室
        inDept: null,
        operatorType: '',
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    datePicker(val) {
      if (val) {
        this.queryData.applyStartTime = val[0] || '';
        this.queryData.applyEndTime = val[1] || '';
      } else {
        this.queryData.applyEndTime = '';
        this.queryData.applyStartTime = '';
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
        submitUser: null,
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
    // 去审核
    revoke(row, type) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerKnowledgeDetail data={row}
          onDone={this.cancel}
          type={type}
        />,
      });
    },
    deleteFun() {
      this.$refs.pureTable.onDel();
    },
    async onDelete(id) {
      try {
        await this.$confirm('确认删除本知识吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await KnowledgeApi.deleteKnowledge(id);
        this.$notify.success('删除成功');
        this.deleteFun();
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    onDetail(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerKnowledgeDetail data={row}
          onDone={this.cancel}
        />,
      });
    },
    // 新增
    applyFun(row) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' onDone={this.cancel}/>,
        width: '900px',
      });
    },
    cancel() {
      this.$refs.pureTable.fetchData();
    },
    editFun(row) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='UPDATE' id={row.id} onDone={this.cancel}/>,
        width: '900px',
      });
    },
  },
};
</script>
<style lang='scss'
  scoped
>
.operate-btn {
  margin-right: 16px;
  font-size: 14px;
  color: #006666;
  cursor: pointer;

  &.delete {
    color: #ff836b;
  }
}
.pureTable {
  padding: 0 16px;
}
</style>
