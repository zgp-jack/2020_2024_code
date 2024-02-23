import { member, } from '@/filters';
import vm from '@/main';
import moment from 'moment';
import store from '@/store';
const h = vm.$createElement;
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';

const filter_dic = function (val, key = 'itemProcessShow') {
  if (!val) {
    return '-';
  }

  const dicList = store.state['dictionary'][key];
  if (dicList?.length) {
    const value = dicList.find((current, index,) => {
      return current.value === val;
    });
    return value;
  }
  return {};
};

const title = function (rows) {
  return h(DemandOrProjectName, {
    props: {
      data: rows,
      isLinkTag: true,
    },
    on: {
      onLink: function () {
        if (rows.type === 1) {
          vm.$router.push({
            name: 'XmXqgl',
            params: {
              itemCode: rows.itemCode,
              showState: rows.showState,
              principal: rows.principal * 1,
            },
          });
        } else {
          vm.$router.push({
            name: 'XmXmlxps',
            params: {
              itemCode: rows.itemCode,
              showState: rows.showState,
              principal: rows.principal * 1,
            },
          });
        }
      },
    },
  });
};

export const tableConfig = [
  {
    label: '序号',
    w: '85px',
    type: 'index',
    fixed: false,
    align: 'center',

  },
  {
    label: '需求/项目名称',
    property: 'title',
    w: '200px',
    fixed: false,
    overflow: true,
    align: 'left',
    formatter: (v) => {
      return title(v);
    },
  }, {
    label: '负责人/责任人',
    property: 'principal',
    w: '140px',
    overflow: true,
    fixed: false,
    align: 'center',

    formatter: (v) => {
      return member(v.principal);
    },
  }, {
    label: '参与人员',
    property: 'users',
    overflow: true,
    w: '302px',
    align: 'center',

    fixed: false,
    formatter: (v) => {
      return member(v.users) || '-';
    },
  },
  {
    label: '提出/开始日期',
    property: 'startTime',
    overflow: true,
    w: '220px',
    align: 'center',

    fixed: false,
    formatter: (v) => {
      if (v['startTime']) {
        return moment(v['startTime']).format('YYYY-MM-DD');
      }
      return '-';
    },
  }, {
    label: '期望完成/结束日期',
    property: 'endTime',
    overflow: true,
    w: '220px',
    align: 'center',

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
    overflow: true,
    w: '94px',
    align: 'center',

    fixed: false,
    formatter: (v) => {
      if (v['totalProgress']) {
        return v['totalProgress'] + '%';
      }
      return '-';
    },
  },
  {
    label: '状态',
    property: 'showState',
    overflow: true,
    w: 'auto',
    fixed: false,
    align: 'center',

    formatter: (v) => {
      const value = filter_dic(v['showState']);
      return value?.name || '-';
    },
  },
  {
    label: '操作',
    overflow: true,
    property: 'options',
    w: 'auto',
    // w: '360px',
    align: 'center',
    fixed: 'right',

  }
];

