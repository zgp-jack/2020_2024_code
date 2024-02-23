<!-- 关联设置弹窗 -->
<template>
  <div
    style="
    height:100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
  "
  >
    <div style="margin-bottom: 20px;">
      {{ title }}
    </div>
    <el-card
      shadow="never"
      :body-style="{overflow:'unset'}"
      style="height:100%;"
      :class="{'disabled':disabled}"
    >
      <div slot="header">
        <el-row class="title-row" type="flex" align="middle">
          <el-col :span="3">巡检信息</el-col>
          <el-col :span="4">
            科室:
            <span>{{ department }}</span>
          </el-col>
          <el-col :span="17">
            模板数量:
            <span>{{ templateNum }}</span>
          </el-col>
        </el-row>
      </div>
      <el-form label-width="98px" size="mini" :model="fromData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择模板">
              <!-- <el-input v-model="template" /> -->
              <el-select
                v-model="fromData.template"
                :filterable="true"
                :disabled="disabled"
                clearable
                @change="templateChange"
              >
                <el-option
                  v-for="i in templatesList"
                  :key="i.id"
                  :label="i.templateName"
                  :value="i.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="频次">
              <el-input-number v-model="fromData.frequency" style="width:80px;" controls-position="right" :min="1" :max="10000" />
              <span style="margin:0 5px;">次/</span>
              <el-input-number v-model="fromData.timeNum" style="width:80px;" controls-position="right" :min="1" :max="10000" />
              <el-select
                v-model="fromData.selectTimeNum"
                :filterable="true"
                :disabled="disabled"
                clearable
                style="width:85px; margin-left:10px;"
              >
                <el-option
                  v-for="item in selectTime"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巡检异常办法">
              <el-radio v-model="fromData.inspectionMethod" :label="0">限期整改</el-radio>
              <el-radio v-model="fromData.inspectionMethod" :label="1">转工单</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="associationSettingDialog-main">
        <div>
          <span>巡检内容</span>
          <span style="color:#ccc;">巡检设备：{{ equipment }}</span>
        </div>
        <div>
          <el-table
            :data="templatesListTable"
            border
          >
            <el-table-column
              type="index"
              label="序号"
              width="61px"
              align="left"
            />
            <el-table-column
              v-for="(item, index) in tablecolumn"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width+6"
              align="left"
            >
              <template slot-scope="scope">
                <span v-if="item.prop === 'enable'" style="maring:0;">
                  <el-switch
                    v-model="scope.row.isOpen"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    :disabled="disabled"
                    style="padding:0;"
                  />
                </span>
                <span v-else-if="item.prop === 'actualValue'" style="maring:0;">
                  <el-switch
                    v-model="scope.row.isWriteValue"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    style="padding:0;"
                    :disabled="disabled"
                  />
                </span>
                <div v-else-if="item.prop === 'errValue'" style="padding:0;">
                  <p v-for="(m, i) in scope.row.errValue" :key="i" style="margin:0;">
                    {{ m }}
                  </p>
                </div>
                <span v-else style="margin:0;">
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </el-table-column></el-table>
        </div>
      </div>

    </el-card>
    <div style="margin:20px 0;">
      <el-button v-if="informationData.openMode === 1 || informationData.openMode === 2" style="width:100px;" size="mini" type="primary" plain @click="saveBtn">保存</el-button>
      <el-button v-if="informationData.openMode === 0" style="width:100px;" size="mini" type="primary" plain @click="outBtn">退出</el-button>
    </div>
  </div>
</template>

