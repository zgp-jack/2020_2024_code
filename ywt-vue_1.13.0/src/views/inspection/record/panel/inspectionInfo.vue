<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-18 15:52:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:40:00
 * @Description:巡检-正常
-->
<template>
  <pure-card class="max-height">
    <div slot="header">
      巡检信息
      <span>
        巡检人:
        <span>{{ userInfo.name }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      size="mini"
      label-position="right"
      label-width="108px"
      :model="formData"
      :rules="rules"
      :disabled="actionType==='view'"
    >

      <el-row>
        <el-col :span="actionType==='view'?6:25">
          <el-form-item label="巡检结果">
            <dic-select v-model="formData.result" style="width:160px;margin-left:5px" dic-key="inspectionResult" />
          </el-form-item>
        </el-col>
        <template v-if="formData.result === 2">
          <el-col :span="actionType==='view'?6:5">
            <el-form-item label="异常处理办法">
              <dic-radio v-model="formData.errorMake" dic-key="errorMake" />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.errorMake===1" :span="actionType==='view'?5:5">
            <el-form-item label="整改时间" prop="rectificationTime">
              <el-date-picker
                v-model="formData.rectificationTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-form-item label="详细说明">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          style="width:100%; text-align: left;margin-right:5px;"
        />
      </el-form-item>
      <el-form-item label="过程照片">
        <upload v-model="formData.processPhoto" list-type="picture-card" :disabled="actionType==='view'" />
      </el-form-item>
      <template v-if="formData.result===2&&formData.errorMake===2">
        <el-row>
          <el-col :span="6">
            <el-form-item label="报修人">
              <engineer-select v-model="formData.repairUser" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报修电话" prop="repairPhone">
              <el-input v-model="formData.repairPhone" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="指派人员" prop="inspDutyOfficer">
              <el-input
                ref="sendUserInput"
                v-model="formData.inspDutyOfficer"
                style="width: auto"
                @focus="handleOpenEngineerPanel"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="formData.reqTime"
                style="width: 70%"
                placeholder=""
                @input="handleReqTimeInput"
              />
              小时
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="故障分类" prop="faultType">

              <fault-type-select
                v-model="formData.faultType"
                style="width:100%"
                @change="handleFaultTypeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障描述" prop="faultRemark">

              <el-input
                v-model="formData.faultRemark"
                style="width:calc(100% - 60px); text-align: left;margin-right:5px;"
              />
              <el-button
                style="width:55px;background: #d7e5f9; color: #409eff;"
              >引用</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="紧急程度">
              <dic-radio v-model="formData.degree" dic-key="gradeUrgency" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响范围">
              <dic-radio v-model="formData.rangeType" dic-key="faultScope" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <span v-if="propertyName" class="inpection-content-title">巡检内容 <span>巡检设备：{{ propertyName }}</span></span>
      <empty-row />
      <el-table
        border
        :data="formData.details"
      >
        <el-table-column
          label="序号"
          type="index"
          align="left"
          width="78px"
        />
        <el-table-column
          label="巡检分类"
          align="left"
          prop="inspectionType"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="巡检内容"
          align="left"
          prop="inspectionRemark"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="巡检值域"
          align="left"
          prop="valueScope"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{ convertVauleScope(row) }}
          </template>
        </el-table-column>
        <el-table-column
          label="实测值"
          align="left"
          prop="writeValue"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <el-select
              v-if="row.valueType===1"
              v-model="row.writeValue"
              clearable
              size="mini"
              @change="handleOptionWriteValueChange(row)"
            >
              <el-option
                v-for="(item,index) in getInspectionValueOption(row)"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <el-input-number v-else v-model.number="row.writeValue" size="mini" style="width:100%" @change="handleValueWriteValueChange(row)" />

          </template>
        </el-table-column>
        <el-table-column
          label="最终结果"
          align="left"
          prop="processResult"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.processResult"
              clearable
              size="mini"
              @change="confirmTotalResult"
            >
              <el-option
                v-for="(item,index) in processResultOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              /></el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="整改要求及处罚意见"
          align="left"
          prop="processRemark"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">

            <span v-if="actionType==='view'">
              {{ row.processRemark }}
            </span>
            <span v-else>
              <el-input v-model="row.processRemark" size="mini" />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </pure-card>
</template>

