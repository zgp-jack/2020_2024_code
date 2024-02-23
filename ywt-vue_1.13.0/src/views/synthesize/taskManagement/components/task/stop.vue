<!-- 暂停任务 -->
<template>
  <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" size="mini">
    <el-form-item label="任务名称">
      <span>{{ data.taskName || '-' }}</span>
    </el-form-item>
    <el-form-item :label="`${typeObject[type].text}原因`" prop="reason">
      <el-select v-model="formData.reason" clearable class="w-100">
        <el-option v-for="v in suspendReasonList" :key="v.id" :value="v.id" :label="v.name" />
      </el-select>
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
        <el-button :type="typeObject[type].btnType" size="mini" :loading="stopButtonLoading" @click="clickStop">
          {{ typeObject[type].text }}
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
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      stopButtonLoading: false,
      formData: {
        explan: '',
        reason: '',
      },
      rules: {
        reason: [{
          required: true,
          message: '原因不能为空',
          trigger: 'blur',
        }],
      },
      typeObject: {
        stop: {
          value: 1,
          btnType: 'primary',
          text: '暂停',
        },
        open: {
          value: 2,
          btnType: 'primary',
          text: '开启',
        },
        end: {
          value: 3,
          btnType: 'danger',
          text: '终止',
        },

      },
    };
  },
  computed: {
    ...mapState('dictionary', ['suspendReasonList']),

  },
  mounted() {
  },
  methods: {
    async  clickStop() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.stopButtonLoading = true;
          const params = {
            taskId: this.data.id,
            reason: this.formData.reason,
            explan: this.formData.explan,
            type: this.typeObject[this.type].value,
          };
          try {
            await TaskApi.operate(params);
            this.stopButtonLoading = false;
            this.$emit('done');
          } catch (error) {
            this.stopButtonLoading = false;
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
.w-100{
    width: 100%;
}
</style>
