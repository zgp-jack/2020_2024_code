/*
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-06-16 18:40:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 11:24:04
 * @FilePath: \ywt-vue\src\feat\system\otherSetting\api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Fetch from '@/utils/fetch';
/**
 * 查询所有系统配置
 */
const getSysconfiguration = () => Fetch.post('/sys/sysconfiguration/all', {});

/**
 * 顶级开关
*/
const mutexSwitch = ({
  parentType,
  type,
} = {}) => Fetch.post('/sys/sysconfiguration/mutexSwitch', {
  parentType,
  type,
});

/**
 * 保存或更新
*/
const saveOrUpdateItem = (
  {
    enable,
    parentType,
    type,
    typeValue,
  }
  = {}) => Fetch.post('/sys/sysconfiguration/saveOrUpdateItem',
  {
    enable,
    parentType,
    type,
    typeValue,
  }
);

/**
 * 分组查询
*/
const groupListAllByTopType = ({
  type,
}) => Fetch.post('/sys/sysconfiguration/groupListAllByTopType', {
  type,
});
// 坐席上下线配置详情
const seatConfigDetail = () => Fetch.post('/sys/sysconfiguration/getTimeConfig', {});
// 更新坐席上下线配置
const updateSeatConfig = ({
  delayTime,
  leadTime,
  delayTimeUnit,
  leadTimeUnit,
} = {}) => Fetch.post('/sys/sysconfiguration/timeConfig', {
  delayTime,
  leadTime,
  delayTimeUnit,
  leadTimeUnit,
});
// 更新告警消息配置
const updateWarningConfig = ({
  warningTime,
  unit,
  warningCount,
} = {}) => Fetch.post('/sys/sysconfiguration/orderWarningConfig', {
  warningTime,
  unit,
  warningCount,
});
// 告警消息配置详情
const warningConfigDetail = () => Fetch.post('/sys/sysconfiguration/getOrderWarningConfig', {});
// 获取故障分类响应时间
const getFaultTypeResponseTime = () => Fetch.post('/sys/sysconfiguration/getSysOrderFaultConfig', {});
// 设置故障分类响应时间
const setFaultTypeResponseTime = ({ id, minTime, maxTime, unit, } = {}) => Fetch.post('sys/sysconfiguration/sysOrderFaultConfig', { id, minTime, maxTime, unit, });
// 获取待派单时间设置
const getDecentTimeConfig = () => Fetch.post('/sys/sysconfiguration/getWaitDeliveryOrderAlertConfig', {});
// 设置待派单时间
const setDecentTimeConfig = ({ warningTime, unit, } = {}) => Fetch.post('/sys/sysconfiguration/waitDeliveryOrderAlertConfig', {
  warningTime,
  unit,
});
// 获取服务时效性评级规则
const getServeTimeLineessRatingRules = () => Fetch.post('/sys/sysconfiguration/getSysOrderFaultSection', {});
// 设置服务时效性评级规则
const setServeTimeLinesssRatingRules = ({
  minTimeSymbol,
  maxTimeSymbol,
} = {}) => Fetch.post('/sys/sysconfiguration/setSysOrderFaultSection', { minTimeSymbol, maxTimeSymbol, });

// 查询科室二维码配置
const getDepartmentQrCodeConfig = () => Fetch.post('/v1/get/system/other_config/dept_qrcode', {});
// 更新科室二维码配置
const setDepartmentQrCodeConfig = ({
  showAcceptDept,
  showCustomPhrase,
  customPhrase,
  acceptDept,
  qrSize,
  printDirection,
} = {}) => Fetch.post('/v1/post/system/other_config/dept_qrcode', {
  showAcceptDept,
  showCustomPhrase,
  customPhrase,
  acceptDept,
  qrSize,
  printDirection, });

// 更新工单科室列表
const setWorkOrderDepartment = (acceptDeptList) => Fetch.post('/v1/update/system/other_config/ticket/accept_dept', { acceptDeptList, });
// 查询工单科室列表
const getWorkOrderDepartment = () => Fetch.post('/v1/get/system/other_config/ticket/accept_dept', {});

/**
 * 获取项目任务工时
 */
const getProjectWorkTime = () => Fetch.post('/sysSystem/get', {
  key: 'MAX_WORK_TIME',
});
/**
 * 获取工单时间配置
 *  @param {String} from 接口来源（非接口字段，工单处理面板和工单信息面板都会调用，会被去重功能干掉一个，为了防止Ajax去重误杀，增加一个标识，使生成的md不同）
 */
