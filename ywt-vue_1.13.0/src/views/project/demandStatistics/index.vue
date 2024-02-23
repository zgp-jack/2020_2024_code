<!--
  需求统计分析
-->

<template>
  <pure-table
    :list-api="listApi"
    :query-condition="queryCondition"
    class="m-t-18"
  >
    <template #header>
      <el-row
        type="flex"
        align="middle"
        class="query base-margin-left base-margin-top base-margin-right"
      >
        <el-col :span="2">
          <span class="label">需求统计</span>
        </el-col>
        <el-col :span="6">
          <pure-button-group
            :options="groupBtnOptions"
            default-active="按人员"
            @change="handleTabChange"
          />
        </el-col>
        <el-col :span="4">
          <span class="text">
            未分配需求数
            <el-tag type="danger" size="small">
              {{ unassignedDeamndNum }}
            </el-tag>
          </span>
        </el-col>

      </el-row>
    </template>
    <template slot="indexColumn">
      序号
    </template>
    <el-table-column
      :label="labelName"
      prop="name"
      width="auto"
      align="left"
      min-width="139px"
    />
    <el-table-column
      label="需求总数"
      prop="itemCount"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.itemCount }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="需求调研"
      prop="demandInv"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.demandInv }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="初定级"
      prop="waitGrading"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.waitGrading }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="需求分析"
      prop="demandAnalysis"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.demandAnalysis }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="技术分析"
      prop="technicalAnalysis"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.technicalAnalysis }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="二次调研"
      prop="demandInvReview"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.demandInvReview }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="需求立项"
      prop="itemEstablish"
      width="180px"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.itemEstablish }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="需求未通过"
      prop="endInvReject"
      width="auto"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.endInvReject }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="需求转工单"
      prop="endProjectOrder"
      width="auto"
      align="left"
      min-width="180px"
    >
      <template slot-scope="{ row }">
        <el-tag size="small">
          {{ row.endProjectOrder }}
        </el-tag>
      </template>
    </el-table-column>
  </pure-table>
</template>

<script>
import PureTable from '@/feat/component/pureTable';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import ProjectAPI from '@/apis/project';
export default {
  name: 'DemandStatics',
  components: {
    PureTable,
    PureButtonGroup,
  },
  filters: {},
  data() {
    return {
      data: [],
      listApi: ProjectAPI.demand.statics,
      labelName: '姓名',
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
      unassignedDeamndNum: 0,

      queryCondition: {
        // 结束时间
        endTime: '',
        // 开始时间
        startTime: '',
        // 模板 1小组 2负责人 3部门 4涉及系统 5科室  6供应商
        template: 2,
      },
    };
  },
  async mounted() {
    // 获取未分配需求数
    const data = await ProjectAPI.demand.unassignedDeamndNum();
    this.unassignedDeamndNum = data || 0;
  },
  methods: {
    handleTabChange(val) {
      let tem = '';
      switch (val) {
        case '按人员':
          tem = 2;
          this.labelName = '姓名';
          break;
        case '按小组':
          tem = 1;
          this.labelName = '小组';

          break;
        case '按科室':
          tem = 5;
          this.labelName = '科室';
          break;
        default:
          // 按供应商
          tem = 6;
          this.labelName = '供应商';
          break;
      }
      this.queryCondition.template = tem;
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  color: #f26161;
}
.m-t-18 {
  margin-top: 18px;
}
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  display: inline-block;
  width: 100px;
}
</style>
