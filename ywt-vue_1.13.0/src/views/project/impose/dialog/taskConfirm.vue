<template>
  <el-form ref="form" :model="form" label-width="140px" :inline="false" size="small">

    <el-form-item label="项目名称">
      <span>{{ data.title }}</span>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.remark" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item style="text-align:right">
      <el-button type="plan" @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import ProjectAPI from '@/apis/project';

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        remark: '',
      },
    };
  },
  methods: {
    onCancel() {
      this.$emit('done');
    },
    async onSubmit() {
      try {
        this.$set(this.form, 'itemCode', this.data.itemCode);
        await ProjectAPI.impose.confirmResult(this.form);
        this.$message.success('提交成功');
        this.$emit('done');
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
