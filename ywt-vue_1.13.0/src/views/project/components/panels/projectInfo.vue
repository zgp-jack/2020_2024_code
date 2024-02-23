<!-- 项目信息 -->
<template>
  <JYWPanel
    :key="'projectInfo'"
    p-k="projectInfo"
    title="项目信息"
    left-flag-title="创建人"
    :left-flag-value="panelInfo.createUser | member"
    right-flag-title="创建时间"
    :right-flag-value="panelInfo.createTime"
    :show-expand="$attrs.expand"
    :expand="expand"
    :height="$attrs.height"
    :disabled="disabled"
  >
    <el-form
      ref="form"
      :model="formData"
      label-width="140px"
      size="mini"
      label-position="right"
      :rules="rules"
      :disabled="disabled"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="项目描述" prop="memo">
        <el-input v-model="formData.memo" type="textarea" rows="5" />
      </el-form-item>
      <el-form-item label="项目起止日期" prop="time">
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
        <ProjectSelect v-model="formData.upItem" :disabled="disabled" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核人" prop="reviewPeople">
            <UserSelect v-model="formData.reviewPeople" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="itemType">
            <DicSelect v-model="formData.itemType" dic-key="projectType" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="urgentLevel">
            <DicSelect v-model="formData.urgentLevel" dic-key="itemPriority" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目负责人" prop="principalpeople">
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
            <DicRadio v-model="formData.itemLevel" :type="'number'" :dic-key="'itemProjectLevel'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="项目属性">
            <DicRadio v-model="formData.itemAttribute" :type="'string'" :dic-key="'item_attribute'" />
          </el-form-item>
        </el-col>
        <el-col v-if="Members.length" :span="24">
          <el-form-item label="组员">
            <el-tag
              v-for="(v, i) in Members"
              :key="i"
              type="info"
              size="mini"
            >{{ v }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="附件">
        <Upload v-model="formData.file" />
      </el-form-item>
    </el-form>
    <template v-if="itemCode">
      <el-row
        style="
          display: flex;
          align: center;
          padding: 25px 0 9px 0;
          border-top: 1px solid #ecf0f7;
        "
      >
        <el-col :span="24">
          <span style="margin-right: 20px">任务信息</span>
          <template v-if="ShowEditButton">
            <pure-button
              :label="!isLookTask ? '编辑任务' : '查看任务'"
              @click="clickEditTaskBtn(isLookTask)"
            />
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">

          <el-table
            ref="infoTable"
            :data="TaskListTree"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children' }"
            size="mini"
            :indent="0"
            append-to-body
            :cell-style="tableStyle.cellStyle"
            :default-sort="{ prop: 'indexNum', order: 'ascending' }"
            :cell-class-name="tableStyle.cellClassName"
          >
            <el-table-column prop="indexNum" align="left" label="序号" width="auto" />
            <el-table-column prop="name" align="left" label="任务名称" min-width="98px" :show-overflow-tooltip="false">
              <template #default="{row}">
                <TextContent :text-content="row.name" :wrap="2" />
              </template>
            </el-table-column>
            <el-table-column prop="planUse" align="left" label="预计工时" width="">
              <template #default="{row}">
                <template v-if="row.planUse">
                  {{ row.planUse }}天
                </template>
                <template v-else>
                  -
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="principal" align="left" label="负责人" width="">
              <template #default="{row}">
                {{ row.principal | member }}
              </template>
            </el-table-column>
            <el-table-column prop="startTime" align="left" label="开始/截止日期" min-width="200px">
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

          </el-table>
        </el-col>
      </el-row>
    </template>
  </JYWPanel>
</template>

<script>
import { mixins_base, mixins_rules, } from '@/minxins/project';
import { mapGetters, mapMutations, mapState, } from 'vuex';
import { date, member, } from '@/filters';
import _ from 'lodash';
import ProjectAPI from '@/apis/project';
import tableStyle from '../../style/table';
import moment from 'moment';
import ProjectSelect from '../select/selectProject.vue';
import TextContent from '@/views/project/components/text/text.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import TaskTable from '../../impose/components/projectTaskTable.vue';
import Upload from '@/components/upload';
import { arrayToTree, } from '@/utils/common';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
export default {
  name: 'ProjectInfo',
  components: {
    Upload,
    TextContent,
    ProjectSelect,
    DicSelect,
    DicRadio,

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
  mixins: [mixins_base, mixins_rules
  //  mixins_task
  ],
  props: {
    where: {
      type: String,
      // 用于处理项目看板的编辑
      default: 'Project',
    },
  },
  data() {
    return {
      tableStyle,
      visibles: {
        referVisible: false,
        saveVisible: false,
        addVisible: false,
      },
      id: 0,
      // 上级项目id 用作提示处理
      upItemId: null,
      formData: {
        name: '',
        memo: '',
        time: [],
        upItem: '',
        reviewPeople: '',
        itemType: 1,
        urgentLevel: 2,
        principalpeople: '',
        itemUsers: [],
        itemLevel: 1,
        file: JSON.stringify([]),
        itemAttribute: '1',
      },

      panelInfo: {
        createUser: '',
        createTime: '',
      },
      tableCheckedParams: {
        allChecked: false,
        childCheckeds: [],
      },
      taskList: [],
      SW: {
        keyWord: '',
        W: {
          code: '',
        },
        N: 999,
        P: 1,
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入项目名称',
          }
        ],
        memo: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入项目描述',
          }
        ],
        time: [
          {
            required: true,
            trigger: 'array',
            message: '请选择项目起止日期',
          }
        ],
        reviewPeople: [
          {
            required: true,
            trigger: 'change',
            message: '请选择审核人',
          }
        ],
        itemType: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择项目类型',
          }
        ],
        urgentLevel: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择项目优先级',
          }
        ],
        principalpeople: [
          {
            required: true,
            trigger: 'change',
            message: '请选择项目负责人',
          }
        ],
      },
    };
  },
  computed: {

    TaskListTree() {
      const treeList = arrayToTree(this.taskList, {
        pfield: 'parentId',
        ufield: 'id',
        sub_name: 'children',
      });
      return treeList;
    },
    ...mapGetters(['userInfo']),
    ...mapState('project/index', {
      expand: (v) => {
        return v['pancelExpandOptions'].projectInfo;
      },
      disabled: (v) => {
        return v['pancelDisabledOptions'].projectInfo;
      },
    }),
    Members() {
      const list = _.uniqBy(this.taskList, 'id');
      if (!list.length) {
        return [];
      }
      const principals = [];
      for (const i of list) {
        if (i.principal) {
          principals.push(member(i.principal));
        }
      }

      const people = _.map(_.filter(list, 'users'), 'users');
      let participants = [];
      if (people.length) {
        participants = people.join(',').split(',');
      }

      return _.uniq([...participants, ..._.uniq(principals)]);
    },
    //
    ShowEditButton() {
      if (this.IsProjectBoard) {
        return this.IsProjectBoard;
      }
      return this.where !== 'projectBoard';
    },
    // 是否是需求看板过来的
    IsProjectBoard() {
      if (this.where === 'projectBoard') {
        return this.IsITBP;
      }
      return false;
    },
    MyPermissions() {
      return this.userInfo.permissions || [];
    },
    IsITBP() {
      return this.MyPermissions.includes('ITBP_MANAGER');
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.itemCode) {
        this.getEditValue();
      } else {
        this.panelInfo = {
          createUser: this.userInfo.id,
          createTime: moment().format('YYYY-MM-DD HH:mm'),
        };
      }
    });
    this.SW.W.code = 'all';
  },
  methods: {
    ...mapMutations('project/index', ['SET_ITEM_CODE']),

    onDone(data) {
      this.afterDone(this.refName);
      this[this.ArgumentName] = data;
    },
    async getEditValue() {
      const rs = this.getterPanelGroupData;
      const info = rs.info;
      this.formData.name = info.title;
      this.formData.memo = info.remark;
      this.formData.time = [
        info.startTime || Date.now(),
        info.endTime || Date.now()
      ];
      this.formData.reviewPeople = info.reviewer;
      this.formData.itemType = info.itemType;
      this.formData.urgentLevel = info.priority;
      this.formData.principalpeople = info.principal;
      this.formData.itemUsers = info.joinUser;
      this.formData.itemLevel = info.projectLevel;
      this.formData.file = info.enclosure;
      this.formData.joinUser = info.joinUser;
      this.formData.upItem = info.parentId;
      this.formData.itemAttribute = info.itemAttribute || '1';
      this.upItemId = info.parentId || null;
      for (const i in this.formData) {
        if (!this.formData[i]) {
          this.formData[i] = '';
        }
      }
      this.panelInfo = _.pick(info, Object.keys(this.panelInfo));

      this.taskList = rs.work;
    },
    async successTask() {
      if (this.itemCode) {
        this.taskList = await ProjectAPI.setUp.getTaskList({ itemCode: this.itemCode, });
      }
    },

    async submit(type) {
      return new Promise((resolve, reject) => {
        let submitParams = {};
        const isProjectBoard = this.where === 'projectBoard';
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            // 常规项目
            if (this.formData.itemAttribute === '1') {
              if (!this.taskList.length && type === 'confirm' && this.itemCode) {
                reject('请先完善任务信息');
                return;
              }
              if (!this.taskList.length && type === 'confirm' && !this.itemCode) {
                reject('请先保存');
                return;
              }
            }

            submitParams = {
              parentId: this.formData.upItem,
              reviewer: this.formData.reviewPeople,
              title: this.formData.name,
              remark: this.formData.memo,
              enclosure: this.formData.file,
              startTime: date(this.formData.time[0], 'YYYY-MM-DD'),
              endTime: date(this.formData.time[1], 'YYYY-MM-DD'),
              itemType: this.formData.itemType,
              principal: this.formData.principalpeople,
              priority: this.formData.urgentLevel,
              projectLevel: this.formData.itemLevel,
              joinUser: this.formData.itemUsers,
              itemAttribute: this.formData.itemAttribute,
            };
            if (this.itemCode) {
              submitParams['itemCode'] = this.itemCode;
            } else {
              this.upItemId = submitParams.parentId || null;
            }
            try {
              let code = this.itemCode || '';
              // 上级项目存在，并且上级项目被清空
              if (this.upItemId && !submitParams.parentId) {
                this.$confirm(
                  '引用项目已被清空,是否继续操作?此操作会清空引用项目的任务!',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
                ).then(async () => {
                  if (isProjectBoard) {
                    await ProjectAPI.demandBoard.projectBoardEdit(submitParams);
                  } else {
                    code = await ProjectAPI.setUp.createOrSaveSetup(submitParams, type);
                  }
                  resolve({
                    itemCode: this.itemCode,
                  });
                  this.SET_ITEM_CODE(code);
                  this.successTask();
                });
                // 原有的上级项目 与 现有的上级项目不一样
              } else if (
                this.upItemId &&
                this.upItemId !== submitParams.parentId
              ) {
                this.$confirm(
                  '引用项目已改变,是否继续操作?此操作会覆盖原有引用项目的任务!',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  }
                ).then(async () => {
                  if (isProjectBoard) {
                    await ProjectAPI.demandBoard.projectBoardEdit(submitParams);
                  } else {
                    code = await ProjectAPI.setUp.createOrSaveSetup(
                      submitParams,
                      type
                    );
                  }
                  resolve({
                    itemCode: this.itemCode,
                  });
                  this.SET_ITEM_CODE(code);
                  this.successTask();
                });
              } else {
                if (isProjectBoard) {
                  await ProjectAPI.demandBoard.projectBoardEdit(submitParams);
                } else {
                  code = await ProjectAPI.setUp.createOrSaveSetup(
                    submitParams,
                    type
                  );
                }
                resolve({
                  itemCode: this.itemCode,
                });
                this.SET_ITEM_CODE(code);
                this.successTask();
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验未通过');
          }
        });
      });
    },
    syncData(data) {
      this.taskList = data;
    },
    clickEditTaskBtn(type) {
      const typeCode = type ? 'check' : 'update';
      this.$innerDrawer({
        width: drawerWidth.larger_pr,
        component: () => <TaskTable
          onDone={this.done}
          onSyncData={this.syncData}
          time={this.formData.time}
          code={typeCode}
          tableData={this.taskList}
          isProjectBoard={this.IsProjectBoard}
          params={{
            itemCode: this.itemCode,
            principal: this.formData.principalpeople,
            joinUser: this.formData.itemUsers,
            createUser: this.getterPanelGroupData?.info?.createUser || this.userInfo.id,
          }}/>,
      });
    },
    done(data) {
      this.taskList = data;
    },

    // ------------- 表格 复选框 选中处理 暂时放弃 后期针对任务列表的处理
    selectAll(checked) {},

  },
};
</script>
<style lang='scss' scoped>
.w-100 {
  width: 100%;
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
.time{
  margin: 0;
  padding: 0;
}
</style>
