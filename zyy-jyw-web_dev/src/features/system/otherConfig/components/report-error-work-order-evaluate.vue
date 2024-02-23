<template>
  <div class="comp-report-error-attendance">
    <p class="title">工单评价</p>
    <CompTips content="开启后，工单需进行评价才可结束。" style="margin-bottom: 8px" />
    <CompModuleHeader title="工单评价">
      <template v-slot:extra>
        <el-switch v-model="formData.isEnable" />
      </template>
    </CompModuleHeader>
    <el-form v-if="formData.isEnable" ref="formRef" :model="formData" :rules="rules" label-width="120px" class="form-box">
      <el-form-item label="评价方式" class="is-required" prop="evaluateWay">
        <div class="evaluate-method-box">
          <div class="evaluate-method-box-header">
            <el-checkbox v-model="formData.isActive">主动评价</el-checkbox>
          </div>
          <p>需报修人在自己手机使用小程序，主动对工单进行评价（推荐）</p>
          <p>此方式适用报修人在系统中注册为用户，且绑定小程序</p>
        </div>
        <div class="evaluate-method-box">
          <div class="evaluate-method-box-header">
            <el-checkbox v-model="formData.isPassive">被动评价</el-checkbox>
          </div>
          <p>需工程师在完成工单时，让报修人在工程师的手机上进行评价</p>
          <p>此方式适用报修人未在系统中注册为用户，且不使用小程序</p>
        </div>
      </el-form-item>
      <el-form-item label="工单完成后" prop="completeDay">
        <div class="content-box">
          <el-input v-model.number="formData.completeDay" class="input">
            <template slot="append">天</template>
          </el-input>
          <span>内可评价</span>
        </div>
      </el-form-item>
      <el-form-item label="超期未评" prop="overdue">
        <el-select v-model="formData.overdue" placeholder="请选择">
          <el-option label="不做评价" :value="0" />
          <el-option label="默认5星非常满意" :value="1" />
          <el-option label="默认4星满意" :value="2" />
          <el-option label="默认3星一般" :value="3" />
          <el-option label="默认2星不满意" :value="4" />
          <el-option label="默认1星非常不满意" :value="5" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <pure-button v-auth="'orderEvaluateConfig:edit'" label="应用" :disabled="isButtonDisabled" @click="updateConfig" />
      <pure-button v-auth="'orderEvaluateConfig:edit'" label="取消" type="patch" :disabled="isButtonDisabled" @click="onCancel" />
    </div>
  </div>
</template>

<script>
import CompModuleHeader from './module-header.vue';
import CompTips from './tips.vue';
import { getWorkOrderEvaluateConfigData, updateWorkOrderEvaluateConfigData, } from '../api';
import { cloneDeep, isEqual, isInteger, } from 'lodash-es';
import { isEmpty, } from '@/common/utils/validator';

export default {
  components: {
    CompModuleHeader,
    CompTips,
  },
  data() {
    const validateInt = (rule, value, callback) => {
      if (!isEmpty(value) && !isInteger(value)) {
        callback(new Error('格式不对'));
      } else {
        callback();
      }
    };
    const validateEvaluateWay = (rule, value, callback) => {
      if (this.formData.isEnable && !this.formData.isActive && !this.formData.isPassive) {
        callback(new Error('请选择评价方式'));
      } else if (this.formData.isEnable && this.formData.isActive && this.formData.isPassive) {
        callback(new Error('请只选择其中一种方式'));
      } else {
        callback();
      }
    };
    return {
      originalFormData: null,
      formData: {},
      rules: {
        evaluateWay: [
          {
            validator: validateEvaluateWay,
          },
        ],
        completeDay: [
          { required: true, message: '请输入天数', },
          { validator: validateInt, },
        ],
        overdue: [
          { required: true, message: '请输入超期未评内容', },
        ],
      },
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
      getWorkOrderEvaluateConfigData().then((result) => {
        if (result) {
          this.originalFormData = result;
          this.formData = cloneDeep(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const loading = this.showLoading();
          updateWorkOrderEvaluateConfigData(this.formData).then(() => {
            this.$message.success('操作成功');
            this.getConfig();
          }).finally(() => {
            loading.close();
          });
        } else {
          this.$message.error('请正确填写');
        }
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
  .content-box {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    .input {
      width: 184px;
      margin: 0 8px;
    }
  }
  .evaluate-method-box {
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
}
</style>
