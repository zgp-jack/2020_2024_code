<!-- 保存模板  -->
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="120px" size="small" class="customForm">
    <el-form-item label="模板名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="所属科室">
      <CascaderDepartment v-model="formData.deptId" />
    </el-form-item>
    <el-form-item label="所属运维小组">
      <el-select v-model="formData.teamId" placeholder="请选择运维小组">
        <el-option
          v-for="v in operationsList"
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="submitButtonLoading" @click="submit"> 确定 </el-button>
    </el-form-item>

  </el-form>

</template>

<script>
import { mixins_base, } from '@/minxins/project';
import { getOperationsTeam, } from '@/apis/group';
import ProjectAPI from '@/apis/project';
export default {
  components: {},

  mixins: [mixins_base],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      operationsList: [],
      submitButtonLoading: false,
      formData: {
        name: '',
        deptId: null,
        teamId: '',
        itemCode: '',
      },
      rules: {
        name: [{
          required: true,
          trigger: 'change',
          message: '模板名称不能为空',
        }],
      },
    };
  },
  computed: {},
  async mounted() {
    this.operationsList = await getOperationsTeam();
  },
  methods: {
    async  submit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.submitButtonLoading = true;
            this.formData.itemCode = this.itemCode;
            await ProjectAPI.setUp.saveTemplate(this.formData);
            this.submitButtonLoading = false;
            this.$message.success('添加成功');
            this.$emit('done');
          } catch (error) {
            this.submitButtonLoading = false;
            this.$message.error(error);
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
</style>
