/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-16 16:13:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-23 10:47:07
 * @Description:巡检模板
 */
import Fetch from '@/utils/fetch';

/**
 * 获取巡检模板列表
 * @param {
 *  deptId 科室id  不传为获取所有模板
 * }
 * @returns
 */
const list = (deptId = null) => Fetch.post('/busPatrolTemplate/getTemplates', {
  deptId,
});
/**
 * 模板列表
 * @param {
 *  pageSize
 *  pageNum
 *  query
 *
 * } param0
 * @returns
 */
const tempList = ({
  pageSize,
  pageNum,
  query,
} = {}) => Fetch.post('/bus/inspection/temp/page', {
  pageSize,
  pageNum,
  query,
});
/**
 * 模板下拉列表
 * @param {
 *  query 查询模版名称
 * } param0
 * @returns
 */
const tempListForSelect = ({
  query,
} = {}) => Fetch.post('/bus/inspection/temp/list', {
  query,
});
/**
 * 获取模板详情
 * @param {*} id 模版ID
 * @returns
 */
const detail = (id) => Fetch.post('/bus/inspection/temp/get', {
  id,
});
/**
 * 新增模板
 * @param {
 *  name  模版名称（长度限定50）
 *  deptId 科室
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 频次单位（数据字典：frequencyUnit）
 *  hasImage 必须上传照片（1【默认】：是，0：否）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *
 *
 * } param0
 * @returns
 */
const create = ({
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
} = {}) => Fetch.post('/bus/inspection/temp/save', {
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
});
/**
 * 快速开启/禁用模板
 * @param {
 *  state 是否启用（1【默认】：启用，0：关闭）
 *  id
 * } param0
 * @returns
 */
const changeState = ({
  state,
  id,
} = {}) => Fetch.post('/bus/inspection/temp/openOrClose', {
  state,
  id,
});
/**
 * 修改模板
 * @param {
 *  id
 *  name  模版名称（长度限定50）
 *  deptId 科室
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 频次单位（数据字典：frequencyUnit）
 *  hasImage 必须上传照片（1【默认】：是，0：否）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *  isEffect 是否立即生效（1：是，0【默认】：否）
 *
 * } param0
 * @returns
 */
const update = ({
  id,
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
  isEffect,
} = {}) => Fetch.post('/bus/inspection/temp/update', {
  id,
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
  isEffect,
});
/**
 * 删除巡检内容
 * @param  {} id 内容ID
 */
const delTempContent = (id) => Fetch.post('/bus/inspection/temp/details/delete', {
  id,
});
/**
 * 添加巡检内容（数值)
 * @param {
 * tempId 模版ID
 * inspectionType 巡检分类（长度限定：50）
 * state 是否启用（1【默认】：是，0：否）
 * inspectionRemark 巡检内容（长度限定：50）
 * isWrite 填写实测值（1【默认】：是，0：否）
 * minValue 值域最小值
 * maxValue 值域最大值
 * valueUnit 值域单位（字典：valueUnit）
 * defaultValue 默认值
 * exceptionValue 异常值域 JSON
 *
 * } param0
 * @returns
 */
const addTempValueContent = ({
  tempId,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  minValue,
  maxValue,
  valueUnit,
  defaultValue,
  exceptionValue,
} = {}) => Fetch.post('/bus/inspection/temp/details/saveValue', {
  tempId,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  minValue,
  maxValue,
  valueUnit,
  defaultValue,
  exceptionValue,
});
/**
 * 修改巡检内容（数值)
 * @param {
 * id 内容ID
 * inspectionType 巡检分类（长度限定：50）
 * state 是否启用（1【默认】：是，0：否）
 * inspectionRemark 巡检内容（长度限定：50）
 * isWrite 填写实测值（1【默认】：是，0：否）
 * minValue 值域最小值
 * maxValue 值域最大值
 * valueUnit 值域单位（字典：valueUnit）
 * defaultValue 默认值
 * exceptionValue 异常值域 JSON
 *
 * } param0
 * @returns
 */
