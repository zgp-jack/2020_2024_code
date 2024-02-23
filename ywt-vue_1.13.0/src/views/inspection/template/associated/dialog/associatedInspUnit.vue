<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 17:48:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:00:34
 * @Description: 巡检单元关联模板
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">巡检单元基本信息</div>
        <el-form
          ref="form"
          label-width="118px"
          label-position="right"
          size="mini"
          :model="formData"
          :rules="rules"
          :disabled="actionType==='view'"
        >

          <el-row>
            <el-col :span="25">
              <el-form-item label="编号" prop="code">
                <el-input v-model="formData.code" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="父节点">
                <inspection-unit-parent-select v-model="formData.parentId" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="是否巡检">
                <el-switch
                  v-model="formData.state"
                  :active-value="1"
                  :inactive-value="0"
                  inactive-text="否"
                  active-text="是"
                  :disabled="actionType==='view'"
                />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="巡检责任人" prop="dutyOffice">
                <el-input
                  ref="sendUserInput"
                  v-model="formData.dutyOffice"
                  style="width: auto"
                  @focus="handleOpenEngineerPanel"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="25">
              <el-form-item label="使用科室" prop="useDept">
                <department-cascader v-model="formData.useDept" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="使用责任人">
                <engineer-select v-model="formData.useUser" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="维护科室">
                <department-cascader v-model="formData.maintainDept" />
              </el-form-item>
            </el-col>
            <el-col :span="25">
              <el-form-item label="维保责任人">
                <engineer-select v-model="formData.maintainUser" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" style="width:100%">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="2"
                  style="width:100%; text-align: left;margin-right:5px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="formData.state">
            <empty-row />
            <span class="table-title"> 巡检模板内容</span>
            <empty-row />
            <el-row>
              <el-col :span="50">
                <el-form-item label="选择模板" prop="tempId">
                  <inspection-temp-select v-model="formData.tempId" style="width:100%" @change="handleTempChange" />
                </el-form-item>
              </el-col>
              <el-col :span="50">
                <el-form-item label="频次" prop="frequencyTimer" style="margin-right:0px;display:inline-block">
                  <el-input-number v-model="formData.frequencyTimer" style="width:80px;" controls-position="right" :min="1" :max="20" />

                </el-form-item>
                <el-form-item label-width="0px" style="margin-right:0px;display:inline-block;margin-left:0px" prop="frequencyInterval">
                  <span class="unit">次/</span>
                  <el-input-number v-model="formData.frequencyInterval" style="width:80px;" controls-position="right" :min="1" :max="20" />
                </el-form-item>
                <el-form-item prop="frequencyUnit" style="display:inline-block" label-width="0px">
                  <dic-select v-model="formData.frequencyUnit" style="width:85px;margin-left:5px" dic-key="frequencyUnit" />
                </el-form-item>
              </el-col>
              <el-col :span="25">
                <el-form-item label="巡检异常办法" label-width="96px">
                  <el-radio-group v-model="formData.errorMake">
                    <el-radio :label="1">限期整改</el-radio>
                    <el-radio :label="2">转工单</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="25">
                <el-form-item label="生效时间">
                  <el-date-picker
                    v-model="formData.startTime"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                    :prefix-icon="'null'"
                    :clear-icon="'null'"
                    class="date-picker"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="25">
                <el-form-item label="失效时间">
                  <el-date-picker
                    v-model="formData.endTime"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                    :prefix-icon="'null'"
                    :clear-icon="'null'"
                    class="date-picker"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="50">
                <el-form-item label-width="55px">
                  <el-checkbox
                    v-model="formData.skipHoliday"
                    :true-label="1"
                    :false-label="0"
                  >跳过节假日</el-checkbox>
                  <el-checkbox
                    v-model="formData.skipWeek"
                    :true-label="1"
                    :false-label="0"
                  >跳过周末</el-checkbox>
                </el-form-item>

              </el-col>
              <el-col :span="25">
                <el-form-item label="到期后宽限">
                  <el-input v-model.number="formData.allowanceTime" style="width: 80%" />
                  <span class="unit">天</span>
                </el-form-item>
              </el-col>
            </el-row>

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
                label="值域类型"
                align="left"
                prop="valueType"
              >
                <template slot-scope="{row}">
                  {{ row.valueType===2?'数值':'选项' }}
                </template>
              </el-table-column>
              <el-table-column
                label="值域"
                align="left"
                prop="valueScope"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  {{ convertVauleScope(row) }}
                </template>
              </el-table-column>
              <el-table-column
                label="默认值"
                align="left"
                prop="defaultValue"
              >
                <template slot-scope="{row}">
                  {{ convertDefaultValue(row) }}
                </template>
              </el-table-column>
              <el-table-column
                label="异常值域"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  {{ convertExceptionScope(row) }}
                </template>
              </el-table-column>
              <el-table-column
                label="启用"
                align="left"
                prop="state"
              >
                <template slot-scope="{row}">
                  <el-switch
                    v-model="row.state"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="否"
                    active-text="是"
                    :disabled="actionType==='view'"
                  />
                </template>

              </el-table-column>
              <el-table-column
                label="填写实测值"
                align="left"
                prop="isWrite"
              >
                <template slot-scope="{row}">
                  <el-switch
                    v-model="row.isWrite"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="否"
                    active-text="是"
                    :disabled="actionType==='view'"
                  />
                </template>

              </el-table-column>

            </el-table>
          </template>

        </el-form>

      </pure-card>
    </div>
    <div v-if="actionType !=='view'" class="footer">
      <el-button

        type="primary"
        size="mini"
        @click="handleSave"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import InspectionTempApi from '@/apis/inspection/template';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import * as InspectionUtil from '@/views/inspection/utils';
