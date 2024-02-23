<template>
  <el-container class="gantt-wrapper">
    <el-main v-loading="loading">
      <div v-show="visible" ref="gantt" class="gantt-container" />
      <el-empty v-show="!visible" description="暂无数据" />
    </el-main>
    <el-footer height="16px" />
  </el-container>
</template>

<style>
</style>

<script>
import gantt from 'dhtmlx-gantt'; // 引入模块
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css'; // 皮肤
import 'dhtmlx-gantt/codebase/locale/locale_cn'; // 本地化
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_tooltip.js'; // 任务条悬浮提示

import ProjectAPI from '@/apis/project';
import moment from 'moment';
import { member, } from '@/filters';
import { mapGetters, mapMutations, } from 'vuex';
import _ from 'lodash';

export default {
  name: 'Gantt',
  components: {},
  props: {
  },
  data() {
    return {
      loading: false,
      visible: true,
      code: '',
      sliderValue: 0,
      ganttColorBar: {
        0: {
          color: '#597ef7',
        },
        1: {
          color: '#f759ab',
        },
        2: {
          color: '#fa541c',
        },
        3: {
          color: '#fa8c16',
        },
        4: {
          color: '#faad14',
        },
        5: {
          color: '#fadb14',
        },
        6: {
          color: '#a0d911',
        },
        7: {
          color: '#1890ff',
        },
        8: {
          color: '#13c2c2',
        },
        9: {
          color: '#52c41a',
        },
        10: {
          color: '#722ed1',
        },
        default: {
          color: '#ff4d4f',
        },
      },
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    code: {
      handler: _.debounce(function (n, o) {
        const self = this;
        self.getList();
      }, 300),
    },
  },
  mounted() {
  },
  methods: {
    setCode(code) {
      this.code = code;
    },
    setScaleConfig(level) {
      if (this.loading) {
        return;
      }
      this.scaleConfig(level);
      gantt.render();
    },
    scaleConfig(level) {
      switch (level) {
        case 0:
          gantt.config.scales = [
            { unit: 'year', step: 1, date: '%Y', },
            { unit: 'day', step: 1, date: '星期' + '%D', },
            { unit: 'day', step: 1, date: '%M' + '%d' + '日', }
          ];
          gantt.config.scale_height = 40;
          break;
        case 1:
          gantt.config.scales = [
            { unit: 'year', step: 1, date: '%Y', },
            { unit: 'day', step: 2, date: '星期' + '%D', },
            { unit: 'day', step: 2, date: '%M' + '%d' + '日', }
          ];
          gantt.config.scale_height = 40;
          break;
        case 2:
          gantt.config.scales = [
            {
              unit: 'week',
              step: 1,
              // format: '%D',
              format: function (date) {
                var dateToStr = gantt.date.date_to_str(`%M %d日`);
                var endDate = gantt.date.add(date, -6, 'day');
                var weekNum = gantt.date.date_to_str('%W周')(date);
                return (weekNum + '/' + dateToStr(endDate) + ' - ' + dateToStr(date));
              },
            },
            { unit: 'day', step: 1, format: '%D', }
          ];
          gantt.config.scale_height = 40;
          break;
        case 3:
          gantt.config.scales = [
            { unit: 'year', step: 1, format: '%Y', },
            { unit: 'month', step: 1, format: '%F', }
            // { unit: 'week', step: 1, format: function (date) {
            //   var dateToStr = gantt.date.date_to_str(`%M%d日`);
            //   var endDate = gantt.date.add(date, -6, 'day');
            //   return (dateToStr(endDate));
            // }, }
          ];
          gantt.config.scale_height = 40;
          break;
        case 4:
          gantt.config.scales = [
            { unit: 'quarter', step: 1, format: '%Y', },
            { unit: 'month', step: 1, format: '%F', }
          ];
          gantt.config.scale_height = 40;
          break;
        case 5:
          gantt.config.scales = [
            { unit: 'year', step: 1, format: '%Y', },
            { unit: 'month', step: 1, format: '%F', }
          ];
          gantt.config.scale_height = 40;
          break;
      }
    },
    init() {
      const self = this;
      // 自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      gantt.config.autosize = false;
      // 只读模式
      gantt.config.readonly = true;
      // 是否显示左侧树表格
      gantt.config.show_grid = true;
      gantt.config.grid_width = 800;
      // 表格列设置
      gantt.config.columns = [
        {
          name: 'text',
          label: '项目名',
          tree: true,
          align: 'left',
          width: 400,
        },
        {
          name: 'leader',
          label: '负责人',
          width: 80,
          align: 'center',
        },
        {
          name: 'join',
          label: '参与人',
          width: '*',
          align: 'center',
          template: (v) => {
            if (v.$level === 1) {
              return '-';
            }
            return v['join'].includes(this.userInfo.name) ? this.userInfo.name : '-';
          },
        },
        {
          label: '开始时间',
          name: 'start',
          width: 180,
          align: 'center',
          template: (v, a, c) => {
            if (v.$level === 0) {
              return moment(v.start).format('YYYY-MM-DD');
            } else {
              return moment(v.start).format('YYYY-MM-DD HH:mm');
            }
          },
        },
        {
          label: '结束时间',
          name: 'end_time',
          width: 180,
          align: 'center',
          template: (v, a, c) => {
            if (v.$level === 0) {
              return moment(v.end_time).format('YYYY-MM-DD');
            } else {
              return moment(v.end_time).format('YYYY-MM-DD HH:mm');
            }
          },
        },
        {
          name: 'progress',
          label: '进度(%)',
          align: 'center',
          width: '*',
          template: function (obj) {
            return obj.process + '%';
          },
        }
      ];
      // 时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
      gantt.config.show_task_cells = true;
      // 设置x轴日期
      // gantt.config.scale_unit = 'year';
      // gantt.config.step = 1;
      // gantt.config.date_scale = '%Y';

      gantt.config.scale_height = 50;

      // 当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
      gantt.config.fit_tasks = true;

      // 在时间线上增加一行显示星期
      // gantt.config.subscales = [
      //   { unit: 'day', step: 1, date: '星期' + '%D', },
      //   { unit: 'day', step: 1, date: '%M' + '%d' + '日', }
      // ];
      // 时间轴图表中，任务条形图的高度
      gantt.config.task_height = 16;
      // 时间轴图表中，甘特图的高度
      // gantt.config.row_height = 36;
      // 从后端过来的数据格式化
      // gantt.config.xml_date = '%Y-%m-%d';

      gantt.templates.grid_folder = function () {
        return '';
      };
      gantt.templates.grid_file = function () {
        return '';
      };
      // 设置 缩进
      gantt.templates.grid_indent = function (item) {
        return "<div class='gantt_tree_indent'></div>";
      };
      // 任务条显示内容
      gantt.templates.task_text = function (start, end, task) {
        return task.text;
      };
      // gantt.templates.task_class = function(start, end, task){return "xx";};
      // 悬浮
      gantt.templates.tooltip_text = function (start, end, task) {
        const info = `
        <li>
        <span>项目名:</span>
        <span>${task.text}</span>
        </li>
        <li>
        <span>开始时间:</span>
        <span>${self.tooltipFormatterTime(task.$level, task.start)}</span>
        </li>
        <li>
        <span>结束时间:</span>
        <span>${self.tooltipFormatterTime(task.$level, task.end_time)}</span>
        </li>
        <li>
        <span>参与人员:</span>
        <span>${task.join || '-'}</span>
        </li>
        <li>
        <span>当前进度:</span>
        <span>${task.process} %</span>
        </li>
        `;
        const wrapper = `<ul class="tip_container">
          ${info}
        </ul>`;
        return wrapper;
      };

      // 任务条上的文字大小 以及取消border自带样式
      gantt.templates.task_class = function (start, end, item) {
        return 'gantt-task-border';
      };
      // 初始化
      this.scaleConfig(0);
      gantt.init(this.$refs.gantt);
      gantt.clearAll();
    },

    ...mapMutations('user/center', ['SET_USER_LIST']),

    async getList() {
      this.init();
      this.RewriteList();
    },
    // 唯一id
    onlyId(a, b) {
      const hasA = Boolean(a);
      const hasB = Boolean(b);
      const result = hasA ? (hasB ? a + b : a + 1 + b) : a + 1 + b;
      return result;
    },
    async RewriteList() {
      this.visible = true;
      this.loading = true;
      const rs = await ProjectAPI.impose.queryGantt({
        code: this.code,
        keyWord: '',
        pageNum: 1,
        pageSize: 9999,
      });
      const result = rs.list;
      if (!result.length) {
        this.visible = false;
        this.loading = false;
        return;
      }
      const item = [];
      const itemChild = [];
      for (const i of result) {
        for (const child of i.workList) {
          itemChild.push({
            // 解决 任务id 和 项目id 冲突的问题
            id: this.onlyId(child.id, i.id),
            lv: child.indexNum.split('.').length,
            text: child.name,
            parent: child.parentId ? child.parentId : i.id,
            start: child.parentId ? child.startTime : this.computedMileageS(child.id, i.workList, i.startTime),
            start_date: child.parentId ? moment(child.startTime).format('DD-MM-YYYY  HH:mm') : moment(this.computedMileageS(child.id, i.workList, i.startTime)).format('DD-MM-YYYY  HH:mm'),
            duration: child.parentId ? this.duration(child.startTime, child.endTime) : this.duration(this.computedMileageS(child.id, i.workList, i.startTime), this.computedMileageE(child.id, i.workList, i.endTime)),
            end_time: child.parentId ? child.endTime : this.computedMileageE(child.id, i.workList, i.endTime),
            progress: child.totalProgress / 100 || 0,
            process: child.totalProgress || 0,
            leader: member(child.principal),
            join: child.users || '-',
            color: '',
            show: false,
            // open: true,
          });
        }
        item.push({
          id: i.id,
          text: i.title,
          parent: 0,
          lv: 0,
          start: i.startTime,
          start_date: moment(i.startTime).format('DD-MM-YYYY  HH:mm'),
          duration: this.duration(i.startTime, i.endTime),
          end_time: i.endTime,
          progress: i.totalProgress / 100 || 0,
          process: i.totalProgress,
          leader: member(i.principal),
          join: i.users || '-',
          color: '',
          // open: true,
        });
      }
      const renderData = [...item, ...itemChild];
      console.log('🚀 ~ file: ganttTable.vue:388 ~ RewriteList ~ renderData:', renderData);
      for (const i of renderData) {
        if (this.ganttColorBar[String(i.lv)]) {
          i.color = this.ganttColorBar[String(i.lv)].color;
        } else {
          i.color = this.ganttColorBar['default'].color;
        }
      }
      gantt.parse({
        data: renderData,
      });
      this.loading = false;
    },

    // 计算里程碑的开始时间
    computedMileageS(id, childList, spareTime) {
      const theIdList = childList.filter(e => e.parentId === id);
      const timeStratTimeGather = theIdList.map(e => new Date(e.startTime).getTime());
      const val = _.min(timeStratTimeGather) || spareTime;
      return val;
    },
    computedMileageE(id, childList, spareTime) {
      const theIdList = childList.filter(e => e.parentId === id);
      const timeEndTimeGather = theIdList.map(e => new Date(e.endTime).getTime());
      const val = _.max(timeEndTimeGather) || spareTime;
      return val;
    },

    tooltipFormatterTime(lv, time) {
      if (lv === 0) {
        return moment(time).format('YYYY-MM-DD');
      } else {
        return moment(time).format('YYYY-MM-DD HH:mm');
      }
    },

    duration(s, e) {
      const start = moment(s);
      const end = moment(e);
      return end.diff(start, 'days');
    },

  },
};
</script>

<style lang="scss"  >
.gantt-wrapper{
    padding: 0 16px;
}
.slider-wrapper{
  display: flex;
  align-items: center;
  .font-span{
    font-weight: 400;
    color: #7D8DB3;
  }
}

.gantt-container {
  height: 100%;
  // height: calc(100vh - 50px) !important;
}
.gantt-task-border {
  border: none;
}
.gantt_tree_indent {
  margin: 0;
  width: 5px;
}
.gantt_grid_head_cell,
.gantt_cell {
  border-right: 1px solid #d7d7d7 !important ;
}

.gantt_hor_scroll::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
// 滚动条的滑块
.gantt_hor_scroll::-webkit-scrollbar-thumb {
  background-color: #e2e3e7;
  border-radius: 3px;
}
.gantt_task_progress {
  background: #2b2b2b !important;
  opacity: 0.5 !important;
}
.gantt_row {
  box-shadow: 0 0 0 1px #d7d7d7;
}
.tip_container {
  padding: 0;
  margin: 0;
  // width: 400px;
  > li {
    > span {
      display: inline-block;
      font-size: 16px;
      // font-weight: 600;
      &:first-child {
        // width: 20%;
        padding: 0 4px;
        text-align: right;
        color: #595959;
      }
      &:last-child {
        flex: 1;
        color: #141414;
      }
    }
  }
}
</style>