const updateTempValueContent = ({
  id,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  minValue,
  maxValue,
  valueUnit,
  defaultValue,
  exceptionValue,
} = {}) => Fetch.post('/bus/inspection/temp/details/updateValue', {
  id,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  minValue,
  maxValue,
  valueUnit,
  defaultValue,
  exceptionValue,
});
/**
  * 添加巡检内容（选项)
 * @param {
 * tempId 模版ID
 * inspectionType 巡检分类（长度限定：50）
 * state 是否启用（1【默认】：是，0：否）
 * inspectionRemark 巡检内容（长度限定：50）
 * isWrite 填写实测值（1【默认】：是，0：否）
 * chooseValue 值域（多个用逗号拼接）
 * chooseDefault 默认值
 * chooseException 异常值域（多个逗号拼接）
 *
 */
const addTempOptionContent = ({
  tempId,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  chooseValue,
  chooseDefault,
  chooseException,
} = {}) => Fetch.post('/bus/inspection/temp/details/saveChoose', {
  tempId,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  chooseValue,
  chooseDefault,
  chooseException,
});
/**
  * 修改巡检内容（选项)
 * @param {
 * id 内容ID
 * inspectionType 巡检分类（长度限定：50）
 * state 是否启用（1【默认】：是，0：否）
 * inspectionRemark 巡检内容（长度限定：50）
 * isWrite 填写实测值（1【默认】：是，0：否）
 * chooseValue 值域（多个用逗号拼接）
 * chooseDefault 默认值
 * chooseException 异常值域（多个逗号拼接）
 *
 */
const updateTempOptionContent = ({
  id,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  chooseValue,
  chooseDefault,
  chooseException,
} = {}) => Fetch.post('/bus/inspection/temp/details/updateChoose', {
  id,
  inspectionType,
  state,
  inspectionRemark,
  isWrite,
  chooseValue,
  chooseDefault,
  chooseException,
});
/**
 * 通过资产类型查询关联模板
 * @param {
 *
 *  assetsType 资产类型（不填为全部）
 *  query
 *  pageSize
 *  pageNum
 * } param0
 * @returns
 */
const relatedListByPropType = ({
  assetsType = null,
  query,
  pageSize = 9999,
  pageNum = 0,
} = {}) => Fetch.post('/bus/inspection/plan/assets/page', {
  assetsType,
  query,
  pageSize,
  pageNum,
});
/**
 * 关联资产
 * @param {
 *  tempId 模版ID，从《模版下拉列表》获取
 *  inspectionAsset 资源ID
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 周期单位（数据字典：frequencyUnit）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *  isAllowance 【备用，后期迭代】是否有宽限期
 *  allowanceTime 【备用，后期迭代】宽限时间【1m（1分钟），1h（1小时），1d（1天），1w（1周），1M（1月）】
 *  skipWeek 是否跳过周末（1【默认】：是，0：否）
 *  skipHoliday 是否跳过法定节假日（1【默认】：是，0：否）
 *  startTime 开始时间（默认当天）
 *  endTime 结束时间
 *  details 巡检内容启用与实测值JSON （detailsId【内容ID】，state【是否启用，1（默认）启用，0未启用】，isWrite【是否要求填写，1（默认）是，0否】）
 *  sendDept 计划执行科室（三选一）
 *  sendTeam 计划执行小组（三选一）
 *  sendUser 计划执行人员（三选一）
 *
 * } param0
 * @returns
 */
const relateProperty = ({
  tempId,
  inspectionAsset,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  state,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendTeam,
  sendUser,
} = {}) => Fetch.post('/bus/inspection/plan/assets/bind', {
  tempId,
  inspectionAsset,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  state,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendTeam,
  sendUser,
});
/**
 * 关联资产修改
 * @param {
 *  id 计划ID
 *  tempId 模版ID，从《模版下拉列表》获取
 *  inspectionAsset 资源ID
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 周期单位（数据字典：frequencyUnit）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *  isAllowance 【备用，后期迭代】是否有宽限期
 *  allowanceTime 【备用，后期迭代】宽限时间【1m（1分钟），1h（1小时），1d（1天），1w（1周），1M（1月）】
 *  skipWeek 是否跳过周末（1【默认】：是，0：否）
 *  skipHoliday 是否跳过法定节假日（1【默认】：是，0：否）
 *  startTime 开始时间（默认当天）
 *  endTime 结束时间
 *  details 巡检内容启用与实测值JSON （detailsId【内容ID】，state【是否启用，1（默认）启用，0未启用】，isWrite【是否要求填写，1（默认）是，0否】）
 *  sendDept 计划执行科室（三选一）
 *  sendTeam 计划执行小组（三选一）
 *  sendUser 计划执行人员（三选一）
 *
 * } param0
 * @returns
 */
