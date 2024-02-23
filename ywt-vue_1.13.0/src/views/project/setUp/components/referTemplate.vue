<!-- 引用模板  -->
<template>
  <el-form :model="formData" label-width="100px" size="mini">
    <el-form-item label="模板名称" prop="tempId">
      <el-select v-model="formData.tempId" class="w-100">
        <el-option v-for="v in templateList" :key="v.id" :label="v.name" :value="v.id" />
      </el-select>
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit"> 确定 </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mixins_base, mixins_task, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  name: 'ReferTemplate',
  components: {},
  mixins: [mixins_base, mixins_task],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      templateList: [],
      submitButtonLoading: false,
      formData: {
        tempId: '',
        itemCode: '',
      },
    };
  },
  computed: {},
  mounted() {
    this.getTemplateList();
  },
  methods: {
    async  getTemplateList() {
      this.templateList = await ProjectAPI.setUp.getTemplateList();
    },
    async submit() {
      if (!this.formData.tempId) {
        this.$message.error('请选择引用模板');
        return;
      }
      try {
        this.submitButtonLoading = true;
        await ProjectAPI.setUp.qutoTemplate(this.itemCode, this.formData.tempId);
        this.SET_TASK_LIST(await ProjectAPI.setUp.getTaskList({ itemCode: this.itemCode, }));
        this.submitButtonLoading = false;
        this.$message.success('引用成功');
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
.w-100{
  width: 100%;
}

</style>
