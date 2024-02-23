<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 17:53:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-09 16:03:07
 * @Description:统计分析-巡检
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
        </div>
      </div>

      <div class="main">
        <div class="pure-placeholder" />
        <div class="table">
          <pure-table
            ref="pureTable"
            :list-api="listApi"
            :query-condition="queryCondition"
          >
            <template slot="header">
              <el-row
                type="flex"
                align="middle"
                class="query base-margin-left base-margin-top base-margin-right"
              >
                <el-col :span="20">

                  <span class="label">巡检统计</span>
                  <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按工程师" @change="handleTabChange" />
                </el-col>
                <el-col :span="4" style="text-align:right">
                  <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />
                </el-col>
              </el-row>
            </template>
            <template slot="indexColumn">
              序号
            </template>
            <el-table-column :label="nameLabel" prop="name" show-overflow-tooltip="" />
            <el-table-column label="巡检总数" prop="itemCount">
              <template slot-scope="{row}">
                <el-tag size="mini" type="info">{{ row.itemCount }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="巡检完成情况">
              <el-table-column label="已巡" prop="complete">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="info">{{ row.complete }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="未巡" prop="overtime">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="danger">{{ row.overtime }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="巡检完成率" prop="completeRale" />
            </el-table-column>
            <el-table-column label="巡检情况">
              <el-table-column label="巡检正常" prop="normal">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="info">{{ row.normal }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="限时整改" prop="rectification">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="warning">{{ row.rectification }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="转工单" prop="toOrder">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="warning">{{ row.toOrder }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="未处理" prop="untreated">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="warning">{{ row.untreated }}</el-tag>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="漏检情况">
              <el-table-column label="漏检数" prop="omit">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="danger">{{ row.omit }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="漏检率" prop="omitRate" />
            </el-table-column>
          </pure-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import InspectionApi from './api';
import PureTable from '@/feat/component/pureTable';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'TjfxXj',
  components: {
    PureTable,
    PureButtonGroup,
  },
  data() {
    return {
      period: [Moment().startOf('month').format('YYYY-MM-DD'), Moment().endOf('month').format('YYYY-MM-DD')],
      list: [{}],
      listApi: InspectionApi.inspectionList,
      groupBtnOptions: [{
        count: null,
        name: '按工程师',
      }, {
        count: null,
        name: '按巡检单元',
      }, {
        count: null,
        name: '按巡检设备',
      }, {
        count: null,
        name: '按科室',
      }, {
        count: null,
        name: '按小组',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1按工程师2按巡检单元3按巡检设备4按科室5按小组6按供应商
      nameLabel: '巡检人',
      queryCondition: {
        startTime: Moment().startOf('month').format('YYYY-MM-DD'),
        endTime: Moment().endOf('month').format('YYYY-MM-DD'),
        template: 1,
      },
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
      downButtonDisable: false,
    };
  },
  mounted() {
    this.onQuery();
  },
  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await InspectionApi.inspectionListExportExcel(this.queryCondition);
        const fileName = `巡检统计分析.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    onQuery() {
      this.startTime = this.period?.[0];
      this.endTime = this.period?.[1];
      this.queryCondition.startTime = this.startTime;
      this.queryCondition.endTime = this.endTime;
    },

    handleTabChange(val) {
      switch (val) {
        case '按工程师':
          this.template = '1';
          this.nameLabel = '巡检人';
          break;
        case '按巡检单元':
          this.template = '2';
          this.nameLabel = '巡检单元';
          break;
        case '按巡检设备':
          this.template = '3';
          this.nameLabel = '设备名称';
          break;
        case '按科室':
          this.template = '4';
          this.nameLabel = '科室';
          break;
        case '按小组':
          this.template = '5';
          this.nameLabel = '小组名';
          break;
        case '按供应商':
          this.template = '6';
          this.nameLabel = '供应商';
          break;
      }
      this.queryCondition.template = this.template;
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
  height: 64px;
  background: #ffffff;
  width: calc(100% + 12px);
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  padding-top: 16px;
}

.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden ;
  .pure-placeholder {
     height: 64px;
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
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
</style>