export default {
  components: {
    EmptyRow: () => import('@/components/emptyRow.vue'),
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    InspectionTempSelect: () => import('@/views/components/inspection/templateSelect.vue'),
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
    InspectionUnitParentSelect: () => import('@/views/components/inspection/unitParentSelect.vue'),
    EngineerSelect: () => import('@/views/sharedComponents/engineer/allEngineerSingleSelect.vue'),
  },
  props: {
    actionType: {
      type: String,
      default: 'create',
    },
    unitId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        state: 0,
        tempId: null,
        frequencyTimer: 1,
        frequencyInterval: 1,
        frequencyUnit: 1,
        errorMake: 1,
        isAllowance: 1,
        details: [],
        code: null,
        name: null,
        parentId: null,
        useDept: null,
        useUser: null,
        maintainDept: null,
        maintainUser: null,
        remark: null,
        sendDept: null,
        sendTeam: null,
        sendUser: null,
        // 巡检责任人，临时数据
        dutyOffice: null,

      },
      // 指派人员信息
      selectedSendEngineer: {
        name: null,
        engineerId: null,
        isTeam: false,
        teamId: null,
      },
      rules: {
        code: [{
          required: true, message: '请输入编号', trigger: 'blur',
        }],
        name: [{
          required: true, message: '请输入名称', trigger: 'blur',
        }],
        useDept: [{
          required: true, message: '请选择使用科室', trigger: 'change',
        }],
        tempId: [
          {
            required: true, message: '请选择巡检模板', trigger: 'change',
          }
        ],
        frequencyTimer: {
          required: true, message: '请输入频次', trigger: 'blur',
        },
        frequencyInterval: {
          required: true, message: '请输入周期', trigger: 'blur',
        },
        dutyOffice: {
          required: true, message: '请选择责任人', trigger: 'blur',
        },
      },
    };
  },
  computed: {
    title() {
      let title = '';
      switch (this.actionType) {
        case 'update':
          title = '编辑巡检单元';
          break;
        case 'view':
          title = '巡检单元';
          break;
        case 'create':
          title = '新增巡检单元';
          break;
        default:
          title = '巡检单元';
          break;
      }
      return title;
    },
  },
  async created() {
    if (this.actionType !== 'create') {
      const data = await InspectionTempApi.relatedUnitDetail(this.unitId);
      this.formData = Object.assign({}, this.formData, data);
      this.selectedSendEngineer.engineerId = this.formData.sendUser;
      this.selectedSendEngineer.teamId = this.formData.sendTeam;
      this.selectedSendEngineer.isTeam = !this.selectedSendEngineer.engineerId;
      this.formData.dutyOffice = this.formData.sendUserToName || this.formData.sendTeamToName || this.formData.sendDeptToName;
      this.formData.sendUser = null;
      this.formData.sendTeam = null;
      this.formData.sendDept = null;
    }
  },
  methods: {
    async handleTempChange(tempId) {
      try {
        const data = await InspectionTempApi.detail(tempId);
        const { details, frequencyTimer, frequencyInterval, frequencyUnit, errorMake, } = data;
        this.formData = Object.assign({}, this.formData, { details, frequencyTimer, frequencyInterval, frequencyUnit, errorMake, });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    handleSelectedEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedSendEngineer = Object.assign({}, data);
      this.formData.dutyOffice = this.selectedSendEngineer.name;
      this.$refs.sendUserInput.blur();
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
        width: '548px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} showOrder={false} defaultSelectedData={this.selectedSendEngineer}/>,
      });
    },
    // 转换值域
    convertVauleScope(row) {
      let data = '';
      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseValue.split(',').join('/');
          break;
        // 数值
        case 2:
          data = `${InspectionUtil.convertDefaultValue(row.minValue, row.valueUnit)}-${InspectionUtil.convertDefaultValue(row.maxValue, row.valueUnit)}`;
          break;

        default:
          break;
      }
      return data;
    },
    async handleSave() {
      try {
        await this.$refs.form.validate();
        let sendUser = null;
        let sendTeam = null;
        if (this.selectedSendEngineer.isTeam) {
          sendTeam = this.selectedSendEngineer.teamId;
        } else {
          sendUser = this.selectedSendEngineer.engineerId;
          sendTeam = this.selectedSendEngineer.teamId;
        }
        const { state,
          code,
          name,
          parentId,
          useDept,
          useUser,
          maintainDept,
          maintainUser,
          remark,
          tempId,
          frequencyTimer,
          frequencyInterval,
          frequencyUnit,
          errorMake,
          details,
          startTime,
          endTime,
          skipWeek,
          skipHoliday,
          allowanceTime,

        } = this.formData;
        if (!state) {
          await InspectionTempApi.createInspUnit({
            code,
            name,
            parentId,
            useDept,
            useUser,
            maintainDept,
            maintainUser,
            remark,
            sendTeam,
            sendUser,
            startTime,
            endTime,
            skipWeek,
            skipHoliday,
            allowanceTime,
          });
        } else {
          const detailsData = details.map(item => {
            return {
              detailsId: item.id,
              state: item.state,
              isWrite: item.isWrite,
            };
          });
          await InspectionTempApi.createInspUnitWithTemp({
            code,
            name,
            parentId,
            useDept,
            useUser,
            maintainDept,
            maintainUser,
            remark,
            tempId,
            frequencyTimer,
            frequencyInterval,
            frequencyUnit,
            errorMake,
            details: detailsData,
            sendTeam,
            sendUser,
            startTime,
            endTime,
            skipWeek,
            skipHoliday,
            allowanceTime,
          });
          this.$message({
            type: 'success',
            message: '新增巡检单元成功！',
          });
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 转换默认值
    convertDefaultValue(row) {
      let data = '';
      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseDefault;
          break;
        // 数值
        case 2:
          data = InspectionUtil.convertDefaultValue(row.defaultValue, row.valueUnit);
          break;
        default:
          break;
      }
      return data;
    },
    // 转换异常值域
    convertExceptionScope(row) {
      let data = '';

      switch (row.valueType) {
        // 选项
        case 1:
          data = row.chooseException.split(',').join('/');
          break;
        // 数值
        case 2:
          data = InspectionUtil.convertExceptionValue(row.exceptionValue, row.valueUnit);
          break;
        default:
          break;
      }
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
    height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 50px);
    height: calc(100% - 50px);
  }
}
::v-deep .el-col-25 {
  width: 20%;
}
::v-deep .el-col-50 {
  width: 40%;
}
::v-deep .el-col-30 {
  width: 30%;
}
.footer {
  height: 28px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.unit {
  font-size: 14px;
  color: #879BBA;
  padding-left: 5px;
  padding-right: 5px;
}
.table-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d405e;
}
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner{
    padding:0 16px;
  }
}
</style>