const getTicketTimeConfig = (from) => Fetch.post('sysSystem/get', {
  key: 'ORDER_TIME_SETTING',
  from,
});
/**
 * 更新项目任务工时
 */
const updateProjectWorkTime = (value) => Fetch.post('/sysSystem/update', {
  key: 'MAX_WORK_TIME',
  value,
});

/**
 * 获取自动派单配置
 */
const getAutoDispatchConfig = () => Fetch.post('/v1/get/system/other_config/order/auto', {});
/**
 * 自动派单设置
 */
const setAutoDispatchConfig = (
  {
    /**
     * 抢单时间配置 0-720
     */
    acceptOrderTime,
    /**
       * 未接单数累计是否开启 1是 0否
       */
    notAccept,
    /**
       * 未接单数累计类型 1可为负数 0不可为负数
       */
    notAcceptType,
    /**
       * 是否开启自动派单 1是 0否
       */
    open,
    /**
       * 是否开启每日重置派单 1是 0否
       */
    reset,
    /**
       * 排班派单是否开启 1是 0否
       */
    schedule,
    /**
       * 接单阈值(他人可接)
       */
    scheduleOrderNum,
    /**
       * 排班派单类型 1值班人员接单 2非值班人员接单 3值班人员末位接单 4值班人员优先接单
       */
    scheduleType,
    /**
       * 是否开启去向派单跳过 1是 0否
       */
    skipWhereabouts,
    /**
       * 跳过的去向数据
       */
    whereaboutsList,
    // 派单模式优先级
    rulePri,
    // 派单模式 报修科室开关(1开 0关)
    orderRuleDept,
    // 派单模式 故障分类开关(1开 0关)
    orderRuleType,
  } = {}
) => Fetch.post('/v1/update/system/other_config/auto/order', {
  acceptOrderTime,
  notAccept,
  notAcceptType,
  open,
  reset,
  schedule,
  scheduleOrderNum,
  scheduleType,
  skipWhereabouts,
  whereaboutsList,
  rulePri,
  orderRuleDept,
  orderRuleType,
});
// 派单模式
const getDispatchMode = ({
  //  * 模式(1报修科室 2故障分类)
  mode,
  //  * 上级科室id
  parentDeptId,
  //  * 上级故障id
  parentTypeId,
}) => Fetch.post('/v1/get/system/other_config/order/rule', {
  mode,
  parentDeptId,
  parentTypeId,
});
// 设置派单模式
const setDispatchMode = ({
  //  * 报修科室
  deptId,
  //  * 故障类型
  faultType,
  //  * 小组id
  sendTeam,
  //  * 派单类型
  sendType,
  //  * 用户id
  sendUser,
} = {}) => Fetch.post('/v1/post/system/other_config/order/rule', {
  deptId,
  faultType,
  sendTeam,
  sendType,
  sendUser,
});

/** ******************** 大屏配置 ************************/
// 查询大屏配置
const getBigScreenConfig = () => Fetch.post('/v1/get/system/other_config/big_screen', {});
// 更新大屏配置
const setBigScreenConfig = (
  {
    interval,
    showItems,
    startTime,
    endTime,
  } = {}
) => Fetch.post('/v1/update/system/other_config/big_screen', {
  interval,
  showItems,
  startTime,
  endTime,
});
// 工单时间配置
const setWorkTimeConfig = (data) => Fetch.post('/sysSystem/update', data);
// 工单时间获取
const getWorkTimeConfig = () => Fetch.post('/sysSystem/get', { key: 'ORDER_TIME_SETTING', });

export default {
  getSysconfiguration,
  mutexSwitch,
  saveOrUpdateItem,
  groupListAllByTopType,
  seatConfigDetail,
  updateSeatConfig,
  updateWarningConfig,
  warningConfigDetail,
  getFaultTypeResponseTime,
  setFaultTypeResponseTime,
  getDecentTimeConfig,
  setDecentTimeConfig,
  getServeTimeLineessRatingRules,
  setServeTimeLinesssRatingRules,
  getDepartmentQrCodeConfig,
  setDepartmentQrCodeConfig,
  setWorkOrderDepartment,
  getWorkOrderDepartment,
  getProjectWorkTime,
  updateProjectWorkTime,
  getAutoDispatchConfig,
  setAutoDispatchConfig,
  getDispatchMode,
  setDispatchMode,
  /** 大屏配置 */
  getBigScreenConfig,
  setBigScreenConfig,
  getTicketTimeConfig,
  getWorkTimeConfig,
  setWorkTimeConfig,
};
