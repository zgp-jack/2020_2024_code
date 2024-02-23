<!--
    添加子任务弹窗
-->
<template>

  <el-form
    ref="form"
    size="mini"
    :model="formData"
    label-position="right"
    label-width="120px"
    :rules="rules"
    :disabled="disabled"
    :validate-on-rule-change="false"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="创建人">
          <el-input v-model="formData.name" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间">
          <el-input v-model="formData.createTime" disabled />
        </el-form-item>
      </el-col>

    </el-row>

    <el-form-item label="排序">
      <el-input-number v-model="formData.taskOrder" controls-position="right" />
    </el-form-item>
    <el-form-item label="子任务名称" prop="taskName">
      <el-input v-model="formData.taskName" />

    </el-form-item>
    <el-form-item label="子任务描述">
      <el-input v-model="formData.taskDesc" type="textarea" rows="5" />

    </el-form-item>
    <el-form-item label="任务类型">
      <DicSelect v-model="formData.taskTypeId" class="w-100" dic-key="taskType" />

    </el-form-item>
    <el-form-item label="责任人" prop="leaderUser">
      <UserSelect v-model="formData.leaderUser" />

    </el-form-item>
    <el-form-item label="参与人">
      <UserSelect v-model="formData.partUser" :disabled-value="formData.leaderUser" multiple />

    </el-form-item>

    <el-form-item prop="planDate" label="计划时间">

      <el-date-picker
        v-model="formData.planDate"
        class="w-100"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :picker-options="DatePickerOptions"
      />
    </el-form-item>
    <el-form-item label="预计工时" prop="planDays">
      <el-input-number
        v-model="formData.planDays"
        controls-position="right"
        :min="0"
        :max="999"
        :step="0.1"
        :precision="1"
      />
      天
    </el-form-item>

    <el-form-item label="附件">
      <JYWUpload v-model="formData.attachment" />
    </el-form-item>
    <el-row>
      <el-col v-show="text" :span="24" class="t-r">
        <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit">
          {{ text }}
        </el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
import { mapGetters, } from 'vuex';
import moment from 'moment';
import _ from 'lodash';
import { stringToArray, } from '@/utils/common';
import TaskApi from '@/apis/synthesize/taskManagement';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';

export default {
  name: 'TaskChild',
  components: {
    DicSelect,
    UserSelect: () => import('@/views/project/components/userSelect/index'),

  },
  filters: {

  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabledDate: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: '',
    },
    where: {
      type: String,
      //  控制弹窗来源
      default: '',
    },
  },
  data() {
    return {
      allTaskList: [],
      submitButtonLoading: false,
      rules: {
        taskName: [{
          required: true,
          message: '子任务名称不能为空',
          trigger: 'blur',
        }],
        leaderUser: [{
          required: true,
          message: '请选择责任人',
          trigger: 'change',
        }],
        planDate: [{
          required: true,
          message: '请选择计划时间',
          trigger: 'blur',
          type: 'array',
        }],
      },
      formData: {
        taskTypeId: '',
        createTime: '',
        taskName: '',
        taskDesc: '',
        leaderUser: '',
        planDate: [],
        planDays: '',
        attachment: JSON.stringify([]),
        partUser: '',
        taskOrder: undefined,
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    frontTaskList() {
      const list = this.showPerson ? this.taskList : this.allTaskList;
      return list.filter((e) => {
        return e.id !== this.pId && e.id !== this.id && e.parentId !== 0;
      });
    },
    disabled() {
      return ['search'].includes(this.type);
    },
    text() {
      let t = '';
      if (this.type === 'search') {
        t = '';
      } else if (this.type === 'edit') {
        t = '提交';
      } else if (this.type === 'add' || this.type === 'addChild') {
        t = '添加';
      }
      return t;
    },
    DatePickerOptions() {
      return {
        disabledDate: (time) => {
          return (moment(this.disabledDate[0]).subtract(1, 'days') >= time.getTime()) || (new Date(this.disabledDate[1]).getTime() <= time.getTime());
        },

      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.type !== 'addChild') {
        if (Object.values(this.data).length) {
          this.formData = _.cloneDeep(this.data);
          this.$set(this.formData, 'planDate', [this.data.planStartDate, this.data.planEndDate]);
          this.$set(this.formData, 'partUser', this.data.partUser?.length ? this.data.partUser : this.data.partUserJson);
        }
      }
      const createName = this.data.createUserToName || this.userInfo.name;
      this.$set(this.formData, 'name', createName);
      this.formData.createTime = this.formData.createTime || moment().format('YYYY-MM-DD');
    },
    submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = _.cloneDeep(this.formData);
          const params = {
            taskName: data.taskName,
            taskDesc: data.taskDesc,
            leaderUser: data.leaderUser,
            planStartDate: data.planDate[0],
            planEndDate: data.planDate[1],
            planDays: data.planDays,
            attachment: data.attachment,
            partUser: stringToArray(data.partUser).length ? stringToArray(data.partUser) : '',
            taskOrder: data.taskOrder,
          };
          try {
            this.submitButtonLoading = true;
            if (this.where === 'index') {
              if (this.type === 'addChild') {
                Object.assign(params, { parentId: this.data.id, partUserJson: data.partUser, });
                _.unset(params, 'partUser');
                await TaskApi.addChild(params);
              } else {
                Object.assign(params, { id: this.data.id, partUserJson: data.partUser, });
                _.unset(params, 'partUser');
                await TaskApi.childEdit(params);
              }
              this.submitButtonLoading = false;
              this.$emit('done');
            } else {
              if (this.type === 'edit') {
                if (this.data.parentId) {
                  Object.assign(params, { parentId: this.data.parentId, id: this.data.id, partUserJson: data.partUser || '', });
                  _.unset(params, 'partUser');
                  await TaskApi.childEdit(params);
                }
                this.$emit('done', params);
              } else {
                if (this.data.id) {
                  Object.assign(params, { parentId: this.data.id, partUserJson: data.partUser, });
                  _.unset(params, 'partUser');
                  const rs = await TaskApi.addChild(params);
                  Object.assign(params, { id: rs, });
                }
                this.$emit('done', params);
              }
              this.submitButtonLoading = false;
            }
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
    changeBeforeSelect(v) {

    },
    close() {
    },
    cancel() {
      this.close();
    },
    async confirm() {

    },
    /**
     * 获取所有的任务列表
     */

    async open() {

    },
  },
};
</script>

<style  lang="scss" scoped>
.w-100{
  width: 100%;
}
.t-r{
    text-align: right;
}
</style>
