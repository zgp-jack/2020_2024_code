<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="comp-report-error-work-order-tips">
    <p class="title">工单提示配置</p>
    <CompModuleHeader title="待派单提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.waitDispatchRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.waitDispatchRemind">
      <CompTips content="提示服务台人员对于已建未派的工单及时派单。" />
      <el-form-item label-width="0" prop="remindDispatchTime">
        <div class="content-box">
          <span>新建工单后，每隔</span>
          <el-input v-model.number="formData.remindDispatchTime" class="input">
            <template slot="append">分钟</template>
          </el-input>
          提醒派单
        </div>
      </el-form-item>
    </template>
    <CompModuleHeader title="告警事件提醒">
      <template v-slot:extra>
        <el-switch v-model="formData.alarmEventRemind" />
      </template>
    </CompModuleHeader>
    <template v-if="formData.alarmEventRemind">
      <CompTips
        content="在规定时间内，有较多数量，同故障分类的工单报修时，进行提醒。"
      />
      <el-form-item label-width="0" prop="faultOrder">
        <div class="content-box">
          <span>相同故障分类工单，在</span>
          <el-input v-model.number="formData.faultOrderTime" class="input">
            <template slot="append">分钟</template>
          </el-input>
          <span>内，大于等于</span>
          <el-input v-model.number="formData.faultOrderNum" class="input">
            <template slot="append">条</template>
          </el-input>
          <span>时，进行提醒</span>
        </div>
      </el-form-item>
      <el-form-item label-width="100px" label="提醒方式" class="is-required" prop="remindWay">
        <div class="tips-method-box">
          <div class="tips-method-box-header">
            <el-checkbox v-model="formData.rightRemindWay">右上角通知提醒</el-checkbox>
            <el-button type="text" @click="onDemonstrateNotify">演示</el-button>
          </div>
          <p>浏览器右上角弹出提示，占位小，不影响其他功能操作（推荐）</p>
        </div>
        <div class="tips-method-box">
          <div class="tips-method-box-header">
            <el-checkbox v-model="formData.screenRemindWay">全屏弹窗提醒</el-checkbox>
            <el-button type="text" @click="onDemonstrateDialog">演示</el-button>
          </div>
          <p>浏览器中部弹窗提示，占位大，会打断其他功能操作</p>
        </div>
      </el-form-item>
    </template>
    <div class="btn-box">
      <pure-button
        label="应用"
        :disabled="isButtonDisabled"
        @click="updateConfig"
      />
      <pure-button
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
import CompTips from './tips.vue';
import {
  getWorkOrderTipsConfigData,
  updateWorkOrderTipsConfigData,
} from '../api';
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
    const validateFaultOrder = (rule, value, callback) => {
      if (!isEmpty(this.formData.faultOrderTime) && !isInteger(this.formData.faultOrderTime)) {
        callback(new Error('格式不对'));
      } else if (!isEmpty(this.formData.faultOrderNum) && !isInteger(this.formData.faultOrderNum)) {
        callback(new Error('格式不对'));
      } else {
        callback();
      }
    };
    const validateRemindWay = (rule, value, callback) => {
      if (this.formData.alarmEventRemind && !this.formData.rightRemindWay && !this.formData.screenRemindWay) {
        callback(new Error('请选择提醒方式'));
      } else if (this.formData.alarmEventRemind && this.formData.rightRemindWay && this.formData.screenRemindWay) {
        callback(new Error('请只选择其中一种方式'));
      } else {
        callback();
      }
    };
    return {
      originalFormData: null,
      formData: {},
      rules: {
        remindDispatchTime: [
          {
            validator: validateInt,
          },
        ],
        faultOrder: [
          {
            validator: validateFaultOrder,
          },
        ],
        remindWay: [
          {
            validator: validateRemindWay,
          },
        ],
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
    getConfig() {
      const loading = this.showLoading();
      getWorkOrderTipsConfigData()
        .then((result) => {
          if (result) {
            this.formData = result;
            this.originalFormData = cloneDeep(result);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    updateConfig() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const loading = this.showLoading();
          updateWorkOrderTipsConfigData(this.formData)
            .then(() => {
              this.$message.success('操作成功');
              this.getConfig();
            })
            .finally(() => {
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
    onDemonstrateNotify() {
      this.$notify({
        title: '告警消息',
        message: '已有6条工单同时报修“软件/登录异常”',
        type: 'warning',
      });
    },
    onDemonstrateDialog() {
      this.$alert('已有6条工单同时报修“软件/登录异常”', '告警消息', {
        confirmButtonText: '确定',
      });
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
    margin-top: 10px;
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
