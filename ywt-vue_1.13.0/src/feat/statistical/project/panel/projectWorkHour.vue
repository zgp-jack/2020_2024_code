<!-- 项目工时统计 -->

<template>
  <el-card style="height:598px">
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
          <el-col :span="10">
            <span class="label">项目工时统计</span>
            <pure-button-group
              style="display:inline"
              :options="groupBtnOptions"
              default-active="按人员"
              @change="handleTabChange"
            />
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="time"
              size="mini"
              :clearable="false"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期"
              class="w-100"
              @change="handleTimeChange"
            />
          </el-col>

          <el-col :span="6" style="text-align:right">
            <el-button
              size="mini"
              icon="el-icon-download"
              :disabled="downButtonDisable"
              @click="onDownExcel"
            />
          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column
        label="项目名称"
        prop="projectName"
        width="auto"
        align="left"
        fixed="left"
        min-width="310px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ row.projectName || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        label="项目负责人"
        prop="principalName"
        width="auto"
        align="left"
        fixed="left"
        min-width="140px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ row.principalName || "-" }}
        </template>
      </el-table-column>
      <el-table-column
        label="任务名称"
        prop="workName"
        width="auto"
        align="left"
        fixed="left"
        min-width="310px"
        show-overflow-tooltip
      />
      <el-table-column
        label="任务负责人"
        prop="objName"
        width="auto"
        align="left"
        fixed="left"
        min-width="140px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ row.objName }}
        </template>
      </el-table-column>
      <el-table-column
        label="预计工时(天)"
        prop="title"
        width="auto"
        align="left"
        fixed="left"
        min-width="170px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ row.planUse }}
        </template>
      </el-table-column>
      <el-table-column
        label="进度"
        prop="title"
        width="auto"
        align="left"
        fixed="left"
        min-width="120px"
        show-overflow-tooltip
      >
        <template #default="{row}"> {{ row.progress }}% </template>
      </el-table-column>
      <el-table-column
        label="已用工时(天)"
        prop="alreadyUse"
        width="130px"
        align="left"
        fixed="left"
        show-overflow-tooltip
      />
      <el-table-column
        label="最后更新时间"
        prop="updateTime"
        width="auto"
        align="left"
        fixed="left"
        min-width="234px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ row.updateTime | date("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </pure-table>
  </el-card>
</template>

<script>
import ProjectApi from '../api';
import PureTable from '@/feat/component/pureTable';

import moment from 'moment';
import downLoadFile from '@/utils/downLoad';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';

export default {
  filters: {
    ratePr(val) {
      if (val) {
        return val.toFixed(2) + '%';
      }
      return '-';
    },
  },
  components: {
    PureButtonGroup,
    PureTable,
  },
  data() {
    return {
      groupBtnOptions: [
        {
          count: null,
          name: '按人员',
        },
        {
          count: null,
          name: '按小组',
        },
        {
          count: null,
          name: '按科室',
        },
        {
          count: null,
          name: '按供应商',
        }
      ],
      listApi: ProjectApi.projectWorkHourList,
      time: [],
      defaultStartTime: '',
      defaultEndTime: '',
      queryCondition: {
        // 开始日期
        startTime: '',
        // 结束日期
        endTime: '',
        // 查询类型 user 负责人 team 小组 dept 科室 factory 供应商
        type: 'user',
      },
      rowspan: [],
      downButtonDisable: false,
    };
  },
  created() {
    // 默认时间为上周五下午4点至本周五下午4点。可自选时间。
    const lastweek = moment()
      .endOf('weeks')
      .subtract(1, 'weeks')
      .day(5)
      .hour(16)
      .minute(0)
      .format('YYYY-MM-DD HH:mm');
    const currentweek = moment()
      .day(5)
      .hour(16)
      .minute(0)
      .format('YYYY-MM-DD HH:mm');

    this.time = [lastweek, currentweek];
    this.defaultStartTime = lastweek;
    this.defaultEndTime = currentweek;
    this.queryCondition.startTime = lastweek;
    this.queryCondition.endTime = currentweek;
  },
  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await ProjectApi.projectWorkHourListExportExcel(
          this.queryCondition
        );
        const fileName = `项目工时统计.xlsx`;
        downLoadFile(res.url, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    handleTimeChange(val) {
      console.log(val, '========');
      if (val) {
        this.queryCondition.startTime = val?.length ? val[0] : '';
        this.queryCondition.endTime = val?.length ? val[1] : '';
      } else {
        this.queryCondition.startTime = this.defaultStartTime;
        this.queryCondition.endTime = this.defaultEndTime;
        this.time = [this.defaultStartTime, this.defaultEndTime];
      }
    },

    handleTabChange(val) {
      let type = '';
      switch (val) {
        case '按人员':
          type = 'user';
          break;
        case '按小组':
          type = 'team';
          break;
        case '按科室':
          type = 'dept';

          break;
        default:
          type = 'factory';

          break;
      }
      this.queryCondition.type = type;
    },
  },
};
</script>

<style lang="scss" scoped>

.w-100 {
  width: 100%;
}
::v-deep .el-card__body {
  height: 100%;
  padding: 0;
}
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
</style>
