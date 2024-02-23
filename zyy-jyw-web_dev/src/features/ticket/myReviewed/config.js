import { STATUS_SUCCESS_COLOR, STATUS_WARNING_COLOR, } from '@/common/utils/color';

export const PROCESS_VALUE = {
  'end_examine': {
    color: STATUS_SUCCESS_COLOR,
    label: '已通过',
  },
  'no_examine': {
    color: STATUS_WARNING_COLOR,
    label: '已驳回',
  },
};
