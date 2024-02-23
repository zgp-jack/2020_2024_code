<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-07 17:25:17
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-18 16:46:30
 * @Description:
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top base-margin-right">
            <search
              v-model="searchValue"
              class="base-margin-right"
              placeholder="故障描述"
            />
            <el-form
              size="mini"
              inline
            >
              <el-form-item label="发布者">
                <engineer-select v-model="queryCondition.createUser" size="mini" class="short-condition" clearable filterable multiple collapse-tags placeholder="发布者" />
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

            <pure-button label="查询" @click="onQuery" />
            <el-checkbox v-model="onlySelf" size="mini" style="line-height:34px" @change="onSeeSelf">只看自己</el-checkbox>
            <pure-button label="新增知识" @click="onAddKnowledge" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <knowledge-card v-for="(item) in data" :key="item.id" :data="item" class="base-margin-bottom" @VIEW="onView" @UPDATE="onUpdate" />
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
            <knowledge-classification-tree @node-click="onClassificationNodeClick" />
          </el-col>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import KnowledgeCard from '@/views/knowledgeBase/components/knowledgeCard.vue';
import KnowledgeDrawer from '@/views/knowledgeBase/retrieval/drawer/knowledge.vue';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval';
import KnowledgeClassificationTree from '@/views/knowledgeBase/components/classificationTree.vue';
export default {
  name: 'ZskZskjs',
  components: {
    KnowledgeCard,
    EngineerSelect: () => import('@/views/reportFault/query/component/engineerSelect.vue'),
    KnowledgeClassificationTree,
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
    onAddKnowledge() {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' onDone={this.fetchData}/>,
        width: '1424px',
      });
    },
    onCreateUserChange(value) {
      // this.queryCondition.createUser = value;
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
    onUpdate(id) {
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='UPDATE' id={id} onDone={this.fetchData}/>,
        width: '1424px',
      });
    },
    onView(id) {
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
.empty-text {
  margin-top: 20px;
  text-align: center;
  color: #7D8DB3;
}
</style>
