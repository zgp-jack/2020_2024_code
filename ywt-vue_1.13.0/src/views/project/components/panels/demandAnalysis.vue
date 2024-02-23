<!--
  需求分析
-->
<template>
  <JYWPanel
    :key="'demandAnalysis'"
    title="需求分析信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="demandAnalysis"
    :expand="Expand"
    :disabled="Disabled"
    left-flag-title="分析人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="操作时间"
    :right-flag-value="panelInfo.injectTime"
  >

    <el-form ref="form" size="small" :disabled="Disabled" label-position="right" :model="formData" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="需求分析人" prop="analyst">
            <UserSelect v-model="formData.analyst" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需求类型" prop="type">
            <DicSelect v-model="formData.type" dic-key="itemType" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="核心需求" prop="coreDemand">
        <el-input v-model="formData.coreDemand" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="需求价值" prop="demandValue">
        <el-input v-model="formData.demandValue" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="涉及业务领域">
        <DicMultipleSelect v-model="formData.domain" dic-key="coverageInvolved" class="w-100" placeholder="请选择涉及业务领域" />
      </el-form-item>
      <el-form-item label="涉及系统">
        <DicMultipleSelect v-model="formData.aboutSystem" dic-key="aboutSystem" class="w-100" placeholder="请选择涉及系统" />
      </el-form-item>
      <el-form-item label="技术分析人" prop="analystTechnical">
        <UserSelect v-model="formData.analystTechnical" multiple />
      </el-form-item>
      <el-form-item label="分析备注">
        <el-input v-model="formData.remark" type="textarea" rows="5" :maxlength="2000" show-word-limit />
      </el-form-item>
      <el-form-item label="附件">
        <Upload v-model="formData.enclosure" />
      </el-form-item>

    </el-form>
  </JYWPanel>

</template>

<script>
import UserSelect from '@/views/project/components/userSelect/index';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicMultipleSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';
import Upload from '@/components/upload/index.vue';
import { mapState, mapGetters, } from 'vuex';
import ProjectAPI from '@/apis/project/index';

export default {
  name: 'DemandAnalysis',
  components: {
    UserSelect,
    DicSelect,
    DicMultipleSelect,
    Upload,
  },
  data() {
    return {
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },
      formData: {
        // 需求分析人
        analyst: '',
        // 需求类型
        type: '',
        // 核心需求
        coreDemand: '',
        // 需求价值
        demandValue: '',
        // 附件
        enclosure: '',
        // 分析备注 知识库引用id
        remark: '',
        // 技术分析人
        analystTechnical: '',
        remarkId: '',
        itemCode: '',
        aboutSystem: '',
      },
      rules: {
        analyst: [{
          required: true,
          message: '请选择需求分析人',
          trigger: 'change',
        }],
        type: [{
          required: true,
          message: '请选择需求类型',
          trigger: 'change',
        }],
        coreDemand: [{
          required: true,
          message: '核心需求不能为空',
          trigger: 'change',
        }],
        demandValue: [{
          required: true,
          message: '需求价值不能为空',
          trigger: 'change',
        }],
        analystTechnical: [{
          required: true,
          message: '请选择技术分析人',
          trigger: 'change',
        }],

      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('project/index', {
      DemandData: (obj) => {
        return obj.panelGroupData.demand;
      },
      DemandAnalysis: (obj) => {
        return obj.panelGroupData.demandAnalysis;
      },
      ItemCode: (obj) => {
        return obj.itemCode;
      },
      Disabled: (v) => {
        return v['pancelDisabledOptions'].demandAnalysis;
      },
      Expand: (v) => {
        return v['pancelExpandOptions'].demandAnalysis;
      },
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.DemandAnalysis) {
        this.formData = this.DemandAnalysis;
        this.panelInfo.injectUser = this.DemandAnalysis.updateUser || '';
        this.panelInfo.injectTime = this.DemandAnalysis.updateTime || '';
      } else {
        this.formData.analyst = this.userInfo.id;
        this.formData.type = this.DemandData.itemType;
        this.formData.itemCode = this.ItemCode;
        this.formData.aboutSystem = this.DemandData.aboutSystem || '';
      }
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            try {
              await ProjectAPI.demand.submitDemandAnalysis(this.formData);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验未通过');
          }
        });
      });
    },
    onSave() {
      return new Promise((resolve, reject) => {
        try {
          ProjectAPI.demand.updateDemandAnalysis(this.formData).then(() => {
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