<script>
import InspectionTaskApi from '@/apis/inspection/task';
import {
  omitBy,
  isNil,
  cloneDeep,
  isString,
  eq,
  gt,
  gte,
  lte,
  lt,

} from 'lodash';
import {
  mapGetters,
} from 'vuex';
import * as Regex from '@/utils/regex';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
const operator = {
  eq,
  gt,
  gte,
  lte,
  lt,
};
export default {
  components: {
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    DicRadio: () => import('@/views/components/dictionary/dicRadio.vue'),
    Upload: () => import('@/components/upload/index.vue'),
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    EmptyRow: () => import('@/components/emptyRow.vue'),
  },
  props: {
    taskId: {
      type: Number,
      default: null,
    },
    propertyName: {
      type: String,
      default: null,
    },
    actionType: {
      type: String,
      default: 'create',
    },
  },
  data() {
    return {
      formData: {
        id: null,
        result: 1,
        remark: '',
        processPhoto: null,
        errorMake: 1,
        rectificationTime: null,
        reqTime: 1,
        degree: 1,
        faultType: null,
        rangeType: 1,
        // 指派人员，临时数据
        inspDutyOfficer: null,
      },
      // 指派人信息
      selectedInspDutyOfficer: {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      rules: {
        rectificationTime: [{
          required: true, message: '请选择整改时间', trigger: 'change',
        }],
        faultType: [{
          required: true, message: '请选择故障分类', trigger: 'change',
        }],
        faultRemark: [{
          required: true, message: '请输入故障描述', trigger: 'blur',
        }],
        repairPhone: [{
          required: true, message: '请输入报修电话', trigger: 'blur',
        }, {
          pattern: Regex.phone, message: '请输入有效手机号码', trigger: 'blur',
        }],
        inspDutyOfficer: [{
          required: true, message: '请指派人员', trigger: 'change',
        }],
        reqTime: [{
          required: true, message: '请输入预计工时', trigger: 'blur',
        }],
      },
      valueUnitMap: {},
      processResultOptions: [{
        label: '正常',
        value: 1,
      }, {
        label: '异常',
        value: 0,
      }],
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  async created() {
    const valueUnitData = this.$store.state['dictionary']['dicList']['valueUnit'];
    valueUnitData.map(item => {
      this.valueUnitMap[item.value] = {
        name: item.name,
        label: item.parm,
      };
    });
    if (this.actionType === 'view') {
      await this.fetchDataWhenViewInit(this.taskId);
    } else {
      await this.fetchDataWhenCreateOrUpdate(this.taskId);
    }
  },
  methods: {
    async fetchDataWhenView(taskId) {
      await this.fetchData(taskId);
    },
    async fetchDataWhenViewInit(taskId) {
      await this.fetchData(taskId, 1);
    },
    async fetchDataWhenCreateOrUpdate(taskId) {
      await this.fetchData(taskId, 0);
    },
    handleReqTimeInput(value) {
      this.formData.reqTime = value.replace(/[^0-9.]/g, '');
    },
    // 获取详情
    async fetchData(taskId, state) {
      if (!taskId) {
        return;
      }
      try {
        const data = await InspectionTaskApi.detail({ id: taskId, state, });
        const dataExcludeNull = omitBy(data, isNil);
        this.formData = Object.assign({ repairUser: this.userInfo.id, repairPhone: this.userInfo.phone, }, this.formData, dataExcludeNull);
        if (isString(this.formData.faultType)) {
          this.formData.faultType = this.formData.faultType.split(',');
        }
        this.selectedInspDutyOfficer.engineerId = this.formData.dispatchUser;
        this.selectedInspDutyOfficer.teamId = this.formData.dispatchTeam;
        this.selectedInspDutyOfficer.isTeam = !this.selectedInspDutyOfficer.engineerId;
        this.formData.inspDutyOfficer = this.formData.dispatchUserToName || this.formData.dispatchTeamToName;
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async check(needValidate = true) {
      if (needValidate) {
        await this.$refs['form'].validate();
      }
      let sendUser = null;
      let sendTeam = null;
      if (this.selectedInspDutyOfficer.isTeam) {
        sendTeam = this.selectedInspDutyOfficer.teamId;
      } else {
        sendUser = this.selectedInspDutyOfficer.engineerId;
        sendTeam = this.selectedInspDutyOfficer.teamId;
      }
      this.formData.dispatchTeam = sendTeam;
      this.formData.dispatchUser = sendUser;
      return cloneDeep(this.formData);
    },
    // 实测值变化-选项 触发
    async handleOptionWriteValueChange(row) {
      const exceptionValue = row.chooseException.split(',');
      if (exceptionValue.includes(row.writeValue)) {
        row.processResult = 0;
      } else {
        row.processResult = 1;
      }
      this.confirmTotalResult();
    },
    // 实测值变化-数值 触发
    async handleValueWriteValueChange(row) {
      const writeValue = row.writeValue;
      const exceptionValue = JSON.parse(row.exceptionValue);

      const result = exceptionValue.reduce((result, item) => {
        if (item.logicOperator === 'and') {
          operator[item.operator](writeValue, item.value) && result;
        } else if (item.logicOperator === 'or') {
          return operator[item.operator](writeValue, item.value) || result;
        } else {
          return operator[item.operator](writeValue, item.value);
        }
      }, true);
      row.processResult = result ? 0 : 1;
      this.confirmTotalResult();
    },

    // 确认整体结果
    async confirmTotalResult() {
      const details = this.formData.details;
      let totalResult = 1; // 1正常 2异常
      details.map(item => {
        // 0异常 1 正常
        if (item.processResult === 0) {
          totalResult = 2;
        }
      });
      this.formData.result = totalResult;
    },
    // 转换值域
    convertVauleScope(row) {
      let data = '';
      let unit = '';
      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseValue.split(',').join('/');
          break;
        // 数值
        case 2:
          unit = this.valueUnitMap[row.valueUnit]?.label || '';

          data = `${row.minValue}${unit}-${row.maxValue}${unit}`;
          break;

        default:
          break;
      }
      return data;
    },
    // 获取巡检值域选项
    getInspectionValueOption(row) {
      return row.chooseValue.split(',').map(item => {
        return {
          value: item,
          label: item,
        };
      });
    },
    handleFaultTypeChange(newVal) {
      this.formData.reqTime = '1';
    },
    handleSelectedEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedInspDutyOfficer = Object.assign({}, data);
      this.formData.inspDutyOfficer = this.selectedInspDutyOfficer.name;
      this.$refs.sendUserInput.blur();
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} showOrder={false} defaultSelectedData={this.selectedInspDutyOfficer}/>,
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
::v-deep .el-col-30 {
  width: 30%;
}
.inpection-content-title {
  font-size: 14px;
  font-weight: 600;
  color: #2D405E;
  span {
    margin-left: 28px;
    color:#879BBA;
 }
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
</style>
