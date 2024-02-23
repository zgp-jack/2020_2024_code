import { mapActions, mapState, } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import processTimeLine from '../components/task/processTimeLine.vue';
import columnStatus from '../components/columnStatus.vue';
import { member, } from '@/filters';

// 0待提交1待处理2待审核3已驳回4已暂停5已停止6已完成
const colorConfig = [{
  color: '#2D405E',
  memo: '黑色',
  code: '0',
  text: '待提交',
}, {
  color: '#67C23A',
  memo: '绿色',
  code: '1',
  text: '待处理',

},
{
  color: '#409EFF',
  memo: '蓝色',
  code: '2',
  text: '待审核',
}, {
  color: '#E6A23C',
  memo: '黄色',
  code: '4',
  text: '已暂停',

}, {
  color: '#F56C6C',
  memo: '红色',
  code: '5',
  text: '已停止',

}, {
  color: '#F56C6C',
  memo: '红色',
  code: '3',
  text: '已驳回',

},

{
  color: '#909399',
  memo: '灰色',
  code: '6',
  text: '已完成',
}];

export const taskKeyColorConfig = _.keyBy(colorConfig, 'code');
export default {
  data() {
    return {
      tableColumn: [
        {
          label: '序号',
          prop: 'index',
          width: '85px',
          fixed: true,
          overflow: true,
        },
        {
          label: '任务名称',
          prop: 'taskName',
          width: '423px',
          align: 'left',
          fixed: true,
          overflow: true,
        }, {
          label: '责任人',
          overflow: true,
          fixed: false,
          prop: 'leaderUser',
          width: '100px',
          align: 'center',
          formatter: (v) => {
            return member(v['leaderUser']);
          },
        }, {
          label: '参与人',
          overflow: true,
          prop: 'partUser',
          width: '300px',
          align: 'center',
          fixed: false,
          formatter: (v) => {
            return member(v['partUser']);
          },
        }, {
          label: '开始时间',
          overflow: false,

          prop: 'planStartDate',
          align: 'center',

          fixed: false,
          width: '140px',

        }, {
          label: '结束时间',
          overflow: false,

          prop: 'planEndDate',
          align: 'center',
          fixed: false,

          width: '140px',

        }, {
          label: '实际完成时间',
          overflow: false,

          prop: 'compTime',
          align: 'center',
          width: '140px',
          fixed: false,

          formatter: (v) => {
            const h = this.$createElement;
            const isTimeBefore = v['compTime'] ? moment(v['compTime']).isBefore(v['planEndDate']) || moment(v['compTime']).isSame(v['planEndDate']) : true;
            return h('span', {
              style: {
                color: isTimeBefore ? '' : '#F56C6C',
              },
              domProps: {
                innerHTML: v['compTime'] || '-',
              },
            });
          },
        },
        {
          label: '项目名称',
          prop: 'itemName',
          align: 'center',
          width: '423px',
          fixed: false,
          formatter: (params) => {
            return params.itemName ? params.itemName : '-';
          },
        },
        {
          label: '状态',
          overflow: false,

          prop: 'states',
          align: 'center',
          width: '100px',
          fixed: 'right',

          formatter: (v) => {
            const h = this.$createElement;
            return h(columnStatus, {
              props: {
                value: v['compRate'],
                id: v['id'],
                state: v['states'] || '',
              },
            });
          },
        }, {
          label: '完成比',
          overflow: false,
          prop: 'compRate',
          align: 'center',
          width: '100x',
          fixed: 'right',
          formatter: (v) => {
            const h = this.$createElement;
            return h(processTimeLine, {
              props: {
                value: v['compRate'],
                id: v['id'],
                state: v['states'] || '',
              },
            });
          },
        }, {
          label: '操作',
          overflow: false,
          prop: 'options',
          fixed: 'right',
          align: 'center',
          width: '300px',
          slot: true,
        }],
    };
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
  },
  computed: {
    ...mapState('user/center', ['userList']),
    StateList() {
      const list = colorConfig;
      list.unshift({
        text: '全部状态',
        code: '-1',
      });
      return list;
    },
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
  },
};
