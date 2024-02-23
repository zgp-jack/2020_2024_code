<!--
    添加子任务弹窗
-->
<template>
  <el-form
    ref="form"
    size="mini"
    :model="formData"
    label-position="right"
    label-width="120px"
    :rules="rules"
    :validate-on-rule-change="false"
  >
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="任务描述" prop="remark">
      <el-input v-model="formData.remark" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item label="父任务">
      <el-select
        v-model="formData.parentId"
        style="width: 100%"
        placeholder="请选择父任务"
      >
        <el-option
          v-for="v in allTaskList "
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="前置任务">
      <el-select
        v-model="formData.beforeId"
        :disabled="beforeId | isDisbled"
        style="width: 100%"
        placeholder="请选择前置任务"
        clearable
      >
        <el-option
          v-for="v in frontTaskList"
          :key="v.id"
          :label="v.name"
          :value="v.id"
        />
      </el-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="关键任务">
          <el-switch
            v-model="formData.isHinge"
            active-color="#409EFF"
            inactive-color="#BFBFBF"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="必须提交文档">
          <el-switch
            v-model="formData.isSubmit"
            active-color="#409EFF"
            inactive-color="#BFBFBF"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="24">
        <el-form-item label="预计工时">
          <el-input-number
            v-model="formData.time"
            controls-position="right"
            :min="0"
            :max="maxDay"
            :step="0.1"
            :precision="2"
          />
          天
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="文件模板">
      <Upload v-model="formData.template" />
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button size="mini" type="primary" :loading="confirmButtonLoading" @click="confirm">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Upload from '@/components/upload';
import _ from 'lodash';
import { mixins_base, mixins_rules, mixins_task, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  name: 'TaskChild',
  components: {
    Upload,
  },
  filters: {
    isDisbled(v) {
      if (v === null || v === '' || !v) {
        return false;
      }
      return true;
    },
  },
  mixins: [mixins_task, mixins_base, mixins_rules],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },

    templateId: {
      type: Number,
      default: 0,
    },
    pId: {
      type: Number,
      required: true,
      default: 0,
    },
    id: {
      type: Number,
      required: true,
    },
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
    beforeId: {
      type: [String, Number],
      default: '',
    },
    maxDay: {
      type: Number,
      default: 100,
    },

  },
  data() {
    return {
      allTaskList: [],
      confirmButtonLoading: false,
      formData: {
        id: '',
        // 任务名称
        name: '',
        // 任务描述
        remark: '',
        // 父任务
        parentId: 0,
        // 前置任务
        beforeId: '',
        // 是否是关键任务
        isHinge: 0,
        // 是否提交文档
        isSubmit: 0,

        // 工时
        time: 0,
        // 文件模板
        template: JSON.stringify([]),
      },
    };
  },
  computed: {
    frontTaskList() {
      const list = this.allTaskList;
      return list.filter((e) => {
        return e.id !== this.pId && e.id !== this.id && e.parentId !== 0;
      });
    },

  },
  mounted() {
    this.open();
  },
  methods: {

    cancel() {
      this.$emit('done');
    },
    async confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.formData));

          try {
            this.confirmButtonLoading = true;
            if (this.title === '编辑任务') {
              await ProjectAPI.template.editTask(this.formData);
              this.$message.success('修改成功!');
            } else {
              await ProjectAPI.template.createTask(data);
              this.$message.success('创建成功!');
            }
            this.confirmButtonLoading = false;
            this.$emit('done', this.templateId);
          } catch (e) {
            this.confirmButtonLoading = false;
            this.$message({
              type: 'error',
              customClass: 'customMessageBox',
              message: e,
            });
          }
        }
      });
    },

    async open() {
      this.formData.parentId = this.id;
      this.formData.template = JSON.stringify([]);
      this.formData.id = this.id || '';
      this.formData.beforeId = this.beforeId || '';
      if (Object.values(this.info).length) {
        this.formData = _.pick(this.info, Object.keys(this.formData));
        for (const i in this.formData) {
          if (!this.formData[i]) {
            this.formData[i] = '';
          }
        }
        this.formData.time = this.info.planUse || 0;
      }

      if (!this.showPerson) {
        this.allTaskList = await ProjectAPI.template.getTaskList(
          this.templateId
        );
      }
    },
  },
};
</script>

<style  lang="scss" scoped>
.w-100 {
  width: 100%;
}
.t-r {
  text-align: right;
}
</style>
