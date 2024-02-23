<template>
  <el-form ref="formRef" :model="formData" class="comp-report-error-work-order-tips">
    <p class="title">工单提醒配置</p>
    <CompModuleHeader title="超时未派单提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.dispatchTimeoutRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.dispatchTimeoutRemind">
      <el-form-item label-width="0" prop="dispatchTimeoutMinute">
        <div class="content-box">
          <span>建单</span>
          <el-input v-model.number="formData.dispatchTimeoutMinute" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>未派单时，每隔</span>
          <el-input v-model.number="formData.dispatchTimeoutInterval" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>推送“超时待派单提醒”系统消息</span>
        </div>
      </el-form-item>
    </template>
    <CompModuleHeader title="超时未接单提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.receiveTimeoutRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.receiveTimeoutRemind">
      <el-form-item label-width="0" prop="faultOrder">
        <div class="content-box">
          <span>派单</span>
          <el-input v-model.number="formData.receiveTimeoutMinute" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>分钟未接单时，每隔</span>
          <el-input v-model.number="formData.receiveTimeoutInterval" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>通过“微信服务号”推送“接单超时通知”消息</span>
        </div>
      </el-form-item>
      <el-form-item
        label="提醒人员"
        class="is-required"
        prop="receive"
        :rules="[{
          required:true,
          message:'不能为空',
        }]"
      >
        <el-checkbox-group v-model="formData.receive">
          <el-checkbox label="1" name="receive">处理人</el-checkbox>
          <el-checkbox label="2" name="receive">组长</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
    <CompModuleHeader title="超时未完成提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.completeTimeoutRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.completeTimeoutRemind">
      <el-form-item label-width="0" prop="faultOrder">
        <div class="content-box">
          <span>接单</span>
          <el-input v-model.number="formData.completeTimeoutMinute" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>分钟未完成工单时，每隔</span>
          <el-input v-model.number="formData.completeTimeoutInterval" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>通过“微信服务号”推送“超时未完成工单通知”消息</span>
        </div>
      </el-form-item>
      <el-form-item
        label="提醒人员"
        class="is-required"
        prop="complete"
        :rules="[{
          required:true,
          message:'不能为空',
        }]"
      >
        <el-checkbox-group v-model="formData.complete">
          <el-checkbox label="1" name="complete">处理人</el-checkbox>
          <el-checkbox label="2" name="complete">组长</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
    <CompModuleHeader title="集中报修提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.centralizedRepairRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.centralizedRepairRemind">
      <el-form-item label-width="0" prop="remindDispatchTime">
        <div class="content-box">
          <span>相同故障分类工单，在</span>
          <el-input v-model.number="formData.repairMinute" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>内，大于等于</span>
          <el-input v-model.number="formData.repairTimes" class="input">
            <template slot="append">条</template>
          </el-input>
          <span>时，推送“集中报修提醒”系统消息</span>
        </div>
      </el-form-item>
    </template>
    <CompModuleHeader title="评价结果提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.evaluateResultRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.evaluateResultRemind">
      <el-form-item
        label-width="0"
        prop="evaluate"
        :rules="[{
          required:true,
          message:'不能为空',
        }]"
      >
        <div class="content-box">
          <span>评价结果为</span>
          <el-select v-model="formData.evaluate" collapse-tags multiple clearable placeholder="请选择" class="input">
            <el-option label="非常满意" value="1" />
            <el-option label="满意" value="2" />
            <el-option label="一般" value="3" />
            <el-option label="不满意" value="4" />
            <el-option label="非常不满意" value="5" />
          </el-select>
          <span>时，推送“评价结果提醒”系统消息或通过“微信服务号”推送“工单评价通知”</span>
        </div>
      </el-form-item>
      <el-form-item
        label="提醒人员"
        class="is-required"
        prop="evaluateReminder"
        :rules="[{
          required:true,
          message:'不能为空',
        }]"
      >
        <el-checkbox-group v-model="formData.evaluateReminder">
          <el-checkbox label="1" name="evaluateReminder">服务台</el-checkbox>
          <el-checkbox label="2" name="evaluateReminder">组长</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
    <div class="btn-box">
      <pure-button
        v-auth="'orderReminderConfig:edit'"
        label="应用"
        :disabled="isButtonDisabled"
        @click="updateConfig"
      />
      <pure-button
        v-auth="'orderReminderConfig:edit'"
        label="取消"
        type="patch"
        :disabled="isButtonDisabled"
        @click="onCancel"
      />
    </div>
  </el-form>
