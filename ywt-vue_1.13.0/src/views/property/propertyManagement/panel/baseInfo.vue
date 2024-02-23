<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-15 15:18:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:43
 * @Description: 资产登记基本信息
-->

<template>
  <pure-card ref="card" class="max-height" :show-expand="showExpand">
    <div slot="header">
      基本信息
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="135px"
      size="mini"
      :model="formData"
      :disabled="actionType==='view'"
      :rules="rules"
    >
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="规格型号" prop="model">
              <el-input v-model="formData.model" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="设备S/N码">
              <el-input v-model="formData.seriesNumb" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="使用日期">
              <el-date-picker
                v-model="formData.useDate"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="使用年限">
              <el-input-number
                v-model="formData.years"
                controls-position="right"
                class="w70"
                :min="0.1"
                :max="100"
              /><span class="unit">年</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="设备状态">
              <dictionary-select
                v-model="formData.equipmentState"
                :dic-key="'equipmentStateList'"
                placeholder="请选择设备状态"
              />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="资产类型" prop="assetsType">
              <dictionary-select
                v-model="formData.assetsType"
                :dic-key="'assetsTypeList'"
                placeholder="请选择资产类型"
                class="w100"
              />
            </el-form-item>
          </el-col>

          <el-col :span="25">
            <el-form-item label="资产来源" prop="assetsSource">
              <dictionary-select
                v-model="formData.assetsSource"
                :dic-key="'assetsSourceList'"
                placeholder="请选择资产来源"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="外联系统ID">
              <el-input v-model="formData.outLinked" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="系统生成编号">
              <el-switch
                v-model="formData.isAutoCode"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                :disabled="actionType!=='create'"
                @change="toggleAutoCode"
              />
            </el-form-item>

          </el-col>
          <el-col :span="25">
            <el-form-item v-if="formData.isAutoCode" label="资产编号前缀" prop="codePrefix">
              <dictionary-select
                v-model="formData.codePrefix"
                :disabled="actionType!=='create'"
                :dic-key="'codePrefixList'"
                placeholder="请选择资产编号前缀"
                class="w100"
              />

            </el-form-item>
            <el-form-item v-else label="资产编号" prop="assetsCode">
              <el-input v-model="formData.assetsCode" :disabled="actionType!=='create'" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="是否计量">
              <el-switch
                v-model="formData.isMetering"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="计量周期" prop="meteringTimer">
              <el-input-number
                v-model="formData.meteringTimer"
                :disabled="!formData.isMetering"
                controls-position="right"
                class="w70"
                :min="1"
                :max="999"
              /><span class="unit">年/次</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="公共设备">
              <el-switch
                v-model="formData.isPublic"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="使用科室" prop="useDept">
              <department-cascader v-model="formData.useDept" class="w100" />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="所在位置">
              <el-input v-model="formData.place" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="使用责任人">
              <engineer-select v-model="formData.personLiable" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="维保服务">
              <el-switch
                v-model="formData.isMaintain"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                @change="toggleMaintain"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="维保期限" prop="maintainTerm">
              <el-date-picker
                v-model="formData.maintainTerm"
                :disabled="!formData.isMaintain"
                type="datetime"
                value-format="timestamp"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="50">
            <el-form-item label="维保公司" prop="maintainCompany">
              <dictionary-select
                v-model="formData.maintainCompany"
                :disabled="!formData.isMaintain"
                :dic-key="'maintainCompanyList'"
                placeholder="请选择维保公司"
                class="w100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="维保责任人" prop="maintainUser">
              <engineer-select v-model="formData.maintainUser" :disabled="!formData.isMaintain" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="25">
            <el-form-item label="是否巡检">
              <el-switch
                v-model="formData.isPatrol"
                :active-value="1"
                :inactive-value="0"
                active-text="是"
                inactive-text="否"
                @change="toggleInspection"
              />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="巡检模板" prop="patrolTemp">
              <inspection-template-select v-model="formData.patrolTemp" :disabled="!formData.isPatrol" />
            </el-form-item>
          </el-col>
          <el-col :span="25">
            <el-form-item label="维护科室">
              <department-cascader v-model="formData.patrolDept" class="w100" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="附件">
        <el-col :span="22">
          <upload v-model="formData.enclosure" />
        </el-col>
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
export default {
  components: {
    Upload: () => import('@/components/upload'),
    DictionarySelect: () => import('@/views/components/dictionary/dictionarySelect.vue'),
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
    InspectionTemplateSelect: () => import('@/views/inspection/component/select/templateSelect.vue'),

  },
  props: {
    showExpand: {
      type: Boolean,
      default: false,
    },
    actionType: {
      type: String,
      default: 'create',
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      // 是否维保
      isMaintain: 1,
      // 是否计量
      isMetering: 1,
      // 是否系统生成编号
      isAutoCode: 1,
      // 是否巡检
      isPatrol: 1,
      formData: {
        name: null,
        model: null,
        seriesNumb: null,
        useDate: null,
        years: null,
        equipmentState: null,
        assetsType: null,
        assetsSource: null,
        outLinked: null,
        isAutoCode: 1,
        codePrefix: null,
        assetsCode: null,
        isMetering: 1,
        meteringTimer: null,
        isPublic: 1,
        useDept: null,
        place: null,
        personLiable: null,
        isMaintain: 1,
        maintainTerm: null,
        maintainCompany: null,
        maintainUser: null,
        isPatrol: 1,
        patrolTemp: null,
        patrolDept: null,

      },
    };
  },
  computed: {
    rules() {
      const data = {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur',
        }],
        model: [{
          required: true, message: '请输入规格型号', trigger: 'blur',
        }],
        assetsType: [{
          required: true, message: '请选择资产类型', trigger: 'change',
        }],
        assetsSource: [{
          required: true, message: '请选择资产来源', trigger: 'change',
        }],
        useDept: [{
          required: true, message: '请选择使用科室', trigger: 'change',
        }],
      };
      if (this.isMaintain) {
        data.maintainTerm = [{
          required: true, message: '请选择维保期限', trigger: 'change',
        }];
        data.maintainCompany = [{
          required: true, message: '请选择维保公司', trigger: 'change',
        }];
        data.maintainUser = [{
          required: true, message: '请选择维保责任人', trigger: 'change',
        }];
      }
      if (this.isMetering) {
        data.meteringTimer = [{
          required: true, message: '请输入计量周期', trigger: 'blur',
        }];
      }
      if (this.isPatrol) {
        data.patrolTemp = [{
          required: true, message: '请选择巡检模板', trigger: 'change',
        }];
      }
      if (this.isAutoCode) {
        data.codePrefix = [{
          required: true, message: '请选择资产编号前缀', trigger: 'change',
        }];
      } else {
        data.assetsCode = [{
          required: true, message: '请输入资产编号', trigger: 'blur',
        }];
      }

      return data;
    },
  },
  async created() {
    if (this.actionType !== 'create') {
      this.formData = Object.assign({}, this.data);
    }
  },

  methods: {
    toggleExpand() {
      this.$refs.card.expand = !this.$refs.card.expand;
    },
    async check() {
      await this.$refs.form.validate();
      return this.formData;
    },
    // 切换是否巡检按钮后数据处理
    async toggleInspection(val) {
      this.clearValidate();
      this.isPatrol = val;
      if (!val) {
        this.formData.patrolTemp = null;
      }
    },
    // 切换是否系统生成编号按钮后数据处理
    async toggleAutoCode(val) {
      this.clearValidate();
      this.isAutoCode = val;
      if (val) {
        this.formData.assetsCode = null;
      } else {
        this.formData.codePrefix = null;
      }
    },
    // 切换是否计量按钮后数据处理
    async toggleMetering(val) {
      this.clearValidate();
      this.isMetering = val;
      if (!val) {
        this.formData.meteringTimer = null;
      }
    },
    // 切换是否维保服务按钮后数据处理
    async toggleMaintain(val) {
      this.clearValidate();
      this.isMaintain = val;

      if (!val) {
        this.formData.maintainCompany = null;
        this.formData.maintainUser = null;
        this.formData.maintainTerm = null;
      }
    },
    // 切换是否巡检按钮后数据处理
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-col-25 {
  width: 20%;
}
::v-deep .el-col-50 {
  width: 40%;
}
.form-item-wrapper {
  padding: 0;
   margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
.w70 {
  width:70%;
}
.w100 {
  width: 100%;
}
.unit {
  font-size: 14px;
  color: #879BBA;
  padding-left: 7px;
}
</style>
