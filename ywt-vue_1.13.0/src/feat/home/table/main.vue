<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-30 17:54:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:41:34
 * @Description: 主面板
-->
<template>
  <el-card class="container">
    <el-row class="container-header base-margin-left" style="height:55px">
      <pure-button-group v-show="viewType === '卡片'" style="display:inline" :options="groupBtnOptions" default-active="工单" @change="handleTabChange" />
      <span class="todo">
        <span>时间范围</span>
        <el-date-picker
          v-model="queryCondition.dateRange"
          size="mini"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          format="yyyy-MM-dd"
          class="condition date"
          :clearable="true"
          :default-time="['00:00:00','23:59:59']"
          style="margin-left:10px"
          @change="updateRedData"
        />
      </span>
      <span v-show="viewType === '卡片'" class="data-range">
        <span>显示数据范围</span>
        <el-select
          v-model="queryCondition.showRange"
          size="mini"
          style="margin-left:10px"
          @change="handleDataRangeChange"
        >
          <el-option
            v-for="(item,index) in dataRangeOption"
            :key="index"

            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span v-if="showTeamMember && viewType === '卡片'" class="data-range">
        <span>查看组员</span>
        <el-select
          v-model="queryCondition.sendUser"
          collapse-tags
          multiple
          filterable
          clearable
          size="mini"
          style="margin-left:10px"
          @change="updateRedData"
        >
          <el-option
            v-for="(item,index) in teamMemberOption"
            :key="index"

            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span v-show="viewType === '列表'">合计：</span>
      <span v-for="(item,idx) in frontPageAllTotal" v-show="viewType === '列表'" :key="idx" class="data-range" style="margin-left:10px">
        <span>{{ item.name }}</span><span class="all-count">{{ item.count }}</span>
      </span>
      <el-button class="view-type-btn" size="mini" @click="toggleView">
        切换{{ viewType }}
        <svg-icon class-name="list-icon" :icon-class="viewType === '卡片' ? 'cardIcon':'list'" />
      </el-button>

    </el-row>
    <el-row v-show="viewType === '卡片'" class="component">
      <component :is="currentTabComponent" ref="tableComponent" :query-data="queryCondition" @update="updateRedData" />
    </el-row>
    <CardView v-show="viewType === '列表'" ref="CardView" :query-data="queryCondition" :card-index-own-team-list="cardIndexOwnTeamList" @updateHomePageNum="updateHomePageNum" />
  </el-card>
</template>

