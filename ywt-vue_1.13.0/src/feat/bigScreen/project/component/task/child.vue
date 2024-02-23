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
    disabled
  >
    <el-form-item label="任务名称" required>
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="任务描述" required>
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
      <el-input :value="Temp" />
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
            active-color="#3e4650"
            inactive-color="#3e4650"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="审核人">
          <el-input :value="formData.reviewUser | member" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="预计工时" label-width="95px">
          <el-input-number
            v-model="formData.time"
            controls-position="right"
          />
          天
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="工时依据">
      <el-input v-model="formData.according" type="textarea" rows="5" />
    </el-form-item>
    <el-form-item label="时间" required>
      <el-date-picker
        v-model="formData.start_end_time"
        style="width: 100%"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm"
        format="yyyy-MM-dd HH:mm"
      />
    </el-form-item>

    <el-form-item label="负责人" required>
      <el-input :value="formData.principal | member" />
    </el-form-item>
    <el-form-item label="参与成员">
      <el-input :value="formData.users |member" />
    </el-form-item>
    <el-form-item label="文件模板">
      <File :data="formData.template" />
    </el-form-item>
  </el-form>
</template>

<script>
import _ from 'lodash';
import { stringToArray, } from '@/utils/common';
import File from '../file/index.vue';

export default {
  name: 'TaskChild',
  components: {
    File,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    taskList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
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
    Temp() {
      return _.find(this.taskList, { id: this.formData.beforeId, })?.name || '';
    },
    frontTaskList() {
      return this.taskList.filter((e) => {
        return e.id !== this.pId && e.id !== this.id && e.parentId !== 0;
      });
    },

  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 获取所有的任务列表
     */

    async init() {
      this.formData.parentId = this.data.parentId;
      this.formData.template = JSON.stringify([]);
      this.formData.beforeId = this.data.beforeId || '';

      this.formData = _.pick(this.data, Object.keys(this.formData));

      for (const i in this.formData) {
        if (!this.formData[i]) {
          this.formData[i] = '';
        }
      }
      this.formData.users = [];
      if (this.data.userIds) {
        this.formData.users = stringToArray(this.data.userIds);
      }
      this.formData.time = this.data.planUse || 0;
      const SE = this.data.startTime ? [this.data.startTime, this.data.endTime] : [];
      this.$set(this.formData, 'start_end_time', SE);
    },
  },
};
</script>

<style  lang="scss" scoped>
@import "~@/feat/bigScreen/style/form.scss";

</style>
