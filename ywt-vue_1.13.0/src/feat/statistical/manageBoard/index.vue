<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 17:54:12
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-09 16:54:19
 * @Description:统计分析-管理看板
-->
<template>
  <el-container>
    <el-main>
      <div class="pure-top">
        <div class="content">
          <el-row type="flex" align="middle">
            <span class="title">统计分析</span>
            <el-date-picker
              v-model="period"
              size="mini"
              type="daterange"
              align="right"
              unlink-panels
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
            <pure-button label="查询" class="base-margin-left" @click="onQuery" />
          </el-row>
          <el-row class="tabs">
            <el-tabs v-model="activeName" @tab-click="onTabChange">
              <el-tab-pane label="科内" name="0" />
              <el-tab-pane label="供应商" name="1" />
            </el-tabs>
          </el-row>
        </div>
      </div>

      <div class="main">
        <div class="pure-placeholder" />
        <el-row class="card" :gutter="12">
          <el-col :span="6">
            <div class="item">
              <div>
                故障报修
              </div>
              <el-row>
                <el-col :span="6">
                  <div class="label">{{ activeName==='0'?'报修数':'指派数' }}</div>
                  <div><el-tag type="info" size="mini">{{ cardDetail.orderNum }}</el-tag></div>
                </el-col>
                <el-col :span="6">
                  <div class="label">未完成</div>
                  <div><el-tag type="warning" size="mini">{{ cardDetail.orderIncomplete }}</el-tag></div>
                </el-col>
                <el-col :span="6">
                  <div class="label">超时</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.orderOvertime }}</el-tag></div>
                </el-col>
                <el-col :span="6">
                  <div class="label">催单</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.reminder }}</el-tag></div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div>
                项目管理
              </div>
              <el-row>
                <el-col v-if="activeName==='0'" :span="6">
                  <div class="label">需求数</div>
                  <div><el-tag type="info" size="mini">{{ cardDetail.demandNum }}</el-tag></div>
                </el-col>
                <el-col :span="activeName==='1'?8:6">
                  <div class="label">立项数</div>
                  <div><el-tag type="info" size="mini">{{ cardDetail.itemNum }}</el-tag></div>
                </el-col>
                <el-col :span="activeName==='1'?8:6">
                  <div class="label">实施数</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.itemIncomplete }}</el-tag></div>
                </el-col>
                <el-col :span="activeName==='1'?8:6">
                  <div class="label">实施超期</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.itemOvertime }}</el-tag></div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div>
                任务管理
              </div>
              <el-row>
                <el-col :span="8">
                  <div class="label">任务数</div>
                  <div><el-tag type="info" size="mini">{{ cardDetail.taskNum }}</el-tag></div>
                </el-col>
                <el-col :span="8">
                  <div class="label">未完成</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.taskIncomplete }}</el-tag></div>
                </el-col>
                <el-col :span="8">
                  <div class="label">超期</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.taskOvertime }}</el-tag></div>
                </el-col>

              </el-row>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item">
              <div>
                巡检管理
              </div>
              <el-row>
                <el-col :span="8">
                  <div class="label">巡检数</div>
                  <div><el-tag type="info" size="mini">{{ cardDetail.inspectionNum }}</el-tag></div>
                </el-col>
                <el-col :span="8">
                  <div class="label">超期未巡</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.inspectionOvertime }}</el-tag></div>
                </el-col>
                <el-col :span="8">
                  <div class="label">故障</div>
                  <div><el-tag type="danger" size="mini">{{ cardDetail.inspectionFault }}</el-tag></div>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>
        <div class="table">
          <department-panel v-if="activeName==='0'" :query-condition="queryCondition" />
          <manufacture-panel v-if="activeName==='1'" :query-condition="queryCondition" />

        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import ManageBoardApi from './api';
import DepartmentPanel from './panel/department.vue';
import ManufacturePanel from './panel/manufacture.vue';
import Moment from 'moment';
export default {
  name: 'TjfxGlkb',
  components: {
    DepartmentPanel,
    ManufacturePanel,
  },
  data() {
    return {
      period: [Moment().startOf('month').format('YYYY-MM-DD'), Moment().endOf('month').format('YYYY-MM-DD')],
      activeName: '0',
      queryCondition: {
        startTime: Moment().startOf('month').format('YYYY-MM-DD'),
        endTime: Moment().endOf('month').format('YYYY-MM-DD'),
        type: '0',
      },
      list: [{}],
      listApi: ManageBoardApi.workCountList,
      columns: [],
      cardDetail: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  mounted() {
    this.fetchCardDetail();
  },
  methods: {
    async fetchCardDetail() {
      const data = await ManageBoardApi.cardsDetail(this.queryCondition);
      this.cardDetail = Object.assign({}, data);
    },
    onTabChange(a) {
      if (this.activeName !== this.queryCondition.type) {
        this.queryCondition.type = this.activeName;
        this.fetchCardDetail();
      }
    },
    onQuery() {
      const startTime = this.period?.[0];
      const endTime = this.period?.[1];
      this.queryCondition.startTime = startTime;
      this.queryCondition.endTime = endTime;
      this.fetchCardDetail();
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-top {
  .title {
    font-size: 24px;
    margin-right: 48px;
  }
  height: 104px;
  background: #ffffff;
  width: calc(100% + 12px);
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
}
.tabs {
  position: absolute;
  bottom: 0;
  ::v-deep .el-tabs__header .el-tabs__item.is-active {
    background-color: unset !important;
    color: #4574E6 !important;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: unset;
    z-index: 1;
  }
  ::v-deep .el-tabs__item {
    font-size: 18px;
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
.card {
  height: 118px;
  margin-bottom: 10px;

  .item {
    height: 100%;
    min-height: 118px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .label {
      font-size: 18px;
      line-height: 26px;
      color: rgba(26,33,51,0.45);
    }
  }
}
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden ;
  .pure-placeholder {
     height: 104px;
  }
  .table {
    flex: 1;
    border-radius: 4px;
    ::v-deep {
      .table-area {
        border-radius: 4px;
      }
    }
  }
}
.sub-title {
  font-size: 18px;
  font-family: AlibabaPuHuiTi_2_65_Medium, AlibabaPuHuiTi_2_65_Medium-Regular;
  font-weight: 400;
  text-align: left;
  color: rgba(26,33,51,0.85);
  line-height: 26px;
}
</style>