<script>
import TeamApi from '@/apis/system/group';
import HomeApi from '@/apis/home';
import moment from 'moment';
import PureButtonGroup from '@/components/button/buttonGroup.vue';
import MainWorkOrder from './mainWorkOrder.vue';
import MainTask from './mainTask.vue';
import MainResearch from './mainResearch.vue';
import MainInspection from './mainInspection.vue';
import MainProject from './mainProject.vue';
import CardView from '../card/cardView.vue';
export default {
  components: {
    PureButtonGroup,
    MainWorkOrder,
    MainTask,
    MainResearch,
    MainInspection,
    MainProject,
    CardView,
  },
  provide() {
    return {
      FrontPage: this,
    };
  },
  data() {
    return {
      cardIndexOwnTeamList: [],
      // 类型：卡片 列表 (取反)
      viewType: '卡片',
      groupBtnOptions: [{
        count: null,
        name: '工单',
      }, {
        count: null,
        name: '任务',
      }, {
        count: null,
        name: '调研',
      }, {
        count: null,
        name: '巡检',
      }, {
        count: null,
        name: '项目',
      }],
      todoOptions: [{
        label: '今日待办',
        value: 1,
      }, {
        label: '本周待办',
        value: 2,
      }, {
        label: '本月待办',
        value: 3,
      }],
      dataRangeOption: [{
        label: '查看全部',
        value: -1,
      }, {
        label: '只看自己',
        value: 0,
      }],
      teamMemberOption: [],
      currentTabComponent: 'MainWorkOrder',
      queryCondition: {
        waitWork: 1,
        sendUser: null,
        dateRange: [moment().startOf('week').add(1, 'days').valueOf(), moment().endOf('week').add(1, 'days').valueOf()],
        showRange: 0,
      },
      redDataInterval: null,
      intervalTime: 30000,
      frontPageAllTotal: [],
    };
  },
  computed: {
    showTeamMember() {
      if (this.queryCondition.showRange === 0 || this.queryCondition.showRange === -1) {
        return false;
      } else {
        return true;
      }
    },
  },
  async created() {
    try {
      const list = await TeamApi.ownTeamList();
      this.cardIndexOwnTeamList = list;
      list.map(item => {
        this.dataRangeOption.push({
          label: item.name,
          value: item.id,
        });
      });
      const startDate = moment().startOf('week').add(1, 'days').valueOf();
      const endDate = moment().endOf('week').add(1, 'days').valueOf();
      this.updateRedData(startDate, endDate);
      this.redDataInterval = setInterval(() => {
        this.updateRedData(startDate, endDate);
      }, this.intervalTime);
    } catch (error) {
      this.$message({
        type: 'error',
        message: error,
      });
    }
  },
  destroyed() {
    clearInterval(this.redDataInterval);
  },
  activated() {
    const startDate = moment().startOf('week').add(1, 'days').valueOf();
    const endDate = moment().endOf('week').add(1, 'days').valueOf();
    this.redDataInterval = setInterval(() => {
      this.updateRedData(startDate, endDate);
    }, this.intervalTime);
  },
  deactivated() {
    clearInterval(this.redDataInterval);
  },
  methods: {
    updateHomePageNum(v) {
      this.frontPageAllTotal = v;
    },
    toggleView() {
      this.viewType === '卡片' ? this.viewType = '列表' : this.viewType = '卡片';
    },
    handleTabChange(val) {
      switch (val) {
        case '工单':

          this.currentTabComponent = 'MainWorkOrder';
          break;
        case '任务':
          this.currentTabComponent = 'MainTask';
          break;
        case '调研':
          this.currentTabComponent = 'MainResearch';
          break;
        case '巡检':
          this.currentTabComponent = 'MainInspection';
          break;
        case '项目':
          this.currentTabComponent = 'MainProject';
      }
    },
    async updateRedData(startDate, endDate) {
      console.log('updateRedData');
      const redData = await HomeApi.redData({
        startTime: this.queryCondition.dateRange?.[0],
        endTime: this.queryCondition.dateRange?.[1],
        showRange: this.queryCondition.showRange,
        sendUser: this.queryCondition.sendUser?.join(','),
      });
      this.groupBtnOptions = [{
        count: redData.orderCount || null,
        name: '工单',
      }, {
        count: redData.taskCount || null,
        name: '任务',
      }, {
        count: redData.itemDemandCount || null,
        name: '调研',
      }, {
        count: redData.inspectionCount || null,
        name: '巡检',
      }, {
        count: redData.itemCount || null,
        name: '项目',
      }];
    },
    async handleDataRangeChange(showRange) {
      this.queryCondition.sendUser = [];
      this.updateRedData();
      if (showRange === 0 || showRange === -1) {
        this.teamMemberOption = [];

        return;
      }
      this.teamMemberOption = await this.getTeamMember(showRange);
    },
    async fetchData() {

    },
    async getTeamMember(teamId) {
      try {
        const { userObjs, } = await TeamApi.detail(teamId);
        return userObjs.map(item => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
        return [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  padding-bottom: 0px;
  ::v-deep .el-card__body {
    height:100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // padding:14px 0 0 0;
    padding: 0;
    .container-header{
      display: flex;
    align-items: center;
    height: 55px;
    }
  }
  .component {
    flex:1;

  }
}
.todo,.data-range,.member {
  font-size: 18px;
  font-weight: 400;
  color: #879bba;
  line-height: 14px;
  margin-right: 10px;
}
.todo {
  // margin-left: 50px;
}
.data-range,.member,.todo {
  font-size: 18px;
  // margin-left: 32px;
}
.el-row + .el-row {
  padding-top:12px;
}
.condition {
  width: 166px;
  &.date {
    width: 290px;
  }
}
.view-type-btn{
  position: absolute;
  right: 20px;
}
.btn-name{
  line-height: 20px;
}
.card-icon{
  width: 20px;
  height: 20px;
}
.all-count{
  margin-left: 5px;
  color: rgb(63, 67, 93);
}
.list-icon{

  color:#426ED7
}
</style>

