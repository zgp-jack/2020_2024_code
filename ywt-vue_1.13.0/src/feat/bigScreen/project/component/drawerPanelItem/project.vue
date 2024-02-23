<!-- 项目信息 -->
<template>
  <Panel
    :header-top="{
      title:'创建信息',
      text:`创建人:${panelInfo.createUser}`
    }"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="140px"
      size="mini"
      label-position="right"
      disabled
    >
      <el-form-item label="项目名称" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="项目描述" required>
        <el-input v-model="formData.memo" type="textarea" rows="5" />
      </el-form-item>
      <el-form-item label="项目起止日期" required>
        <el-date-picker
          v-model="formData.time"
          class="w-100"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="关联项目">
        <ProjectSelect v-model="formData.upItem" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核人" required>
            <UserSelect v-model="formData.reviewPeople" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" required>
            <DicSelect v-model="formData.itemType" dic-key="projectType" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" required>
            <DicSelect v-model="formData.urgentLevel" dic-key="itemPriority" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目负责人" required>
            <UserSelect v-model="formData.principalpeople" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目参与人员">
            <UserSelect v-model="formData.itemUsers" multiple />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目级别">
            <el-radio-group v-model="formData.itemLevel">
              <el-radio
                v-for="item in dictionary['itemProjectLevel']"
                :key="item.id"
                :label="Number(item.value)"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-form-item label="组员">
          <el-tag
            v-for="(v, i) in JoinUsers"
            :key="i"
            type="info"
            size="mini"
          >{{ v }}</el-tag>
        </el-form-item>
      </el-row>

      <el-form-item label="附件">
        <File :data="formData.file" />
      </el-form-item>
    </el-form>
    <el-row
      style="
          display: flex;
          align: center;
          padding: 25px 0 9px 0;
          border-top: 1px solid #ecf0f7;
        "
    >
      <el-col :span="24">
        <span style="margin-right: 20px" class="form-tag--span">任务信息</span>
        <Button @click="clickEditTaskBtn">
          查看任务
        </Button>
      </el-col>
    </el-row>
    <el-table
      :data="TaskListTree"
      :row-style="rowStyle"
      :header-row-style="headerRowStyle"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      row-key="id"
      style=" margin-bottom: 20px"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
      size="mini"
      :indent="0"
      :default-sort="{ prop: 'indexNum', order: 'ascending' }"
    >
      <!-- :cell-style="tableStyle.cellStyle" -->
      <el-table-column :show-overflow-tooltip="true" width="140px" prop="indexNum" label="序号" align="left" />
      <el-table-column :show-overflow-tooltip="true" width="160px" prop="name" label="任务名称" align="left" />
      <el-table-column :show-overflow-tooltip="true" width="100px" prop="planUse" label="预计工时" align="left">
        <template #default="{row}">
          {{ row['planUse']?row['planUse'] +'天' :'' }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" width="100px" prop="principal" label="负责人" align="left">
        <template #default="{row}">
          {{ row['principal'] | member }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始/截止日期" align="left">
        <template #default="{row}">
          <template v-if="!row['startTime']">
            <p class="tag-p">{{ computedMileageSE(row['id'], TaskList)[0] }}</p>
            <p class="tag-p">{{ computedMileageSE(row['id'], TaskList)[1] }}</p>
          </template>
          <template v-else>
            <p class="tag-p">{{ row['startTime'] | date('YYYY-MM-DD HH:mm') }}</p>
            <p class="tag-p">{{ row['endTime'] | date('YYYY-MM-DD HH:mm') }}</p>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Drawer :visible.sync="visible" size="87.91%" :data-width="'87.91%'">
      <template #title>
        任务查看
      </template>
      <TaskTable :data="TaskListTree" :task-list="TaskList" />
    </Drawer>
  </Panel>
</template>

<script>
import { mixins_base, mixins_rules, mixins_task, } from '@/minxins/project';
import { member, } from '@/filters';
import _ from 'lodash';
import moment from 'moment';
import ProjectSelect from '@/views/project/components/select/selectProject.vue';
import DicSelect from '@/views/project/components/select/selectDic';
import File from '../file/index.vue';
import Panel from '../panel/index.vue';
import ElTableStyle from '@/feat/bigScreen/style/table';
import Button from '../button/index.vue';
import { arrayToTree, } from '@/utils/common';
import Drawer from '../drawer/index.vue';
import TaskTable from '../table/projectTask.vue';
export default {
  name: 'ProjectInfo',
  components: {
    DicSelect,
    File,
    Panel,
    ProjectSelect,
    Button,
    Drawer,
    TaskTable,
  },
  mixins: [ElTableStyle, mixins_base, mixins_rules, mixins_task],
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
      visible: false,
      id: 0,
      // 上级项目id 用作提示处理
      upItemId: null,
      formData: {
        name: '',
        memo: '',
        time: [],
        upItem: '',
        reviewPeople: '',
        itemType: '',
        urgentLevel: '',
        principalpeople: '',
        itemUsers: [],
        itemLevel: '',
        file: JSON.stringify([]),
      },

      panelInfo: {
        createUser: '',
        createTime: '',
      },

    };
  },
  computed: {
    ProjectData() {
      return this.data.info || {};
    },
    TaskListTree() {
      const task = _.cloneDeep(this.data.work);
      const rs = arrayToTree(task, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      });
      return rs;
    },
    TaskList() {
      const task = this.data.work;
      return task;
    },
    JoinUsers() {
      let taskPrincipals = _.map(this.TaskList, (e) => e.principal);
      taskPrincipals = _.uniq(taskPrincipals);
      taskPrincipals = taskPrincipals.map(e => member(e));

      let taskJoinUsers = _.filter(this.TaskList, (item) => {
        return item.users;
      });
      taskJoinUsers = _.map(taskJoinUsers, (item) => {
        return item.users;
      });
      taskJoinUsers = _.filter(taskJoinUsers, (e) => e !== '');
      taskJoinUsers = taskJoinUsers.length ? taskJoinUsers.join(',').split(',') : [];
      return _.uniq([...taskPrincipals, ...taskJoinUsers]);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.formData.name = this.ProjectData.title;
      this.formData.memo = this.ProjectData.remark;
      this.formData.time = [
        this.ProjectData.startTime || Date.now(),
        this.ProjectData.endTime || Date.now()
      ];
      this.formData.reviewPeople = this.ProjectData.reviewer;
      this.formData.itemType = this.ProjectData.itemType;
      this.formData.urgentLevel = this.ProjectData.priority;
      this.formData.principalpeople = this.ProjectData.principal;
      this.formData.itemUsers = this.ProjectData.joinUser;
      this.formData.itemLevel = this.ProjectData.projectLevel;
      this.formData.file = this.ProjectData.enclosure;
      this.formData.joinUser = this.ProjectData.joinUser;
      this.formData.upItem = this.ProjectData.parentId;
      this.upItemId = this.ProjectData.parentId || null;
      for (const i in this.formData) {
        if (!this.formData[i]) {
          this.formData[i] = '';
        }
      }
      this.panelInfo.createUser = member(this.ProjectData.createUser);
      this.panelInfo.createTime = this.ProjectData.createTime;
    },

    computedMileageSE(id, childList) {
      const theIdList = childList.filter(e => e.parentId === id);
      if (theIdList.length) {
        const timeStartTimeGather = theIdList.map(e => new Date(e.startTime).getTime());
        const timeEndTimeGather = theIdList.map(e => new Date(e.endTime).getTime());
        const minTime = moment(_.min(timeStartTimeGather)).format('YYYY-MM-DD HH:mm');
        const maxTime = moment(_.max(timeEndTimeGather)).format('YYYY-MM-DD HH:mm');
        return [minTime, maxTime];
      }
      return ['-', '-'];
    },

    clickEditTaskBtn() {
      this.visible = true;
    },
    done() {},

  },
};
</script>
<style lang='scss' scoped>
@import "~@/feat/bigScreen/style/form.scss";

.w-100 {
  width: 100%;
}
.tag{
  &-p{
    margin: 0;
  }
}
.content-span {
  font-size: 14px;
  color: #879bba;
  > p {
    font-size: 14px;
    font-weight: 400;
    text-align: justify;
    color: #dcdfe6;
    margin: 0;
    padding: 0;
  }
}
.el-tag + .el-tag {
  margin-left: 4px;
}
</style>
