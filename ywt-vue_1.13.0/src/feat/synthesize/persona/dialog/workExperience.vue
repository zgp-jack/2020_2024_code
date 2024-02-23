<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-08 16:04:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-15 16:22:31
 * @Description: 工作经历信息弹窗
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
    <el-form-item label="单位名称" prop="companyName">
      <el-input v-model="formData.companyName" />
    </el-form-item>
    <el-form-item label="部门" prop="dept">
      <el-input v-model="formData.dept" />
    </el-form-item>
    <el-form-item label="岗位" prop="station">
      <el-input v-model="formData.station" />
    </el-form-item>
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
export default {
  name: 'QualificationDialog',

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
        // 人员id
        personnelId: null,
        // 单位名称
        companyName: null,
        // 开始时间
        startDate: null,
        // 结束时间
        endDate: null,
        // 部门
        dept: null,
        // 岗位
        station: null,
      },
      rules: {
        companyName: [
          { required: true, message: '请输入单位名称', trigger: 'blur', }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur', }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur', }
        ],
        station: [
          { required: true, message: '请输入岗位', trigger: 'blur', }
        ],
        dept: [
          { required: true, message: '请输入部门', trigger: 'blur', }
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
          await PersonaApi.updateWorkExperienceInfo(this.formData);
        } else {
          await PersonaApi.createWorkExperienceInfo(this.formData);
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
