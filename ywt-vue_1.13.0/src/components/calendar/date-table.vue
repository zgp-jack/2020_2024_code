<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-23 16:39:12
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-06-03 19:47:10
 * @Description:
-->
<script>
import {
  range as rangeArr,
  getFirstDayOfMonth,
  getPrevMonthLastDays,
  getMonthDays,
} from '@/utils/dateUtil';
import moment from 'moment';
import {
  getMonthHoliday,
  getMonthSchedule,
} from '@/apis/synthesize/workforceManagement';
import {
  bus,
} from '@/utils/bus';
import {
  find,
} from 'lodash';
export default {
  props: {
    selectedDay: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: function () {
        return new Date();
      },
    },

  },
  inject: ['pureCalendar'],
  data() {
    return {
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      monthHolidayList: [],
      monthScheduleList: [],
    };
  },
  computed: {
    rows() {
      let days = [];
      const date = this.date;
      let firstDay = getFirstDayOfMonth(date);
      firstDay = firstDay === 0 ? 7 : firstDay;
      const firstDayOfWeek = 1;
      const prevMonthDays = getPrevMonthLastDays(date, firstDay - firstDayOfWeek).map(day => ({
        text: day,
        type: 'prev',
      }));
      const currentMonthDays = getMonthDays(date).map(day => ({
        text: day,
        type: 'current',
      }));
      days = [...prevMonthDays, ...currentMonthDays];
      const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
        text: index + 1,
        type: 'next',
      }));
      days = days.concat(nextMonthDays);
      return this.toNestedArr(days);
    },
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
    formatedToday() {
      return this.pureCalendar.formatedToday;
    },
  },
  watch: {
    selectedDay(val) {
      // getMonthHoliday(this.curMonthDatePrefix).then((res) => {
      //   this.monthHolidayList = res;
      // });
      getMonthSchedule(this.curMonthDatePrefix).then(res => {
        this.monthScheduleList = res;
      });
    },
  },
  created() {
    getMonthHoliday(this.curMonthDatePrefix).then((res) => {
      this.monthHolidayList = res;
    });
    getMonthSchedule(this.curMonthDatePrefix).then(res => {
      this.monthScheduleList = res;
    });
    bus.$on('reloadData', (userId) => {
      getMonthSchedule(this.curMonthDatePrefix, userId).then(res => {
        this.monthScheduleList = res;
      });
    });
  },
  methods: {
    toNestedArr(days) {
      return rangeArr(days.length / 7).map((_, index) => {
        const start = index * 7;
        return days.slice(start, start + 7);
      });
    },
    cellRenderProxy({ text, type, }) {
      const render = this.pureCalendar.$scopedSlots.dateCell;
      if (!render) {
        return <span>{text}</span>;
      }
      const day = this.getFormateDate(text, type);
      const date = new Date(day);
      const data = {
        type: `${type}-month`,
        day,
      };
      const scheduleData = find(this.monthScheduleList, function (item) {
        return item.holidayTime.includes(day);
      });
      return render({ date, data, day: text, holidayData: scheduleData || {}, scheduleData: scheduleData || {}, });
    },
    getFormateDate(day, type) {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type');
      }
      let prefix = this.curMonthDatePrefix;
      if (type === 'prev') {
        prefix = this.prevMonthDatePrefix;
      } else if (type === 'next') {
        prefix = this.nextMonthDatePrefix;
      }
      day = `00${day}`.slice(-2);
      return `${prefix}-${day}`;
    },
    getCellClass({ text, type, }) {
      const classes = [type];
      if (type === 'current') {
        const date = this.getFormateDate(text, type);
        if (date === this.selectedDay) {
          classes.push('is-selected');
        }
        if (date === this.formatedToday) {
          classes.push('is-today');
        }
      }
      return classes;
    },
    pickDay({ text, type, }) {
      if (type !== 'current') {
        return;
      }
      const date = this.getFormateDate(text, type);
      this.$emit('pick', date);
    },
  },
  render() {
    const thead = (<thead>
      {
        this.weekDays.map(day => <th key={day}>{day}</th>)
      }
    </thead>);
    return (
      <table
        class={{
          'el-calendar-table': true,
        }}
        cellspacing='0'
        cellpadding='0'>
        {
          thead
        }
        <tbody>
          {
            this.rows.map((row, index) => <tr
              class={{
                'el-calendar-table__row': true,
              }}
              key={index}>
              {
                row.map((cell, key) => <td
                  key={key}
                  class={this.getCellClass(cell)}
                  onClick={this.pickDay.bind(this, cell)}
                >
                  <div class='el-calendar-day'>
                    {
                      this.cellRenderProxy(cell)
                    }
                  </div>
                </td>)
              }
            </tr>)
          }
        </tbody>
      </table>);
  },
};
</script>

<style lang="scss" scoped>
td.is-today{
  color: white;
  span.day {
    color: white;
    background-color: #F56C6C;
    border-radius: 50%;
    line-height: 25px;
    width: 25px;
    top:-4px;
  }
}
thead {
  background-color: #F2F6FC;
  font-size: 20px;
  line-height: 33px;
  th {
    padding: 0 10px 0px;
    text-align:right;
  }
}
.el-calendar-day {
  padding: 8px 8px;
}

</style>
