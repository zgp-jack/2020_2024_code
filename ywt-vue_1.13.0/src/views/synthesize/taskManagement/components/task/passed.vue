<!-- 转交任务 -->
<template>
  <el-form ref="form" label-position="right" :model="formData" label-width="100px" size="mini" :rules="rules">
    <el-form-item label="任务名称">
      <span>{{ data.taskName || '-' }}</span>
    </el-form-item>
    <el-form-item label="转交原因" prop="processReason">
      <el-select v-model="formData.processReason" clearable class="w-100">
        <el-option v-for="v in transReasonList" :key="v.id" :value="v.value" :label="v.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="转交人" prop="transferUser">
      <UserSelect v-model="formData.transferUser" />
    </el-form-item>
    <el-form-item label="说明">
      <el-input
        v-model="formData.explan"
        type="textarea"
        size="small"
        :autosize="{ minRows: 5, maxRows: 10 }"
        placeholder="请输入内容"
      />
    </el-form-item>

    <el-row>
      <el-col :span="24" class="t-r">
        <el-button type="primary" size="mini" :loading="transferButtongLoading" @click="clickTransfer">
          转交
        </el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<script>
import TaskApi from '@/apis/synthesize/taskManagement';
import { mapState, } from 'vuex';
export default {
  components: {
    UserSelect: () => import('@/views/project/components/userSelect/index'),

  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      transferButtongLoading: false,
      formData: {
        processReason: '',
        explan: '',
        transferUser: '',
      },
      rules: {
        processReason: [{
          required: true,
          message: '请选择转交原因',
          trigger: 'blur',
        }],
        explan: [{
          required: true,
          message: '说明不能为空',
          trigger: 'blur',
        }],
        transferUser: [{
          required: true,
          trigger: ['change'],
          message: '请选择转交人',
        }],
      },
    };
  },
  computed: {
    ...mapState('dictionary', ['transReasonList']),
  },
  mounted() {
  },
  methods: {
    async clickTransfer() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.transferButtongLoading = true;
          const params = {
            taskId: this.data.id,
            processReason: this.formData.processReason,
            explan: this.formData.explan,
            transferUser: this.formData.transferUser,
          };
          await TaskApi.transfer(params);
          this.transferButtongLoading = false;

          this.$emit('done');
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
.w-100{
    width: 100%;
}
</style>
