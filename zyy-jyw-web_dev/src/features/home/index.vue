<template>
  <el-container>
    <el-main class="main">
      <el-row>
        <el-col :span="24">
          <my-statistics />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" style="padding-right: 11px">
          <el-row :gutter="11">
            <el-col :span="10">
              <my-schedule />
            </el-col>
            <el-col :span="14">
              <repair-source />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="home_card home_card_center">
            <div class="home_card_header">
              <span>报修故障分类排名</span>
            </div>
            <div class="home_card_body fault_table">
              <el-table
                :data="faultTypeData"
                style="width: 100%;font-size: 14px;"
                :cell-style="{padding:'8px'}"
                max-height="260px"
              >
                <el-table-column label="排名" width="80" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.$index==0" class="first_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else-if="scope.$index==1" class="second_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else-if="scope.$index==2" class="third_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else>{{ scope.$index + 1 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="faultTypeToName"
                  label="故障分类"
                  align="center"
                />
                <el-table-column
                  prop="count"
                  label="报修数量"
                  align="center"
                />
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18" style="padding-right: 11px">
          <div class="home_card home_card_bottom">
            <div class="home_card_header">
              <span>工单告警</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="onShowMsg">查看更多</el-button>
            </div>
            <div class="home_card_body order_warning_table">
              <el-table
                :data="orderWarningData"
                style="width: 100%;font-size: 14px;"
                :cell-style="{padding:'14px'}"
                max-height="320px"
              >
                <el-table-column label="告警内容" align="center">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">你有{{ scope.row.count }}个工单30分钟内同时报修
                      【{{ scope.row.parentFaultTypeToName }}】，请谨慎</span>
                  </template>
                </el-table-column>
                <el-table-column label="工单数" align="center" width="160" prop="count" />
                <el-table-column label="故障分类" align="center" width="280" prop="faultTypeToName" />
                <el-table-column label="告警时间" align="center" width="180" prop="warningTime" />
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <div class="home_card home_card_bottom">
            <div class="home_card_header">
              <span>工程师接单数排名</span>
            </div>
            <div class="home_card_body user_order_table">
              <el-table
                :data="userOrderRank"
                style="width: 100%;font-size: 14px;"
                :cell-style="{padding:'8px'}"
                max-height="320px"
              >
                <el-table-column label="排名" width="80" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.$index==0" class="first_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else-if="scope.$index==1" class="second_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else-if="scope.$index==2" class="third_tag">{{ scope.$index + 1 }}</el-tag>
                    <el-tag v-else>{{ scope.$index + 1 }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userName"
                  label="姓名"
                  align="center"
                />
                <el-table-column
                  prop="end"
                  label="已完成"
                  align="center"
                />
                <el-table-column
                  prop="process"
                  label="处理中"
                  align="center"
                />
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import myStatistics from './myStatistics.vue';
import mySchedule from './mySchedule.vue';
import repairSource from './repairSource.vue';
import { getOrderUserRank, getOrderFaultRank, getOrderWarningList, } from '@/features/home/api';

export default {
  components: {
    myStatistics,
    mySchedule,
    repairSource,
  },
  data() {
    return {
      color1: '#409EFF',
      faultTypeData: [], // 报修故障分类排名
      userOrderRank: [], // 工程师接单数排名
      orderWarningData: [], // 告警消息
    };
  },
  mounted: function () {
    this.getOrderWarningList();
    this.getOrderUserRank();
    this.getOrderFaultRank();
  },
  methods: {
    /* 点击工单告警 */
    onShowMsg() {
      this.$router.push({ path: '/giveAlarm', });
    },
    getOrderWarningList() {
      getOrderWarningList().then((res) => {
        console.log(res);
        if (res) {
          this.orderWarningData = res.rows;
        }
      });
    },
    getOrderUserRank() {
      getOrderUserRank().then((res) => {
        if (res) {
          this.userOrderRank = res;
        }
      });
    },
    getOrderFaultRank() {
      getOrderFaultRank().then((res) => {
        if (res) {
          this.faultTypeData = res;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/common/styles/theme/handle.scss";

.main-content-wrapper {
  padding: 11px 11px 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex: auto;
  min-height: 0;
}

.layout-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.el-row {
  margin-bottom: 11px;

  &:last-child {
    margin-bottom: 0;
  }
}

.home_card_center {
  height: 320px;
}

.home_card_bottom {
  height: 400px;
}

/* 卡片样式*/
.home_card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #FFFFFF;
  overflow: hidden;
  color: #2D405E;
  transition: 0.3s;
}

.home_card_header {
  padding: 12px 12px;
  box-sizing: border-box;

  span {
    @include font_color_imp('color-primary');
    font-size: 15px;
    font-weight: bold;
  }
}

.home_card_body {
  padding: 12px;
}

/*排名序号*/
.first_tag {
  background-color: #FF6347 !important;
  color: #ffffff !important;
  border-color: #FF6347 !important;
}

.second_tag {
  background-color: #FFB90F !important;
  color: #ffffff !important;
  border-color: #FFB90F !important;
}

.third_tag {
  background-color: #1E90FF !important;
  color: #ffffff !important;
  border-color: #1E90FF !important;
}

/*去掉排名表格行下划线*/
.fault_table ::v-deep .el-table td.el-table__cell {
  border-bottom: none;
}

.order_warning_table ::v-deep .el-table td.el-table__cell {
  border-bottom: none;
}

.user_order_table ::v-deep .el-table td.el-table__cell {
  border-bottom: none;
}

//去掉最下面的那一条线
.el-table::before {
  height: 0px;
}

</style>
