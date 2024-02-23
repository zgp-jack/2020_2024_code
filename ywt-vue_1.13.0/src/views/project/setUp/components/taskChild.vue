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
    :validate-on-rule-change="false"
  >
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="任务描述" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="父任务">
      <el-select
        v-model="formData.parentId"
        style="width: 100%"
        placeholder="请选择父任务"
      >
        <el-option
          v-for="v in taskList"
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="前置任务">
      <el-select
        v-model="formData.beforeId"
        :disabled="beforeId | isDisbled"
        style="width: 100%"
        placeholder="请选择前置任务"
        clearable
        @change="changeBeforeSelect"
      >
        <el-option
          v-for="v in frontTaskList"
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="关键任务">
          <el-switch
            v-model="formData.isHinge"
            active-color="#409EFF"
            inactive-color="#BFBFBF"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="必须提交文档">
          <el-switch
            v-model="formData.isSubmit"
            active-color="#409EFF"
            inactive-color="#BFBFBF"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="预计工时">
      <el-input-number
        v-model="formData.time"
        controls-position="right"
        :min="0"
        :max="maxDay"
        :step="0.1"
        :precision="2"
      />
      天
    </el-form-item>

    <el-form-item label="工时依据">
      <el-input v-model="formData.according" type="textarea" rows="5" />
    </el-form-item>

    <el-form-item label="时间" required prop="start_end_time">
      <el-date-picker
        v-model="formData.start_end_time"
        style="width: 100%"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm"
        format="yyyy-MM-dd HH:mm"
        :default-value="startEnd.start"
        :default-time="[ldt, '23:59:59']"
        :picker-options="startEndPickerOptions"
      />
    </el-form-item>

    <el-form-item label="负责人" prop="principal">
      <UserSelect
        v-model="formData.principal"
        :disabled-value="formData.users"
      />
    </el-form-item>
    <el-form-item label="参与成员">
      <UserSelect
        v-model="formData.users"
        multiple
        :disabled-value="formData.reviewUser + ',' + formData.principal"
      />
    </el-form-item>
    <el-form-item label="文件模板">
      <Upload v-model="formData.template" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button
        size="mini"
        type="primary"
        :loading="confirmButtonLoading"
        @click="confirm"
      >确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Upload from '@/components/upload';
