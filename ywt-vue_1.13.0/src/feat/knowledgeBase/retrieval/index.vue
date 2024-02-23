<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 14:31:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-17 10:00:11
 * @Description:知识库检索
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right">

            <el-form
              size="mini"
              inline
              style="flex:1"
            >
              <el-form-item label="">
                <search
                  v-model="searchValue"
                  class="base-margin-right"
                  placeholder="故障描述"
                />
              </el-form-item>

              <el-form-item label="发布者">
                <!-- <engineer-multi-select v-model="queryCondition.createUser" size="mini" class="short-condition" clearable filterable multiple collapse-tags placeholder="发布者" /> -->
                <engineer-select v-model="queryCondition.createUser" class="short-condition" clearable filterable multiple collapse-tags placeholder="处理人" />
              </el-form-item>
              <el-form-item label="发布日期">
                <el-date-picker
                  v-model="queryCondition.publishTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  class="condition date"
                />
              </el-form-item>
            </el-form>
            <div style="width:320px !important; ">
              <pure-button label="查询" type="wire-frame" class="base-margin-right" @click="onQuery" />
              <el-checkbox v-model="onlySelf" size="mini" style="line-height:32px" @change="onSeeSelf">只看自己</el-checkbox>
              <pure-button label="新增知识" @click="onCreateKnowledge" />
            </div>

          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <knowledge-card v-for="(item) in data" :key="item.id" :data="item" class="base-margin-bottom" @VIEW="onViewKnowledge" @UPDATE="onUpdateKnowledge" />
            <div v-if="!data.length" class="empty-text">{{ emptyText }}</div>
          </div>
        </template>
        <template slot="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>
    </el-main>
    <el-aside style="width: 288px; height: 100%">
      <el-container>
        <el-header class="aside-header" height="42px">
          知识分类
        </el-header>
        <el-main class="department-nav">
          <el-col :span="24">
            <tree-dic-tree dic-key="faultClassification" @node-click="onClassificationNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import KnowledgeBaseRetrievalApi from './api';
import KnowledgeDrawer from './drawer/knowledge.vue';
import KnowledgeCard from './component/knowledgeCard.vue';
import TreeDicTree from '@/feat/system/dictionary/tree/component/treeDicTree';
import PaginationTable from '@/minxins/common/paginationTable';

export default {
  name: 'ZskZskjs',
  components: {
    KnowledgeCard,
    EngineerSelect: () => import('@/views/reportFault/query/component/engineerSelect.vue'),
    TreeDicTree,
  },
  mixins: [PaginationTable],
  data() {
    return {
      listApi: KnowledgeBaseRetrievalApi.list,
      onlySelf: false,
    };
  },
  async created() {
    this.fetchData();
  },
  methods: {
    onCreateKnowledge() {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' onDone={this.fetchData}/>,
        width: '1424px',
      });
    },
    onSeeSelf() {
      const createUser = this.onlySelf ? this.$store.getters.userInfo.id + '' : '';
      this.$set(this.queryCondition, 'createUser', createUser);
      this.onQuery();
    },
    onQuery() {
      this.queryCondition.startTime = this.queryCondition.publishTime?.[0];
      this.queryCondition.endTime = this.queryCondition.publishTime?.[1];
      this.fetchData();
    },
    onUpdateKnowledge(id) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='UPDATE' id={id} onDone={this.fetchData}/>,
        width: '1424px',
      });
    },
    onViewKnowledge(id) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='VIEW' id={id}/>,
        width: '1424px',
      });
    },
    onClassificationNodeClick(node) {
      this.queryCondition.type = node.id;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.aside-header {
  background: #e2e3e7;
  font-size: $--pure-base-font-size;
  text-align: center;
  color: #334266;
  line-height: 42px;
  font-family:AlibabaPuHuiTi-2-55-Regular, PingFangSC, PingFangSC-Regular, Neue, Helvetica, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}
.flex {
  justify-content: space-between;
}
.table-wrapper {
  overflow: scroll;
}
.condition-label {
  font-size: $--pure-base-font-size;
  color: #7D8DB3;
  line-height: 34px;
  margin-right:8px;
}
.el-form-item--mini.el-form-item {
    margin-bottom: 0px;
}
 .short-condition {
    width:220px;
  }
.empty-text {
  margin-top: 20px;
  text-align: center;
  color: #7D8DB3;
}
</style>
