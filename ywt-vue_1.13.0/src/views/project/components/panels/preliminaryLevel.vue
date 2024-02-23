<!-- 初定级信息 -->

<template>
  <JYWPanel
    :key="'preliminaryLevel'"
    title="初定级信息"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    p-k="preliminaryLevel"
    :expand="Expand"
    :disabled="Disabled"
    left-flag-title="定级人"
    :left-flag-value="panelInfo.injectUser | member"
    right-flag-title="定级时间"
    :right-flag-value="panelInfo.injectTime "
  >

    <el-form ref="form" :model="formData" :disabled="Disabled" label-width="120px" :rules="rules" size="small" label-position="right">

      <el-form-item label="项目级别" prop="projectLevel">
        <DicRadio v-model="formData.projectLevel" :dic-key="'itemProjectLevel'" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="projectType">
            <DicSelect v-model="formData.projectType" :dic-key="'projectType'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目负责人" prop="principal">
            <UserSelect v-model="formData.principal" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目优先级" prop="priority">
            <DicSelect v-model="formData.priority" :dic-key="'itemPriority'" />
          </el-form-item>
        </el-col>
      </el-row>

      <!--
       项目级别 M|L 级
     -->
      <el-row v-show="[2,3].includes(formData.projectLevel)">
        <el-col :span="12">
          <el-form-item label="业务答辩人" prop="businessRespondent">
            <UserSelect v-model="formData.businessRespondent" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="技术答辩人">
            <UserSelect v-model="formData.technicalRespondent" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他参与人">
            <UserSelect v-model="formData.otherRespondent" :multiple="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" rows="4" />
      </el-form-item>
    </el-form>

  </JYWPanel>

</template>

<script>
import UserSelect from '@/views/project/components/userSelect/index';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import { mapGetters, mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';

export default {
  components: {
    UserSelect,
    DicRadio,
    DicSelect,
  },
  props: {
  },
  data() {
    return {
      panelInfo: {
        injectUser: '',
        injectTime: '',
      },

      rules: {
        principal: [{ trigger: 'change', message: '请选择项目负责人', required: true, }],
        projectLevel: [{ trigger: 'blur', message: '请选择项目级别', required: true, }],
        priority: [{ trigger: 'blur', message: '请选择项目优先级', required: true, }],
        projectType: [{ trigger: 'blur', message: '请选择项目类型', required: true, }],

        businessRespondent: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ([2, 3].includes(this.formData.projectLevel)) {
                if (value) {
                  callback();
                } else {
                  callback(new Error('请选择业务答辩人'));
                }
              } else {
                callback();
              }
            },
            required: true,
          }
        ],
      },

      formData: {
        itemCode: '',
        // 项目类型
        projectType: 1,
        // 项目负责人
        principal: '',
        // 项目优先级
        priority: '',
        // 项目级别
        projectLevel: 1,
        // 业务答辩人
        businessRespondent: '',
        // 技术答辩人
        technicalRespondent: '',
        // 其他答辩人
        otherRespondent: '',
        // 备注
        remark: '',
      },

    };
  },
  computed: {
    ...mapGetters('project/index', ['getterPanelGroupData']),
    ...mapState('project/index', {

      ItemCode: (obj) => {
        return obj.itemCode;
      },
      Disabled: (v) => {
        return v['pancelDisabledOptions'].preliminaryLevel;
      },
      Expand: (v) => {
        return v['pancelExpandOptions'].preliminaryLevel;
      },
    }),

  },

  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      const data = this.getterPanelGroupData?.firstGrading || {};
      this.$set(this.panelInfo, 'injectUser', data?.updateUser || '');
      this.$set(this.panelInfo, 'injectTime', data?.updateTime || '');
      this.$set(this.formData, 'itemCode', this.ItemCode);
      this.$set(this.formData, 'projectType', data.projectType || null);
      this.$set(this.formData, 'principal', data.principal || null);
      this.$set(this.formData, 'priority', data.priority || 2);
      this.$set(this.formData, 'projectLevel', data.projectLevel || 1);
      this.$set(this.formData, 'businessRespondent', data.businessRespondent || null);
      this.$set(this.formData, 'technicalRespondent', data.technicalRespondent || null);
      this.$set(this.formData, 'otherRespondent', data.otherRespondent || null);
      this.$set(this.formData, 'remark', data.remark || '');
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              await ProjectAPI.demand.submitPreliminaryLevel(this.formData);
              resolve();
              this.$message.success('提交成功!');
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验不通过!');
          }
        });
      });
    },
    save() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              await ProjectAPI.demand.updatePreliminaryLevel(this.formData);
              resolve();
              this.$message.success('保存成功!');
            } catch (error) {
              reject(error);
            }
          } else {
            reject('表单校验不通过!');
          }
        });
      });
    },

  },
};
</script>

