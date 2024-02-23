<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-23 16:39:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-08 20:34:35
 * @Description:
-->
<template>
  <div class="el-calendar">
    <div
      class="el-calendar__body"
    >
      <el-row type="flex" align="middle">
        <el-col style="width:20px">

          <div class="triangle-left" @click="selectDate('prev-month')" />
        </el-col>
        <el-col :span="24"><date-table
          :selected-day="realSelectedDay"
          :date="date"
          @pick="pickDay"
        /></el-col>
        <el-col style="width:20px"><div class="triangle-right" @click="selectDate('next-month')" /></el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import moment from 'moment';
import DateTable from './date-table.vue';

const validTypes = ['prev-month', 'today', 'next-month'];
export default {
  name: 'PureCalendar',
  components: {
    DateTable,
  },
  provide() {
    return {
      pureCalendar: this,
    };
  },
  data() {
    return {
      selectedDay: '',
      now: new Date(),
    };
  },
  computed: {
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      return moment(temp).format('yyyy-MM');
    },
    curMonthDatePrefix() {
      return moment(this.date).format('yyyy-MM');
    },
    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return moment(temp).format('yyyy-MM');
    },
    formatedDate() {
      return moment(this.date, 'yyyy-MM-DD');
    },
    formatedToday() {
      return moment(this.now).format('yyyy-MM-DD');
    },
    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.formatedDate;
      },
      set(val) {
        this.selectedDay = val;
        const date = new Date(val);
        this.$emit('input', date);
      },
    },
    date() {
      if (!this.value) {
        if (this.realSelectedDay) {
          const d = this.selectedDay.split('-');
          return new Date(d[0], d[1] - 1, d[2]);
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },
  },
  methods: {
    selectDate(type) {
      if (!validTypes.includes(type)) {
        throw new Error(`invalid type ${type}`);
      }
      let day = '';
      if (type === 'prev-month') {
        day = `${this.prevMonthDatePrefix}-01`;
        this.$emit('monthChange', day);
      } else if (type === 'next-month') {
        day = `${this.nextMonthDatePrefix}-01`;
        this.$emit('monthChange', day);
      } else {
        day = this.formatedToday;
      }
      if (day === this.formatedDate) return;
      this.pickDay(day);
    },
    pickDay(day) {
      this.realSelectedDay = day;
    },
    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    handlePreMonth() {

    },
    handleNextMonth() {

    },

  },

};
</script>

<style lang="scss" scoped>
.el-calendar__header {
  border: unset;
}
.el-calendar__body {
  padding: 0 8px 0px;
}
.triangle-left {
      display: inline-block;
      width: 0;
      height: 0;
      border-top: 28px solid transparent;
      border-right: 18px solid #D9D9D9;
      border-bottom: 28px solid transparent;
}
.triangle-right {
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 2px;
      border-top: 28px solid transparent;
      border-left: 18px solid #D9D9D9;
      border-bottom: 28px solid transparent;
}
</style>
