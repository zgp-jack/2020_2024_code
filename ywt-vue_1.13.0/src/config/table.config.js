import { phoneState, deptId, staffId, orderState, degree, range, source, } from '@/filters';
import store from '@/store';
const infoTypeFilter = {
  type: [{
    text: '已回拨',
    value: 3,
  }, {
    text: '未接',
    value: 2,
  }, {
    text: '已接',
    value: 0,
  }, {
    text: '拨出',
    value: 1,
  }],
};
const faultDegreeFilter = {
  type: store.state.dictionary.degreeList.map(e => {
    return {
      text: e.name,
      value: e.value,
    };
  }),
};
/**
 * 生成筛选配置
 * @param {*} name 字典名
 */
const genDicFilter = (name) => ({
  type: store.state.dictionary[name + 'List'].map(e => {
    return {
      text: e.name,
      value: e.value,
    };
  }),
});
const userFilter = {
  type: [{
    text: store.state.login.userInfo.name,
    value: store.state.login.userInfo.id,
  }],
};
const faultProcessState = {
  type: [{
    text: '待接单',
    value: 'create/forward',
  },
  {
    text: '处理中',
    value: 'receiving/assist/not_complete/suspend/open_suspend/forward/open_termination',
  },
  {
    text: '未派单',
    value: 'start/back',
  }, {
    text: '已完成',
    value: 'close',
  }, {
    text: '暂停处理',
    value: 'suspend',
  }, {
    text: '待评价',
    value: 'end_examine',
  }, {
    text: '待审核',
    value: 'complete',
  }, {
    text: '终止',
    value: 'end_termination',
  }, {
    text: '审核未通过',
    value: 'no_examine',
  }, {
    text: '电话已解决',
    value: 'end_phone',
  }],
};

export const fields = {
  'state': {
    computed: (val) => phoneState(val),
    class: (val) => `phoneState-${val}`,
  },

  'info.createTime': {
    computed: (val) => val,
  },
  'type': {
    computed: (val) => phoneState(val),
    filters: infoTypeFilter,
  },
  'info.deptId': {
    computed: (val) => {
      // 服务端返回的数据结构存在问题 ，导致一直进入死循环
      return deptId(val);
    },
  },
  'info.user': {
    computed: (val) => staffId(val),
  },
  'info.receptionToName': {
    computed: (val) => staffId(val) || val,
  },
  'fault.processState': {
    computed: (val) => orderState(val),
    class: (val) => `orderState-${val}`,

    filters: faultProcessState,
  },
  'fault.degree': {
    computed: (val) => degree(val),
    class: (val) => `degree-${val}`,
    filters: faultDegreeFilter,
  },
  'fault.rangeType': {
    computed: (val) => range(val),
    filters: genDicFilter('range'),
  },
  'fault.source': {
    computed: (val) => source(val),
    filters: genDicFilter('source'),
  },
  'fault.sendUser': {
    computed: (val) => staffId(val),
  },
  'fault.createUser': {
    computed: (val) => staffId(val),
    filters: userFilter,
  },
  'make.makeUser': {
    computed: (val) => staffId(val),
  },
  'info.recording': {
    isComponent: true,
    computed: (val) => {
      if (val) {
        return val;
      }
      return '';
    },
  },
  'info.phone': {
    computed: (val) => val,
  },
  'fault.faultRemark': {
    computed: (val) => val,
  },
  'info.linkedType': {
    computed: (val) => val,
  },

};

