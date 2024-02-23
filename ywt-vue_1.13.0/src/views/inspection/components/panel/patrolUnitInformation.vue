<!-- 巡检单元信息 -->
<template>
  <el-card
    shadow="never"
    :body-style="{overflow:'unset'}"
  >
    <div slot="header">
      <el-row class="title-row" type="flex" align="middle">
        <el-col :span="16">
          检查单元格信息
        </el-col>
        <el-col v-show="isdisabled" :span="8" style="text-align:right;">
          <span style="cursor: pointer;color:#409EFF" @click="expand=!expand">
            {{ expand?'收起':'展开' }}
            <i :class="expand?'el-icon-arrow-up':'el-icon-arrow-down'" style="color:#409EFF" />
          </span>
        </el-col>
      </el-row>
    </div>
    <div v-show="expand">
      <el-form
        ref="fromRules"
        :model="addFrom"
        style="padding:20px;"
        label-position="right"
        label-width="100px"
        size="mini"
        :class="{ 'disabled': isdisabled }"
        :rules="rules"
      >
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="6">
            <el-form-item
              label="编号"
              prop="number"
            >
              <el-input v-model="addFrom.number" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="名称"
              prop="name"
            >
              <el-input v-model="addFrom.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="父节点"
            >
              <el-select
                v-model="addFrom.parentNode"
                clearable
              >
                <el-option
                  v-for="item in parentNodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="是否巡检"
            >
              <el-switch
                v-model="addFrom.isInspection"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :active-value="1"
                :inactive-value="0"
              /></el-form-item>
          </el-col>

        </el-row>
        <el-row
          type="flex"
          align="middle"
        >
          <el-col :span="6">
            <el-form-item
              label="使用科室"
              prop="useDepartment"
            >
              <el-cascader
                v-model="addFrom.useDepartment"
                :options="departmentlist"
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="使用负责人"
            >
              <engineerSelect v-model="addFrom.personResponsible" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="维护科室"
            >
              <el-cascader
                v-model="addFrom.maintenanceDepartment"
                :options="departmentlist"
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="维保责任人"
            >
              <engineerSelect v-model="addFrom.personCharge" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="备注"
        >
          <el-input v-model="addFrom.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <div v-show="addFrom.isInspection === 1" :class="{ 'disabled': isdisabled }" style="padding:0 20px 20px 20px; ">
        <div style="margin-bottom:10px;padding-top:20px;border-top:1px solid #ccc;">巡检模板内容</div>
        <el-form
          ref="fromRules1"
          :model="templateFrom"
          label-width="100px"
          size="mini"
          :class="{ 'disabled': isdisabled }"
          :rules="rules1"
        >
          <el-row type="flex">
            <el-col :span="9">
              <el-form-item
                label="选择模板"
                prop="selectTemplate"
              >
                <el-select
                  v-model="templateFrom.selectTemplate"
                  clearable
                  style="width:100%;"
                  @change="selectTemplateChange"
                >
                  <el-option
                    v-for="item in templatesList"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="频次"
              >
                <span v-if="!isexpand">{{ templateFrom.frequency }}次/{{ templateFrom.timeNum }}{{ templateFrom.tiemCompany }}</span>
                <div v-if="isexpand">
                  <el-input-number v-model="templateFrom.frequency" style="width:80px;" controls-position="right" :min="1" :max="10000" />
                  <span style="margin:0 5px;">次/</span>
                  <el-input-number v-model="templateFrom.timeNum" style="width:80px;" controls-position="right" :min="1" :max="10000" />
                  <el-select
                    v-model="templateFrom.tiemCompany"
                    clearable
                    style="width:85px;"
                  >
                    <el-option
                      v-for="item in selectTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item />
            </el-col>
            <el-col :span="7">
              <el-form-item label="异常处理办法">
                <el-radio-group v-model="templateFrom.handle" text-color="#000" fill="#000">
                  <el-radio :label="1">限期改整</el-radio>
                  <el-radio :label="2">转工单</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="templatesListTable"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="59px"
            align="left"
          />
          <el-table-column
            v-for="(item, index) in tablecolumn"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width-widthNum"
            align="left"
          >
            <template slot-scope="scope">
              <span v-if="item.prop === 'enable'">
                <el-switch
                  v-model="scope.row.isOpen"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                />
              </span>
              <span v-else-if="item.prop === 'actualValue'">
                <el-switch
                  v-model="scope.row.isWriteValue"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                />
              </span>
              <div v-else-if="item.prop === 'errValue'">
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
</template>

