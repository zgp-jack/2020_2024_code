
import { STATUS_SUCCESS_COLOR, STATUS_WARNING_COLOR, } from '@/common/utils/color';

// 角色状态
export const ROLE_TYPE = {
  0: {
    label: '正常',
    color: STATUS_SUCCESS_COLOR,
  },
  1: {
    label: '停用',
    color: STATUS_WARNING_COLOR,
  },
};
