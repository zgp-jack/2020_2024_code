<!--  -->
<template>
  <el-container>
    <el-header height="48px" class="header_wrapper">

      <span class="header_wrapper--title">{{ title }}</span>
      <span class="header_wrapper--codeName">{{ ItemCodeText }}</span>
      <div v-if="ShowMilestoneOrReference || IsProjectBoard" class="header_wrapper--btn-group">
        <el-button
          v-if="IsLeader || IsJoinUser || IsProjectBoard"
          size="small"
          type="primary"
          @click="clickAddMainTask"
        >添加里程碑
        </el-button>
        <el-button
          v-if="IsLeader || IsJoinUser || IsProjectBoard"
          size="small"
          plain
          type="primary"
          @click="clickReferTemplate"
        >引用模板</el-button>
      </div>
      <el-button
        style="margin-left: 24px"
        size="small"
        plain
        type="primary"
        @click="clickSaveTemplate"
      >保存模板</el-button>
      <el-button
        style="margin-left: 24px"
        size="small"
        plain
        type="primary"
        @click="onDownExcelTemplate"
      >下载导入模板</el-button>
      <template v-if="ShowTableImportButton">
        <el-button
          v-if="IsLeader || IsJoinUser"
          style="margin-left: 24px"
          size="small"
          plain
          type="primary"
          @click="onImportFile"
        >导入</el-button>

      </template>
      <input v-show="false" ref="inputFile" type="file" @change="handleChange">

    </el-header>
    <el-main>
      <el-table
        v-loading="loadingTable"
        :data="TaskListTree"
        height="99%"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        size="mini"
        :indent="0"
        append-to-body
        :row-style="rowStyle"
        :default-sort="{ prop: 'indexNum', order: 'ascending' }"
        :cell-style="tableStyle.cellStyle"
        :cell-class-name="tableStyle.cellClassName"
      >
        <el-table-column prop="indexNum" label="序号" width="auto" />
        <el-table-column
          prop="name"
          label="任务名称"
          min-width="160px"
          :show-overflow-tooltip="false"
          align="left"
        >
          <template #default="{row}">
            <div style="display:flex">
              <i v-if="row.quoteId" class="quote">
                引
              </i>
              <svg-icon v-if="row.isHinge" class="hinge" icon-class="focus-on" />
              <TextContent :text-content="row.name" :wrap="4" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="任务描述"
          min-width="160px"
          :show-overflow-tooltip="false"
          align="left"
        >
          <template #default="{row}">
            <TextContent :text-content="row.remark || '-'" :wrap="4" />
          </template>
        </el-table-column>
        <el-table-column
          prop="planUse"
          label="预计工时"
          width="100px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            <span v-if="row.planUse">
              {{ row.planUse }} 天
            </span>
            <span v-else>
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createUser"
          label="创建人"
          width="100px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            {{ row.createUser | member }}
          </template>
        </el-table-column>
        <el-table-column
          prop="principal"
          label="负责人"
          width="100px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            {{ row.principal | member }}
          </template>
        </el-table-column>
        <el-table-column
          prop="users"
          label="参与人员"
          min-width="160px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            {{ row.users || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始/截止日期"
          width="200px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            <template v-if="!row.startTime && !row.endTime">
              <p class="time">
                {{ row.id |filterMileageSE(taskList)| filterMileageSEFormatterStart }}
              </p>
              <p class="time">
                {{ row.id |filterMileageSE(taskList)| filterMileageSEFormatterEnd }}
              </p>
            </template>
            <template v-else>
              <p class="time">{{ row.startTime | date("YYYY-MM-DD HH:mm") }}</p>
              <p class="time">{{ row.endTime | date("YYYY-MM-DD HH:mm") }}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalProgress"
          label="进度"
          width="94px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            <template v-if="row.quoteId || !row.parentId">
              -
            </template>
            <template v-else-if="row.totalProgress !== null && row.totalProgress">
              <ProcessTimeLine :id="row.id" :value="row.totalProgress + '%'" />
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="file"
          label="附件"
          width="70px"
          :show-overflow-tooltip="true"
          align="left"
        >
          <template #default="{row}">
            <TableCellAttachment :data="row.template" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="ShowTableMemo"
          prop="according"
          label="依据"
          width="150px"
          :show-overflow-tooltip="true"
          align="left"
        />
        <el-table-column v-if="ShowTableOperation" label="操作" width="220px" :show-overflow-tooltip="false" align="left">
          <template #default="{row}">
            <ChangeHandleButtonMenu :data="row" :is-project-board="IsProjectBoard" :params="params" :code="code" @click="onOptions" />
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="footer_wrapper">
      <el-button size="mini" type="primary" @click="clickBackItem">
        返回项目
      </el-button>

      <template v-if="HiddenHandle">
        <el-button
          v-if="showSubmit"
          type="primary"
          size="mini"
          :loading="confirmResultLoading"
          @click="clickConfirmResult"
        >提交</el-button>
        <el-button
          v-if="ShowSubmitChangeButton"
          type="primary"
          size="mini"
          :loading="submitSaveChangeLoading"
          @click="onSubmitSaveChange"
        >提交变更</el-button>
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import ProjectAPI from '@/apis/project';
import { mapGetters, mapMutations, mapState, } from 'vuex';
import ProcessTimeLine from '../../components/panels/childComponents/perojectInfo/processTimeLine.vue';
import tableStyle from '../../style/table';
import TextContent from '@/views/project/components/text/text.vue';
import dialogWidth from '@/views/project/common/width/dialog';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';

