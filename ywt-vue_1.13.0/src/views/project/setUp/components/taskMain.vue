<!--
    添加任务弹窗
-->
<template>
  <el-form
    ref="form"
    size="mini"
    :model="formData"
    label-position="right"
    label-width="120px"
    :rules="rules"
  >
    <el-form-item label="里程碑名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="里程碑描述">
      <el-input v-model="formData.remark" type="textarea" />
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <UserSelect v-model="formData.principal" />
    </el-form-item>
    <el-form-item v-if="!isEdit" label="排序">
      <el-col :span="18">
        <el-select v-model="formData.tempId" style="width:100%">
          <el-option v-for="(v) in mainTaskList" :key="v.id" :label="v.name" :value="v.id" />
        </el-select>
      </el-col>
      <el-col style="text-align:right" :span="6">
        <el-switch
          v-model="formData.sort"
          inactive-text="前"
          active-text="后"
          :inactive-value="0"
          :active-value="1"
        />
      </el-col>
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary" :loading="confirmButtonLoading" @click="confirm">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import _ from 'lodash';
import { mixins_base, mixins_task, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  name: 'TaskMain',
  mixins: [mixins_base, mixins_task],
  props: {

    templateId: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '添加任务',
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: Boolean,
    projectBoard: Boolean,
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      formData: { name: '', remark: '', tempId: '', sort: 0, principal: '', },
      confirmButtonLoading: false,
      rules: {
        name: [{
          required: true,
          message: '里程碑不能为空',
        }],
        principal: [{
          required: true,
          message: '负责人不能为空',
        }],
      },
    };
  },
  computed: {
    mainTaskList() {
      if (this.list.length) {
        return this.list;
      } else {
        return this.taskList.filter(e => !e.parentId);
      }
    },
  },
  mounted() {
    this.open();
  },
  methods: {
    open() {
      this.formData = this.$options.data().formData;
      if (Object.values(this.info).length) {
        this.formData = _.pick(this.info, Object.keys(this.formData));
      }
    },
    async confirm() {
      if (this.title === '编辑任务') {
        this.confirmButtonLoading = true;
        const data = {
          id: this.info.id,
          itemCode: this.itemCode,
          name: this.formData.name,
          remark: this.formData.remark,
          sort: this.formData.sort,
          principal: this.formData.principal,
        };
        try {
          if (this.projectBoard) {
            await ProjectAPI.demandBoard.projectBoardTaskSave(data);
          } else {
            await ProjectAPI.setUp.editedTask(data);
          }
          this.confirmButtonLoading = false;
          this.$emit('done',);
          this.$message.success('修改成功');
        } catch (error) {
          this.confirmButtonLoading = false;

          this.$message.error(error);
        }
      } else {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            try {
              this.confirmButtonLoading = true;
              const params = {
                name: this.formData.name,
                remark: this.formData.remark,
                sort: this.formData.sort,
                itemCode: this.itemCode,
                order: this.formData.tempId,
                principal: this.formData.principal,
              };
              if (this.projectBoard) {
                await ProjectAPI.demandBoard.projectBoardTaskSave(params);
              } else {
                await ProjectAPI.setUp.createdTask(params);
              }
              this.confirmButtonLoading = false;
              this.$emit('done',);
              this.$message.success('添加成功!');
            } catch (error) {
              this.confirmButtonLoading = false;
              this.$message.error(error);
            }
          }
        });
      }
    },
  },
};
</script>

<style  lang="scss" scoped>
.t-r{
  text-align: right;
}
</style>
