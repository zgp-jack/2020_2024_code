<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-09 14:46:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-09 15:41:12
 * @Description:论文发表信息弹窗
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
        <el-form-item label="发表时间" prop="publishDate">
          <el-date-picker
            v-model="formData.publishDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="发表时间"
            class="w-100-i"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" />
    </el-row>
    <el-form-item label="论文名称" prop="title">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="发表平台" prop="platform">
      <el-input v-model="formData.platform" />
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
  name: 'PaperDialog',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        // 论文id
        id: null,
        // 人员画像id
        personnelId: null,
        // 发表时间
        publishDate: null,
        // 论文名称
        title: null,
        // 发表平台
        platform: null,
        // 主导部门
        deptName: null,
        // 负责人
        principal: null,
        // 参与人
        participant: null,
      },
      rules: {
        publishDate: [
          { required: true, message: '请选择发表时间', trigger: 'blur', }
        ],
        title: [
          { required: true, message: '请输入论文名称', trigger: 'blur', }
        ],
        platform: [
          { required: true, message: '请输入发表平台', trigger: 'blur', }
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
          await PersonaApi.updatePaperInfo(this.formData);
        } else {
          await PersonaApi.createPaperInfo(this.formData);
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
