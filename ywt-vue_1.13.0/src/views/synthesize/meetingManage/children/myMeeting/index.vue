<template>
  <pure-table-area>
    <template #header>
      <div class="flex base-margin-left base-margin-top">
        <PureButtonGroup
          :options="btnGroupConfig"
          style="margin-left: 0"
          @change="changeButtonGroup"
        />
      </div>
      <el-row v-show="showSearchContainer" class=" base-margin-left base-margin-top">
        <el-col :span="24">
          <el-form size="mini" inline :model="searchFormData">
            <el-row>
              <el-col :span="3">
                <el-form-item>
                  <el-input v-model="searchFormData.keyword" placeholder="会议名称" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <MettingSelect v-model="searchFormData.meetingRoomId" placeholder="会议室" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item>
                  <el-date-picker
                    v-model="searchFormData.time"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <UserSelect v-model="searchFormData.hostId" :placeholder="'主持人'" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <UserSelect v-model="searchFormData.attendId" :multiple="true" :placeholder="'参会人员'" />
                </el-form-item>
              </el-col>
              <el-col :span="3">

                <el-form-item>
                  <UserSelect v-model="searchFormData.auditId" :placeholder="'审核人员'" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-button @click="clickSearch">查询</el-button>
                  <el-button type="primary">重置</el-button>
                </el-form-item>
              </el-col>

            </el-row>

          </el-form>
        </el-col>
      </el-row>

    </template>
    <template #body>
      <div ref="tableWrapper" class="table-wrapper">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          border
          :cell-style="tableStyle.cellStyle"
          :empty-text="emptyText"
          :max-height="tableMaxHeight"
        >
          <el-table-column
            label="序号"
            type="index"
            width="85px"
            align="left"
            :fixed="true"
            show-overflow-tooltip
          />
          <el-table-column
            align="left"
            label="状态"
            prop="flag"
            width="140px"
            :fixed="true"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :style="row.flag|stateStyle">{{ row.flag | stateText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="会议主题及议题"
            prop="title"
            width="405px"
            :fixed="true"
            show-overflow-tooltip
          />
          <el-table-column
            align="left"
            label="会议时间"
            prop="time"
            width="152px"
            :fixed="true"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.time }}</span>
              <br>
              <span>{{ row.startTime }}-{{ row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="会议室及地址"
            prop="address"
            width="200px"
            :fixed="true"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.meetingRoomName }}</span>
              <br>
              <span>{{ row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="会议类型"
            prop="type"
            width="200px"
            :fixed="false"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.type | meetingType }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="参与人"
            prop="join"
            width="296px"
            :fixed="false"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.attends | users }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="任务数"
            prop="taskNum"
            width="100px"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ row.taskId | taskNum }}
            </template>
          </el-table-column>
          <el-table-column align="left" label=" 操作" width="260px" :fixed="'right'">
            <template #default="{ row }">
              <OptionsMenu :data="row" @click="clickOptions($event,row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
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
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import tableStyle from '@/views/project/style/table';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';

import PureButtonGroup from '@/components/button/buttonGroup.vue';
import UserSelect from '@/views/project/components/userSelect/index';
import RejectDialog from './components/dialog/reject.vue';
import OptionsMenu from './components/button/buttonOptions.vue';
import MettingSelect from '../meetingMangement/components/select/mettingSelect.vue';