import ReferTemplate from '@/views/project/setUp/components/referTemplate.vue';
import SaveTemplate from '@/views/project/setUp/components/saveTemplate.vue';
import TaskMain from '@/views/project/setUp/components/taskMain.vue';
import TaskChild from '@/views/project/setUp/components/taskChild.vue';
import { arrayToTree, stringToArray, } from '@/utils/common';
import ChangeHandleButtonMenu from './changeOptionMenu.vue';
import Handle from './handle.vue';
import downLoadFile from '@/utils/downLoad';
import DialogTaskConfirm from '../dialog/taskConfirm.vue';

export default {
  name: 'TaskTableDialog',
  components: {
    TableCellAttachment,
    ProcessTimeLine,
    TextContent,
    ChangeHandleButtonMenu,
  },
  filters: {
    filterMileageSE(id, childList) {
      const theIdList = childList.filter(e => e.parentId === id);
      if (theIdList.length) {
        const timeStartTimeGather = theIdList.map(e =>
          new Date(e.startTime).getTime()
        );
        const timeEndTimeGather = theIdList.map(e =>
          new Date(e.endTime).getTime()
        );
        const minTime = moment(_.min(timeStartTimeGather)).format(
          'YYYY-MM-DD HH:mm'
        );
        const maxTime = moment(_.max(timeEndTimeGather)).format(
          'YYYY-MM-DD HH:mm'
        );
        return [minTime, maxTime];
      }
      return ['-', '-'];
    },
    filterMileageSEFormatterStart(val) {
      if (val && val.length) {
        return val[0];
      }
      return '-';
    },
    filterMileageSEFormatterEnd(val) {
      if (val && val.length) {
        return val[1];
      }
      return '-';
    },
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    // 项目的开始-结束 日期
    time: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 参数
    params: {
      type: Object,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    isProjectBoard: Boolean,
  },
  data() {
    return {
      tableStyle,
      taskList: [],
      loadingTable: false,
      confirmResultLoading: false,
      submitSaveChangeLoading: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),

    UserId() {
      return this.userInfo.id;
    },
    ItemCode() {
      return this.params?.itemCode || '';
    },

    ItemCodeText() {
      if (this.ItemCode) {
        return `需求编号:${this.ItemCode}`;
      }
      return '';
    },
    TaskListMap() {
      return _.keyBy(this.taskList, 'id');
    },
    TaskListTree() {
      const treeList = arrayToTree(this.taskList, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      });
      return treeList;
    },
    IsLeader() {
      return Number(this.params?.principal) === this.UserId || Number(this.params?.createUser) === this.UserId;
    },
    IsJoinUser() {
      return this.params?.joinUser?.includes(this.UserId);
    },
    //  哪里在用？
    ShowOperation() {
      return !(this.title === '查看任务');
    },

    // 确认结果 显示提交按钮
    IsConfirm() {
      return ['confirm'].includes(this.code);
    },
    showSubmit() {
      if (this.IsConfirm) {
        return (Number(this.params?.principal) === Number(this.UserId));
      }
      return false;
    },

    HiddenHandle() {
      return !(this.code === 'handle');
    },
    // 显示导入按钮
    ShowTableImportButton() {
      return ['append', 'change', 'update'].includes(this.code);
    },
    // 显示table 依据栏
    ShowTableMemo() {
      return ['handle', 'append'].includes(this.code);
    },
    // 显示 table 操作栏
    ShowTableOperation() {
      return ['append', 'handle', 'change', 'update'].includes(this.code);
    },

    // 显示 里程碑 和引用模板
    ShowMilestoneOrReference() {
      return ['change', 'update'].includes(this.code);
    },
    // 显示 提交变更按钮
    ShowSubmitChangeButton() {
      return ['change'].includes(this.code);
    },
    IsProjectBoard() {
      return this.isProjectBoard;
    },

    ...mapState('login', {
      DownUrl: (v) => {
        return v.uriConfig.fileBaseUri;
      },
      ExcelUrl: (v) => {
        return v.templateConfig.excel.replace('/', '');
      },
    }),
    FormatterRequestExcelUrl() {
      return this.DownUrl + this.ExcelUrl;
    },
  },
  mounted() {
    if (this.tableData.length) {
      this.taskList = this.tableData;
      this.SET_TASK_LIST(this.taskList);
    } else {
      this.init();
    }
  },
  methods: {
    ...mapMutations('project/index', ['SET_TASK_LIST']),
    onImportFile() {
      this.$refs.inputFile.click();
    },
    onDownExcelTemplate() {
      downLoadFile(this.FormatterRequestExcelUrl, '项目任务导入模板示例');
    },
    async importExcelFile(files) {
      if (files.length) {
        const reg = /\.(xls|xlsx)$/;
        const file = files[0];
        if (reg.test(file.name)) {
          const loading = this.$loading({
            text: '导入中...',
          });
          try {
            await ProjectAPI.setUp.importExcel({
              itemCode: this.ItemCode,
              file: file,
            });
            this.$message.success('导入成功!');
            this.init();
          } catch ({ message, }) {
            this.$message.error(message);
          } finally {
            loading.close();
          }
        } else {
          this.$message.error('所选中文件格式错误,请检查!');
        }
      }
    },
    handleChange(ev) {
      if (this.taskList.length) {
        this.$message.error('存在任务,不能导入!');
      } else {
        const files = ev.target.files;
        this.importExcelFile(files);
      }
    },
    rowStyle({ row, rowIndex, }) {
      if (row.quoteId === 1) {
        return {
          backgroundColor: '#f7f7f7',
        };
      }
      return {};
    },

    async init(isSet = true) {
      if (this.ItemCode) {
        this.loadingTable = true;
        const result = await ProjectAPI.setUp.getTaskList({ itemCode: this.ItemCode, });
        if (isSet) {
          this.SET_TASK_LIST(result);
        }
        this.$emit('syncData', result);
        this.taskList = result;
        this.loadingTable = false;
      }
    },
    async onSubmitSaveChange() {
      try {
        this.submitSaveChangeLoading = true;
        await ProjectAPI.impose.saveChangeApply(this.ItemCode);
        this.$message.success('保存成功');
        this.$emit('done');
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.submitSaveChangeLoading = false;
      }
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

    async clickConfirmResult() {
      this.$dialog({
        title: '提交确认',
        width: dialogWidth.mini_px,
        component: () => <DialogTaskConfirm data={this.params} onDone={() => { this.$emit('done'); }}/>,
      });
    },

    clickBackItem() {
      this.$emit('done', this.taskList);
    },
    clickAddMainTask() {
      this.$dialog({
        position: 'center',
        width: dialogWidth.mini_px,
        title: '添加里程碑',
        component: () => <TaskMain isEdit={false} projectBoard={this.IsProjectBoard} onDone={this.init} />,
      });
    },
    clickReferTemplate() {
      this.$dialog({
        position: 'center',
        width: dialogWidth.mini_px,
        title: '引用模板',
        component: () => <ReferTemplate onDone={this.init}/>,
      });
    },
    clickSaveTemplate() {
      this.$dialog({
        width: dialogWidth.mini_px,
        position: 'center',
        title: '保存模板',
        component: () => <SaveTemplate />,
      });
    },

    parentTime(pid, field) {
      const listMap = _.keyBy(this.taskList, 'id');
      return listMap[pid][field];
    },
    optionsEdit(row, startEnd, taskId, taskPId, maxDay) {
      if (row.parentId === 0) {
        this.$dialog({
          position: 'center',
          width: dialogWidth.mini_px,
          title: '编辑里程碑',
          component: () => (
            <TaskMain
              title={'编辑任务'}
              info={row}
              isEdit={true}
              onDone={this.init}
              projectBoard={this.IsProjectBoard}
            />
          ),
        });
      }
      if (row.parentId) {
        this.$innerDialog({
          position: 'center',
          width: dialogWidth.mini_px,
          top: '5vh',
          title: '编辑子任务',
          component: () => (
            <TaskChild
              title={'编辑任务'}
              startEnd={startEnd}
              beforeId={row.beforeId}
              info={row}
              id={taskId}
              pId={taskPId}
              maxDay={ maxDay}
              onDone={this.init}
              projectBoard={this.IsProjectBoard}

            />
          ),
        });
      }
    },
    optionsDel(row) {
      let deleteMessage = '';
      if (row?.children && row.children.length) {
        deleteMessage = `是否删除「${row.name}」任务,该任务下存在子级任务,`;
      } else {
        deleteMessage = `是否删除「${row.name}」任务`;
      }
      this.$confirm(deleteMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'customMessageBox',
      }).then(async () => {
        if (this.IsProjectBoard) {
          await ProjectAPI.demandBoard.projectBoardTaskDel(row.id);
        } else {
          await ProjectAPI.setUp.deletedTask(row.id);
        }
        this.init();
        this.$message.success('删除成功');
      });
    },
    optionsAdd(row, startEnd, taskId, taskPId, maxDay) {
      this.$dialog({
        position: 'center',
        width: dialogWidth.mini_px,
        title: row.parentId ? '添加子任务' : '添加任务',
        top: '5vh',
        component: () => (
          <TaskChild
            title={'添加子任务'}
            startEnd={startEnd}
            beforeId={row.beforeId}
            info={{}}
            id={taskId}
            pId={taskPId}
            maxDay={maxDay}
            onDone={this.init}
            projectBoard={this.IsProjectBoard}

          />
        ),
      });
    },
    optionsHandle(row, title) {
      const taskId = row.id;
      const userIds = stringToArray((row.userIds || '') + ',' + row.principal);
      const isUpload = !!row.isSubmit;
      const progressDisabled = title === '补充';
      const data = title === '补充' ? {} : row;
      this.$dialog({
        position: 'center',
        width: dialogWidth.mini_px,
        title: title,
        component: () => (
          <Handle
            info={data}
            id={taskId}
            user-ids={userIds}
            is-upload={isUpload}
            title={title}
            progress-disabled={progressDisabled}
            onDone={this.init}
          />
        ),
      });
    },
    async onOptions(params) {
      const { code, data, } = params;
      let taskId = '';
      let taskPId = '';
      let projectStartStopTime = [];
      let maxDay = 100;
      const parentPlanUse = this.TaskListMap[data.parentId]?.planUse;
      if (parentPlanUse) {
        maxDay = parentPlanUse;
      }

      if (['edit', 'add'].includes(code)) {
        taskId = data.id;
        taskPId = data.parentId;
      }
      if (this.time.length) {
        projectStartStopTime = this.time;
      } else {
        projectStartStopTime = [this.params.startTime, this.params.endTime];
      }
      const id = code === 'edit' ? data.parentId : data.id;
      const start = !data.parentId ? projectStartStopTime[0] : this.parentTime(id, 'startTime') || projectStartStopTime[0];
      const end = !data.parentId ? projectStartStopTime[1] : this.parentTime(id, 'endTime') || projectStartStopTime[1];
      const startEnd = { start, end, };

      switch (code) {
        case 'edit':
          this.optionsEdit(data, startEnd, taskId, taskPId, maxDay);
          break;
        case 'del':
          this.optionsDel(data);
          break;
        case 'add':
          this.optionsAdd(data, startEnd, taskId, taskPId, maxDay);
          break;
        case 'handle':
          this.optionsHandle(data, '处理');
          break;
        case 'append':
          this.optionsHandle(data, '补充');

          break;
        default:
          alert('无效的操作');
          break;
      }
    },
  },
};
</script>
<style   lang="scss">
.table-cell-index{
  > div{
    display: flex;
  }
}

</style>
<style lang="scss" scoped>
.hinge {
  color: rgb(212, 16, 16);
  font-weight: 600;
  font-size: 14px;
  margin-right: 4px;
  // margin-left: 4px;

}
.quote {
  color: rgb(29 163 64);
  font-size: 14px;
  font-style: initial;
  margin-right: 10px;
  display: inline-block;
  border: 1px solid;
  border-radius: 100%;
  margin-left: 4px;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 16px;
}

.header {
  &_wrapper {
    display: flex;
    align-items: center;
    &--title {
      font-size: 18px;
      font-weight: 400;
      color: #2d405e;
    }
    &--btn-group {
      display: inline-block;
      margin-left: 36px;
    }
    &--codeName {
      font-size: 18px;
      font-weight: 400;
      color: #879bba;
      display: inline-block;
      margin-left: 36px;
    }
  }
}
.time{
  margin: 0;
  padding: 0;
}
.footer {
  &_wrapper {
    display: flex;
    align-items: center;
    padding: 0 !important;
    &-save-button {
      background: #fff;
    }
  }
}
</style>
