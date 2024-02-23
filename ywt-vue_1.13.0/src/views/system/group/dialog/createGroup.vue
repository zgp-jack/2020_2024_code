<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-19 15:58:12
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-05-21 20:56:41
 * @Description: 新增或编辑分组
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="90px"
      size="mini"
    >
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-col :span="12">
          <el-form-item label="小组名" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组长" prop="leader">
            <engineer-select
              v-model="formData.leader"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理部门">
            <group-select v-model="formData.deptId" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作内容">
            <el-input
              v-model="formData.content"
              type="textarea"
              :rows="5"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="小组成员">
            <engineer-drag-select v-model="formData.users" style="width: 100%" />

          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <el-row style="position:absolute;bottom:16px;right:16px">
      <el-col style="text-align:right">
        <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import engineerSelect from '@/views/reportFault/sharedComponents/select/engineerSelect.vue';
import EngineerDragSelect from '@/views/synthesize/sharedComponents/select/engineerDragSelect.vue';
import GroupSelect from '../../sharedComponnets/select/groupSelect.vue';
import {
  createGroup,
  updateGroup,
} from '@/apis/system/group';
import {
  bus,
} from '@/utils/bus';
export default {
  components: { engineerSelect, EngineerDragSelect, GroupSelect, },
  props: {
    type: {
      type: String,
      default: 'create',
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {},
      rules: {
        name: [
          {
            required: true, message: '请输入小组名', trigger: 'blur',
          }
        ],
        leader: [
          {
            required: true, message: '请选择组长', trigger: 'change',
          }
        ],
      },
    };
  },
  created() {
    this.formData = Object.assign({}, this.data);
  },
  methods: {
    async handleSave() {
      try {
        await this.$refs.form.validate();
        if (this.type === 'create') {
          await createGroup(this.formData);
        } else {
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

</style>
