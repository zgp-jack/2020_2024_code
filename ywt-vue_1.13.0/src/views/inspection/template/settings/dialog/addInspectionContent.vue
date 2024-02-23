<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-11 14:18:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-27 15:48:54
 * @Description:添加巡检内容
-->

<template>
  <div>
    <el-form
      ref="form"
      label-position="right"
      label-width="102px"
      size="mini"
      :model="formData"
      :rules="rules"
    >

      <el-form-item
        label-width="0px"
        class="form-item-wrapper"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检分类" prop="inspectionType">
              <el-input v-model="formData.inspectionType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch
                v-model="formData.state"
                :active-value="1"
                :inactive-value="0"
                inactive-text="否"
                active-text="是"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="巡检内容" prop="inspectionRemark">
        <el-input v-model="formData.inspectionRemark" />
      </el-form-item>
      <el-form-item
        label-width="0px"
        class="form-item-wrapper"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="值域类型">
              <el-switch
                v-model="formData.valueType"
                :active-value="2"
                :inactive-value="1"
                inactive-text="选项"
                active-text="数值"
                inactive-color="#67C23A"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写实测值">
              <el-switch
                v-model="formData.isWrite"
                :active-value="1"
                :inactive-value="0"
                inactive-text="否"
                active-text="是"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 数值 -->
      <template v-if="formData.valueType=== 2">
        <el-form-item label="值域" required class="form-item-wrapper">
          <el-col :span="8">
            <el-form-item prop="minValue">
              <el-input v-model.number="formData.minValue" />
            </el-form-item>
          </el-col>
          <el-col :span="2" class="center"><span class="unit">至</span></el-col>
          <el-col :span="8">
            <el-form-item prop="maxValue">
              <el-input v-model.number="formData.maxValue" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="valueUnit">
              <dic-select v-model="formData.valueUnit" dic-key="valueUnit" style="margin-left:6px" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label-width="0px"
          class="form-item-wrapper"
        >
          <el-row>
            <el-col :span="13">
              <el-form-item key="defaultValue" label="默认值" prop="defaultValue">
                <el-input v-model.number="formData.defaultValue" class="w-80" />
                <span class="unit">{{ valueUnitLabel }}</span>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form-item>
        <template v-for="(k,index) in formData.exceptionValue">
          <el-form-item :key="'exceptionValue'+index" :label="index===0?'异常值域':''" required class="form-item-wrapper">
            <el-row :gutter="3">
              <el-col v-if="index!==0" :span="4">
                <el-form-item :key="'exceptionValue.'+index+'.logicOperator'">
                  <dic-select
                    v-model="k.logicOperator"
                    type="string"
                    dic-key="connectorSymbol"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item :key="'exceptionValue.'+index+'.operator'">
                  <dic-select
                    v-model="k.operator"
                    type="string"
                    dic-key="comparatorSymbol"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  :key="'exceptionValue.'+index+'.value'"
                  :prop="'exceptionValue.'+index+'.value'"
                  :rules="[{required: true, message: '请输入值', trigger: 'blur'},{
                    type: 'number', message: '请输入数字',
                  }]"
                >
                  <el-input v-model.number="k.value" />
                </el-form-item>
              </el-col>

              <!-- <el-col :span="4">
                <el-form-item :key="'exceptionValue.'+index+'.secondOperator'">
                  <dic-select
                    v-model="k.secondOperator"
                    type="string"
                    dic-key="comparatorSymbol"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  :key="'exceptionValue.'+index+'.secondValue'"
                  :prop="'exceptionValue.'+index+'.secondValue'"
                  :rules="[{required: true, message: '请输入值', trigger: 'blur'},{
                    type: 'number', message: '请输入数字',
                  }]"
                >
                  <el-input v-model.number="k.secondValue" />
                </el-form-item>
              </el-col> -->
              <el-col v-if="index!==0" :span="2">
                <el-button

                  @click="handleDelExceptionVaule(index)"
                >删除</el-button>
              </el-col>
            </el-row>

          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            @click="handleAddExceptionVal"
          >添加异常值域</el-button>
        </el-form-item>
      </template>
      <!-- 选项 -->
      <template v-else-if="formData.valueType===1">

        <template v-for="(k,index) in formData.chooseValue">
          <el-form-item
            :key="index"
            :label="index===0?'值域':''"
            :prop="'chooseValue.'+index+'.value'"
            :rules="[{ required: true, message: '请输入值域', trigger: 'blur' },{validator: uniq,trigger: 'blur'}]"
          >
            <el-col :span="20">
              <el-input v-model="k.value" placeholder="请填写值域选项" @change="handleValueOptionChange" />
            </el-col>
            <el-col v-if="index!==0" :span="4" class="right">
              <el-button
                @click="handleDelValueOption(index)"
              >删除</el-button>
            </el-col>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            @click="handleAddValueOption"
          >添加值域选项</el-button>
        </el-form-item>
        <el-form-item
          label-width="0px"
          class="form-item-wrapper"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item key="chooseDefault" label="默认值" prop="chooseDefault">
                <el-select
                  v-model="formData.chooseDefault"
                  clearable
                >
                  <el-option
                    v-for="(item,index) in valueOptions"
                    :key="index+item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form-item>
        <el-form-item key="chooseException" label="异常值域" prop="chooseException">
          <el-select
            v-model="formData.chooseException"
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in valueOptions"
              :key="index+item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <el-button size="mini" type="primary" @click="submit"> 保存 </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import InspectionTempApi from '@/apis/inspection/template';