<script>
import { getTemplates, getTemplate, } from '@/apis/inspection/patrolTemplate/index';
// import { relatedTemplate, updateRelatedTemplate, } from '@/apis/inspection/relatedTemplate/index';
import {
  cloneDeep,
} from 'lodash';
export default {
  props: {
    informationData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      title: '设置巡检模板',
      disabled: false,
      fromData: {
        template: null,
        frequency: 1,
        timeNum: 1,
        selectTimeNum: 1,
        inspectionMethod: 0,
      },
      department: null,
      templateNum: null,
      equipment: null,
      selectTime: [{
        value: 1,
        label: '天',
      }, {
        value: 2,
        label: '周',
      }, {
        value: 3,
        label: '月',
      }, {
        value: 4,
        label: '年',
      }
      ],
      tablecolumn: null,
      isEnable: false,
      isActualValue: false,

      templatesList: null,
      templatesListTable: null,
      templatesListTable2: null,
    };
  },
  computed: {
    addTemplateTableColumn() {
      return this.$store.state['inspection/center'].addTemplateTableColumn;
    },
  },
  created() {
    this.$store.state.dictionary.departmentList.forEach(item => {
      if (item.id === this.informationData.deptId) {
        this.department = item.dept_name;
      }
    });
    this.tablecolumn = this.addTemplateTableColumn;
    if (this.informationData.openMode === 0) {
      this.fromData.template = this.informationData.id;
      this.fromData.frequency = this.informationData.frequencyCount;
      this.fromData.timeNum = this.informationData.frequencyInterval;
      this.fromData.selectTimeNum = this.informationData.frequencyDateType;
      this.fromData.inspectionMethod = this.informationData.errType;
      this.informationData.busPatrolTemplateDetails[0].valueType = 0;
      this.templatesListTable2 = cloneDeep(this.informationData.busPatrolTemplateDetails);
      this.templatesListTable = cloneDeep(this.informationData.busPatrolTemplateDetails);
      console.log(this.informationData.busPatrolTemplateDetails);
      this.templatesListTableData(this.templatesListTable);
      this.disabled = true;
      this.title = '查看巡检模板';
    } else if (this.informationData.openMode === 1) {
      this.fromData.template = this.informationData.id;
      this.fromData.frequency = this.informationData.frequencyCount;
      this.fromData.timeNum = this.informationData.frequencyInterval;
      this.fromData.selectTimeNum = this.informationData.frequencyDateType;
      this.fromData.inspectionMethod = this.informationData.errType;
      this.informationData.busPatrolTemplateDetails[0].valueType = 0;
      this.templatesListTable2 = cloneDeep(this.informationData.busPatrolTemplateDetails);
      this.templatesListTable = cloneDeep(this.informationData.busPatrolTemplateDetails);
      console.log(this.informationData.busPatrolTemplateDetails);
      this.templatesListTableData(this.templatesListTable);
      this.title = '编辑巡检模板';
    } else {
      this.title = '设置巡检模板';
    }
    console.log(this.informationData, '888888888');
    this.getTemplatesList();
  },
  methods: {
    async getTemplatesList() {
      const rs = await getTemplates({ pageNum: 1, pageSize: 9999999, deptId: '', });
      console.log(rs.list);
      this.templatesList = rs.list;
    },
    templatesListTableData(tableData) {
      let errValue1 = [];
      let value1 = '';
      tableData.forEach(item => {
        if (item.valueType === 1) {
          item.valueType = '数值';
          let aa = '';
          item.errValue.forEach(i => {
            i.signThree = i.signThree === '1' ? '＜' : i.signThree === '2' ? '≤' : i.signThree === '3' ? '＝' : i.signThree === '4' ? '≥' : i.signThree === '5' ? '＞' : '';
            i.signTwo = i.signTwo === '1' ? '＜' : i.signTwo === '2' ? '≤' : i.signTwo === '3' ? '＝' : i.signTwo === '4' ? '≥' : i.signTwo === '5' ? '＞' : '';
            i.valueType = i.valueType === 1 ? '%' : i.valueType === 2 ? '℃' : '';
            i.signOne = i.signOne === '1' ? 'or' : i.signOne === '2' ? 'and' : '';
            aa = i.signThree + i.valueOne + i.valueType + i.signOne + i.signTwo + i.valueTwo + i.valueType;
            errValue1.push(aa);
          });
          item.errValue = errValue1;
          errValue1 = [];
          item.value.forEach(i => {
            i.valueType = i.valueType === 1 ? '%' : i.valueType === 2 ? '℃' : '';
            value1 = i.valueOne + i.valueType + '-' + i.valueTwo + i.valueType;
            item.defaultValue += i.valueType;
          });
          item.value = value1;
          value1 = '';
        } else {
          item.valueType = '选项';
          item.errValue.forEach(i => {
            errValue1.push(i.optionValue);
          });
          item.errValue = errValue1;
          errValue1 = [];
          item.value.forEach(i => {
            value1 += i.optionValue + '/';
            if (i.valueType === Number(item.defaultValue)) {
              item.defaultValue = i.optionValue;
            }
          });
          item.value = value1;
          value1 = '';
        }
      });
    },
    async getTemplateData(e) {
      this.fromData.template = e;
      const res = await getTemplate({ id: e, });
      this.templatesListTable2 = cloneDeep(res.busPatrolTemplateDetails);
      this.templatesListTable = cloneDeep(res.busPatrolTemplateDetails);
      this.templatesListTableData(this.templatesListTable);
    },

    templateChange(e) {
      this.getTemplateData(e);
    },
    outBtn() {
      this.$emit('done');
    },
    saveBtn() {
      console.log(this.templatesListTable2, 'templatesListTable2');
      console.log(this.templatesListTable, 'templatesListTable');
      this.templatesListTable2.forEach(item => {
        this.templatesListTable.forEach(v => {
          item.isOpen = v.isOpen;
          item.isWriteValue = v.isWriteValue;
        });
      });
      const data = {
        id: this.this.fromData.template,
        errType: this.fromData.inspectionMethod,
        frequencyCount: this.fromData.frequency,
        frequencyInterval: this.fromData.timeNum,
        frequencyDateType: this.fromData.selectTimeNum,
        creatUserId: 1,
        assets_id: 1,
        assets_type_id: null,
        unit_id: null,
        busPatrolTemplateDetails: this.templatesListTable2,
      };
      console.log(data);
      if (this.informationData.openMode === 1) { // 编辑
        // updateRelatedTemplate({ json: JSON.stringify(data), });
        // console.log(data);
      } else if (this.informationData.openMode === 2) { // 设置
        // relatedTemplate({ json: JSON.stringify(data), });
        // console.log({ json: JSON.stringify(data), });
      }
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
.disabled{
  background-color: #FAFAFA;
   pointer-events: none;
  ::v-deep .el-input__inner{
    background-color: #FAFAFA;
  }
  ::v-deep .el-table{
    background-color: #f7f7f7;
  }
  ::v-deep .el-table__row{
    background-color: #f7f7f7;
  }
  ::v-deep .el-radio{
    color: #ccc;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #000 !important;
}
/* 选中后小圆点的颜色 */
.is-checked  ::v-deep .el-radio__inner {
  background: #000 !important;
  border-color: #000 !important;
}
}
.el-card ::v-deep .el-card__header {
  padding: 0;
}
.el-card ::v-deep .el-card__body {
  padding: 20px;
}
.el-card {
  overflow: unset;
}
.title-row {
  height: 32px;
  background: #d7e5f9;
  border-radius: 4px 4px 0 0;
  padding: 6px 12px 6px 20px;
  :nth-child(1) {
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  :nth-child(2), :nth-child(3){
    font-size: 12px;
    font-weight: 500;
    color: #879bba;
    span {
      opacity: 1;
      font-size: 12px;
      font-weight: 400;
      color: #2d405e;
    }
  }
}
.associationSettingDialog-main{
  border-top: 1px solid #ccc;
  padding-top:20px;
    div{
    padding-bottom: 20px;
      font-size: 16px;
    span{
      margin-right: 30px;
    }
  }
   ::v-deep .el-table{
    padding: 0;
  }
}
</style>
