<!--
    添加任务弹窗
-->
<template>
  <el-form
    size="mini"
    :model="formData"
    label-position="right"
    label-width="120px"
  >
    <el-form-item label="里程碑名称">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="里程碑描述">
      <el-input v-model="formData.remark" type="textarea" />
    </el-form-item>
    <el-form-item v-if="!isEdit" label="排序">
      <el-col :span="18">
        <el-select v-model="formData.order" style="width:100%">
          <el-option v-for="(v) in list" :key="v.id" :label="v.name" :value="v.id" />
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
    visible: {
      type: Boolean,
      default: false,
    },
    templateId: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '添加里程碑',
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: Boolean,
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      formData: { name: '', remark: '', tempId: '', order: '', sort: 0, },
      confirmButtonLoading: false,
    };
  },
  computed: {

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
      if (this.title === '编辑里程碑') {
        try {
          this.confirmButtonLoading = true;
          this.$set(this.formData, 'id', this.info.id);
          await ProjectAPI.template.editTask(this.formData);
          this.$emit('done', this.templateId);
          this.confirmButtonLoading = false;
          this.$message.success('修改成功');
        } catch (error) {
          this.confirmButtonLoading = false;

          this.$message.error(error);
        }
      } else {
        try {
          this.confirmButtonLoading = true;
          this.formData.tempId = this.templateId;
          await ProjectAPI.template.createTask(this.formData);
          this.$emit('done', this.templateId);
          this.$message.success('添加成功!');
        } catch (error) {
          this.confirmButtonLoading = false;
          this.$message.error(error);
        }
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
