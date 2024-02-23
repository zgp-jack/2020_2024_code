<!--  -->
<template>
  <JYWPanel
    title="会议纪要"
    width="100%"
    left-flag-title="记录人"
    :left-flag-value="panelInfo.user"
    right-flag-title="记录时间"
    :right-flag-value="panelInfo.time | date('YYYY-MM-DD HH:mm:ss')"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="summary"
    :expand="expand"
    :disabled="Disabled"
  >
    <div style="height:100%">
      <el-form
        ref="form"
        :disabled="Disabled"
        label-position="left"
        :model="formData"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="到会人员" prop="users">
          <UserSelect v-model="formData.users" multiple />
        </el-form-item>
        <el-form-item label="会议纪要" prop="desc">
          <el-input v-model="formData.desc" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-row>
        <el-col :span="2">
          任务
        </el-col>
        <el-col v-if="!Disabled" :span="22">
          <pure-button
            type="wire-frame-auto"
            size="mini"
            label="添加任务"
            @click="clickAddTask"
          />
        </el-col>
      </el-row>
      <el-table
        class="table"
        border
        :data="tableData"
        :cell-style="tableStyle.cellStyle"
      >
        <el-table-column
          align="left"
          show-overflow-tooltip
          type="index"
          label="序号"
          width="85px"
        />
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="taskName"
          label="任务名称"
          width="auto"
        />
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="leaderUser"
          label="责任人"
          width="200px"
        >
          <template #default="{row}">
            {{ row.leaderUser | member }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="planEndDate"
          label="结束时间"
          width="210px"
        />
        <el-table-column
          align="left"
          show-overflow-tooltip
          prop="compRate"
          label="任务进度"
          width="120px"
        >
          <template #default="{row}">
            <TaskProcessTimeLine :id="row.id" :value="row.compRate" :state="row.states" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="!Disabled"
          align="left"
          show-overflow-tooltip
          label="操作"
          width="200px"
        >
          <template #default="{row,$index}">
            <pure-button
              type="text"
              label="查看"
              @click="clickLook(row, $index)"
            />
            <pure-button
              type="text"
              label="编辑"
              @click="onUpdateTask(row, $index)"
            />
            <pure-button
              type="text"
              label="删除"
              @click="clickDel(row, $index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </JYWPanel>
</template>

<script>
import UserSelect from '@/views/project/components/userSelect/index';
import { mapGetters, mapState, } from 'vuex';
import tableStyle from '@/views/project/style/table';
import TaskDialog from '@/views/synthesize/meetingManage/children/meetingMangement/components/task.vue';
import TaskApi from '@/apis/synthesize/taskManagement';
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';
import { arrayToString, stringToArray, } from '@/utils/common';
import TaskProcessTimeLine from '@/views/synthesize/taskManagement/components/task/processTimeLine.vue';
import _ from 'lodash';
export default {
  name: 'SummaryPanel',
  components: {
    UserSelect,
    TaskProcessTimeLine,
  },
  props: {
    optionsCode: {
      type: String,
      // look  add  updated
      default: 'add',
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: Boolean,
  },
  data() {
    return {
      tableStyle,
      tableData: [],
      rules: {
        users: [{ required: true, message: '到会人员不能为空', }],
        desc: [{ required: true, message: '纪要不能为空', }],
      },
      tableDataClickIndex: -1,
      formData: {
        users: '',
        desc: '',
      },
      panelInfo: {
        time: new Date(),
        user: '',
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('project/index', {
      expand: (v) => {
        return v['pancelExpandOptions'].summary;
      },
    }),
    RoomId() {
      return this.data.id || '';
    },
    Disabled() {
      return this.disabled;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let rs = {};
      if (this.RoomId) {
        rs = await MeetingMangementApi.getReserve({ id: this.RoomId, sign: 'summary', });
        const users = rs.users || [];
        if (users.length) {
          this.formData = {
            users: users.map(e => e.user),
            desc: rs.summary || '',
          };
        } else {
          const allUsers = [...rs.attends, ...rs.hosts];
          const UserIds = allUsers.map((e) => e.user);

          this.formData = {
            users: _.uniq(UserIds),
            desc: '',
          };
        }
      }
      this.initPanelInfo(rs);
      this.initTaskData(rs);
    },
    async initTaskData(val) {
      const taskIds = val.taskId ? stringToArray(val.taskId) : [];
      for (const i of taskIds) {
        const rs = await TaskApi.detail(i);
        this.tableData.push(rs);
      }
    },
    initPanelInfo(data) {
      this.panelInfo.user = data?.updateUserName || this.userInfo.name;
      this.panelInfo.time = data?.updateTime || Date.now();
    },
    clickAddTask() {
      this.tableDataClickIndex = -1;
      this.renderTaskDialog('添加任务', {}, 'add');
    },
    clickLook(item, index) {
      this.tableDataClickIndex = index;
      this.renderTaskDialog('查看任务', item, 'look');
    },
    onUpdateTask(item, index) {
      this.tableDataClickIndex = index;
      this.renderTaskDialog('编辑任务', item, 'edit');
    },
    clickDel(item, index) {
      this.$confirm(`是否删除「${item.taskName}」任务?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          if (item.id !== undefined) {
            await TaskApi.del(item.id);
          }
          this.tableData.splice(index, 1);
          this.$message.success('删除成功');
        } catch (error) {
          this.$message.error(error);
        }
      }).catch({});
    },
    renderTaskDialog(title, data, code) {
      this.$dialog({
        top: '5vh',
        title: title,
        width: '898px',
        position: 'center',
        component: () => <TaskDialog optionsCode={code} data={data} onDone={this.onDone} />,
      });
    },
    async saveSummary(taskIds = '') {
      const params = {
        id: this.data.id,
        summary: this.formData.desc,
        meetingUsers: this.anyUserDataToArray(4, this.formData.users),
        taskId: taskIds,
      };
      try {
        await MeetingMangementApi.saveOrUpdatedSummary(params);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    anyUserDataToArray(type, val) {
      const arr = [];
      const value = val instanceof Array ? val : stringToArray(val);
      value.forEach((e) => {
        arr.push({
          type,
          user: e,
        });
      });
      return arr;
    },
    async  saveTask() {
      const data = this.tableData;
      const taskIds = [];
      try {
        if (data.length) {
          for (const i of data) {
            if (i?.id) {
              _.unset(i, 'createTime');
              _.unset(i, 'planDate');
              _.unset(i, 'taskChild');
              _.unset(i, 'partUser');
              _.unset(i, 'createTime');
              const rs = await TaskApi.update(i);
              taskIds.push(rs);
            } else {
              const rs = await MeetingMangementApi.addTask(i);
              taskIds.push(rs);
            }
          }
          await this.saveSummary(arrayToString(taskIds));
        } else {
          await this.saveSummary();
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate(async (valid) => {
          try {
            if (valid) {
              await this.saveTask();
              resolve();
            } else {
              reject('表单校验未通过!');
            }
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    onDone(data) {
      if (Object.values(data).length) {
        if (this.tableDataClickIndex > -1) {
          this.$set(this.tableData, this.tableDataClickIndex, data);
        } else {
          this.tableData.push(data);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.table {
  margin-top: 16px;
}
</style>
