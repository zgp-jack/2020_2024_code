<!--
  技术分析
-->
<template>
  <JYWPanel
    :key="'technicalAnalysis'"
    title="技术评估信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="technicalAnalysis"
    :expand="Expand"
    :disabled="Disabled"
    left-flag-title="分析人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="操作时间"
    :right-flag-value="panelInfo.injectTime"
  >
    <el-form ref="form" :disabled="Disabled" size="small" label-position="right" :model="formData" :rules="rules" label-width="140px">

      <el-form-item label="难易程度" label-width="100px">
        <DicRadio v-model="formData.difficulty" dic-key="difficulty" />
      </el-form-item>
      <el-form-item label="当前技术风险" prop="technicalRisk">
        <el-input v-model="formData.technicalRisk" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="建议解决方案" prop="solution">
        <el-input v-model="formData.solution" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="实施形式" prop="applyType">
        <DicSelect v-model="formData.applyType" :type="'string'" dic-key="implementation_form" class="w-100" />
      </el-form-item>
      <el-form-item label="评估备注">
        <el-input v-model="formData.remark" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="预估工时">
            <el-input v-model="formData.workingHours" v-input-number :min="0">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-form-item label="附件">
        <Upload v-model="formData.enclosure" />
      </el-form-item>

    </el-form>
  </JYWPanel>
</template>

<script>
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';

import Upload from '@/components/upload/index.vue';
import ProjectAPI from '@/apis/project/index';
import { mapGetters, mapState, } from 'vuex';

export default {

  components: {
    DicSelect,
    DicRadio,
    Upload,
  },
  data() {
    return {
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      formData: {
        // 难易程度
        difficulty: 1,
        // 技术风险
        technicalRisk: '',
        // 建议解决方案
        solution: '',
        // 实施形式
        applyType: '',
        // 备注
        remark: '',
        // 预估工时 【天】
        workingHours: '',
        // 附件
        enclosure: '',
      },
      rules: {

        technicalRisk: [{
          required: true,
          message: '当前技术风险不能为空',
          trigger: 'blur',
        }],
        solution: [{
          required: true,
          message: '建议解决方案不能为空',
          trigger: 'blur',
        }],
        applyType: [{
          required: true,
          message: '请选择实施形式',
          trigger: 'change',
        }],
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('project/index', {
      TechnicalAnalysisData: (obj) => {
        return obj.panelGroupData.technicalAnalysis;
      },
      ItemCode: (obj) => {
        return obj.itemCode;
      },
      Disabled: (v) => {
        return v['pancelDisabledOptions'].technicalAnalysis;
      },
      Expand: (v) => {
        return v['pancelExpandOptions'].technicalAnalysis;
      },
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.TechnicalAnalysisData) {
        this.formData = this.TechnicalAnalysisData;
        this.panelInfo.injectUser = this.TechnicalAnalysisData.updateUser || '';
        this.panelInfo.injectTime = this.TechnicalAnalysisData.updateTime || '';
      } else {
        this.formData.itemCode = this.ItemCode;
      }
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            try {
              await ProjectAPI.demand.submitTechnicalAnalysis(this.formData);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验未通过!');
          }
        });
      });
    },
    onSave() {
      return new Promise((resolve, reject) => {
        try {
          ProjectAPI.demand.updateTechnicalAnalysis(this.formData).then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } catch (error) {
          reject(error);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.w-{
  &-100{
    width: 100%;
  }
}
</style>
