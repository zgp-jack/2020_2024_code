<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-13 14:25:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-29 17:42:49
 * @Description:评价信息面板
-->
<template>
  <pure-card>
    <div slot="header">
      评价
    </div>
    <el-form
      disabled
      label-position="right"
      size="mini"
      label-width="120px"
    >

      <el-form-item label="评价时间">
        {{ formData.createTime }}
      </el-form-item>

      <el-tabs v-model="activeName">
        <el-tab-pane label="接听电话" name="1">
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
          <el-form-item label="评价结果">
            <span :style="{color:evaluateResult(formData.evaluateResult).color}">{{ evaluateResult(formData.evaluateResult).label }}</span>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="处理速度" name="2">
          <el-form-item label="服务态度">
            <el-rate v-model="formData.makeSpeedServiceAttitude " :max="5" />
          </el-form-item>
          <el-form-item label="服务质量">
            <el-rate v-model="formData.makeSpeedServiceQuality " :max="5" />
          </el-form-item>
          <el-form-item label="响应时效">
            <el-rate v-model="formData.makeSpeedResponsePrescription " :max="5" />
          </el-form-item>
          <el-form-item label="意见与建议">
            <el-input v-model="formData.makeSpeedCommentSuggestion " type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="评价结果">
            <span :style="{color:evaluateResult(formData.makeSpeedEvaluateResult).color}">{{ evaluateResult(formData.makeSpeedEvaluateResult).label }}</span>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="处理效果" name="3">
          <el-form-item label="服务态度">
            <el-rate v-model="formData.makeEffectServiceAttitude " :max="5" />
          </el-form-item>
          <el-form-item label="服务质量">
            <el-rate v-model="formData.makeEffectServiceQuality " :max="5" />
          </el-form-item>
          <el-form-item label="响应时效">
            <el-rate v-model="formData.makeEffectResponsePrescription " :max="5" />
          </el-form-item>
          <el-form-item label="意见与建议">
            <el-input v-model="formData.makeEffectCommentSuggestion " type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="评价结果">
            <span
              :style="{color:evaluateResult(formData.makeEffectEvaluateResult).color}"
            >{{ evaluateResult(formData.makeEffectEvaluateResult).label }}</span>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item label="附件">
        <upload v-model="formData.enclosure " />
      </el-form-item>
      <el-form-item label="评价人">

        <div> {{ formData.createUserToName||'暂无' }}</div>
        <div v-if="formData.autograph">
          <img class="autograph" :src="$store.state['login'].uriConfig.fileBaseUri+formData.autograph">
        </div>

      </el-form-item>

    </el-form>
  </pure-card>
</template>

<script>
import { omitBy, isNil, } from 'lodash';
export default {
  components: {
    Upload: () => import('@/components/upload'),
  },
  props: {
    evaluate: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: '1',

      formData: {
        createTime: null,
      },
    };
  },
  computed: {

  },
  watch: {
    evaluate: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, omitBy(val, isNil));
      },
      deep: true,
      immediate: true,

    },
  },
  methods: {
    // 通过值获取评价结果
    getEvaluateResult(value) {

    },
    evaluateResult(value) {
      value = Number(value || 0);
      // 规则 非常满意： 合计得分=15, 满意：合计得分大于等于12小于15
      // 一般：合计得分大于等于9小于12
      // 不满意：合计得分大于等于6小于9
      // 非常不满意：合计得分大于等于0小于6
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
::v-deep .el-tabs__header .el-tabs__item.is-active{
  background-color: initial !important;
  color: #426ED7 !important;
}
.el-rate {
  display: inline-block;
}
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-11 {
    padding: 0;
  }
}
.autograph  {
  width: 100%;
  height: auto;
}
</style>
