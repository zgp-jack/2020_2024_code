<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-09 14:24:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-09 14:45:48
 * @Description:工程师取走面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      取走
    </template>
    <template #labelText>
      取货人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      取货时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
    >
      <el-form-item label="签名">
        <div v-if="formData.sign">
          <img class="autograph" :src="$store.state['login'].uriConfig.fileBaseUri+formData.sign">
        </div>
      </el-form-item>
      <el-form-item label="附件">
        <upload v-model="formData.enclosure " />
      </el-form-item>
      <el-form-item label="评价结果">
        <span :style="{color:evaluateResult.color}">{{ evaluateResult.label }}</span>
      </el-form-item>
      <el-form-item label="服务态度">
        <el-rate v-model="formData.serviceAttitude " :max="5" />
      </el-form-item>
      <el-form-item label="服务质量">
        <el-rate v-model="formData.serviceQuality " :max="5" />
      </el-form-item>
      <el-form-item label="响应时效">
        <el-rate v-model="formData.responsePrescription " :max="5" />
      </el-form-item>
      <el-form-item label="意见与建议">
        <el-input v-model="formData.commentSuggestion " type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceMixin from '../mixin';

export default {
  name: 'EngineerTakeAwayPanel',
  mixins: [CarryInServiceMixin],
  data() {
    return {
      name: 'EngineerTakeAwayPanel',
      formData: {},

    };
  },
  computed: {
    evaluateResult() {
      // 规则 非常满意： 合计得分=15, 满意：合计得分大于等于12小于15
      // 一般：合计得分大于等于9小于12
      // 不满意：合计得分大于等于6小于9
      // 非常不满意：合计得分大于等于0小于6
      const value = this.formData.evaluateResult;
      let result = {
        label: '',
        color: '',
      };
      if (value >= 15) {
        result = {
          label: '非常满意',
          color: 'rgb(7, 193, 96)',
        };
      } else if (value >= 12 && value < 15) {
        result = {
          label: '满意',
          color: 'rgb(112, 179, 45)',
        };
      } else if (value >= 9 && value < 12) {
        result = {
          label: '一般',
          color: 'rgb(235, 185, 23)',
        };
      } else if (value >= 6 && value < 9) {
        result = {
          label: '不满意',
          color: 'rgb(230, 129, 57)',
        };
      } else if (value >= 0 && value < 6) {
        result = {
          label: '非常不满意',
          color: 'rgb(254, 108, 108)',
        };
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.autograph  {
  width: 100%;
  height: auto;
}
.el-rate {
  display: inline-block;
}
</style>
