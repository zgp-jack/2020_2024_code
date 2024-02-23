<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-08 15:39:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-08 15:45:06
 * @Description:技能信息弹窗
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

    <el-form-item label="技能信息" prop="specialtie">
      <el-input
        v-model="formData.specialtie"
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
  name: 'SkillDialog',
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
        // 技能信息
        specialtie: null,
      },
      rules: {
        // 技能信息
        specialtie: [
          { required: true, message: '请输入技能信息', trigger: 'blur', }
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
          await PersonaApi.updateSkillInfo(this.formData);
        } else {
          await PersonaApi.createSkillInfo(this.formData);
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
