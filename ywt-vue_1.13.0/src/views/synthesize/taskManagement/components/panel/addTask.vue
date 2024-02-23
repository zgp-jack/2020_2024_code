
<!--  -->
<template>
  <div style="height: 100%">
    <div style="height: 95%">
      <JYWPanel
        :key="'faultInfo'"
        p-k="faultInfo"
        title="任务信息"
        left-flag-title="创建人"
        :left-flag-value="createInfo.user | member "
        right-flag-title="创建时间"
        :right-flag-value="createInfo.time"
        width="100%"
      >
        <el-form
          ref="form"
          :model="formData"
          label-position="right"
          label-width="120px"
          size="mini"
          :rules="rules"
          :disabled="disabled"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item prop="taskName" label="任务名称" class="w-100">
                <el-input v-model="formData.taskName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="level" label="紧急程度">
                <DicRadio v-model="formData.level" dic-key="gradeUrgency" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="详细描述">
            <el-input
              v-model="formData.taskDesc"
              type="textarea"
              rows="4"
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="giveTime" label="提出时间">
                <el-date-picker
                  v-model="formData.giveTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="officeId" label="提出科室">
                <DepartmentSelect v-model="formData.officeId" style="width:100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="6">
              <el-form-item prop="giveUser" label="提出人">
                <UserSelect v-model="formData.giveUser" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="auditUser" label="审核人">
                <UserSelect v-model="formData.auditUser" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="leaderUser" label="责任人">
                <UserSelect v-model="formData.leaderUser" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参与人">
                <UserSelect v-model="formData.partUserJson" multiple :disabled-value="formData.leaderUser" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="planDate" label="计划时间">
                <el-date-picker
                  v-model="formData.planDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="daterange"
                  class="w-100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属项目">
                <ProjectSelect
                  v-model="formData.itemCode"
                  value-type="itemCode"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="预计工时">
                <el-input-number
                  v-model="formData.planDays"
                  controls-position="right"
                  :min="0"
                  :max="10"
                  :step="0.1"
                  :precision="1"
                />
                <span style="color: #879bba"> 天 </span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="必须上传文档">
                <el-switch
                  v-model="formData.mustAttr"
                  active-color="#409EFF"
                  inactive-color="#BFBFBF"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务类型">
                <DicSelect v-model="formData.taskTypeId" class="w-100" dic-key="taskType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="附件">
            <JYWUpload v-model="formData.attachment" />
          </el-form-item>
        </el-form>
        <hr class="hr">
        <el-row class="m-t-25">
          <el-col :span="24">
            <span style="color: #2d405e"> 子任务 </span>
            <el-button
              plain
              size="mini"
              type="primary"
              class="btn m-l-23"
              :disabled="disabled"
              @click="clickOptionsMenu('add')"
            >
              添加子任务
            </el-button>
          </el-col>
        </el-row>
        <el-row class="m-t-25">
          <el-col :span="24">
            <el-table
              ref="taskTable"
              :data="_tableData"
              border
              :cell-style="tableStyle.cellStyle"
              size="mini"
            >
              <el-table-column
                v-for="v in computedColumn"
                :key="v.prop"
                :type="v.type"
                :label="v.label"
                :prop="v.prop"
                :formatter="v.formatter"
                :width="v.width"
                :show-overflow-tooltip="v.overflow"
                :fixed="v.fixed"
                align="left"
              >
                <template v-if="v.slot" #default="{ row, $index }">
                  <OptionsMenu
                    :data="row"
                    :options="type"
                    @click="clickOptionsMenu($event, $index, row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </JYWPanel>
    </div>
    <div>
      <template v-if="type === 'search'">
        <el-button type="primary" size="mini" @click="close">关闭</el-button>
      </template>
      <template v-else-if="type === 'review'">
        <el-button
          type="success"
          size="mini"
          @click="clickReview(1)"
        >通过</el-button>
        <el-button
          type="danger"
          size="mini "
          @click="clickReview(2)"
        >驳回</el-button>
      </template>
      <template v-else>
        <template v-if="Object.values(info).length">
          <el-button
            type="primary"
            size="mini "
            plain
            class="btn"
            :loading="saveButtonLoading"
            @click="save(0)"
          >保存</el-button>
        </template>

        <template v-else>
          <el-button
            type="primary"
            size="mini"
            :loading="submitButtonLoading"
            @click="submit(1)"
          >提交</el-button>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import TaskApi from '@/apis/synthesize/taskManagement';
