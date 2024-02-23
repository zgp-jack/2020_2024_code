<template>
  <hyy-view-layout>
    <template #header>
      <query-panel
        @query="onQuery"
        @reset="onReset"
      >
        <el-form-item>
          <el-input v-model="queryData.title" placeholder="知识标题" />
        </el-form-item>
        <el-form-item>
          <fault-type-select
            v-model="queryData.faultType"
            style="width: 100%"
          />
        </el-form-item>
        <!-- <el-form-item>
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
        </el-form-item> -->
        <el-form-item>
          <user-select
            v-model="queryData.createUser"
            collapse-tags
            multiple
            placeholder="创建人"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryData.time"
            format="yyyy-MM-dd"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="更新开始日期"
            end-placeholder="更新结束日期"
            @change="datePicker"
          />
        </el-form-item>
      </query-panel>
    </template>
    <template #aside>
      <FaultTree class="tree" @node-click="handleNodeClick" />
    </template>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryData"
      class="pureTable"
    >
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
        label="创建人"
        prop="createUserName"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
      />
      <el-table-column
        label="状态"
        prop="state"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="0"
            @change="changeEidt(scope.row)"
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
          <template v-if="row.reviewer">
            <span
              v-auth="'kl:knowledge:edit'"
              class="operate-btn"
              @click="editFun(row)"
            >
              编辑
            </span>
            <span
              v-auth="'kl:knowledge:remove'"
              class="operate-btn delete"
              @click="onDelete(row.id)"
            >
              删除
            </span>
          </template>
        </template>
      </el-table-column>
    </pure-table>
  </hyy-view-layout>
</template>
<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import FaultTree from '@/features/system/otherConfig/components/faultTree.vue';
import KnowledgeApi from './api.js';
import KnowledgeDrawer from '../applyManagement/components/knowledge.vue';
import DrawerKnowledgeDetail from '../applyManagement/components/knowledgeDetail.vue';
import IconFile from '@/common/components/attachment/tableCellFile.vue';

export default {
  components: {
    IconFile,
    FaultTree,
    UserSelect,
    QueryPanel,
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
  },
  data() {
    return {
      listApi: KnowledgeApi.getknowledgeData,
      queryData: {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: [],
        // 申请科室
        inDept: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    editFun(row) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' mode={'library'} id={row.id} onDone={this.cancel}/>,
        width: '900px',
      });
    },
    cancel() {
      this.$refs.pureTable.fetchData();
    },
    deleteFun() {
      this.$refs.pureTable.onDel();
    },
    async onDelete(id) {
      try {
        await this.$confirm('确认删除本知识吗？', '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await KnowledgeApi.deleteknowledge(id);
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
    changeEidt(row) {
      const params = {
        id: row.id,
        state: row.state,
      };
      KnowledgeApi.editStateData(params).then(res => {
        this.$message.success('操作成功');
      });
    },
    handleNodeClick(row) {
      this.queryData.faultType = row.dictValue;
      this.init();
    },
    datePicker(val) {
      if (val) {
        this.queryData.updateEndTime = val[0] || '';
        this.queryData.updateStartTime = val[1] || '';
      } else {
        this.queryData.updateEndTime = '';
        this.queryData.updateStartTime = '';
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
        createUser: [],
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
    // 查看
    revoke(row, type) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <DrawerKnowledgeDetail data={row}
          onDone={this.cancel}
          type={type}
        />,
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
</style>