</template>

<script>
import CompModuleHeader from './module-header.vue';
// import CompTips from './tips.vue';
import {
  updateOrderReminderConfigData,
  getOrderReminderConfigData,
} from '../api';
import { cloneDeep, isEqual, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
    // CompTips,
  },
  data() {
    return {
      originalFormData: null,
      formData: {
        // 超时未派单提醒
        dispatchTimeoutRemind: '',
        dispatchTimeoutMinute: '',
        dispatchTimeoutInterval: '',
        // 超时未接单提醒
        receiveTimeoutRemind: '',
        receiveTimeoutMinute: '',
        receiveTimeoutInterval: '',
        receiveTimeoutReminder: '',
        receive: [],
        // 超时未完成提醒
        completeTimeoutRemind: '',
        completeTimeoutMinute: '',
        completeTimeoutInterval: '',
        completeTimeoutReminder: '',
        complete: [],
        // 集中报修提醒
        centralizedRepairRemind: '',
        repairMinute: '',
        repairTimes: '',
        // 评价结果提醒
        evaluateResultRemind: '',
        evaluateResult: '',
        evaluate: [],
        evaluateResultReminder: '',
        evaluateReminder: [],
      },
    };
  },
  computed: {
    isButtonDisabled() {
      return (
        !this.originalFormData || isEqual(this.originalFormData, this.formData)
      );
    },
  },
  created() {
    this.getConfig();
  },
  methods: {
    initData(result) {
      return {
        ...result,
        dispatchTimeoutRemind: result.dispatchTimeoutRemind || false,
        receiveTimeoutRemind: result.receiveTimeoutRemind || false,
        receive: result.receiveTimeoutReminder ? result.receiveTimeoutReminder.split(',') : [],
        completeTimeoutRemind: result.completeTimeoutRemind || false,
        complete: result.completeTimeoutReminder ? result.completeTimeoutReminder.split(',') : [],
        centralizedRepairRemind: result.centralizedRepairRemind || false,
        evaluateResultRemind: result.evaluateResultRemind || false,
        evaluate: result.evaluateResult ? result.evaluateResult.split(',') : [],
        evaluateReminder: result.evaluateResultReminder ? result.evaluateResultReminder.split(',') : [],
      };
    },
    getConfig() {
      const loading = this.showLoading();
      getOrderReminderConfigData()
        .then((result) => {
          this.formData = this.initData(result);
          this.originalFormData = cloneDeep(result);
        })
        .finally(() => {
          loading.close();
        });
    },
    updateConfig() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.formData.receiveTimeoutReminder = this.formData.receive.join(',');
          this.formData.completeTimeoutReminder = this.formData.complete.join(',');
          this.formData.evaluateResult = this.formData.evaluate.join(',');
          this.formData.receiveTimeoutReminder = this.formData.receive.join(',');
          this.formData.evaluateResultReminder = this.formData.evaluateReminder.join(',');
          const loading = this.showLoading();
          updateOrderReminderConfigData(this.formData)
            .then(() => {
              this.$message.success('操作成功');
              this.getConfig();
            })
            .finally(() => {
              loading.close();
            });
        }
      });
    },
    onCancel() {
      this.formData = this.initData(this.originalFormData);
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-report-error-work-order-tips {
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
  }
  .tips-method-box {
    width: 400px;
    margin-bottom: 10px;
    padding: 10px 16px;
    border: 1px solid #e7e7e7;
    border-radius: 2px;
    font-size: 12px;
    color: #666;
    &-header {
      display: flex;
      justify-content: space-between;
    }
  }
  .form-box {
    max-width: 500px;
  }
  .btn-box {
    margin-top: 20px;
  }
}
</style>
