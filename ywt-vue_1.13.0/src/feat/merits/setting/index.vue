<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:17:17
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-07-05 17:45:14
 * @Description:绩效-绩效设置
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <!-- <div class="flex base-margin-left base-margin-top base-margin-right">
          </div> -->

        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <period-panel class="panel" @changeId="onChangeId" />
            <role-score-panel :id="id" class="panel" />
            <level-panel :id="id" class="panel" />
            <detail-rule-panel :id="id" class="panel" />
          </div>
        </template>
      </pure-table-area>
    </el-main>
  </el-container>
</template>

<script>
import PeriodPanel from './panel/period.vue';
import RoleScorePanel from './panel/roleScore.vue';
import LevelPanel from './panel/level.vue';
import DetailRulePanel from './panel/detailRule.vue';
export default {
  name: 'JxJxsz',
  components: {
    PeriodPanel,
    RoleScorePanel,
    LevelPanel,
    DetailRulePanel,
  },
  data() {
    return {
      id: null,
    };
  },
  mounted() {

  },
  methods: {
    onChangeId(id) {
      this.id = id;
    },
  },

};
</script>

<style lang="scss" scoped>
.panel {
  border-bottom: 1px solid #e6eaf2;
  ::v-deep .title {
    font-weight: 400;
    text-align: left;
    color: #334266;
    line-height: $--pure-base-font-size;
    font-size: $--pure-base-font-size;
    margin-bottom: 16px;
  }

}
.table-wrapper {
  overflow: scroll;
}
</style>
