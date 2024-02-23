<template>
  <div class="comp-global-big-screen">
    <p class="title">大屏</p>
    <CompTips content="配置大屏展示的模块，轮播时间。" />
    <CompModuleHeader title="展示配置" />
    <el-form label-width="100px" class="form-box">
      <el-form-item label="展示页面" class="is-required">
        <el-checkbox v-model="formData.workOrder">工单统计</el-checkbox>
        <el-checkbox v-model="formData.project">项目统计</el-checkbox>
      </el-form-item>
      <el-form-item label="轮播时间">
        <el-input v-model="formData.rotationTime">
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
import { getBigScreenConfigData, updateBigScreenConfigData, } from '../api';
import { cloneDeep, isEqual, } from 'lodash-es';

export default {
  components: {
    CompModuleHeader,
    CompTips,
  },
  data() {
    return {
      formData: {
        workOrder: false,
        project: false,
        rotationTime: '',
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
      getBigScreenConfigData().then((result) => {
        if (result) {
          this.originalFormData = result;
          this.formData = cloneDeep(result);
        }
      }).finally(() => {
        loading.close();
      });
    },
    updateConfig() {
      const loading = this.showLoading();
      updateBigScreenConfigData(this.formData).then(() => {
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
.comp-global-big-screen {
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
