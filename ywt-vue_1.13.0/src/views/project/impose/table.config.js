import { member, stringifyToArr, } from '@/filters';
import vm from '@/main';
import { arrayToString, } from '@/utils/common';
import moment from 'moment';
import popoverProjectInfo from '@/views/project/components/popver/projectInfo';
import { tableCellIconData, tableCellIconDataDrawer, } from '../common';
// import Application from './components/application.vue';
import attachment from '@/views/project/components/attachment/attachment.vue';
import contractList from './components/contractList.vue';
import MeetingList from './components/meetingList.vue';
import drawerWidth from '@/views/project/common/width/drawer';
const icons = {
  apply: require('@/assets/project/icons/apply.svg'),
  metting: require('@/assets/project/icons/metting.svg'),
  invoice: require('@/assets/project/icons/invoice.svg'),
  file: require('@/assets/project/icons/file.svg'),

};

export const tableConfig = [

  {
    label: '序号',
    w: '85px',
    type: 'index',
    fixed: true,
  },
  {
    label: '项目名称',
    property: 'title',
    w: '245px',
    fixed: true,
    overflow: false,
    formatter: (v) => {
      return vm.$createElement(popoverProjectInfo, {
        props: {
          info: v,
        },
      });
    },
  }, {
    label: '负责人',
    property: 'principal',
    w: '102px',
    overflow: false,
    fixed: false,
    formatter: (v) => {
      return member(v.principal);
    },
  }, {
    label: '参与人员',
    property: 'users',
    overflow: true,
    w: '142px',
    fixed: false,

    formatter: (v) => {
      return arrayToString(v.users);
    },
  }, {
    label: '创建人',
    property: 'createUser',
    overflow: false,
    w: '90px',
    fixed: false,

    formatter: (v) => {
      return member(v.createUser);
    },
  }, {
    label: '开始日期',
    property: 'startTime',
    overflow: false,
    w: '200px',
    fixed: false,

    formatter: (v) => {
      if (v['startTime']) {
        return moment(v['startTime']).format('YYYY-MM-DD');
      }
      return '-';
    },

  }, {
    label: '结束日期',
    property: 'endTime',
    overflow: false,
    w: '200px',
    fixed: false,

    formatter: (v) => {
      if (v['endTime']) {
        return moment(v['endTime']).format('YYYY-MM-DD');
      }
      return '-';
    },
  },
  {
    label: '进度',
    property: 'totalProgress',
    overflow: false,
    w: '94px',
    fixed: false,
    formatter: (v) => {
      if (v['totalProgress']) {
        return v['totalProgress'] + '%';
      }
      return '-';
    },
  },

  {
    label: '实际完成日期',
    property: 'updateTime',
    overflow: false,
    w: '200px',
    fixed: false,
    formatter: (v) => {
      const h = vm.$createElement;
      const isTimeBefore = v['updateTime'] ? moment(v['updateTime']).isBefore(v['endTime']) || moment(v['updateTime']).isSame(v['endTime']) : true;

      return h('span', {
        style: {
          color: isTimeBefore ? '' : '#F56C6C',
        },
        domProps: {
          innerHTML: v['totalProgress'] === 100 ? v['updateTime'] : '-',
        },
      });
    },
  },
  {
    label: '附件',
    show: true,
    fixed: 'right',
    property: 'enclosure',
    formatter: (v) => {
      const num = stringifyToArr(v['enclosure']).length;
      return tableCellIconData(icons.file, num, v['enclosure'], attachment, '附件');
    },
  },
  // {
  //   label: '申请',
  //   property: 'applyNum',
  //   w: '60px',
  //   fixed: 'right',
  //   overflow: false,
  //   formatter: (v) => {
  //     return tableCellIconData(icons.apply, v['applyNum'], v, Application, '申请');
  //   },
  // },
  {
    label: '会议',
    property: 'meetingNum',
    w: '60px',
    overflow: false,
    fixed: 'right',

    formatter: (v) => {
      return tableCellIconDataDrawer(icons.metting, v['meetingNum'], v, MeetingList, '会议', drawerWidth.larger_pr);
    },
  }, {
    label: '合同/发票',
    property: 'contractNum',
    overflow: false,
    w: '110px',
    fixed: 'right',
    formatter: (v) => {
      return tableCellIconDataDrawer(icons.invoice, (v['contractNum']), v, contractList, '合同/发票', drawerWidth.larger_pr);
    },
  },
  {
    label: '操作',
    overflow: false,
    property: 'options',
    w: '320px',
    fixed: 'right',

  }];

