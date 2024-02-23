<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-03 19:21:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-26 14:43:44
 * @Description: 新增/编辑排班规则
-->

<template>

  <div>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="108px"
      style="padding: 0 0 0 60px"
      size="mini"
    >
      <el-form-item label="班次" prop="dutyType">
        <el-input v-model="formData.dutyType" class="input-width" />
      </el-form-item>
      <el-form-item label="排班人员" prop="dutyUser">
        <engineer-drag-select
          v-model="formData.dutyUser"
          class="input-width"
        />
      </el-form-item>
      <el-form-item label="单次值班天数" prop="days">
        <el-input-number
          v-model="formData.days"
          controls-position="right"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="每天值班人数" prop="needNum">
        <el-input-number
          v-model="formData.needNum"
          controls-position="right"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="排班日期" prop="holidayType">
        <el-select
          v-model="formData.holidayType"
          clearable
          :filterable="true"
          class="input-width"
        >
          <el-option :value="10" label="全部" />
          <el-option :value="0" label="工作日" />
          <el-option :value="1" label="周末" />
          <el-option :value="2" label="节假日" />
          <el-option :value="3" label="节假日+周末" /></el-select>
      </el-form-item>
      <el-form-item label="颜色样式">
        <el-color-picker
          v-model="formData.colorCode"
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input-number
          v-model="formData.sortNum"
          controls-position="right"
          :min="1"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="是否续排">
        <el-radio-group v-model="formData.isContinue">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-for="num in slotTimeCount"
        :key="num"
        :label="'值班时间段'+num"
      >
        <el-time-picker

          v-model="formData.slotTime['time'+num]"
          class="input-width"
          is-range
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

    </el-form>
    <el-row>
      <el-col :span="12" style="text-align:left">
        <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      </el-col>
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
import EngineerDragSelect from '../select/engineerDragSelect.vue';
import {
  cloneDeep,
} from 'lodash';
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
    EngineerDragSelect,
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
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff'
      ],
      formData: {
        slotTime: {},
      },
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
      slotTimeCount: 1,
    };
  },
  destroyed() {
  },
  mounted() {
    if (this.type === 'create') {
      this.formData = Object.assign({}, cloneDeep(defaultFormData));
    } else if (this.type === 'update') {
      this.formData = Object.assign({}, cloneDeep(this.data));
      this.slotTimeCount = Object.keys(this.formData.slotTime).length || 1;
    }
  },
  methods: {
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
        if (this.type === 'create') {
          await addDutyScheduleRule(this.formData);
        } else if (this.type === 'update') {
          await updateDutySchedule(this.formData);
        }
        this.$emit('done');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.input-width {
  width: 224px;
}
</style>