import MeetingBaseInfoPanel from '../meetingMangement/components/panelGroup/reserve.vue';
import MeetingSummaryPanel from '../meetingMangement/components/panelGroup/summary.vue';
import MeetingBaseInfoOrSummaryPanel from '../meetingMangement/components/panelGroup/index.vue';
import { arrayToString, stringToArray, } from '@/utils/common';
import { getDicValue, } from '@/filters';
import { mapActions, } from 'vuex';
import _ from 'lodash';
const stateMap = {
  0: {
    color: '#334266',
    text: '未开始',
  },
  1: {
    color: '#426ED7',
    text: '进行中',
  },
  2: {
    color: '#334266',
    text: '已结束',
  },
  3: {
    color: '#F56C6C',
    text: '驳回',
  },
  4: {
    color: '#F56C6C',
    text: '未审核(作废)',
  },
  5: {
    color: '#F56C6C',
    text: '驳回(已过期)',
  },
  6: {
    color: '#426ED7',
    text: '通过',
  },
};
export default {
  name: 'ZhWdhy',
  components: {
    PureButtonGroup,
    UserSelect,
    OptionsMenu,
    MettingSelect,
  },
  filters: {
    users(val) {
      if (val) {
        if (val instanceof Array && val.length) {
          const userNames = val.map((e) => e.userName);
          return arrayToString(userNames);
        }
        return '-';
      }
      return '-';
    },
    meetingType(val) {
      if (val) {
        const value = getDicValue(val, 'meeting_type');
        if (value && value instanceof Array && value.length) {
          return arrayToString(value);
        }
      }
      return '-';
    },
    taskNum(val) {
      if (val) {
        const value = stringToArray(val);
        return value.length;
      }
      return 0;
    },
    stateStyle(val) {
      let color = '#334266';
      if (stateMap[val]?.color) {
        color = stateMap[val].color;
      }
      return `color:${color}`;
    },
    stateText(val) {
      let text = '-';
      if (stateMap[val]?.text) {
        text = stateMap[val].text;
      }
      return text;
    },
  },
  mixins: [PaginationTable],
  data() {
    return {

      showSearchContainer: false,
      searchFormData: {
        keyword: '',
        meetingRoomId: '',
        time: [],
        hostId: '',
        attendId: '',
        auditId: '',
      },
      listApi: MeetingMangementApi.getMyMeetingList,
      tableStyle,
      btnGroupConfig: [
        {
          name: '我主持的',
          count: '',
          code: 'myHostMeeting',
        },
        {
          name: '我参与的',
          count: '',
          code: 'myAttendMeeting',
        },
        {
          name: '我审核的',
          count: '',
          code: 'myAuditMeeting',
        },
        {
          name: '我创建的',
          count: '',
          code: 'myCreateMeeting',
        },
        {
          name: '更多..',
          count: '',
          code: 'more',

        }
      ],
      btnGroupCode: {
        '我主持的': '1',
        '我参与的': '2',
        '我审核的': '3',
        '我创建的': '4',
      },
      optionsCode: '1',
    };
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
    this.init();
    this.initCount();
  },
  activated() {
    this.initCount();
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    init() {
      this.queryCondition.type = this.optionsCode;
      this.fetchData();
    },
    async initCount() {
      const rs = await MeetingMangementApi.getMyMeetingCount() || {};
      const btnGroupConfigMap = _.keyBy(this.btnGroupConfig, 'code');
      for (const i in rs) {
        btnGroupConfigMap[i].count = rs[i] || '';
      }
      this.btnGroupConfig = Object.values(btnGroupConfigMap);
    },
    clickSearch() {
      const data = this.searchFormData;
      const params = data;
      params.startTime = data.time[0];
      params.endTime = data.time[1];
      this.queryCondition = params;
      this.queryCondition.type = this.optionsCode;
      this.fetchData();
    },
    changeButtonGroup(val) {
      const code = this.btnGroupCode[val];
      if (code) {
        this.showSearchContainer = false;
        this.optionsCode = code;
        this.queryCondition.type = code;
        this.currentPage = 1;
        this.queryCondition.pageNum = this.currentPage;
        this.fetchData();
      } else {
        this.showSearchContainer = true;
      }
    },
    onDone() {
      this.fetchData();
      this.initCount();
    },
    clickOptions(code, item) {
      switch (code) {
        case 'look':
          this.clickLook(item);
          break;
        case 'edit':
          this.clickEdit(item);
          break;
        case 'summary':
          this.clickSummary(item);
          break;
        case 'pass':
          this.clickPass(item);
          break;
        case 'reject':
          this.clickReject(item);
          break;
        case 'delete':
          this.clickDel(item);
          break;
        default:
          break;
      }
    },
    clickLook(item) {
      if (item.summary) {
        this.$drawer({
          width: '1688px',
          component: () => <MeetingBaseInfoOrSummaryPanel data={item} onDone={this.onDone} optionsCode={'look'} />,
        });
      } else {
        this.$drawer({
          width: '1688px',
          component: () => <MeetingBaseInfoPanel data={item} onDone={this.onDone} optionsCode={'look'} />,
        });
      }
    },
    clickEdit(item) {
      this.$drawer({
        width: '1688px',
        component: () => (
          <MeetingBaseInfoPanel optionsCode={'updated'} data={item} onDone={this.onDone} />
        ),
      });
    },
    clickSummary(item) {
      this.$drawer({
        width: '1688px',
        disabled: true,
        component: () => (
          <MeetingSummaryPanel data={item} onDone={this.onDone} />
        ),
      });
    },
    clickDel(item) {
      this.$confirm(`是否删除「${item.title}」会议?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await MeetingMangementApi.deleteMeeting({ id: item.id, });
          this.fetchData();
          this.$message.success('删除成功');
        } catch (error) {
          this.$message.error(error);
        }
      });
    },
    async clickPass(item) {
      try {
        await MeetingMangementApi.rejectOrPassMeeting({
          id: item.id,
          operState: 'meeting_pass',
          remark: '',
        });
        this.onDone();
      } catch (error) {
        this.$message.error(error);
      }
    },
    clickReject(item) {
      this.$dialog({
        title: '驳回',
        position: 'center',
        component: () => <RejectDialog data={item} onDone={this.onDone} />,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  position: relative;
  height: 32px;
  text-align: left;
  margin-left: 34px;
  .item {
    display: inline-flex;
    align-items: center;
    height: 28px;
    border-radius: 4px;
    padding: 2px;
    background: #e9eff5;
    margin-right: 16px;
    ::v-deep .el-badge__content.is-fixed {
      right: 18px;
    }
    :nth-last-child(1) {
      margin-right: 1px;
    }
    > a {
      color: #409eff;
      font-size: 14px;
      line-height: 28px;
      flex: 0 0 auto;
      text-decoration: none;
      cursor: pointer;
      padding: 0 15px;
      &.active {
        color: #ffffff;
        border-radius: 4px;
        background-color: #409eff;
      }
    }
  }
}
</style>
