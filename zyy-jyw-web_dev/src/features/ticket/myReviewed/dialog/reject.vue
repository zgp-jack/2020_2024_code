/**
*@file pass.vue.vue
* @author huang
* @date 2023/8/17
* @description 通过弹窗
* @projectName
* @email newflyhuang@gmail.com
*/

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
        prop="rejectDescribe"
      >
        <el-input
          v-model="form.rejectDescribe"
          :rows="3"
          placeholder="请输入内容"
          type="textarea"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <pure-button label="确定" @click="onSubmit" />
      <pure-button
        v-if="!isCancel"
        type="patch"
        label="取消"
        @click="onCancel"
      />
    </template>
  </pure-dialog-template>
</template>

<script>
import MyReviewedApi from '../api';
import {
  find,
} from 'lodash-es';
import PureButton from '@/common/components/button/index.vue';

export default {
  name: 'Reject',
  components: { PureButton, },
  props: {
    orderNum: {
      type: String,
      default: '',
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        rejectReason: [
          { required: true, message: '请选择驳回原因', trigger: 'change', },
        ],
        rejectDescribe: [
          { required: true, message: '请输入驳回说明', trigger: 'blur', },
        ],
      },
      form: {
        orderNum: '',
        rejectDescribe: '',
        rejectReason: '',
      },
      examineList: [],
    };
  },
  watch: {
    orderNum: {
      handler(newVal) {
        if (newVal) {
          this.form = {
            orderNum: newVal,
          };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.getConfigs();
  },
  methods: {
    /* 获取缓存配置 */
    getConfigs() {
      const cachedDicList = this.$store.state['SYSTEM_DIC'].list || [];
      const examineList = find(cachedDicList, { type: 'obs_no_examine', })?.data || [];
      this.examineList = examineList;
    },
    onDone() {
      this.$emit('done');
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await MyReviewedApi.reject(this.form).then(() => {
            this.$message.success('操作成功');
            this.onDone();
          }).catch((err) => {
            this.$message.error(err);
          });
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
