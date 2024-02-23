<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-25 20:26:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-25 22:39:29
 * @Description: 首页数据统计设置
-->
<template>
  <div>
    <div class="unit base-margin-bottom">
      数据统计时间默认统计最近30天数据。 自定义统计时间后，如需恢复默认，可点击“重置”按钮，再点击确定即可。 设置时，号数仅能填入1-31的整数数字，当截止数填入为30或31，而现实截止月只有28号时，则截止时间为28号。 例：设置数据范围为“上月1号 至 本月31号”，当到2月时，则实际统计时间为“1月1日 至 2月28日”。
    </div>
    <el-form size="mini">
      <el-form-item label="数据统计时间">

        <el-select v-model="startMonth" class="w-10 base-margin-right" @change="onStartMonthChange">
          <el-option
            v-for="item in monthOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="startDay" class="w-80">
          <el-option
            v-for="item in currentMonthDayOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        号
        至
        <el-select v-model="endMonth" class="w-10 base-margin-right" @change="onEndMonthChange">
          <el-option
            v-for="item in monthOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="endDay" class="w-80">
          <el-option
            v-for="item in currentMonthDayOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        号
      </el-form-item>
      <div class="align-right">
        <pure-button
          label="重置"
          @click="onReset"
        />
        <pure-button
          label="确定"
          @click="onSubmit"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment';
import { bus, } from '@/utils/bus';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
const HOME_SETTING_KEY = 'home_setting';
export default {
  data() {
    return {
      monthOption: [{
        value: 'previousMonth',
        label: '上月',
      }, {
        value: 'currentMonth',
        label: '本月',
      }],
      startMonth: 'currentMonth',
      startDay: '1',
      endMonth: 'currentMonth',
      endDay: '31',
      // 上月天数
      previousMonthDays: 31,
      // 本月天数
      currentMonthDays: 31,
    };
  },
  computed: {
    previousMonthDayOption() {
      const option = [];
      for (let i = 1; i <= this.previousMonthDays; i++) {
        const value = i < 10 ? `0${i}` : i;
        option.push({
          value: value,
          label: i,
        });
      }
      return option;
    },
    currentMonthDayOption() {
      const option = [];
      for (let i = 1; i <= this.currentMonthDays; i++) {
        const value = i < 10 ? `0${i}` : i;
        option.push({
          value: value,
          label: i,
        });
      }
      return option;
    },

  },
  mounted() {
    const { startMonth, startDay, endMonth, endDay, } = getJSON(HOME_SETTING_KEY);
    this.startMonth = startMonth || 'currentMonth';
    this.startDay = startDay || '01';
    this.endMonth = endMonth || 'currentMonth';
    this.endDay = endDay || '31';
  },
  methods: {
    onStartMonthChange(val) {
      if (val === 'currentMonth') {
        this.endMonth = 'currentMonth';
      }
    },
    onEndMonthChange(val) {
      if (val === 'previousMonth') {
        this.startMonth = 'previousMonth';
      }
    },
    onReset() {
      this.startMonth = 'currentMonth';
      this.endMonth = 'currentMonth';
      this.startDay = '01';
      this.endDay = '31';
    },
    async onSubmit() {
      const startMonth = this.getMonth(this.startMonth);
      const endMonth = this.getMonth(this.endMonth);
      const startDate = `${startMonth}-${this.startDay}`;
      const endDate = `${endMonth}-${this.endDay}`;
      console.log('endDate: ', endDate);
      const startTime = moment(new Date(startDate)).valueOf();
      console.log('startTime: ', startTime);
      const endTime = moment(new Date(endDate)).valueOf();
      console.log('endTime: ', endTime);
      if (startTime > endTime) {
        this.$message.error('开始时间不能大于结束时间');
        return;
      }
      setJSON(HOME_SETTING_KEY, {
        startMonth: this.startMonth,
        startDay: this.startDay,
        endMonth: this.endMonth,
        endDay: this.endDay,
      });
      bus.$emit('home-refresh-statistics', { startTime, endTime, });
      this.$emit('done');
    },
    getMonth(monthLabel) {
      switch (monthLabel) {
        case 'currentMonth':
          return moment().startOf('month').format('YYYY-MM');
        case 'previousMonth':
          return moment().subtract('month', 1).format('YYYY-MM');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.w-10 {
  width: 100px;
}
.w-80 {
  width: 80px;
}

</style>
