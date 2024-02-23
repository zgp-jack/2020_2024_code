
import {
  STATUS_FAIL_COLOR,
  STATUS_SUCCESS_COLOR,
  STATUS_TRANSPARENT_COLOR,
  STATUS_WARNING_COLOR,
} from '@/common/utils/color';
// 电话类型
export const CALL_TYPE = {
  0: {
    label: '已接',
    color: STATUS_SUCCESS_COLOR,
  },
  1: {
    label: '呼出',
    color: STATUS_WARNING_COLOR,
  },
  2: {
    label: '未接',
    color: STATUS_FAIL_COLOR,
  },
  'null': {
    label: '-',
    color: STATUS_TRANSPARENT_COLOR,
  },

};
