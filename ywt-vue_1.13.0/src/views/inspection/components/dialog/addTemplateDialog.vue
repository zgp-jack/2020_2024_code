<!-- 新增模板 -->
<template>
  <div style="height:100%;display:flex; flex-direction: column;">
    <div style="margin-bottom:20px;">
      {{ title }}
    </div>
    <div style="flex:1;">
      <el-card
        style="height:100%;"
        :body-style="{overflow:'unset'}"
        shadow="never"
        :class="{'disabled':isdisabled, }"
      >
        <div slot="header" class="addTemplate-header">
          <span>模板信息</span>
        </div>
        <div>
          <el-form ref="datafrom" label-width="98px" size="mini" :rules="rules" :model="datafrom">
            <el-row>
              <el-col :span="7">
                <el-form-item label="模板名称" prop="templateName">
                  <el-input v-model="datafrom.templateName" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="科室" prop="department">
                  <el-cascader
                    v-model="datafrom.department"
                    :options="departmentlist"
                    :disabled="isdisabled"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="频次">
                  <el-input-number v-model="frequency" style="width:80px;" controls-position="right" :min="1" :max="9999" />
                  <span style="margin:0 5px;">次/</span>
                  <el-input-number v-model="timeNum" style="width:80px;" controls-position="right" :min="1" :max="9999" />
                  <el-select
                    v-model="selectTimeNum"
                    clearable
                    :disabled="isdisabled"
                    style="width:85px;"
                  >
                    <el-option
                      v-for="item in selectTime"
                      :key="'aa'+item.value"
                      :label="item.label"
                      :value="item.value"
                      :filterable="true"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="必须上传照片">
                  <el-radio v-model="isUploadPhotos" :label="0">是</el-radio>
                  <el-radio v-model="isUploadPhotos" :label="1">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="巡检异常办法">
                  <el-radio v-model="inspectionMethod" :label="0">限期整改</el-radio>
                  <el-radio v-model="inspectionMethod" :label="1">转工单</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="addTemplate-table">
          <el-row type="flex" align="middle" style="margin-bottom:10px;">
            <el-col :span="3">巡检内容</el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" :disabled="isdisabled" @click="addziduan">添加巡检内容</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="addData"
            border
          >
            <el-table-column
              label="序号"
              align="left"
              type="index"
              width="80"
            />
            <el-table-column
              v-for="(item, index) in tablecolumn"
              :key="'bb'+index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width-7"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-input v-if="item.prop ==='templateDetailsName'" v-model="scope.row.templateDetailsName" size="mini" />
                <el-input v-else-if="item.prop ==='templateDetailsType'" v-model="scope.row.templateDetailsType" size="mini" />
                <el-switch
                  v-else-if="item.prop ==='valueType'"
                  v-model="scope.row.valueType"
                  size="mini"
                  active-color="#409EFF"
                  inactive-color="#13ce66"
                  active-text="数值"
                  inactive-text="选项"
                  :disabled="isdisabled"
                  @change="changeValueType(addData[scope.$index])"
                />
                <div v-else-if="item.prop ==='value'">
                  <el-popover v-if="scope.row.valueType === true" trigger="click" placement="top" @after-leave="rangeOptionsVerification(scope.row)">
                    <div>
                      <el-select
                        v-model="scope.row.value[0].valueType"
                        :filterable="true"
                        :disabled="isdisabled"
                        clearable
                        size="mini"
                        style="width:100px;margin-right:20px;"
                      >
                        <el-option
                          v-for="i in companyValue"
                          :key="'cc'+i.value"
                          :label="i.label"
                          :value="i.value"
                        />
                      </el-select>
                      <el-input-number v-model="scope.row.value[0].valueOne" style="width:120px;" size="mini" controls-position="right" :min="0" :max="scope.row.valueType===3?null: 99" />
                      <span style="margin:0 10px;">至</span>
                      <el-input-number v-model="scope.row.value[0].valueTwo" style="width:120px;" size="mini" controls-position="right" :min="0" :max="scope.row.valueType===3?null: 100" />
                    </div>
                    <div
                      slot="reference"
                      style="
                          width:100%;
                          min-height:28px;
                          border:1px solid #ccc;
                          border-radius: 5px;
                          padding-left:10px;
                          line-height:28px;
                          text-align:left;
                          background-color:#fff;
                    "
                    >{{
                      scope.row.value[0].valueType == 1 ? scope.row.value[0].valueOne + '%' + '~' + scope.row.value[0].valueTwo + '%' : scope.row.value[0].valueType == 2 ?scope.row.value[0].valueOne + '℃' + '~' + scope.row.value[0].valueTwo + '℃' : scope.row.value[0].valueOne + '~' + scope.row.value[0].valueTwo
                    }}
                    </div>
                  </el-popover>
                  <el-popover v-if="scope.row.valueType === false" trigger="click" placement="top" @after-leave="rangeOptionsVerification(scope.row)">
                    <div>
                      <el-row
                        v-for="(i, indexo) in scope.row.value"
                        :key="'dd'+indexo"
                        type="flex"
                        align="middle"
                        style="margin-bottom: 20px;"
                      >
                        <el-col :span="5">
                          选项{{ indexo + 1 }}
                        </el-col>
                        <el-col :span="15">
                          <el-input v-model="i.optionValue" size="mini" />
                        </el-col>
                        <el-col :span="4" style="text-align:center;">
                          <el-popconfirm
                            title="确定删除吗？"
                            @confirm="delRangeOptions(scope.$index,indexo)"
                          >
                            <el-button
                              slot="reference"
                              size="mini"
                              type="text"
                            >删除</el-button>
                          </el-popconfirm></el-col>
                      </el-row>
                      <el-button size="mini" type="primary" plain @click="addoption(scope.$index)">添加选项</el-button>
                    </div>
                    <div
                      slot="reference"
                      style="
                          width:100%;
                          min-height:28px;
                          border:1px solid #ccc;
                          border-radius: 5px;
                          white-space:normal;
                          word-break:break-all;
                          word-wrap:break-word;
                          text-align:left;
                          line-height:28px;
                          padding:0 10px;
                          background-color:#fff;
                    "
                    >
                      <span v-for="(v, h) in scope.row.value" :key="'a'+h">{{ v.optionValue ? v.optionValue + '/' : '' }}</span>
                    </div>
                  </el-popover>
                </div>
                <div v-else-if="item.prop ==='defaultValue'">
                  <div v-if="scope.row.valueType === true">
                    <div style="width:100%;overflow:hidden;">
                      <el-input v-model="scope.row.defaultValue" size="mini" />
                      <span
                        style="
                          position: relative;
                          top: 0;
                          right: 20px;
                          "
                      >{{ scope.row.value[0].valueType == 1 ? '%' : scope.row.value[0].valueType == 2 ? '℃' : '' }}</span>
                    </div>
                  </div>
                  <el-select
                    v-if="scope.row.valueType === false"
                    v-model="scope.row.defaultValue"
                    :filterable="true"
                    :disabled="isdisabled"
                    clearable
                    size="mini"
                  >
                    <el-option
                      v-for="i in scope.row.value"
                      :key="'b'+i.valueType"
                      :value="i.valueType"
                      :label="i.optionValue"
                    />
                  </el-select>
                </div>
                <div v-else-if="item.prop ==='errValue'">
                  <el-popover v-if="scope.row.valueType === true" trigger="click" placement="top">
                    <div>
                      <el-row
                        v-for="(e, z) in scope.row.errValue"
                        :key="'ee'+z"
                        type="flex"
                        align="middle"
                        justify="center"
                        style="margin:10px 0;"
                      >
                        <el-col>
                          <el-select
                            v-model="e.signThree"
                            :filterable="true"
                            clearable
                            size="mini"
                            style="width:100px;margin-right:10px;"
                          >
                            <el-option
                              v-for="i in sizeValue"
                              :key="'ff'+i.value"
                              :label="i.label"
                              :value="i.value"
                            />
                          </el-select>
                        </el-col>
                        <el-col>
                          <el-input-number v-model="e.valueOne" size="mini" controls-position="right" :min="-1" :max="100" style="width:100px;margin-right:10px;" />
                        </el-col>
                        <el-col>
                          <el-select
                            v-model="e.signOne"
                            :filterable="true"
                            clearable
                            size="mini"
                            style="width:100px;margin-right:10px;"
                          >
                            <el-option
                              v-for="x in selectModeValue"
                              :key="x.value"
                              :label="x.label"
                              :value="x.value"
                            />
                          </el-select>
                        </el-col>
                        <el-col>
                          <el-select
                            v-model="e.signTwo"
                            :filterable="true"
                            clearable
                            size="mini"
                            style="width:100px;margin-right:10px;"
                          >
                            <el-option
                              v-for="p in sizeValue"
                              :key="'a'+p.value"
                              :label="p.label"
                              :value="p.value"
                            />
                          </el-select>
                        </el-col>
                        <el-col>
                          <el-input-number v-model="e.valueTwo" size="mini" controls-position="right" :min="-1" :max="100" style="width:100px;margin-right:10px;" />
                        </el-col>
                        <el-col>
                          <el-popconfirm
                            title="确定删除吗？"
                            @confirm="delOutlierRangeValue(scope.$index, z)"
                          >
                            <el-button
                              slot="reference"
                              size="mini"
                              type="text"
                            >删除</el-button>
                          </el-popconfirm></el-col>
                      </el-row>
                      <el-button type="primary" size="mini" plain @click="addRange(scope.$index)">添加值域</el-button>
                    </div>
                    <div
                      slot="reference"
                      style="
                        width:100%;
                        min-height:28px;
                        border:1px solid #ccc;
                          border-radius: 5px;
                          background-color:#fff;
                        "
                    >
                      <p v-for="(v, x) in scope.row.errValue" :key="'i' + x" style="margin:0;">
                        {{ v.signThree == 1 ? '＜' : v.signThree == 2 ? '≤' : v.signThree == 3 ? '＝' : v.signThree == 4 ? '≥' : v.signThree == 5 ? '＞' : '' }}
                        {{ v.valueOne == '-1' ? '': v.valueOne }}
                        {{ scope.row.value[0].valueType == '1' ? '%' : scope.row.value[0].valueType == '2' ? '℃' : '' }}
                        {{ v.signOne == 1 ? 'or' : v.signOne == 2 ? 'and' : '' }}
                        {{ v.signTwo == 1 ? '＜' : v.signTwo == 2 ? '≤' : v.signTwo == 3 ? '＝' : v.signTwo == 4 ? '≥' : v.signTwo == 5 ? '＞' : '' }}
                        {{ v.valueTwo == '-1' ? '': v.valueTwo }}
                        {{ scope.row.value[0].valueType == '1' ? '%' : scope.row.value[0].valueType == '2' ? '℃' : '' }}
                      </p>
                    </div>
                  </el-popover>
                  <div v-else>
                    <el-select
                      v-model="scope.row.errValue"
                      :filterable="true"
                      :disabled="isdisabled"
                      multiple
                      clearable
                      size="mini"
                    >
                      <el-option
                        v-for="i in scope.row.value"
                        :key="'c'+i.valueType"
                        :value="i.valueType"
                        :label="i.optionValue"
                      />
                    </el-select>
                  </div>
                </div>
                <el-switch
                  v-else-if="item.prop ==='enable'"
                  v-model="scope.row.isOpen"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  :disabled="isdisabled"
                />
                <el-switch
                  v-else-if="item.prop ==='actualValue'"
                  v-model="scope.row.isWriteValue"
                  active-color="#13ce66"
                  inactive-color="#cccccc"
                  :disabled="isdisabled"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="85">
              <template slot-scope="scope">
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="delData(scope.$index)"
                >
                  <el-button
                    slot="reference"
                    size="medium"
                    type="text"
                  >删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <div style="margin:20px 0;">
      <el-button v-if="!isdisabled" style="width:100px;" size="mini" type="primary" plain @click="saveTemplateBtn('datafrom')">保存</el-button>
      <div v-if="isdisabled">
        <el-button style="width:100px;" size="mini" type="primary" plain @click="outTemplateBtn">退出</el-button>
        <el-button style="width:100px;" size="mini" type="primary" plain @click="updateTemplateBtn">编辑</el-button>
        <el-popconfirm
          title="确认删除？"
          @confirm="delTemplateBtn(templateId)"
        >
          <el-button slot="reference" style="margin-left:10px;" size="mini" type="text">删除</el-button>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import { convertToCascader, } from '@/utils/common';
