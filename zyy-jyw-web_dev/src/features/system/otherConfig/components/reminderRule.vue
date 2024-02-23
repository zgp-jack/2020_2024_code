<template>
  <div class="comp-report-error-attendance">
    <p class="title">催单规则</p>
    <el-form ref="form" label-width="120px" class="form-box">
      <CompModuleHeader title="催单规则" />
      <template>
        <el-form-item label-width="0" prop="remindDispatchTime">
          <div class="content-box">
            <span>每</span>
            <el-input v-model.number="formData.reminderMinutes" class="input">
              <template slot="append">分钟</template>
            </el-input>
            <span>可催单，超过</span>
            <el-input v-model.number="formData.reminderTimes" class="input">
              <template slot="append">次</template>
            </el-input>
            <span>后，提示操作频繁</span>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <div class="btn-box">
      <pure-button v-auth="'reminderRulesConfig:edit'" label="应用" @click="updateConfig" />
      <pure-button v-auth="'reminderRulesConfig:edit'" label="取消" type="patch" @click="onCancel" />
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import { getReminderRulesConfigData, updateReminderRulesConfigData, } from '../api';
import { cloneDeep, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
  },
  data() {
    return {
      formData: {
        reminderMinutes: '',
        reminderTimes: '',
      },
      originalFormData: null,
    };
  },
  computed: {
    isButtonDisabled() {
      return false;
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      const loading = this.showLoading();
      getReminderRulesConfigData().then((result) => {
        this.formData.reminderMinutes = result.reminderMinutes || 10;
        this.formData.reminderTimes = result.reminderTimes || 1;
        this.originalFormData = cloneDeep(result);
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const loading = this.showLoading();
      updateReminderRulesConfigData(this.formData).then(() => {
        this.$message.success('操作成功');
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
  .content-box {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    .input {
      width: 184px;
      margin: 0 8px;
    }
  }
}
</style>
