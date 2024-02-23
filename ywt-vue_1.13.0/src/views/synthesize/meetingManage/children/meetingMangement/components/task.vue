<template>
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
      <el-input v-model="formData.taskDesc" type="textarea" rows="4" />
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
          <DeprmentSelect v-model="formData.officeId" style="width: 100%" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="giveUser" label="提出人">
          <UserSelect v-model="formData.giveUser" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="auditUser" label="审核人">
          <UserSelect v-model="formData.auditUser" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="leaderUser" label="责任人">
          <UserSelect v-model="formData.leaderUser" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="参与人">
          <UserSelect
            v-model="formData.partUserJson"
            multiple
            :disabled-value="formData.leaderUser"
          />
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
          <ProjectSelect v-model="formData.itemCode" value-type="itemCode" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
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
      <el-col :span="12">
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
    </el-row>
    <el-form-item label="任务类型">
      <DicSelect v-model="formData.taskTypeId" dic-key="taskType" />
    </el-form-item>
    <el-form-item label="附件">
      <JYWUpload v-model="formData.attachment" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import DicRadio from '@/views/components/dictionary/dicRadio.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import UserSelect from '@/views/project/components/userSelect/index';
import ProjectSelect from '@/views/project/components/select/selectProject.vue';
import DeprmentSelect from '@/feat/system/department/component/departmentCascader.vue';
import moment from 'moment';
import _ from 'lodash';
import { arrayToString, } from '@/utils/common';
import { mapState, } from 'vuex';
import GroupAPI from '@/apis/system/group/index';

export default {
  name: 'MeetingTask',
  components: {
    DicRadio,
    DicSelect,
    UserSelect,
    ProjectSelect,
    DeprmentSelect,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    optionsCode: {
      type: String,
      // add edit look
      default: 'add',
    },
  },
  data() {
    return {
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
        giveTime: new Date(),
        // 提出人ID
        giveUser: '',
        // 负责人
        leaderUser: '',
        // 计划开始时间
        planStartDate: '',
        // 计划结束时间
        planEndDate: '',
        // 计划时间
        planDate: [],
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
      rules: {
        taskName: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur',
          }
        ],
        level: [
          {
            required: true,
            message: '请选择紧急程度',
            trigger: 'blur',
          }
        ],
        taskDesc: [
          {
            required: true,
            message: '描述不能为空',
            trigger: 'blur',
          }
        ],
        giveTime: [
          {
            required: true,
            message: '请选择提出时间',
            trigger: 'blur',
          }
        ],
        giveUser: [
          {
            required: true,
            message: '请选择提出人',
            trigger: 'change',
          }
        ],
        leaderUser: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'change',
          }
        ],
        planDate: [
          {
            required: true,
            message: '请选择计划时间',
            trigger: 'blur',
          }
        ],
        planDays: [
          {
            trigger: 'blur',
            required: true,
            validator: (r, v, cb) => {
              if (parseFloat(v) <= 0 || v === '') {
                return cb(new Error('工时不能为空或者小于0'));
              }
              cb();
            },
          },
          {
            trigger: 'change',
            type: 'number',
            transform: (v) => Number(v),
          }
        ],
        auditUser: [
          {
            required: true,
            message: '请选择审核人',
            trigger: 'change',
          }
        ],
        officeId: [
          {
            required: true,
            message: '请选择科室',
            trigger: 'blur',
          }
        ],
      },
    };
  },
  computed: {
    disabled() {
      return ['look'].includes(this.optionsCode);
    },
    ...mapState('login', ['userInfo']),

  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (Object.values(this.data).length) {
        const data = _.cloneDeep(this.data);
        this.formData = data;
        this.formData.planDate = [data.planStartDate, data.planEndDate];
      } else {
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

    cancel() {
      this.$emit('done', {});
    },
    async confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = _.cloneDeep(this.formData);
          params.taskChildJson = JSON.stringify([]);
          params.giveTime = moment(params.giveTime).format('YYYY-MM-DD');
          params.planStartDate = params.planDate[0];
          params.planEndDate = params.planDate[1];
          params.partUserJson = typeof params.partUserJson === 'string' ? params.partUserJson : arrayToString(params.partUserJson);
          params.states = 0;
          _.unset(params, 'planDate');
          _.unset(params, 'createTime');
          _.unset(params, 'taskChild');
          _.unset(params, 'partUser');

          this.$emit('done', params);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
.t-r {
  text-align: right;
}
</style>