const relatedPropertyUpdate = ({
  id,
  tempId,
  inspectionAsset,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  state,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendTeam,
  sendUser,
} = {}) => Fetch.post('/bus/inspection/plan/assets/update', {
  id,
  tempId,
  inspectionAsset,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  state,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendTeam,
  sendUser,
});
/**
 * 获取资产绑定模版详情
 * @param {*} id
 * @returns
 */
const relatedPropertyDetail = (id) => Fetch.post('/bus/inspection/plan/assets/get', {
  id,
});
/**
 * 巡检单元关联列表
 * @param {
 * unitFolder 巡检单元（不填为全部）
 * query
 * pageSize
 * pageNum
 * }
 * @returns
 */
const relatedListByInspUnit = ({
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/inspection/plan/unit/page', {
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
});
/**
 * 创建巡检单元
 * @param {
 * code 编号（长度限定50）
 * name 名称（长度限定50）
 * parentId 父节点《单元维护列表》
 * useDept 使用科室
 * useUser 使用责任人
 * maintainDept 维护科室
 * maintainUser 维保责任人
 * remark
 备注（长度限定：255）
 *
 *
 * } param0
 * @returns
 */
const createInspUnit = ({
  code,
  name,
  parentId,
  useDept,
  useUser,
  maintainDept,
  maintainUser,
  remark,
  sendDept,
  sendUser,
  sendTeam,
  startTime,
  endTime,
  skipWeek,
  skipHoliday,
  allowanceTime,

} = {}) => Fetch.post('/bus/inspection/plan/unit/save', {
  code,
  name,
  parentId,
  useDept,
  useUser,
  maintainDept,
  maintainUser,
  remark,
  sendDept,
  sendUser,
  sendTeam,
  startTime,
  endTime,
  skipWeek,
  skipHoliday,
  allowanceTime,
});
/**
 * 创建巡检单元并添加巡检模板
 * @param {
 * code 编号（长度限定50）
 * name 名称（长度限定50）
 * parentId 父节点《单元维护列表》
 * useDept 使用科室
 * useUser 使用责任人
 * maintainDept 维护科室
 * maintainUser 维保责任人
 * remark
 * tempId 模版ID，从《模版下拉列表》获取
 * frequencyTimer  频次
 * frequencyInterval 周期
 * frequencyUnit 周期单位（数据字典：frequencyUnit）
 * errorMake 巡检异常办法（字典：errorMake）
 * } param0
 * @returns
 */
const createInspUnitWithTemp = ({
  code,
  name,
  parentId,
  useDept,
  useUser,
  maintainDept,
  maintainUser,
  remark,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  sendDept,
  sendUser,
  sendTeam,
  startTime,
  endTime,
  skipWeek,
  skipHoliday,
  allowanceTime,
} = {}) => Fetch.post('/bus/inspection/plan/unit/saveBind', {
  code,
  name,
  parentId,
  useDept,
  useUser,
  maintainDept,
  maintainUser,
  remark,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  sendDept,
  sendUser,
  sendTeam,
  startTime,
  endTime,
  skipWeek,
  skipHoliday,
  allowanceTime,
});
/**
 * 巡检单元详情（包括绑定的模版）
 * @param {*} id 巡检单元ID
 * @returns
 */
const relatedUnitDetail = (id) => Fetch.post('/bus/inspection/plan/unit/get', {
  id,
});
export default {
/**
 * 模板设置
 */
  list,
  tempList,
  tempListForSelect,
  detail,
  create,
  changeState,
  update,
  addTempValueContent,
  updateTempValueContent,
  addTempOptionContent,
  updateTempOptionContent,
  delTempContent,
  /**
 * 关联模板
 */
  relatedListByPropType,
  relateProperty,
  relatedPropertyUpdate,
  relatedPropertyDetail,

  relatedListByInspUnit,
  createInspUnit,
  createInspUnitWithTemp,
  relatedUnitDetail,
};