import _ from 'lodash';
import { mixins_base, mixins_task, } from '@/minxins/project';
import { arrayToString, stringToArray, } from '@/utils/common';
import moment from 'moment';
import ProjectAPI from '@/apis/project';
export default {
  name: 'TaskChild',
  components: {
    Upload,
  },
  filters: {
    isDisbled(v) {
      if (v === null || v === '' || !v) {
        return false;
      }
      return true;
    },
  },
  mixins: [mixins_task, mixins_base],
  props: {
    title: {
      type: String,
      required: true,
    },
    templateId: {
      type: Number,
      default: 0,
    },
    pId: {
      type: Number,
      required: true,
      default: 0,
    },
    id: {
      type: Number,
      required: true,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    beforeId: {
      type: [String, Number],
      default: '',
    },
    maxDay: {
      type: Number,
      default: 100,
    },
    startEnd: {
      type: Object,
      default: (v) => {
        return {
          start: '',
          end: '',
        };
      },
    },
    projectBoard: Boolean,

  },
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '名称不能为空',
          },
          {
            max: 50,
            min: 1,
            message: `长度在1到${50}个字符`,
            trigger: 'blur',
          }
        ],
        remark: [{
          required: true,
          trigger: 'blur',
          message: '描述不能为空',
        }],
        start_end_time: [{
          required: true,
          trigger: 'blur',
          type: 'array',
          message: '开始和结束时间不能为空',
        }],
        principal: [{
          required: true,
          message: '请选择负责人',
          trigger: 'blur',
        }, {
          trigger: 'change',
          type: 'number',
        }],
      },
      startDefaultValue: new Date(),
      ldt: moment(new Date()).format('HH:mm:ss'),
      confirmButtonLoading: false,
      formData: {
        // 任务名称
        name: '',
        // 任务描述
        remark: '',
        // 父任务
        parentId: 0,
        // 前置任务
        beforeId: '',
        // 是否是关键任务
        isHinge: 0,
        // 是否提交文档
        isSubmit: 0,

        // 工时
        time: 0,
        // 文件模板
        template: JSON.stringify([]),
        // // 负责人
        principal: '',
        // // 调研成员
        users: [],
        // // 审核人
        reviewUser: '',
        // // // 开始时间
        // startTime: '',
        // // // 结束时间
        // endTime: '',
        // 开始 + 结束时间
        start_end_time: [],

        // 依据
        according: '',
      },
    };
  },
  computed: {
    frontTaskList() {
      return this.taskList.filter((e) => {
        return e.id !== this.pId && e.id !== this.id && e.parentId !== 0;
      });
    },
    startEndPickerOptions() {
      return {
        disabledDate: (time) => {
          const end = new Date(this.startEnd.end);
          end.setHours(23, 59, 59, 0);
          const strat = new Date(this.startEnd.start);
          strat.setHours(0, 0, 0, 0);
          return time.getTime() > end || time.getTime() < strat; // 注意是||不是&&
        },
      };
    },
  },
  mounted() {
    this.open();
  },
  methods: {
    changeBeforeSelect(v) {
      const result = _.find(this.frontTaskList, { id: v, });
      if (result) {
        this.formData.reviewUser = result.reviewUser;
      }
    },

    cancel() {
      this.$emit('done');
    },
    async confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = _.cloneDeep(this.formData);
          data.startTime = moment(data.start_end_time[0]).format(
            'YYYY-MM-DD HH:mm'
          );
          data.endTime = moment(data.start_end_time[1]).format(
            'YYYY-MM-DD HH:mm'
          );
          try {
            this.confirmButtonLoading = true;
            data.users = arrayToString(data.users);
            if (this.title === '编辑任务') {
              data['id'] = this.info.id;
              data.planUse = data.time;
              data.itemCode = this.itemCode;
              if (this.projectBoard) {
                await ProjectAPI.demandBoard.projectBoardTaskChildSave(data);
              } else {
                await ProjectAPI.setUp.editedTaskChlid(data);
              }
              this.$message.success('修改成功!');
            } else {
              _.unset(data, 'id');
              data.planUse = data.time;
              data.itemCode = this.itemCode;
              if (this.projectBoard) {
                await ProjectAPI.demandBoard.projectBoardTaskChildSave(data);
              } else {
                await ProjectAPI.setUp.createdTaskChild(data);
              }
              this.$message.success('创建成功!');
            }
            this.confirmButtonLoading = false;
            this.$refs['form'].resetFields();
            this.$emit('done', this.templateId);
          } catch (e) {
            this.confirmButtonLoading = false;
            this.$message({
              type: 'error',
              customClass: 'customMessageBox',
              message: e,
            });
          }
        }
      });
    },
    /**
     * 获取所有的任务列表
     */

    async open() {
      this.formData = this.$options.data().formData;
      this.formData.parentId = this.id;
      this.formData.template = JSON.stringify([]);
      this.formData.beforeId = this.beforeId || '';

      if (Object.values(this.info).length) {
        this.formData = _.pick(this.info, Object.keys(this.formData));

        for (const i in this.formData) {
          if (!this.formData[i]) {
            this.formData[i] = '';
          }
        }
        this.formData.users = [];
        if (this.info.userIds) {
          this.formData.users = stringToArray(this.info.userIds);
        }
        this.$set(this.formData, 'time', this.info.planUse || 0);
        const SE = this.info.startTime
          ? [this.info.startTime, this.info.endTime]
          : [];
        this.$set(this.formData, 'start_end_time', SE);
      }
    },
  },
};
</script>

<style  lang="scss" scoped>
.w-100 {
  width: 100%;
}
.t-r {
  text-align: right;
}
</style>