import mixin from './mixin';
import _ from 'lodash';
import { arrayToString, } from '@/utils/common';
import { mapGetters, mapState, } from 'vuex';
import moment from 'moment';
import tableStyle from '@/views/project/style/table';
import GroupAPI from '@/apis/system/group/index';
export default {
  name: 'AddTask',
  components: {
    OptionsMenu: () => import('@/views/synthesize/taskManagement/components/childOptionsMenu.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Review: () => import('../task/review.vue'),
    DicSelect: () => import('@/feat/system/dictionary/normal/component/dicSelect.vue'),
    DicRadio: () => import('@/feat/system/dictionary/normal/component/dicRadio.vue'),

    UserSelect: () => import('@/views/project/components/userSelect/index'),
    // eslint-disable-next-line vue/no-unused-components
    childTask: () => import('../task/childTask.vue'),
    ProjectSelect: () => import('@/views/project/components/select/selectProject.vue'),
    DepartmentSelect: () => import('@/feat/system/department/component/departmentCascader.vue'),
  },
  mixins: [mixin],
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: '',
    },
    where: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableStyle,
      taskChildData: [],
      reviewStatus: '',
      submitButtonLoading: false,
      saveButtonLoading: false,
      formData: {
        // 任务名称
        taskName: '',
        // 任务类型ID
        taskTypeId: null,
        // 任务紧急程度(1一般2较急3紧急4非常紧急)
        level: 3,
        // 描述
        taskDesc: '',
        // 提出时间
        giveTime: '',
        // 提出人ID
        giveUser: '',
        // 负责人
        leaderUser: '',
        // 计划开始时间
        planStartDate: '',
        // 计划结束时间
        planEndDate: '',
        // 计划时间
        planDate: '',
        // 预计工时(天)
        planDays: '',
        // 是否必须上传文档(0否1是)
        mustAttr: '',
        // 附件
        attachment: '',
        // 参与人json
        partUserJson: '',
        // 子任务json
        taskChildJson: '',
        // 审核人
        auditUser: '',
        // 项目ID
        itemCode: '',
        // 科室ID
        officeId: undefined,
      },
      panelInfo: {
        user: '',
        time: '',
      },
      firstEditIndex: -1,
    };
  },
  computed: {
    disabled() {
      return ['search', 'review'].includes(this.type);
    },
    _tableData() {
      return _.sortBy(this.taskChildData, ['taskOrder']);
    },
    taskChildDataMap() {
      return _.keyBy(this.taskChildData, 'id');
    },

    ...mapState('login', ['userInfo']),

    createInfo() {
      return {
        user: this.panelInfo.user || this.userInfo.id,
        time: this.panelInfo.time || moment().format('YYYY-MM-DD HH:mm:ss'),
      };
    },
    computedColumn() {
      const col = this.tableColumn;
      if (!this.disabled) {
        col.push(
          {
            label: '操作',
            fixed: 'right',
            overflow: false,
            prop: 'options',
            width: '247px',
            slot: true,
          }
        );
      }
      return col;
    },
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getDetail();
  },
  mounted() {
    this.$refs['taskTable'].doLayout();
  },
  methods: {

    async getDetail() {
      if (Object.values(this.info).length) {
        const result = await TaskApi.detail(this.info.id);

        this.formData = result;
        this.panelInfo.user = this.formData.createUser;
        this.panelInfo.time = this.formData.createTime;
        this.$set(this.formData, 'planDate', [result.planStartDate, result.planEndDate]);
        this.formData.partUserJson =
          typeof result.partUser === 'string'
            ? result.partUser
            : arrayToString(result.partUser);
        this.formData.giveUser = result.giveUser;
        this.formData.auditUser = result.auditUser;
        this.taskChildData = result.taskChild;
      } else {
        this.formData.giveTime = new Date();
        this.$set(this.formData, 'planDate', [moment().format('YYYY-MM-DD'), moment().add(6, 'days').format('YYYY-MM-DD')]);

        this.formData.officeId = this.userInfo.deptId;
        this.formData.giveUser = this.userInfo.id;
        this.formData.leaderUser = this.userInfo.id;
        const rs = await GroupAPI.userByGroupInfo(this.userInfo.id);
        if (rs?.length) {
          this.formData.auditUser = rs[0].leader;
        }
      }
    },
    async clickOptionsMenu(type, i, r) {
      const isInfo = !!Object.values(this.info).length;

      switch (type) {
        case 'add':
          if (!this.formData.planDate.length) {
            this.$message.warning('计划时间不能为空');
            return;
          }
          this.renderChildTask(
            '添加子任务',
            isInfo ? this.info : {},
            isInfo ? 'addChild' : type
          );

          break;
        case 'edit':
          this.firstEditIndex = i;
          this.renderChildTask('编辑', r, type);
          break;
        case 'del':
          if (r?.id) {
            await TaskApi.del(r.id);
          }
          this.taskChildData.splice(i, 1);
          break;
        case 'search':
          this.renderChildTask('查看', r, type);
          break;
      }
    },
    renderChildTask(title = '添加子任务 ', info = {}, type) {
      this.$dialog({
        title: title,
        width: '548px',
        position: 'center',
        top: '15vh',
        component: () => (
          <childTask
            where={'dialog'}
            data={info}
            type={type}
            disabledDate={this.formData.planDate}
            onDone={this.getChildData}
          />
        ),
      });
    },
    async getChildData() {
      const res = await TaskApi.lazyChild(this.info.id);
      this.taskChildData = res;
    },
    onDone(data) {
      if (data.id && this.taskChildDataMap[data.id]) {
        for (let i = 0; i < this.taskChildData.length; i++) {
          if (this.taskChildData[i].id === data.id) {
            this.$set(this.taskChildData, i, data);
          }
        }
      } else {
        if (this.firstEditIndex > -1) {
          this.taskChildData;
          this.$set(this.taskChildData, this.firstEditIndex, data);
          this.firstEditIndex = -1;
        } else {
          this.taskChildData.push(data);
        }
      }
    },
    save(state) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.info.id) {
            this.nextEditHandle();
          } else {
            this.firstHandle(state);
          }
        }
      });
    },
    // 驳回
    // 通过
    clickReview(status) {
      this.reviewStatus = status;
      if (status === 1) {
        this.reviewDone({ reason: '通过', });
      } else {
        this.$dialog({
          position: 'center',
          title: '审核',
          width: '548px',
          component: () => <Review onDone={this.reviewDone} states={status} />,
        });
      }
    },
    async reviewDone(data) {
      await TaskApi.review({
        taskId: this.info.id,
        reason: data.reason,
        type: this.reviewStatus,
      });
      this.$emit('done');
    },

    close() {
      this.$emit('done');
    },
    async submit(state) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.info.id) {
            this.nextSubmitHandle();
          } else {
            this.firstHandle(state);
          }
        }
      });
    },
    // 二次 编辑之后的操作
    async nextEditHandle() {
      const params = _.cloneDeep(this.formData);

      this.$set(params, 'planStartDate', params.planDate[0]);
      this.$set(params, 'planEndDate', params.planDate[1]);
      _.unset(params, 'planDate');
      _.unset(params, 'taskChild');
      _.unset(params, 'partUser');
      _.unset(params, 'createTime');
      try {
        this.saveButtonLoading = true;
        await TaskApi.update(params);
        this.saveButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.saveButtonLoading = false;
        this.$message.error(error);
      }
    },
    // 刚开始创建时的提交和保存操作
    async firstHandle(state) {
      const params = _.cloneDeep(this.formData);
      params.taskChildJson = JSON.stringify(this.taskChildData);
      params.giveTime = moment(params.giveTime).format('YYYY-MM-DD');
      params.planStartDate = params.planDate[0];
      params.planEndDate = params.planDate[1];
      params.partUserJson = typeof params.partUserJson === 'string' ? params.partUserJson : arrayToString(params.partUserJson);
      params.states = state;
      _.unset(params, 'planDate');
      _.unset(params, 'taskChild');
      try {
        if (state) {
          this.submitButtonLoading = true;
        } else {
          this.saveButtonLoading = true;
        }
        await TaskApi.save(params);
        if (state) {
          this.submitButtonLoading = false;
        } else {
          this.saveButtonLoading = false;
        }
        this.$emit('done');
      } catch (error) {
        if (state) {
          this.submitButtonLoading = false;
        } else {
          this.saveButtonLoading = false;
        }
        this.$message.error(error);
      }
    },
    // 编辑进来之后的提交操作
    async nextSubmitHandle() {
      try {
        this.submitButtonLoading = true;
        await TaskApi.submit(this.info.id);
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      }
    },

  },
};
</script>
<style lang='scss' scoped>
.panel-container {
  height: 97%;
  margin: 0;
}
.w-100 {
  width: 100%;
}
.m-t-25 {
  margin-top: 25px;
}
.hr {
  height: 1px;
  background-color: #ecf0f7;
  border: 0;
}
.btn {
  background-color: #fff;
}
.m-l-23 {
  margin-left: 23px;
}
</style>
