import vm from '@/main';
import store from '@/store';
import payProcess from '../components/payProcess.vue';
import billProcess from '../components/billProcess.vue';
import ItemSet from '@/views/project/components/panelsGroup/itemSet.vue';
import Research from '@/views/project/components/panelsGroup/research.vue';

import _ from 'lodash';
import { Loading, } from 'element-ui';
import { formatCash, } from '@/filters';
import ProjectAPI from '@/apis/project';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';

const h = vm.$createElement;
// /支付状态(1未支付2部份支付3全部支付)
export const pay_status = {
  '1': {
    color: '#F56C6C',
    memo: '红色',
    text: ['未开', '未付'],
    code: 1,
  },
  '2': {
    color: '#E6A23C',
    memo: '黄色',
    text: ['部分已开', '部分支付'],
    code: 2,
  },
  '3': {
    color: '#67C23A',
    memo: '绿色',
    text: ['全部已开', '全部支付'],
    code: 3,
  },
};
const panelArguments = {
  ItemSet: {
    width: '844px',
    null: {
      width: '844px',
    },
    end_termination: {
      width: '844px',

    },
    item_program_review: {
      width: '844px',
    },
    item_establish: {
      width: '1420px',
    },
    program_review_reject: {
      width: '844px',
    },
    implement_start: {
      width: '844px',
    },
    implement_over: {
      width: '844px',
    },
    item_before_project: {
      width: '844px',
    },
    end_project: {
      width: '844px',
    },
    reject_end: {
      width: '844px',
    },
    props: {
      title: '新增项目',
      hiddenSaveButton: true,
      showFooter: true,
    },
  },
  Research: {
    width: '1420px',
    item_establish: {
      width: '1420px',
    },
    props: {
      title: '调研',
      hiddenSaveButton: true,
      showFooter: true,
    },
  },
  EditLookOrder: {
    width: '1440px',
    item_program_review: {
      width: '1440px',
    },
    item_before_project: {
      width: '1440px',
    },
    implement_over: {
      width: '1440px',
    },
    props: {
      title: '评审',
      hiddenSaveButton: true,
      showFooter: true,
    },
  },
};
const perview = async function (code) {
  const loading = Loading.service({
    fullscreen: true,
    text: '请求中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const rs = (await ProjectAPI.setUp.getListData({ pageNum: 1, pageSize: 1, code: 'all', query: code, })).list || [];
  const allData = await ProjectAPI.setUp.reviewInfo(code);
  await store.dispatch('project/index/FETCH_PANEL_DATA', allData);

  const type = rs[0].showState || '';
  let componentName = '';
  let component = null;
  store.commit('project/index/SET_RESEARCH_INFO', rs[0]);

  store.commit('project/index/SET_ITEM_CODE', code,);
  store.commit('project/index/SET_PANCEL_DISABLED', { name: 'needInfo', disabled: true, });
  store.commit('project/index/SET_PANCEL_DISABLED', { name: 'needInfo', disabled: true, });
  store.commit('project/index/SET_PANCEL_DISABLED', { name: 'researchViewPlan', disabled: true, });
  store.commit('project/index/SET_PANCEL_DISABLED', { name: 'projectInfo', disabled: true, });
  store.commit('project/index/SET_PANCEL_DISABLED', { name: 'researchInfo', disabled: true, });
  store.commit('project/index/SET_LOOK_TASK', true);

  const searchResult = [
    {
      memo: '(方案编辑 => 需求 + 调研)/',
      type: ['item_establish'],
      componentName: 'Research',
    },
    {
      memo: '(项目实施)/(项目结束)/(方案制定=> 评审)',
      type: [
        'implement_start',
        'item_before_project',
        'item_program_review',
        'implement_over',
        'reject_end',
        'end_termination'
      ],
      componentName: 'ItemSet',
    }
  ];
  for (const i of searchResult) {
    if (i.type.includes(type)) {
      componentName = i.componentName;
      break;
    } else {
      componentName = 'ItemSet';
    }
  }
  // debugger;
  panelArguments[componentName].props.title = '查看';
  panelArguments[componentName].props.showFooter = false;
  if (
    [
      'item_before_project',
      'program_review_reject',
      'end_project',
      'implement_over',
      'item_program_review',
      'implement_start',
      null,
      'null',
      'reject_end',
      'end_termination'
    ].includes(type)
  ) {
    if (allData.demand) {
      panelArguments[componentName][type].width = '1420px';
    } else {
      panelArguments[componentName][type].width = '844px';
    }
  }
  component = componentName === 'ItemSet' ? ItemSet : Research;
  loading.close();
  vm.$drawer({
    width: panelArguments[componentName][type].width,
    component: () => {
      return h(component, {
        props: panelArguments[componentName].props,
        on: {
          done: () => {
          },
          save: () => {
          },
        },
      });
    },
  });
};

const tableConfig = [{
  type: 'index',
  label: '序号',
  width: '60px',
}, {
  prop: 'name',
  label: '合同名称',
}, {
  prop: 'itemCode',
  label: '所属项目',
  width: '200px',

  formatter: (v) => {
    const list = store.state['contract/index'].itemList;
    const data = _.find(list, { itemCode: v['itemCode'], });
    const title = data?.title || '-';
    return h(DemandOrProjectName, {
      props: {
        data: data,
        isLinkTag: true,
        isOverFlow: false,
      },
      on: {
        onLink: () => {
          if (title !== '-') {
            perview(v['itemCode']);
          }
        },
      },
    });
  },
}, {
  prop: 'state',
  label: '付款情况',
  children: [{
    prop: 'contractPrice',
    label: '应付(元)',
    formatter: (v) => {
      return formatCash(v['contractPrice']);
    },
  }, {
    prop: 'paidPrice',
    label: '已付(元)',
    formatter: (v) => {
      return formatCash(v['paidPrice']);
    },

  }, {
    prop: 'unpaidPrice',
    label: '待付(元)',
    formatter: (v) => {
      return formatCash(v['unpaidPrice']);
    },
  }, {
    prop: 'payState',
    label: '付款状态',
    formatter: (v) => {
      if (v['payState'] === 1) {
        return vm.$createElement('span', {
          style: {
            color: pay_status[v['payState']].color,
          },
          domProps: {
            innerHTML: pay_status[v['payState']].text[1],
          },
        });
      }
      return vm.$createElement(payProcess, {
        props: {
          value: v['payState'],
          id: v['id'],
        },
      });
    },
  }],
}, {
  label: '开票情况',
  children: [{
    prop: 'contractPrice',
    label: '应开(元)',
    formatter: (v) => {
      return formatCash(v['contractPrice']);
    },
  }, {
    prop: 'paidReceiptPrice',
    label: '已开(元)',
    formatter: (v) => {
      return formatCash(v['paidReceiptPrice']);
    },
  }, {
    prop: 'unpaidReceiptPrice',
    label: '待开(元)',
    formatter: (v) => {
      return formatCash(v['unpaidReceiptPrice']);
    },
  }, {
    prop: 'receiptState',
    label: '开票状态',
    formatter: (v) => {
      // return renderStatus(v['receiptState']);
      if (v['receiptState'] === 1) {
        return vm.$createElement('span', {
          style: {
            color: pay_status[v['receiptState']].color,
          },
          domProps: {
            innerHTML: pay_status[v['receiptState']].text[0],
          },
        });
      }
      return vm.$createElement(billProcess, {
        props: {
          contractPrice: v['contractPrice'],
          state: v['receiptState'],

          id: v['id'],
        },
      });
    },
  }],
},
{
  label: '操作',
  width: '248px',
  slot: true,
}];

export default tableConfig;
