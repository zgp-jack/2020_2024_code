<!-- 项目总结 -->

<template>
  <el-form ref="form" size="mini" label-width="100px" :rules="rules" :model="formData">
    <el-form-item label="总结内容" prop="content">
      <el-input v-model="formData.content" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="附件">
      <Upload v-model="formData.enclosure" />
    </el-form-item>
    <el-form-item style="text-align:right">
      <pure-button label="取消" type="wire-frame" @click="onCancel" />
      <pure-button label="提交" :loading="loadingSubmit" @click="onSubmit" />
    </el-form-item>
  </el-form>
</template>

<script>
import Upload from '@/components/upload/index.vue';
import ProjectAPI from '@/apis/project/index';
export default {
  components: {
    Upload,
  },
  props: {
    projectId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rules: {
        content: [{ required: true, message: '总结内容不能为空', }],
      },
      loadingSubmit: false,
      formData: {
        content: '',
        enclosure: '',
      },
    };
  },
  methods: {
    onCancel() {
      this.$emit('done', {});
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            this.loadingSubmit = true;
            this.$set(this.formData, 'projectId', this.projectId);
            await ProjectAPI.impose.submitProjectSummary(this.formData);
            this.$message({
              message: '提交成功',
              type: 'success',
              onClose: this.$emit('done', {}),
            });
          } catch (err) {
            //
          } finally {
            this.loadingSubmit = false;
          }
        }
      });
    },
  },
};
</script>

<style>

</style>
