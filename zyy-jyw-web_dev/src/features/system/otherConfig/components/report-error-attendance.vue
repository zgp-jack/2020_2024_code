<template>
  <div class="comp-report-error-attendance">
    <p class="title">服务台考勤</p>
    <CompTips content="时间以排班的时间段为准。次日 00:00 会自动下线。例：时间为 09:00~18:00 ，则当天 00:00~09:00 上线不算迟到，当天 18:00～24:59:59 下线不算早退。" />
    <CompModuleHeader title="考勤规则" />
    <el-form ref="form" label-width="120px" class="form-box">
      <el-form-item label="上线可推迟">
        <el-input v-model="formData.delayTime" placeholder="1-99">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="下线可提前">
        <el-input v-model="formData.leadTime" placeholder="1-99">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <pure-button label="应用" :disabled="isButtonDisabled" @click="updateConfig" />
      <pure-button label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import { getAttendanceConfigData, updateAttendanceConfigData, } from '../api';
import { cloneDeep, isEqual, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
    CompTips,
  },
  data() {
    return {
      formData: {
        delayTime: '',
        leadTime: '',
      },
      originalFormData: null,
    };
  },
  computed: {
    isButtonDisabled() {
      return !this.originalFormData || isEqual(this.originalFormData, this.formData);
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      const loading = this.showLoading();
      getAttendanceConfigData().then((result) => {
        if (result.data) {
          this.originalFormData = result.data;
          this.formData = cloneDeep(result.data);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const loading = this.showLoading();
      updateAttendanceConfigData(this.formData).then(() => {
        this.$message.success('操作成功');
        this.getConfig();
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.formData = cloneDeep(this.originalFormData);
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-report-error-attendance {
  padding: 16px;
  background: #fff;
  .title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333333;
  }
  .form-box {
    max-width: 500px;
  }
}
</style>
