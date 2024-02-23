<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-01 15:07:51
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-04-26 15:33:44
 * @Description: 新增或编辑排班规则
-->
<template>
  <div class="drawer">
    <div class="header">
      <span class="title">{{ type==='create'?'新增规则':'编辑规则' }}</span>
    </div>
    <pure-card class="max-height">
      <div slot="header">规则信息</div>
      <el-form
        ref="form"
        label-width="135px"
        label-position="right"
        size="mini"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-col :span="12">
            <el-form-item label="班次名称" prop="dutyType">
              <el-input v-model="formData.dutyType" class="input-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排班日期" prop="holidayType">
              <el-select
                v-model="formData.holidayType"
                :filterable="true"
                class="input-width"
                clearable
              >
                <el-option :value="10" label="全部" />
                <el-option :value="0" label="工作日" />
                <el-option :value="1" label="周末" />
                <el-option :value="2" label="节假日" />
                <el-option :value="3" label="节假日+周末" /></el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-col :span="12">
            <el-form-item label="单次值班天数" prop="days">
              <el-input-number
                v-model="formData.days"
                class="width-88"
                controls-position="right"
                :min="1"
                :max="10"
              /><span class="unit">天</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每天值班人数" prop="needNum">
              <el-input-number
                v-model="formData.needNum"
                class="width-88"
                controls-position="right"
                :min="1"
                :max="10"
              /><span class="unit">人</span>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-col :span="24">
            <el-form-item label="排班人员" prop="dutyUser">

              <engineer-draggable-select
                v-model="formData.dutyUser"
                class="input-width"
                style="width:100%"
                draggable
                multiple
              />
            </el-form-item></el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-col :span="12">
            <el-form-item label="显示顺序">
              <el-input-number
                v-model="formData.sortNum"
                class="width-88"
                controls-position="right"
                :min="1"
                :max="10"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色样式">
              <el-color-picker
                v-model="formData.colorCode"
                :predefine="predefineColors"
              />
            </el-form-item></el-col>
        </el-form-item>
        <el-form-item label-width="0px" class="form-item-wrapper">
          <el-col :span="12">
            <el-form-item label="是否续排">
              <el-switch
                v-model="formData.isContinue"
                active-text="是"
                inactive-text="否"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值班费用">
              <el-input v-model="formData.dutyExpenses" size="mini" style="width: 100px;" @input="onInput" /> 元
            </el-form-item>
          </el-col>
        </el-form-item>
        <div class="hospital">值班时间段</div>
        <el-form-item
          v-for="num in slotTimeCount"
          :key="num"
          :label="'值班时间段'+num"
        >
          <el-time-picker

            v-model="formData.slotTime['time'+num]"
            class="time-width"
            is-range
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
          <el-button
            v-if="num!==1"
            style="margin-left:16px"
            @click="handleDeleteSlotTime(num)"
          >删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="slotTimeCount<4"
            @click="handleAddSlotTime"
          >添加时间段</el-button>
        </el-form-item>
        <div class="hospital">值班院区<span>请至少勾选一个院区<span>(所选院区值班人数之和需等于每天值班人数)</span></span><div /></div>

        <template v-for="hospital in hospitalList">
          <el-form-item
            :key="'hosiptal'+hospital.id"
            label-width="0px"
            class="form-item-wrapper"
          >
            <el-col :span="12">
              <el-form-item label=" ">
                <el-checkbox v-model="hospital.checked">{{ hospital.name }}</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="hospital.checked" label="值班人数">
                <el-input-number
                  v-model="hospital.num"
                  class="width-88"
                  controls-position="right"
                  :min="1"
                  :max="10"
                /><span class="unit">人</span>
              </el-form-item>
            </el-col>
          </el-form-item>
        </template>
      </el-form>
    </pure-card>
    <el-row class="footer">
      <el-col :span="12" style="text-align:right">
        <el-button size="mini" type="primary" @click="handleSaveSchedule">保存规则</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  addDutyScheduleRule,
  updateDutySchedule,
} from '@/apis/synthesize/workforceManagement';
import {
  cloneDeep,
} from 'lodash';
import DepartmentApi from '@/apis/system/department';
import EngineerDraggableSelect from '@/feat/system/user/component/v2/engineerDraggableSelect.vue';
const defaultFormData = {
  dutyType: null,
  dutyUser: null,
  isContinue: 1,
  days: 1,
  needNum: 1,
  holidayType: 0,
  colorCode: '#409EFF',
  sortNum: 1,
  slotTime: {},
};
export default {
  components: {
    EngineerDraggableSelect,
  },
  props: {
    type: {
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
      formData: {
        slotTime: {},
        hospitalInfo: [],
        dutyExpenses: '',
      },
      hospitalList: [],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff'
      ],
      slotTimeCount: 1,
      rules: {
        dutyType: [
          {
            required: true, message: '请填写班次', trigger: 'blur',
          }
        ],
        dutyUser: [
          {
            required: true, message: '请选择排班人员', trigger: 'change',
          }
        ],
        days: [
          {
            required: true, message: '请填写值班天数', trigger: 'blur',
          }
        ],
        needNum: [
          {
            required: true, message: '请填写值班人数', trigger: 'blur',
          }
        ],
        holidayType: [
          {
            required: true, message: '请选择排班日期', trigger: 'change',
          }
        ],
      },
    };
  },
  mounted() {

  },
  async created() {
    await this.fetchHospitalList();
    if (this.type === 'create') {
      this.formData = Object.assign({}, cloneDeep(defaultFormData));
    } else if (this.type === 'update') {
      this.formData = Object.assign({}, cloneDeep(this.data));
      this.slotTimeCount = Object.keys(this.formData.slotTime).length || 1;
      const hospitalInfo = this.formData.hospitalInfo;
      hospitalInfo.map(item => {
        this.hospitalList = this.hospitalList.map(innerItem => {
          if (item.hospital === innerItem.id) {
            innerItem.checked = true;
            innerItem.num = item.num;
          }
          return innerItem;
        });
      });
    }
  },
  methods: {
    onInput() {
      let filterValue = this.formData.dutyExpenses.toString();
      filterValue = filterValue.replace(/^\./g, ''); //  不能以“.”开头
      filterValue = filterValue.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      filterValue = filterValue.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      filterValue = filterValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      filterValue = filterValue.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');// 只能输入两个小数
      if (filterValue.indexOf('.') < 0 && filterValue !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        filterValue = parseFloat(filterValue);
      }
      this.formData.dutyExpenses = filterValue;
    },
    async fetchHospitalList() {
      try {
        const { list, } = await DepartmentApi.list({ deptType: 1, state: 1, });
        this.hospitalList = list.map(item => {
          return { id: item.id, name: item.deptName, checked: false, num: 1, };
        });
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    handleAddSlotTime() {
      this.slotTimeCount++;
    },
    handleDeleteSlotTime(num) {
      this.slotTimeCount--;
      delete this.formData.slotTime['time' + num];
    },
    async handleSaveSchedule() {
      try {
        await this.$refs['form'].validate();
        const hospitalInfo = this.hospitalList.filter(item => item.checked)
          .map(item => { return { hospital: item.id, num: item.num, }; });
        this.formData.hospitalInfo = hospitalInfo;
        if (this.type === 'create') {
          await addDutyScheduleRule(this.formData);
        } else if (this.type === 'update') {
          await updateDutySchedule(this.formData);
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
.form-item-wrapper {
  padding: 0;
  margin-bottom: 0;
}
.hospital {
    font-size: $--pure-base-font-size;
    color: #2D405E;
    span {
        color: #C0C4CC;
        padding-left: 16px;
        span {
          color: red;
          padding-left:0;
        }
    }
}
.unit {
    font-size: $--pure-base-font-size;
    color: #879BBA;
    padding-left: 7px;
}
.width-88 {
    width: 88px;
}
.time-width {
    width: 320px;
}
.footer {
    position: absolute;
    bottom: 16px;
}
.max-height ::v-deep .pure-card__body{
   max-height: calc(100vh - 160px);
}
</style>
