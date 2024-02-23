import { GRAY_COLOR, STATUS_FAIL_COLOR, STATUS_SUCCESS_COLOR, } from '@/common/utils/color';
import { keyBy, } from 'lodash-es';

// 巡检结果
export const INSPECTION_RESULT = [
  {
    label: '正常',
    color: STATUS_SUCCESS_COLOR,
    state: 1,
  }, {
    label: '异常',
    color: STATUS_FAIL_COLOR,
    state: 2,
  },
];
// 异常处理办法
export const INSPECTION_HANDLE_METHOD = [
  {
    label: '限期整改',
    color: STATUS_SUCCESS_COLOR,
    state: 1,
  }, {
    label: '转工单',
    color: STATUS_FAIL_COLOR,
    state: 2,
  },
];
// 整改状态
export const INSPECTION_RECTIFY_STATUS = [
  {
    label: '超时未整改',
    color: STATUS_FAIL_COLOR,
    state: -1,
  },
  {
    label: '未整改',
    color: STATUS_FAIL_COLOR,
    state: 0,
  }, {
    label: '已整改',
    color: STATUS_SUCCESS_COLOR,
    state: 1,
  },
];
// 巡检项配置 是否 配置
export const INSPECTION_CONFIG_ITEM_SETTING = [

  {
    label: '是',
    color: STATUS_FAIL_COLOR,
    state: 1,
  },
  {
    label: '否',
    color: STATUS_FAIL_COLOR,
    state: 0,
  },

];
// 巡检项类型
export const INSPECTION_CONFIG_ITEM_TYPE = [
  {
    label: '数值型',
    value: 1,
  }, {
    label: '选项型',
    value: 2,
  },
];
// 巡检项是否启用
export const INSPECTION_CONFIG_ITEM_ENBALE = [
  {
    value: 1,
    label: '启用',
  }, {
    value: 0,
    label: '禁用',
  },
];
// 巡检计划状态 （1已启用 2已停用 3已失效 4未配置）
export const INSPECTION_PLAN_STATUS = [
  {
    state: 1,
    label: '已启用',
    color: STATUS_SUCCESS_COLOR,
  }, {
    state: 2,
    label: '已停用',
    color: STATUS_FAIL_COLOR,
  }, {
    state: 3,
    label: '已失效',
    color: STATUS_FAIL_COLOR,
  }, {
    state: 4,
    label: '未配置',
    color: GRAY_COLOR,
  },
];

// 巡检项配置-资产类型
export const INSPECTION_CONFIG_ASSET_TYPE = '1';
// 巡检项配置-巡检单元
export const INSPECTION_CONFIG_INSPECTION_UNIT = '2';

export const INSPECTION_HANDLE_METHOD_MAP = keyBy(INSPECTION_HANDLE_METHOD, 'state');
export const INSPECTION_RESULT_MAP = keyBy(INSPECTION_RESULT, 'state');
export const INSPECTION_RECTIFY_STATUS_MAP = keyBy(INSPECTION_RECTIFY_STATUS, 'state');
export const INSPECTION_CONFIG_ITEM_SETTING_MAP = keyBy(INSPECTION_CONFIG_ITEM_SETTING, 'state');
export const INSPECTION_CONFIG_ITEM_TYPE_MAP = keyBy(INSPECTION_CONFIG_ITEM_TYPE, 'value');
export const INSPECTION_CONFIG_ITEM_ENBALE_MAP = keyBy(INSPECTION_CONFIG_ITEM_ENBALE, 'value');
export const INSPECTION_PLAN_STATUS_MAP = keyBy(INSPECTION_PLAN_STATUS, 'state');
