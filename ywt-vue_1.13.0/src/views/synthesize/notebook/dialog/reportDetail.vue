<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-14 13:53:45
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-01-16 11:03:12
 * @Description:事项报告 - 人员详情
-->
<template>
  <div class="wrapper">
    <el-tabs v-model="activeName" @tab-click="onTabClick">
      <el-tab-pane label="日常工作" name="common">
        <div v-for="(item,index) in commonList" :key="index" class="common-item">
          {{ index+1 }}.{{ item.name }};  (已完成)
        </div>
        <div v-show="!commonList.length">暂无数据</div>
      </el-tab-pane>
      <el-tab-pane label="项目工作" name="project">
        <div v-for="(item,index) in projectList" :key="index" class="item">
          <div>[{{ item.itemCode }}-{{ item.projectLevelToName }}-{{ item.itemToName }}]</div>
          <div>[参与人员] {{ item.joinUser }}</div>
          <div>[本周计划]</div>
          <div v-for="(item1,index1) in item.thisWeekList" :key="index1">
            {{ index1+1 }}.{{ item1.name }}; (已完成)
          </div>
          <div>[下周计划]</div>
          <div v-for="(item2,index2) in item.nextWeekList" :key="index2">
            {{ index2+1 }}.{{ item2.name }};
          </div>
        </div>
        <div v-show="!projectList.length">暂无数据</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    detailInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: 'common',
      loading: true,
      commonList: [],
      projectList: [],
    };
  },
  watch: {
    detailInfo: {
      handler(newVal, oldVal) {
        const { dailyWorkList, itemWorkList, } = newVal;
        this.commonList = dailyWorkList || [];
        this.projectList = itemWorkList || [];
      },
      deep: true,
      immediate: true,
    },
  },
  created() {

  },
  methods: {
    onTabClick() {

    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  // ::v-deep .el-tabs__header .el-tabs__item.is-active {
  //   background-color: red !important;
  //   color: #426ED7 !important;
  // }
  ::v-deep .el-tabs__header .el-tabs__item {
      color: #000000 !important;
      font-size: 18px !important;
      &.is-active {
        background-color: unset!important;
        color: #2B65D9 !important;
      }
      &.el-tabs__active-bar {
        background-color: #2B65D9 !important;
      }
    }
  ::v-deep .el-tabs__item{
    font-size: $--pure-base-font-size;
    line-height: $--pure-base-font-size;
    height: 32px;
  }
  ::v-deep .el-tabs__content {
    height: 27vw;
    overflow-y: auto;
  }
  .item {
    margin-bottom: 48px;
    div+div {
      margin-top: 16px;
    }
  }
  .common-item{
    margin-bottom: 16px;
  }
}
</style>
