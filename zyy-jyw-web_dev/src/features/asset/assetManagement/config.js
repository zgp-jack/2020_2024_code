// 资产转移-审核状态

import { GRAY_COLOR, STATUS_FAIL_COLOR, STATUS_SUCCESS_COLOR, } from '@/common/utils/color';
import { keyBy, } from 'lodash-es';

// 资产转移审核状态
export const ASSET_TRANSFER_AUDIT_STATE = [
  {
    state: 0,
    label: '未审核',
    color: GRAY_COLOR,
  },
  {
    state: 1,
    label: '驳回',
    color: STATUS_FAIL_COLOR,

  },
  {
    state: 2,
    label: '已完成',
    color: STATUS_SUCCESS_COLOR,

  },
];
// 资产借用状态 (1:待审核,2:驳回,3:待归还,4:已归还)
export const ASSET_BORROW_STATE = [
  {
    state: 1,
    label: '待审核',
    color: GRAY_COLOR,
  },
  {

    state: 2,
    label: '驳回',
    color: STATUS_FAIL_COLOR,

  },
  {
    state: 3,
    label: '待归还',
    color: STATUS_FAIL_COLOR,

  },
  {
    state: 4,
    label: '已归还',
    color: STATUS_SUCCESS_COLOR,
  },
];

// export const ASSET_DISPOSE_TYPE

export const ASSET_TRANSFER_AUDIT_STATE_MAP = keyBy(ASSET_TRANSFER_AUDIT_STATE, 'state');
export const ASSET_BORROW_STATE_MAP = keyBy(ASSET_BORROW_STATE, 'state');