import { saveTemplate, delTemplate, updateTemplate, } from '@/apis/inspection/patrolTemplate/index';
import { mapState, } from 'vuex';
import {
  cloneDeep,
} from 'lodash';
export default {
  props: {

    templateData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      rules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur', }
        ],
        department: [
          { required: true, message: '请选择科室', trigger: 'change', }
        ],
      },
      title: '新增模板',
      templateId: null,
      isdisabled: false,
      updateTemplate: false,
      selectModeValue: [
        { value: '1', label: '或者', },
        { value: '2', label: '并且', }
      ],
      sizeValue: [
        { value: '1', label: '小于', },
        { value: '2', label: '小于等于', },
        { value: '3', label: '等于', },
        { value: '4', label: '大于等于', },
        { value: '5', label: '大于', }
      ],
      outlierRange: null,
      companyValue: [{
        value: 1,
        label: '百分比',
      }, {
        value: 2,
        label: '摄氏度',
      },
      {
        value: 3,
        label: '数字',
      }],
      tablecolumn: null,
      datafrom: {
        templateName: null,
        department: null,
      },
      addData: [],
      templateName: null,
      department: null,
      frequency: null,
      timeNum: null,
      selectTimeNum: '1',
      selectTime: [{
        value: '1',
        label: '天',
      }, {
        value: '2',
        label: '周',
      }, {
        value: '3',
        label: '月',
      }, {
        value: '4',
        label: '年',
      }
      ],
      inspectionMethod: 1,
      isUploadPhotos: 1,
    };
  },
  computed: {
    addTemplateTableColumn() {
      return this.$store.state['inspection/center'].addTemplateTableColumn;
    },
    ...mapState({
      departmentlist: (v) => {
        return convertToCascader(
          v.dictionary['departmentList'],
          0,
          'dept_name'
        );
      },
    }),
  },
  created() {
    // const tmp = Object.assign({}, this.templateData);
    const tmp = cloneDeep(this.templateData);
    if (tmp.btnType === 1) {
      this.title = '模板信息';
      this.isdisabled = true;
      this.templateId = tmp.id;
      this.datafrom.templateName = tmp.templateName;
      this.datafrom.department = tmp.deptId;
      this.frequency = tmp.frequencyCount;
      this.timeNum = tmp.frequencyInterval;
      this.selectTimeNum = tmp.frequencyDateType;
      this.inspectionMethod = tmp.errType;
      this.isUploadPhotos = tmp.hasImage;
      this.addData = tmp.busPatrolTemplateDetails;
      const errValueNum = [];
      this.addData.forEach(item => {
        item.defaultValue = Number(item.defaultValue);
        if (item.valueType === 1) {
          item.valueType = true;
        } else {
          item.valueType = false;
          item.errValue.forEach(i => {
            errValueNum.push(i.valueType);
          });
          item.errValue = errValueNum;
        }
        if (item.isOpen === 1) {
          item.isOpen = true;
        } else {
          item.isOpen = false;
        }
        if (item.isWriteValue === 1) {
          item.isWriteValue = true;
        } else {
          item.isWriteValue = false;
        }
      });
    }
    if (tmp.btnType === 2) {
      this.title = '编辑模板';
      this.updateTemplate = true;
      this.templateId = tmp.id;
      this.datafrom.templateName = tmp.templateName;
      this.datafrom.department = tmp.deptId;
      this.frequency = tmp.frequencyCount;
      this.timeNum = tmp.frequencyInterval;
      this.selectTimeNum = tmp.frequencyDateType;
      this.inspectionMethod = tmp.errType;
      this.isUploadPhotos = tmp.hasImage;
      this.addData = tmp.busPatrolTemplateDetails;
      const errValueNum = [];
      this.addData.forEach(item => {
        item.defaultValue = Number(item.defaultValue);
        if (item.valueType === 1) {
          item.valueType = true;
        } else {
          item.valueType = false;
          item.errValue.forEach(i => {
            errValueNum.push(i.valueType);
          });
          item.errValue = errValueNum;
        }
        if (item.isOpen === 1) {
          item.isOpen = true;
        } else {
          item.isOpen = false;
        }
        if (item.isWriteValue === 1) {
          item.isWriteValue = true;
        } else {
          item.isWriteValue = false;
        }
      });
    }

    this.tablecolumn = this.addTemplateTableColumn;
  },
  methods: {
    outTemplateBtn() {
      this.$emit('done');
    },
    async delTemplateBtn(id) {
      await delTemplate({ id: id, });
      this.$emit('done');
    },
    updateTemplateBtn() {
      this.isdisabled = false;
      this.updateTemplate = true;
    },
    changeValueType(i) {
      if (i.valueType) {
        i.value = [{
          valueOne: 0,
          valueTwo: 100,
          valueType: 1,
          type: 0,
        }];
        i.defaultValue = '50';
        i.errValue = [{
          signThree: '1',
          signTwo: '1',
          signOne: '1',
          valueOne: 1,
          valueTwo: 1,
          valueType: 0,
          type: 1,
        }];
      } else {
        i.value = [{
          optionValue: '',
          valueType: 0,
          type: 0,
        }];
        i.defaultValue = 0;
        i.errValue = [];
      }
    },
    async saveTemplateBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const deptId = this.datafrom.department instanceof Array ? this.datafrom.department.pop() : this.datafrom.department;
          this.addData.forEach(item => {
            if (typeof item.isOpen !== 'number') {
              if (item.isOpen) {
                item.isOpen = 1;
              } else {
                item.isOpen = 0;
              }
            }
            if (typeof item.isWriteValue !== 'number') {
              if (item.isWriteValue) {
                item.isWriteValue = 1;
              } else {
                item.isWriteValue = 0;
              }
            }
            if (typeof item.valueType !== 'number') {
              if (item.valueType) {
                item.valueType = 1;
              } else {
                item.valueType = 0;
                const errData = [];
                item.errValue.forEach(i => {
                  item.value.forEach(v => {
                    if (v.valueType === i) {
                      errData.push(v);
                    }
                  });
                });
                item.errValue = cloneDeep(errData);
                item.errValue.forEach(item => {
                  item.type = 1;
                });
              }
            }
          });
          const data = {
            id: this.templateId,
            templateName: this.datafrom.templateName,
            deptId: deptId,
            errType: this.inspectionMethod,
            hasImage: this.isUploadPhotos,
            frequencyCount: this.frequency,
            frequencyInterval: this.timeNum,
            frequencyDateType: this.selectTimeNum,
            isOpen: 1,
            creatUserId: null, // 待取
            busPatrolTemplateDetails: this.addData,
          };
          if (this.updateTemplate) {
            updateTemplate({ json: JSON.stringify(data), });
          } else {
            saveTemplate({ json: JSON.stringify(data), });
          }
          this.$emit('done');
        } else {
          return false;
        }
      });
    },
    delRangeOptions(i, e) {
      this.addData[i].value.splice(e, 1);
    },
    delData(e) {
      this.addData.splice(e.index, 1);
    },
    delOutlierRangeValue(i, e) {
      this.addData[i].errValue.splice(e, 1);
    },
    addRange(e) {
      this.addData[e].errValue.push(
        {
          signThree: '1',
          signTwo: '1',
          signOne: '1',
          valueOne: 1,
          valueTwo: 1,
          valueType: this.addData[e].errValue.length,
          type: 1,

        }
      );
    },
    rangeOptionsVerification(e) {
      if (e.value instanceof Array) {
        const arr = e.value.filter(item => {
          if (item.optionValue !== '') {
            return item;
          }
        });
        e.value = arr;
      }
    },
    addoption(i) {
      this.addData[i].value.push(

        {
          optionValue: '',
          valueType: this.addData[i].value.length,
          type: 0,
        }

      );
    },
    addziduan() {
      this.addData.push({
        index: this.addData.length - 1,
        templateDetailsType: '',
        templateDetailsName: '',
        isOpen: true,
        isWriteValue: true,
        company: 1,
        valueType: true,
        defaultValue: '50',
        value: [{
          valueOne: 0,
          valueTwo: 100,
          valueType: 1,
          type: 0,
        }],
        errValue: [{
          signThree: '1',
          signTwo: '1',
          signOne: '1',
          valueOne: 1,
          valueTwo: 1,
          valueType: 0,
          type: 1,
        }],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card ::v-deep .el-card__header {
  padding: 0;
}
.el-card ::v-deep .el-card__body {
  padding: 20px;
}
.el-card {
  overflow: unset;
  margin-bottom: 16px;
}
.addTemplate-header{
      height: 32px;
  background: #d7e5f9;
  border-radius: 4px 4px 0 0;
  padding: 6px 12px 6px 20px;
    text-align: start;
    line-height: 32px;
}
.addTemplate-table{
  border-top:1px solid #ccc;
  margin-top: 20px;
  padding-top: 20px;
}
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
</style>
