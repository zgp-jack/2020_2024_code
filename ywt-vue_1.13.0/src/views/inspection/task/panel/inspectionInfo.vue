<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-18 15:52:16
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-27 10:05:47
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
            <el-form-item v-if="requiredCreateTime" label="创建时间" required>
              <el-date-picker
                v-model="formData.createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                align="right"
                :prefix-icon="'null'"
                :clear-icon="'null'"
                class="date-picker"
              />
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
            <el-form-item label="报修人" prop="repairUser" :rules="[{required: repair_user,message: '请输入报修人', trigger: 'blur', }]">
              <engineer-select v-model="formData.repairUser" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报修电话" prop="repairPhone" :rules="[{required: repair_phone,message: '请输入报修电话', trigger: 'blur', }]">
              <el-input v-model="formData.repairPhone" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="报修科室" prop="deptId" :rules="[{ required: repair_dept, message: '请选择报修科室', trigger: 'change', }]">

              <department-cascader
                v-model="formData.deptId"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障分类" prop="faultType">

              <fault-type-select
                v-model="formData.faultType"
                style="width:100%"
                @change="handleFaultTypeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="故障描述" prop="faultRemark">
          <Q-paste-up
            ref="Q"
            :data-dom="formData.faultRemark"
            :disabled-fun="setDisabledFun"
            :html-hash-val="htmlHashVal"
            placeholder="1.请先选择故障分类<br/>2.引用知识库请先输入#号，再选择所需知识库"
            @isInputHashTrue="isInputHashTrue"
          >
            <el-card shadow="always" class="card-box">
              <div
                v-for="list in optionList"
                :key="list.id"
                :style="{ background: list.isActive ? '#f5f7fa' : '#fff' }"
                class="card-item"
                :disabled="list.title === '暂无数据...'"
                @click="changeItem(list)"
                @mouseenter="onMouseenter(list)"
                @mouseleave="omMouseleave(list)"
              >
                {{ list.title }}
              </div>
            </el-card>
          </Q-paste-up>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计工时" prop="reqTime">
              <el-input
                v-model="formData.reqTime"
                style="width: 80%"
                placeholder=""
                @input="onInputReqTime"
              />
              <span class="unit">小时</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度">
              <dic-radio v-model="formData.degree" dic-key="gradeUrgency" type="string" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="影响范围">
              <dic-radio v-model="formData.rangeType" dic-key="faultScope" type="string" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="响应类型">
              <dic-radio
                v-model="formData.responseType"
                dic-key="responseType"
                type="string"
              />
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
import EngineerApi from '@/feat/system/user/api';
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
import moment from 'moment';
import OtherSettingApi from '@/feat/system/otherSetting/api';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import KnowledgeBaseRetrievalApi from '@/apis/knowledgeBase/retrieval/index';
const operator = {
  eq,
  gt,
  gte,
  lte,
  lt,
};
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import InspectionTemplateApi from '@/apis/inspection/template/index.js';
export default {
  components: {
    DicSelect,
    DicRadio,
    Upload: () => import('@/components/upload/index.vue'),
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    EmptyRow: () => import('@/components/emptyRow.vue'),
    DepartmentCascader: () =>
      import('@/feat/system/department/component/departmentCascader.vue'),
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
      optionList: [],
      htmlHashVal: {}, // 通过 # 选择的引用数据
      formData: {
        id: null,
        result: 1,
        remark: '',
        processPhoto: null,
        errorMake: 1,
        rectificationTime: null,
        reqTime: 1,
        degree: '3',
        faultType: null,
        rangeType: '1',
        // 指派人员，临时数据
        inspDutyOfficer: null,
        // 响应类型
        responseType: '1',
        // 知识库id
        learningId: null,
        createTime: null,
        deptId: null,
        faultRemark: null,

      },
      // 指派人信息
      selectedInspDutyOfficer: {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      // 报修信息必填字段状态
      repair_phone: false,
      repair_user: false,
      repair_dept: false,
      repair_place: false,
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
        inspDutyOfficer: [{
          required: false, message: '请指派人员', trigger: 'change',
        }],
        reqTime: [{
          required: false, message: '请输入预计工时', trigger: 'blur',
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
      requiredCreateTime: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    setDisabledFun() {
      if (this.actionType === 'view') {
        return 'disable';
      } else {
        return 'enable';
      }
    },
  },
  async created() {
    console.log(this.actionType, 'actionType');
    this.getRepairConfigData();
    const { value: configValue, } = await OtherSettingApi.getTicketTimeConfig();
    try {
      const configValueObj = JSON.parse(configValue);
      if (configValueObj.createTime === 1) {
        this.requiredCreateTime = true;
      }

      if (!this.formData.deptId) {
        this.formData.deptId = this.userInfo.deptId;
      }
    } catch (error) {
      this.$message.error('获取工单时间配置出错');
    }
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
    this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
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

        // 获取 资产|单元 模版配置信息
        if (data.inspectionAsset) {
          const res = await InspectionTemplateApi.relatedPropertyDetail(data.mainId);
          this.formData.errorMake = res.errorMake;
        } else {
          const res = await InspectionTemplateApi.relatedUnitDetail(data.inspectionUnit);
          this.formData.errorMake = res.errorMake;
        }

        const dataExcludeNull = omitBy(data, isNil);
        this.formData = Object.assign({ repairUser: this.userInfo.id, repairPhone: this.userInfo.phone, }, this.formData, dataExcludeNull);
        if (isString(this.formData.faultType)) {
          this.formData.faultType = this.formData.faultType.split(',');
        }
        // 处理默认值的回显

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
      this.formData.faultRemark = this.$refs['Q']?.convertBase64();
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
      this.formData.orderCreateTime = this.formData.createTime;
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
      console.log(row, 'row');

      const writeValue = row.writeValue;
      const exceptionValue = JSON.parse(row.exceptionValue);

      const _result = exceptionValue.reduce((result, item) => {
        if (item.logicOperator === 'and') {
          return operator[item.operator](writeValue, item.value) && result;
        } else if (item.logicOperator === 'or') {
          return operator[item.operator](writeValue, item.value) || result;
        } else {
          return operator[item.operator](writeValue, item.value);
        }
      }, true);
      row.processResult = _result ? 0 : 1;
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
    isInputHashTrue(v, val) {
      v ? this.querySearch(val) : (this.optionList = []);
    },
    async querySearch(val) {
      const { list, } = await KnowledgeBaseRetrievalApi.list({
        pageSize: 9999,
        type: this.formData.faultType,
        query: val,
      });
      list.length === 0 ? this.optionList = [{ title: '暂无数据...', id: new Date().getTime(), }] : this.optionList = list.slice(0, 6).map((item) => {
        item.isActive = false;
        return item;
      });
    },
    changeItem(list) {
      this.formData.learningId = list.id;
      JSON.stringify(this.htmlHashVal) === '{}'
        ? (this.htmlHashVal = list)
        : this.$confirm('将使用选择内容替换故障描述', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.htmlHashVal = list;
          })
          .catch(() => {
            this.formData.learningId = null;
          });
      this.$refs['Q'].isSlotShow = false; // 隐藏引用选择框
    },
    onMouseenter(list) {
      list.isActive = true;
    },
    omMouseleave(list) {
      list.isActive = false;
    },
    onInputReqTime(value) {
      this.formData.reqTime = value.replace(/[^0-9.]/g, '');
    },
    async getRepairConfigData() {
      let configData = [];
      configData = await EngineerApi.getRepairConfig({});
      console.log('woc');
      const needFindKey = ['repair_phone', 'repair_user', 'repair_dept', 'repair_place'];
      configData.forEach(item => {
        needFindKey.forEach(el => {
          if (item.type === el) {
            this[el] = item.enable;
          }
        });
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