import {
  omitBy,
  isNil,
} from 'lodash';
export default {
  components: {
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
  },
  props: {
    tempId: {
      type: Number,
      default: null,
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
      formData: {
        inspectionType: null,
        state: 1,
        inspectionRemark: null,
        // 值域类型 1选项 2 数值
        valueType: 2,
        isWrite: 1,
        /**
         * 选项
         */

        chooseValue: [{ value: '', }],
        chooseDefault: null,
        chooseException: [],

        /**
         * 数值
         */
        // 值域单位
        valueUnit: null,
        minValue: null,
        maxValue: null,
        defaultValue: null,
        exceptionValue: [{ operator: 'eq', value: '', }],
      },
      valueUnitMap: {},
      rules: {

        inspectionRemark: [{
          required: true, message: '请输入巡检内容', trigger: 'blur',
        }],
        /**
         * 选项
         */

        // 选项类型默认值
        chooseDefault: [{
          required: true, message: '请选择默认值', trigger: 'change',
        }],
        // 选项类型异常值域
        chooseException: [{
          required: true, type: 'array', message: '请选择异常值域', trigger: 'change',
        }],
        /**
         * 数值
         */

        minValue: [{
          required: true, message: '请输入最小值', trigger: 'blur',

        }, {
          type: 'number', message: '请输入数字',
        }],
        maxValue: [{
          required: true, message: '请输入最大值', trigger: 'blur',
        }, {
          type: 'number', message: '请输入数字',
        }],
        valueUnit: [{
          required: true, message: '请选择单位', trigger: 'change',
        }],
        defaultValue: [{
          required: true, message: '请输入默认值', trigger: 'blur',
        }, {
          type: 'number', message: '请输入数字',
        }],
      },
    };
  },
  computed: {
    // 值域选项
    valueOptions() {
      return this.formData.chooseValue.filter(item => item.value.length > 0).map(item => {
        return {
          label: item.value,
          value: item.value,
        };
      });
    },
    // 值域单位
    valueUnitLabel() {
      return this.valueUnitMap[this.formData.valueUnit]?.label || '';
    },
  },
  async created() {
    const data = omitBy(this.data, isNil);
    this.formData = Object.assign({}, this.formData, data);
    const valueUnitData = this.$store.state['dictionary']['dicList']['valueUnit'];
    valueUnitData.map(item => {
      this.valueUnitMap[item.value] = {
        name: item.name,
        label: item.parm,
      };
    });
    switch (this.formData.valueType) {
      case 1: // 选项
        this.formData.chooseValue = this.data.chooseValue.split(',').map(item => {
          return {
            value: item,
          };
        });
        this.formData.chooseException = this.data.chooseException.split(',');
        break;
      case 2: // 数值
        this.formData.exceptionValue = (typeof this.data.exceptionValue === 'string') ? JSON.parse(this.data.exceptionValue) : [{ operator: 'eq', value: '', }];
        break;
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();

        // 选项
        if (this.formData.valueType === 1) {
          await this.optionSubmit();
        } else { // 数值
          await this.valueSubmit();
        }
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    // 选项新增或修改
    async optionSubmit() {
      try {
        const {
          id,
          inspectionType,
          state,
          inspectionRemark,
          isWrite,
          chooseValue,
          chooseDefault,
          chooseException,
        } = this.formData;
        const chooseVauleData = chooseValue.map(item => item.value).join(',');
        const chooseExceptionData = chooseException.join(',');
        if (id) { // 修改选项巡检内容
          await InspectionTempApi.updateTempOptionContent({
            id,
            inspectionType,
            state,
            inspectionRemark,
            isWrite,
            chooseValue: chooseVauleData,
            chooseDefault,
            chooseException: chooseExceptionData, });
          this.$message({
            type: 'success',
            message: '修改巡检内容成功',
          });
        } else { // 新增选项巡检内容
          const result = await InspectionTempApi.addTempOptionContent({
            tempId: this.tempId,
            inspectionType,
            state,
            inspectionRemark,
            isWrite,
            chooseValue: chooseVauleData,
            chooseDefault,
            chooseException: chooseExceptionData,
          });
          this.formData.id = result;
          this.$message({
            type: 'success',
            message: '添加巡检内容成功',
          });
        }
        const data = { id: this.formData.id, valueType: 1, inspectionType, state, inspectionRemark, isWrite, chooseDefault, chooseException: chooseExceptionData, };
        this.$emit('done', data);
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 数值新增或修改
    async valueSubmit() {
      try {
        const {
          id,
          inspectionType,
          state,
          inspectionRemark,
          isWrite,
          minValue,
          maxValue,
          valueUnit,
          defaultValue,
          exceptionValue,
        } = this.formData;
        if (minValue > maxValue) {
          throw new Error('请输入有效值域区间！');
        }
        if (defaultValue < minValue || defaultValue > maxValue) {
          throw new Error(`默认值 ${defaultValue} 不在区间 ${minValue} - ${maxValue} 内,请重新输入`);
        }
        if (id) { // 修改数值巡检内容
          await InspectionTempApi.updateTempValueContent({
            id,
            inspectionType,
            state,
            inspectionRemark,
            isWrite,
            minValue,
            maxValue,
            valueUnit,
            defaultValue,
            exceptionValue: JSON.stringify(exceptionValue),
          });
          this.$message({
            type: 'success',
            message: '修改巡检内容成功',
          });
        } else { // 新增数值巡检内容
          await InspectionTempApi.addTempValueContent({
            tempId: this.tempId,
            inspectionType,
            state,
            inspectionRemark,
            isWrite,
            minValue,
            maxValue,
            valueUnit,
            defaultValue,
            exceptionValue: JSON.stringify(exceptionValue),
          });
          this.$message({
            type: 'success',
            message: '添加巡检内容成功',
          });
        }
        this.$emit('done');
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 不能存在同名值域
    uniq(rule, value, callback) {
      const sameData = this.formData.chooseValue.filter(item => item.value === value);
      if (sameData.length >= 2) {
        callback(new Error(`值域"${value}"已存在,请重新输入`));
      } else {
        callback();
      }
    },
    // 删除异常值域
    handleDelExceptionVaule(index) {
      this.formData.exceptionValue.splice(index, 1);
    },
    // 添加异常值域
    handleAddExceptionVal() {
      this.formData.exceptionValue.push({ logicOperator: 'and', operator: 'eq', value: '', });
    },

    // 添加值域选项
    handleAddValueOption() {
      this.formData.chooseValue.push({
        value: '',
      });
    },
    // 删除值域选项
    handleDelValueOption(index) {
      this.formData.chooseValue.splice(index, 1);
    },
    // 值域选项变更
    handleValueOptionChange() {
      this.formData.chooseDefault = null;
      this.formData.chooseException = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
  .el-col-12 {
    padding:0;
  }
}

.w-80 {
  width: 80%;
}
.unit {
  font-size: 14px;
  color: #879BBA;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
</style>
