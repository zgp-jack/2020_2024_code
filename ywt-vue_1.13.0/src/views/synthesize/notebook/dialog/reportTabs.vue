<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-14 13:53:45
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-15 16:40:25
 * @Description:事项报告 - 小组详情
-->
<template>
  <div class="container">
    <el-tabs class="Q-el-tabs-style" :tab-position="'left'" @tab-click="handleClick">
      <el-tab-pane v-for="(item,idx) in userList" :key="idx" :label="item.name">
        <ReportDetailDialog v-if="detailInfo" :detail-info="detailInfo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import NotebookApi from '@/apis/notebook';
import ReportDetailDialog from './reportDetail.vue';
export default {
  components: {
    ReportDetailDialog,
  },
  props: {
    searchForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    userList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: 'common',
      detailInfo: {},
    };
  },
  created() {
    this.getItemReportData(this.userList[0].id);
  },
  methods: {
    handleClick(tab) {
      const userAll = this.userList[tab.index].id;
      console.log(this.userList[tab.index].id);
      this.getItemReportData(userAll);
    },
    async getItemReportData(userAll) {
      this.detailInfo = {};
      const res = await NotebookApi.itemReport({
        ...this.searchForm,
        userAll,
      });
      this.detailInfo = res[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 600px;
  .Q-el-tabs-style{
    height: calc(100% - 15px) !important;
    ::v-deep .el-tabs__header .el-tabs__item {
      color: #000000 !important;
      font-size: 18px !important;
      &.is-active {
        background-color: unset !important;
        color: #2B65D9 !important;
      }
      &.el-tabs__active-bar {
        background-color: #2B65D9 !important;
      }
    }
    ::v-deep .el-tabs__header .el-tabs__active-bar {
      background-color: #2B65D9 !important;
    }
  }
}
</style>
