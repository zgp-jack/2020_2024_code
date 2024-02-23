<template>
  <pure-dialog-template>
    <template #title>
      驳回
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item
        label="驳回原因"
        prop="rejectReason"
      >
        <el-select
          v-model="form.rejectReason"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in examineList"
            :key="item.id"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="驳回说明"
        prop="description"
      >
        <el-input
          v-model="form.description"
          :rows="3"
          placeholder="请输入内容"
          type="textarea"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <pure-button
        label="确定"
        type="primary"
        @click="onSubmit"
      />
      <pure-button
        v-if="!isCancel"
        label="取消"
        @click="onCancel"
      />
    </template>
  </pure-dialog-template>
</template>

<script>
import {
  find,
} from 'lodash-es';

export default {
  name: 'Reject',
  props: {
    id: {
      type: String,
      default: '',
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
    dicType: {
      type: String,
      default: 'obs_no_examine',
    },
    rejectApi: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      rules: {
        rejectReason: [
          { required: true, message: '请选择驳回原因', trigger: 'change', },
        ],
        description: [
          { required: true, message: '请输入驳回说明', trigger: 'blur', },
        ],
      },
      form: {
        id: '',
        description: '',
        rejectReason: '',
      },
      examineList: [],
    };
  },
  mounted() {
    this.getConfigs();
  },
  methods: {
    /* 获取缓存配置 */
    getConfigs() {
      const cachedDicList = this.$store.state['SYSTEM_DIC'].list || [];
      const examineList = find(cachedDicList, { type: this.dicType, })?.data || [];
      this.examineList = examineList;
    },
    onDone() {
      this.$emit('done');
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.form.id = this.id;
          await this.rejectApi(this.form);
          this.$message.success('驳回成功');
          this.onDone();
        }
      });
    },
    onCancel() {
      this.onDone();
    },
  },
};
</script>

<style lang='scss'
  scoped
></style>
