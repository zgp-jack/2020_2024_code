<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-08 17:53:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-15 16:23:53
 * @Description: 科研课题信息弹窗
-->

<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="122px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="formData.startDate"
            type="date"
            :picker-options="pickerOptionsStart"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            class="w-100-i"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker
            v-model="formData.endDate"
            type="date"
            :picker-options="pickerOptionsEnd"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            class="w-100-i"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="课题名称" prop="title">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="主导部门" prop="deptName">
      <el-input v-model="formData.deptName" />
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <el-input v-model="formData.principal" />
    </el-form-item>
    <el-form-item label="参与人" prop="participant">
      <el-input v-model="formData.participant" />
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="课题级别" prop="topicLevel">
          <dic-select v-model="formData.topicLevel" type="string" dic-key="topic_level" />
        </el-form-item>

      </el-col>
      <el-col :span="12">
        <el-form-item label="是否成功" prop="successState">
          <dic-radio v-model="formData.successState" type="string" dic-key="yes_or_no" />
        </el-form-item></el-col>
    </el-row>
    <el-row>
      <el-col class="align-right">
        <pure-button
          label="确定"
          @click="onSubmit"
        />

      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import PersonaApi from '../api.js';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio';
export default {
  name: 'ResearchProjectDialog',
  components: {
    DicSelect,
    DicRadio,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        // 学历id
        id: null,
        // 开始时间
        startDate: null,
        // 结束时间
        endDate: null,
        // 课题名称
        title: null,
        // 主导部门
        deptName: null,
        // 负责人
        principal: null,
        // 参与人
        participant: null,
        // 课题级别
        topicLevel: null,
        // 是否成功
        successState: '1',
      },
      rules: {
        title: [
          { required: true, message: '请输入课题名称', trigger: 'blur', }
        ],
        deptName: [
          { required: true, message: '请输入主导部门', trigger: 'blur', }
        ],
        principal: [
          { required: true, message: '请输入负责人', trigger: 'blur', }
        ],
        participant: [
          { required: true, message: '请输入参与人', trigger: 'blur', }
        ],
        topicLevel: [
          { required: true, message: '请选择课题级别', trigger: 'blur', }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur', }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur', }
        ],

      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.formData.endDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const startDateVal = this.formData.startDate;
          if (startDateVal) {
            return time.getTime() < new Date(startDateVal).getTime();
          }
        },
      },
    };
  },
  created() {
    this.formData = Object.assign({}, this.formData, this.data);
  },
  methods: {
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        if (this.data.id) {
          await PersonaApi.updateResearchProjectInfo(this.formData);
        } else {
          await PersonaApi.createResearchProjectInfo(this.formData);
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
