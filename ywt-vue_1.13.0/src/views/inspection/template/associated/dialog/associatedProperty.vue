<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-16 14:32:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-05 19:33:14
 * @Description: 资产关联模板
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">巡检信息</div>
        <el-form
          ref="form"
          label-position="right"
          label-width="118px"
          size="mini"
          :inline="false"
          :model="formData"
          :rules="rules"
          :disabled="actionType==='view'"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="选择模板" prop="tempId" style="display:block !important;width:100%">
                <inspection-temp-select v-model="formData.tempId" style="width:100%" @change="handleTempChange" />
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item label="频次" prop="frequencyTimer" style="margin-right:0px;">
                <el-input-number v-model="formData.frequencyTimer" style="width:80px;" controls-position="right" :min="1" :max="20" />

              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="20px" style="margin-right:0px;" prop="frequencyInterval">
                <span class="unit">次/</span>
                <el-input-number v-model="formData.frequencyInterval" style="width:80px;" controls-position="right" :min="1" :max="20" />
                <dic-select v-model="formData.frequencyUnit" style="width:85px;margin-left:5px" dic-key="frequencyUnit" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="巡检异常办法" label-width="160px">

                <dic-radio v-model="formData.errorMake" dic-key="errorMake" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
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
            <el-col :span="4">
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
            <el-col :span="4">
              <el-form-item label="巡检责任人" prop="dutyOffice">
                <el-input
                  ref="sendUserInput"
                  v-model="formData.dutyOffice"
                  style="width: auto"
                  @focus="handleOpenEngineerPanel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
            <el-col :span="6">
              <el-form-item label="到期后宽限">
                <el-input v-model.number="formData.allowanceTime" style="width: auto" />
                <span class="unit">天</span>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <empty-row />
        <span class="table-title">巡检模板内容</span>
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
import emptyRow from '@/components/emptyRow.vue';
import InspectionTempApi from '@/apis/inspection/template';
import EngineerPanel from '@/views/components/engineer/engineerPanel.vue';
import { omitBy, isNil, } from 'lodash';
import * as InspectionUtil from '@/views/inspection/utils';
export default {
  components: {
    emptyRow,
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    DicRadio: () => import('@/views/components/dictionary/dicRadio.vue'),
    InspectionTempSelect: () => import('@/views/components/inspection/templateSelect.vue'),
  },
  props: {
    propertyId: {
      type: Number,
      default: null,
    },
    actionType: {
      type: String,
      default: 'create',
    },
    relatedId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        tempId: null,
        frequencyTimer: 1,
        frequencyInterval: 1,
        frequencyUnit: 1,
        errorMake: 1,
        startTime: null,
        endTime: null,
        skipWeek: 0,
        skipHoliday: 0,
        allowanceTime: 0,
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
          required: true, message: '请选择责任人', trigger: 'change',
        },
      },
    };
  },
  computed: {
    title() {
      let title = '';
      switch (this.actionType) {
        case 'update':
          title = '编辑巡检模板';
          break;
        case 'view':
          title = '巡检模板';
          break;
        case 'create':
          title = '设置巡检模板';
          break;
        default:
          title = '巡检模板';
          break;
      }
      return title;
    },
  },
  async created() {
    if (this.actionType !== 'create') {
      const data = await InspectionTempApi.relatedPropertyDetail(this.relatedId);
      this.formData = Object.assign({}, this.formData, omitBy(data, isNil));
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
        console.log(data);
        this.formData = Object.assign({}, this.formData, data);
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
        const { tempId,
          frequencyTimer,
          frequencyInterval,
          frequencyUnit,
          errorMake,
          startTime,
          endTime,
          skipWeek,
          skipHoliday,
          allowanceTime,
          details,
        } = this.formData;
        const detailsData = details.map(item => {
          return {
            detailsId: item.id,
            state: item.state,
            isWrite: item.isWrite,
          };
        });
        if (this.actionType === 'create') {
          await InspectionTempApi.relateProperty({
            tempId,
            inspectionAsset: this.propertyId,
            frequencyTimer,
            frequencyInterval,
            frequencyUnit,
            errorMake,
            startTime,
            endTime,
            skipWeek,
            skipHoliday,
            allowanceTime,
            sendTeam,
            sendUser,
            details: detailsData,
          });
          this.$message({
            type: 'success',
            message: '设置巡检模板成功',
          });
        } else {
          await InspectionTempApi.relatedPropertyUpdate({
            id: this.relatedId,
            tempId,
            inspectionAsset: this.propertyId,
            frequencyTimer,
            frequencyInterval,
            frequencyUnit,
            errorMake,
            startTime,
            endTime,
            skipWeek,
            skipHoliday,
            allowanceTime,
            sendTeam,
            sendUser,
            details: detailsData,
          });
          this.$message({
            type: 'success',
            message: '修改巡检模板成功',
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
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
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
