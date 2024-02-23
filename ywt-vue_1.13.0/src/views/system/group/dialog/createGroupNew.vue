<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-09 16:52:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:02:34
 * @Description: 新增或编辑分组
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">分组</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">分组信息</div>
        <el-form
          ref="form"
          label-width="100px"
          label-position="right"
          :model="formData"
          :rules="rules"
          size="mini"
        >
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="小组名" prop="name">
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理科室" prop="deptId">
                <department-cascader v-model="formData.deptId" />
              </el-form-item>

            </el-col>
          </el-form-item>
          <el-form-item label="小组成员" prop="users">
            <all-engineer-select v-model="formData.users" style="width:100%" />
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="组长" prop="leader">
                <engineer-select v-model="formData.leader" />
              </el-form-item>
            </el-col>

          </el-form-item>

          <el-form-item label="工作内容">
            <el-input v-model="formData.content" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </pure-card>
    </div>
    <div class="footer">
      <el-button
        type="primary"
        size="mini"
        @click="handleSave"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  createGroup,
  updateGroup,
} from '@/apis/system/group';
import {
  bus,
} from '@/utils/bus';
export default {
  components: {
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    AllEngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSelect.vue'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },

    },
    type: {
      type: String,
      default: 'create',
    },
  },
  data() {
    return {
      formData: {},
      rules: {
        name: [{
          required: true, message: '请输入小组名', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',
        }],
      },
    };
  },
  async created() {
    this.formData = Object.assign({}, this.data);
  },
  methods: {
    async handleSave() {
      try {
        await this.$refs.form.validate();
        if (this.type === 'create') {
          await createGroup(this.formData);
        } else if (this.type === 'update') {
          const { id, name, leader, deptId, content, users, } = this.formData;
          await updateGroup({ id, name, leader, deptId, content, users, });
        }
        bus.$emit('updateGroupTree');
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
.body {
    height: 100%;
    .card {
        height: 100%;
    }
     &::v-deep .pure-card__body {
      max-height:calc(100% - 34px);
      height: calc(100% - 34px);
  }
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .form-item-wrapper {
    padding: 0;
    margin-bottom: 0;
}
</style>
