<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-08 17:31:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-08 17:34:45
 * @Description: 成长计划信息弹窗
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
    <el-form-item label="时间" prop="planDate">
      <el-date-picker
        v-model="formData.planDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="时间"
        class="w-100-i"
      />
    </el-form-item>
    <el-form-item label="计划内容" prop="content">
      <el-input
        v-model="formData.content"
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
      />
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
  name: 'GrowthPlanDialog',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        // 技能id
        id: null,
        // 人员id
        personnelId: null,
        // 时间
        planDate: null,
        // 计划内容
        content: null,
      },
      rules: {
        planDate: [
          { required: true, message: '请选择时间', trigger: 'blur', }
        ],
        content: [
          { required: true, message: '请输入计划内容', trigger: 'blur', }
        ],
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
          await PersonaApi.updateGrowthPlanInfo(this.formData);
        } else {
          await PersonaApi.createGrowthPlanInfo(this.formData);
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
