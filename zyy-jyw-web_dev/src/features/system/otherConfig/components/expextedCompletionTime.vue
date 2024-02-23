<template>
  <div class="comp-report-error-attendance">
    <p class="title">工单期望完成时间</p>
    <CompTips content="配置工单“期望完成时间”默认选中的规则。未配置规则时，默认未选；" style="margin-bottom: 8px" />
    <CompModuleHeader title="工单期望完成时间规则" />
    <el-form ref="form" label-width="120px" class="form-box">
      <el-form-item label="今日上午：">
        <div class="content-box">
          <span>建单时间为</span>
          <el-time-picker
            v-model="formData.morning"
            class="input-date"
            is-range
            :picker-options="{
              selectableRange: '00:00:00 - 12:00:00',
            }"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
          <span>点时，默认选中</span>
        </div>
      </el-form-item>
      <el-form-item label="今日下午：">
        <div class="content-box">
          <span>建单时间为</span>
          <el-time-picker
            v-model="formData.afternoon"
            class="input-date"
            is-range
            :picker-options="{
              selectableRange: '12:00:00 - 23:59:59',
            }"
            format="HH:mm"
            value-format="HH:mm"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
          <span>点时，默认选中</span>
        </div>
      </el-form-item>
      <el-form-item label="明日：">
        <div class="content-box">
          <span>建单时间为</span>
          <el-time-picker
            v-model="formData.tomorrow"
            class="input-date"
            is-range
            format="HH:mm"
            value-format="HH:mm"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
          <span>点时，默认选中</span>
        </div>
      </el-form-item>
      <CompModuleHeader title="工单超时完成判断规则" />
      <el-form-item label-width="0" prop="timeoutHour">
        <div class="content-box">
          <span>在工单“期望完成时间”</span>
          <el-input v-model.number="formData.timeoutHour" class="input">
            <template slot="append">小时</template>
          </el-input>
          <span>后完成的工单，即为该工单超时完成。</span>
        </div>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <pure-button v-auth="'orderExpectedTimeConfig:edit'" label="应用" @click="updateConfig" />
      <pure-button v-auth="'orderExpectedTimeConfig:edit'" label="取消" type="patch" @click="onCancel" />
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import { getOrderExpectedTimeConfigData, updateOrderExpectedTimeConfigData, } from '../api';
import { cloneDeep, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
    CompTips,
  },
  data() {
    return {
      formData: {
        morning: [],
        afternoon: [],
        tomorrow: [],
        timeoutHour: 0,
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
    initData(result) {
      this.formData.timeoutHour = result.timeoutHour || 4;
      this.formData.morning = [result.morningStartTime || '', result.morningEndTime || '',
      ];
      this.formData.afternoon = [result.afternoonStartTime || '', result.afternoonEndTime || '',
      ];
      this.formData.tomorrow = [result.tomorrowStartTime || '', result.tomorrowEndTime || '',
      ];
    },
    getConfig() {
      const loading = this.showLoading();
      getOrderExpectedTimeConfigData().then((result) => {
        this.initData(result);
        this.originalFormData = cloneDeep(result);
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const loading = this.showLoading();
      const params = {
        timeoutHour: this.formData.timeoutHour,
        morningStartTime: this.formData.morning[0],
        morningEndTime: this.formData.morning[1],
        afternoonStartTime: this.formData.afternoon[0],
        afternoonEndTime: this.formData.afternoon[1],
        tomorrowStartTime: this.formData.tomorrow[0],
        tomorrowEndTime: this.formData.tomorrow[1],
      };
      updateOrderExpectedTimeConfigData(params).then(() => {
        this.$message.success('操作成功');
      }).catch((error) => {
        this.$message.error(error);
      }).finally(() => {
        loading.close();
      });
    },
    onCancel() {
      this.initData(this.originalFormData);
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
    // margin-top: 10px;
    font-size: 14px;
    color: #666;
    .input {
      width: 184px;
      margin: 0 8px;
    }
    .input-date {
      margin: 0 8px;
    }
  }
  .form-box {
    // max-width: 500px;
  }
}
</style>
