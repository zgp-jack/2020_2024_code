<template>

  <el-form
    ref="templateForm"
    :model="params"
    :rules="rules"
    label-position="right"
    label-width="120px"
    size="mini"
  >
    <el-form-item label="模板名称" prop="name">
      <el-input v-model="params.name" />
    </el-form-item>
    <el-col :span="12" />
    <el-form-item label="所属科室">
      <CascaderDepartment v-model="params.deptId" />
    </el-form-item>

    <el-form-item label="所属运维小组">
      <el-select
        v-model="params.teamId"
        :filterable="true"
        placeholder="请选择运维小组"
      >
        <el-option
          v-for="v in operationsList"
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" :loading="confirmButtonLoading" @click="confirm">确认</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
import { getOperationsTeam, } from '@/apis/group/index';
import _ from 'lodash';
import ProjectAPI from '@/apis/project';
import { mixins_base, } from '@/minxins/project';
const rules = {
  name: [
    { required: true, message: '请填写模板名称', trigger: 'blur', }
  ],
};
export default {
  name: 'Edit',
  components: {
  },
  mixins: [mixins_base],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否是编辑模板
     */
    isEdit: {
      type: Boolean,
    },
    /**
     * 接受传过来的模板基本参数
     */
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      rules,
      show: this.visible,
      confirmButtonLoading: false,
      // 运维小组列表
      operationsList: [],
      // 部门列表
      params: {
        name: '',
        deptId: null,
        teamId: '',
        code: '',
        remark: '',
      },
    };
  },
  created() {
    this.open();
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    async confirm() {
      const self = this;
      this.$refs['templateForm'].validate(async (valid) => {
        if (valid) {
          try {
            this.confirmButtonLoading = true;
            await ProjectAPI.template.createOrEditTemplate(self.params, self.isEdit);
            self.FETCH_PERFORM_EVENT({ name: 'templateUpdate', });
            this.confirmButtonLoading = false;
            this.$emit('done');
            this.$message.success('操作成功');
          } catch (e) {
            this.confirmButtonLoading = false;
            self.$message.error(e);
          }
        }
      });
    },
    async open() {
      for (const i in this.params) {
        this.params[i] = null;
      }
      if (Object.values(this.info).length) {
        this.params = _.cloneDeep(this.info);
        this.params.deptId = this.params.deptId || null;
      }
      this.operationsList = await getOperationsTeam();
    },
  },
};
</script>

<style  lang="scss" scoped>
.t-r{
  text-align: right;
}

</style>