<script>
import { mapState, } from 'vuex';
import { convertToCascader, } from '@/utils/common';
import engineerSelect from '@/views/reportFault/sharedComponents/select/engineerSelect.vue';
import { getTemplates, getTemplate, } from '@/apis/inspection/patrolTemplate/index';
import {
  cloneDeep,
} from 'lodash';
export default {
  components: {
    engineerSelect,
  },
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'isdisabled',
    // eslint-disable-next-line vue/require-prop-types
    'isexpand',
    // eslint-disable-next-line vue/require-prop-types
    'widthNum'
  ],
  data() {
    return {
      expand: false,

      parentNodeList: [],

      addFrom: {
        number: null,
        name: null,
        parentNode: null,
        isInspection: 1,
        useDepartment: null,
        personResponsible: null,
        maintenanceDepartment: null,
        personCharge: null,
        remarks: null,
      },

      rules: {
        name: [
          { required: true, message: '请输入编号', trigger: 'blur', }
        ],
        number: [
          { required: true, message: '请输入名称', trigger: 'blur', }
        ],
        useDepartment: [
          { required: true, message: '请选择科室', trigger: 'change', }
        ],
      },

      templateFrom: {
        selectTemplate: null,
        frequency: null,
        timeNum: null,
        tiemCompany: 1,
        handle: 1,
      },

      rules1: {
        selectTemplate: [
          { required: true, message: '请选择模板', trigger: 'change', }
        ],
      },

      templateList: [],

      isenable: true,
      isactualValue: true,

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

      templatesList: null,
      templatesListTable: [],
      templatesListTable2: [],

      allData: null,
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
    this.tablecolumn = this.addTemplateTableColumn;
    this.expand = this.isexpand;
    this.getTemplatesList();
  },
  methods: {
    async getTemplatesList() {
      const rs = await getTemplates({ pageNum: 1, pageSize: 9999999, deptId: '', });
      this.templatesList = rs.list;
    },
    handleChange() {},
    transferData(formName, formName2) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addFrom.isInspection === 1) {
            this.$refs[formName2].validate((v) => {
              this.allData = {
                id: '',
                number: this.addFrom.number,
                name: this.addFrom.name,
                parentId: this.addFrom.parentNode instanceof Array ? this.addFrom.parentNode.pop() : this.addFrom.parentNode, // 父节点 ?
                isPatrol: this.addFrom.isInspection,	// 是否巡检
                useUserId: this.addFrom.personResponsible, 	// 使用人id
                useDeptId: this.addFrom.useDepartment instanceof Array ? this.addFrom.useDepartment.pop() : this.addFrom.useDepartment, // 使用科室id
                protectUserId: this.addFrom.personCharge, // 维护人id
                protectDeptId: this.addFrom.maintenanceDepartment instanceof Array ? this.addFrom.maintenanceDepartment.pop() : this.addFrom.maintenanceDepartment, //	维护科室id
                mark: this.addFrom.remarks, //	备注
                creatUserId: '', //	创建人id
              };
            });
          }
          this.allData = {
            id: '',
            number: this.addFrom.number,
            name: this.addFrom.name,
            parentId: this.addFrom.parentNode instanceof Array ? this.addFrom.parentNode.pop() : this.addFrom.parentNode, // 父节点 ?
            isPatrol: this.addFrom.isInspection,	// 是否巡检
            useUserId: this.addFrom.personResponsible, 	// 使用人id
            useDeptId: this.addFrom.useDepartment instanceof Array ? this.addFrom.useDepartment.pop() : this.addFrom.useDepartment, // 使用科室id
            protectUserId: this.addFrom.personCharge, // 维护人id
            protectDeptId: this.addFrom.maintenanceDepartment instanceof Array ? this.addFrom.maintenanceDepartment.pop() : this.addFrom.maintenanceDepartment, //	维护科室id
            mark: this.addFrom.remarks, //	备注
            creatUserId: '', //	创建人id
          };
        } else {
          return;
        }
      });
      return this.allData;
    },
    async selectTemplateChange(v) {
      this.templatesListTable = [];
      const res = await getTemplate({ id: v, });
      this.templatesListTable = cloneDeep(res.busPatrolTemplateDetails);
      this.templatesListTable2 = cloneDeep(res.busPatrolTemplateDetails);
      let errValue1 = [];
      let value1 = '';
      this.templatesListTable.forEach(item => {
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
      // console.log(this.templatesListTable);
      // console.log(this.templatesListTable2);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card ::v-deep .el-card__header {
  padding: 0;
}
.el-card ::v-deep .el-card__body {
  padding: 0;
}
.title-row {
  width: 100%;
  height: 32px;
  background: #d7e5f9;
  border-radius: 4px 4px 0 0;
  padding: 6px 12px;
  :nth-child(1) {
    font-size: 14px;
    font-weight: 500;
    color: #2d405e;
  }
  :nth-child(2) {
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
.disabled {
     background: #f7f7f7;
  pointer-events: none;
  ::v-deep .el-radio {
    color: #ccc;
  }
  ::v-deep .el-form-item__label{
    color: #ccc;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #000 !important;
}
::v-deep .el-switch__label--right {
   color: #ccc;
 }

 ::v-deep .el-switch__label--left {
     color: #ccc;
   }
/* 选中后小圆点的颜色 */
.is-checked  ::v-deep .el-radio__inner {
  background: #000 !important;
  border-color: #000 !important;
}
}
</style>
