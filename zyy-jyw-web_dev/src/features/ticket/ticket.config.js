import { STATUS_SUCCESS_COLOR, GRAY_COLOR, } from '@/common/utils/color';
import { keyBy, } from 'lodash-es';

// 其他工单状态
export const OTHER_ORDER_STATE = [
  {
    label: '待评价',
    color: STATUS_SUCCESS_COLOR,
    state: 1,
  }, {
    label: '待审核',
    color: STATUS_SUCCESS_COLOR,
    state: 2,
  },
  {
    label: '已完成',
    color: GRAY_COLOR,
    state: 3,
  },
];

export const OTHER_ORDER_STATE_MAP = keyBy(OTHER_ORDER_STATE, 'state');

