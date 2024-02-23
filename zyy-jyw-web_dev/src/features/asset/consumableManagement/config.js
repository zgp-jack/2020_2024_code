import { keyBy, } from 'lodash-es';
// 耗材申领审核状态 (0待审核 1驳回 2通过)
export const CONSUMABLE_APPLAY_AUDIT_STATE = [
  {
    label: '待审核',
    state: 0,
  }, {
    label: '驳回',
    state: 1,
  }, {
    label: '通过',
    state: 2,
  },
];

// 耗材库存情况
export const CONSUMABLE_RESERVE_STATE = [
  {
    label: '正常',
    state: 1,
  },
  {
    label: '达到预警值',
    state: 2,
  },
  {
    label: '无库存',
    state: 3,
  },
];

export const CONSUMABLE_APPLAY_AUDIT_STATE_MAP = keyBy(CONSUMABLE_APPLAY_AUDIT_STATE, 'state');
