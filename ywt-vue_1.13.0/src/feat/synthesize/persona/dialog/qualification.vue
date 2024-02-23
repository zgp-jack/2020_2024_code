<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-08 11:27:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-15 16:00:20
 * @Description:学历信息弹窗
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
            :picker-options="pickerOptionsEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            class="w-100-i"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="学校" prop="school">
      <el-input v-model="formData.school" />
    </el-form-item>
    <el-form-item label="专业" prop="major">
      <el-input v-model="formData.major" />
    </el-form-item>
    <el-form-item label="学历" prop="education">
      <dic-select v-model="formData.education" class="w-100-i" dic-key="user_education" type="string" />
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
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect';
export default {
  name: 'QualificationDialog',
  components: {
    DicSelect,
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
        // 人员id
        personnelId: null,
        // 学历
        education: null,
        // 开始时间
        startDate: null,
        // 毕业时间
        endDate: null,
        // 毕业院校
        school: null,
        // 毕业专业
        major: null,
      },
      rules: {
        // 学历
        education: [
          { required: true, message: '请选择学历', trigger: 'change', }
        ],
        // 开始时间
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'change', }
        ],
        // 毕业时间
        endDate: [
          { required: true, message: '请选择毕业时间', trigger: 'change', }
        ],
        // 毕业院校
        school: [
          { required: true, message: '请输入毕业院校', trigger: 'blur', }
        ],
        // 毕业专业
        major: [
          { required: true, message: '请输入毕业专业', trigger: 'blur', }
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
          await PersonaApi.updateQualificationInfo(this.formData);
        } else {
          await PersonaApi.createQualificationInfo(this.formData);
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
