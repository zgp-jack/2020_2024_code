<template>
  <el-container>
    <el-header>
      <pure-button label="预定会议" :disabled="!IsPrincipal" @click="clickReserve" />
    </el-header>
    <el-main>
      <el-table v-loading="loading" :data="result.list" border>
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
            <span :style=" row.flag | stateColor ">
              {{ row.flag | stateText }}
            </span>
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
        <el-table-column
          align="left"
          label="操作"
          min-width="400px"
          :fixed="'right'"
        >
          <template #default="{ row }">
            <OptionsMenu
              :data="row"
              :options-code="String(row.operaType)"
              :where="'project'"
              @click="clickOptions($event, row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="footer">
      <el-pagination
        :current-page="result.pageNum"
        :page-size="result.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="result.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import panelWidth from '@/views/project/common/width/panel';
import OptionsMenu from '@/views/synthesize/meetingManage/children/myMeeting/components/button/buttonOptions.vue';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';
import { arrayToString, stringToArray, } from '@/utils/common';
import { getDicValue, } from '@/filters';
import MeetingBaseInfoPanel from '@/views/synthesize/meetingManage/children/meetingMangement/components/panelGroup/reserve.vue';
import MeetingSummaryPanel from '@/views/synthesize/meetingManage/children/meetingMangement/components/panelGroup/summary.vue';
import MeetingBaseInfoOrSummaryPanel from '@/views/synthesize/meetingManage/children/meetingMangement/components/panelGroup/index.vue';
import MeetingReject from '@/views/synthesize/meetingManage/children/myMeeting/components/dialog/reject.vue';
import drawerWidth from '../../common/width/drawer';
import { debounce, } from 'lodash';
import { mapActions, mapState, } from 'vuex';
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
  components: {
    OptionsMenu,
  },
  filters: {

    users(val) {
      if (val) {
        if (val instanceof Array && val.length) {
          const userNames = val.map(e => e.userName);
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
    stateColor(val) {
      if (stateMap[val]) {
        return `color:${stateMap[val].color}`;
      }
      return `color:#334266`;
    },
    stateText(val) {
      if (stateMap[val]) {
        return `${stateMap[val].text}`;
      }
      return `-`;
    },
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      panelWidth,
      loading: false,
      result: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },

      queryParams: {
        itemCode: '',
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  computed: {
    ...mapState('login', {
      UserId: (data) => {
        return data.userInfo.id;
      },
    }),
    ItemCode() {
      return this.data?.itemCode || '';
    },
    IsPrincipal() {
      return this.data.principal === this.UserId;
    },
  },
  watch: {
    queryParams: {
      deep: true,
      handler: debounce(function () {
        this.init();
      }, 300),
    },
  },
  mounted() {
    this.queryParams.itemCode = this.ItemCode;

    // this.init();
  },
  methods: {
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),

    handleSizeChange(N) {
      this.queryParams.pageSize = N;
    },
    handleCurrentChange(P) {
      this.queryParams.pageNum = P;
    },
    async init() {
      try {
        // this.queryParams.itemCode = this.ItemCode;
        this.loading = true;
        this.result = await MeetingMangementApi.getItemMeeting(
          this.queryParams
        );
        this.loading = false;
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.loading = false;
      }
    },
    clickReserve() {
      this.$innerDrawer({
        width: drawerWidth.medium_pr,
        component: () => (
          <MeetingBaseInfoPanel
            data={this.data}
            optionsCode={'add'}
            where={'project'}
            onDone={this.onDone}
          />
        ),
      });
    },
    onDone() {
      this.FETCH_PERFORM_EVENT({ name: 'imposeList', });
      this.init();
      // this.$emit('done');
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
        this.$innerDrawer({
          width: drawerWidth.larger_pr,
          component: () => (
            <MeetingBaseInfoOrSummaryPanel
              data={item}
              onDone={this.onDone}
              optionsCode={'look'}
            />
          ),
        });
      } else {
        this.$innerDrawer({
          width: drawerWidth.larger_pr,
          component: () => (
            <MeetingBaseInfoPanel
              data={item}
              onDone={this.onDone}
              optionsCode={'look'}
            />
          ),
        });
      }
    },
    clickEdit(item) {
      this.$innerDrawer({
        width: drawerWidth.larger_pr,
        component: () => (
          <MeetingBaseInfoPanel
            optionsCode={'updated'}
            data={item}
            onDone={this.onDone}
          />
        ),
      });
    },
    clickSummary(item) {
      this.$innerDrawer({
        width: drawerWidth.larger_pr,
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
          this.init();
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
        component: () => <MeetingReject data={item} onDone={this.onDone} />,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0;
}
</style>
