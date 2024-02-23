<!-- 项目周报 -->

<template>
  <el-form
    ref="form"
    label-width="140px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-form-item
      label="周报时间"
      prop="weeklyTime"
    >
      <el-date-picker
        v-model="formData.weeklyTime"
        class="w-100"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />
    </el-form-item>
    <el-form-item label="计划时间时间">
      <el-date-picker
        v-model="formData.planTime"
        value-format="yyyy-MM-dd"
        class="w-100"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-form-item>
    <el-form-item label="人员">
      <el-select
        v-model="formData.members"
        multiple
        class="w-100"
      >
        <el-option
          v-for="item in members"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item style="text-align:right">
      <pure-button
        label="取消"
        type="wire-frame"
        @click="onCancel"
      />
      <pure-button
        label="提交"
        @click="onSubmit"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import DialogWeeklyView from './weeklyView.vue';
import moment from 'moment';
import ProjectApi from '@/apis/project/index';
export default {
  props: ['projectId'],
  data() {
    return {
      rules: {
        weeklyTime: [{ type: 'array', required: true, message: '请选择周报时间', }],
      },
      formData: {
        weeklyTime: [moment().startOf('week').subtract(1, 'week',).add(1, 'days').format('YYYY-MM-DD'), moment().endOf('week').subtract(1, 'week').add(1, 'days').format('YYYY-MM-DD')],
        planTime: [moment().startOf('week').add(1, 'days').format('YYYY-MM-DD'), moment().endOf('week').add(1, 'days').format('YYYY-MM-DD')],
        members: [],
      },
      // 人员
      members: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getMembers();
    },
    async getMembers() {
      this.members = await ProjectApi.impose.getProjectPrincipalAndParticipant(this.projectId);
    },
    onCancel() {
      this.$emit('done', {});
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            projectId: this.projectId,
            startTime: this.formData.weeklyTime[0],
            endTime: this.formData.weeklyTime[1],
            members: this.formData.members.join(','),
            planStartTime: this.formData.planTime?.length ? this.formData.planTime[0] : '',
            planEndTime: this.formData.planTime?.length ? this.formData.planTime[1] : '',
          };
          this.$innerDialog({
            title: '项目周报',
            width: '688px',
            component: () => <DialogWeeklyView parmas={params}/>,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.w-100{
  width: 100%;
}
</style>
