<template>
  <el-container>
    <el-main>
      <el-container class="impose-container">
        <el-header class="impose-header">
          <el-row class="base-container">
            <el-col :span="10" class="base-container-info">
              <span class="name">
                模板名称
              </span>
              <el-tooltip class="item" effect="dark" :content="templateInfo.name" placement="bottom">
                <span class="value">{{ templateInfo.name }}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="5" class="base-container-info">
              <span class="name">
                所属科室
              </span>
              <span class="value">{{ templateInfo.deptId | office }}</span>
            </el-col>
            <el-col :span="4" class="base-container-info">
              <span class="name">
                所属运维小组
              </span>
              <span class="value">
                {{ templateInfo.teamId | groupName }}
              </span>

            </el-col>
            <el-col class="base-container-info" :span="1">
              <pure-button
                v-if="isTemplate"
                type="text"
                label="编辑"
                @click="editTemplate(templateInfo.id)"
              />
            </el-col>

            <el-col :span="4" class="base-container-info T-R">
              <pure-button
                v-if="isTemplate"
                type="wire-frame-auto"
                size="mini"
                label="添加里程碑"
                @click="taskAdd"
              />
            </el-col>
          </el-row>
        </el-header>
        <el-main class="impose-main">
          <el-table
            :data="treelist"
            row-key="id"
            :tree-props="{ children: 'children' }"
            :indent="0"
            default-expand-all
            border
            :cell-style="tableStyle.cellStyle"

            size="mini"
            :default-sort="{ prop: 'indexNum', order: 'ascending' }"
          >
            <el-table-column prop="indexNum" show-overflow-tooltip label="序号" width="85px" />
            <el-table-column
              v-for="v in config"
              :key="v.property"
              :label="v.label"
              :property="v.property"
              :filters="v.filter ? v.filter : null"
              :column-key="v.property"
              :formatter="v.formatter ? v.formatter : null"
              :width="v.w ? v.w : 'auto'"
              align="left"
              show-overflow-tooltip
            >
              <template v-if="v.slot" #default="scope">
                <el-button
                  type="text"
                  @click="options('edit', scope.row)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="options('del', scope.row)"
                >删除</el-button>
                <el-button
                  type="text"
                  @click="options('add', scope.row)"
                >{{ scope.row.parentId ? '添加子任务':'添加任务' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-main>
    <el-aside style="width: 288px; height: 100%; background: #fff">
      <TemplalteList @info="getTemplateInfo" />
    </el-aside>
  </el-container>
</template>

<script>
import { config, } from './table.config';
import { arrayToTree, } from '@/utils/common';
import ProjectAPI from '@/apis/project';
import { mapMutations, } from 'vuex';
import tableStyle from '../style/table';
import { deptId, teamIdToName, } from '@/filters';
import dialogWidth from '@/views/project/common/width/dialog';

export default {
  name: 'XmMbgl',
  filters: {
    office(n) {
      if (n) {
        return deptId(n);
      }
      return '-';
    },
    groupName(n) {
      if (n) {
        return teamIdToName(n);
      }
      return '-';
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    TaskChild: () => import('./components/child.vue'),
    // eslint-disable-next-line vue/no-unused-components
    TaskMain: () => import('./components/main.vue'),
    TemplalteList: () => import('./components/templateList.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Edit: () => import('./components/edit.vue'),
  },
  data() {
    return {
      tableStyle,
      config,
      taskChildrenVisible: false,
      taskMainVisible: false,
      taskID: 0,
      taskPID: 0,
      TaskName: '添加子任务',
      templateInfo: {
        name: '',
        id: '',
        depId: [],
        teamId: 0,
      },
      index: 0,
      taskInfo: {},
      tableData: [],
      isTemplate: false,
      maxDay: 100,
      isEdit: false,
    };
  },
  computed: {
    treelist() {
      // return ;[];
      return arrayToTree(
        this.tableData,
        {
          pfield: 'parentId',
          ufield: 'id',
          sub_name: 'children',
        },
        0
      );
    },
    mainList() {
      return this.tableData.filter((e) => !e.parentId);
    },
  },
  mounted() {
    this.$store.dispatch('team/center/FETCH_TEAM_LIST', {});
    this.SET_PERVIEW(false);
  },
  methods: {
    ...mapMutations('project/index', ['SET_PERVIEW']),
    /**
     * 获取模板基本信息
     */
    getTemplateInfo(v) {
      this.index = 0;
      if (
        Object.prototype.toString.call(v) === '[object Object]' &&
        Object.values(v).length
      ) {
        this.index = v.index || 0;
        this.templateInfo = v;
      } else if (v instanceof Array && v.length) {
        this.templateInfo = v[this.index];
        this.isTemplate = true;
      } else {
        this.tableData = [];
        return;
      }
      this.getTaskList(this.templateInfo.id);
    },
    editTemplate() {
      this.$dialog({
        title: '编辑模板',
        position: 'center',
        width: dialogWidth.mini_px,
        component: () => <Edit is-edit={true} info={this.templateInfo} />,
      });
    },
    taskAdd() {
      this.TaskName = '添加里程碑';
      this.taskInfo = {};
      this.isEdit = false;
      this.$dialog({
        position: 'center',
        width: dialogWidth.mini_px,
        title: this.TaskName,
        component: () => (
          <TaskMain
            template-id={Number(this.templateInfo.id)}
            info={this.taskInfo}
            title={this.TaskName}
            list={this.mainList}
            is-edit={this.isEdit}
            onDone={this.getTaskList}
          />
        ),
      });
    },
    /**
     * 获取任务列表
     */
    async getTaskList(id) {
      this.tableData = await ProjectAPI.template.getTaskList(id);
    },
    options(type, row) {
      switch (type) {
        case 'edit':
          this.TaskName = '编辑里程碑';
          this.taskInfo = row;
          this.taskID = row.id;
          this.taskPID = row.parentId;
          if (row.parentId === 0) {
            this.isEdit = true;
            this.taskMainVisible = true;
            this.$dialog({
              position: 'center',
              width: dialogWidth.mini_px,
              title: '编辑里程碑',
              component: () => (
                <TaskMain
                  template-id={Number(this.templateInfo.id)}
                  info={this.taskInfo}
                  title={'编辑里程碑'}
                  list={this.mainList}
                  is-edit={this.isEdit}
                  onDone={this.getTaskList}
                />
              ),
            });
          }
          if (row.parentId) {
            this.taskChildrenVisible = true;
            this.$dialog({
              position: 'center',
              width: dialogWidth.mini_px,
              title: '编辑任务',
              component: () => (
                <TaskChild
                  id={this.taskID}
                  template-id={Number(this.templateInfo.id)}
                  title={'编辑任务'}
                  p-id={this.taskPID}
                  info={this.taskInfo}
                  max-day={this.maxDay}
                  onDone={this.getTaskList}
                />
              ),
            });
          }
          break;
        case 'del':
          this.$confirm(`是否删除${row.name}任务`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await ProjectAPI.template.deleteTask(row.id);
            await this.getTaskList(this.templateInfo.id);
            this.$message.success('删除成功');
          });
          break;
        case 'add':
          this.taskInfo = {};
          this.TaskName = '添加子任务';
          this.taskChildrenVisible = true;
          this.maxDay = row.time || 100;
          this.taskID = row.id;
          this.taskPID = row.parentId;
          this.$dialog({
            position: 'center',
            width: dialogWidth.mini_px,
            title: this.TaskName,
            component: () => (
              <TaskChild
                id={this.taskID}
                template-id={Number(this.templateInfo.id)}
                title={this.TaskName}
                p-id={this.taskPID}
                info={this.taskInfo}
                max-day={this.maxDay}
                onDone={this.getTaskList}
              />
            ),
          });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.impose{
  &-container{
    padding-right:12px ;

  }
  &-header,&-main{
    padding: 0 12px ;

    background: #fff;
  }
}
.base {
  &-container {
    height: 100%;
      display: flex;
  align-items: center;
  height: 60px;
    &-info {
         overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      > .name {
        font-size: 18px;
        font-weight: 400;
        color: #879bba;
      }
      > .value {
        font-size: 18px;
        font-weight: 400;
        color: #334266;

      }
    }
  }
}
.T{
  &-R{
    text-align: right;
  }
}

</style>
