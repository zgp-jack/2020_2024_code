/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 15:26:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-01 10:37:23
 * @Description:台账管理API
 */
import Fetch from '@/utils/fetch';
/**
 * 资产登记
 * @param {Array} {
 * }
 * @returns
 */
const register = ({
  name,
  model,
  seriesNumb,
  useDate,
  years,
  equipmentState,
  assetsType,
  assetsSource,
  outLinked,
  isAutoCode,
  codePrefix,
  assetsCode,
  isPublic,
  isMetering,
  meteringTimer,
  useDept,
  place,
  personLiable,
  isMaintain,
  maintainTerm,
  maintainCompany,
  maintainUser,
  isPatrol,
  patrolTemp,
  patrolDept,
  remark,
  enclosure,
  purchaseCode,
  projectName,
  purchaseDate,
  purchasePrice,
  purchaseNumber,
  brand,
  manufacturer,
  supplier,
  manufacturerPhone,
  salesPhone,
  originPlace,
  ipPlace,
  macPlace,
  operatingSystem,
  systemVersion,
  isGenuine,
  configuration,
  amount,
  sendUser,
  sendTeam,
  pertainUnit,
} = {}) => Fetch.post('/bus/assets/save', {
  name,
  model,
  seriesNumb,
  useDate,
  years,
  equipmentState,
  assetsType,
  assetsSource,
  outLinked,
  isAutoCode,
  codePrefix,
  assetsCode,
  isPublic,
  isMetering,
  meteringTimer,
  useDept,
  place,
  personLiable,
  isMaintain,
  maintainTerm,
  maintainCompany,
  maintainUser,
  isPatrol,
  patrolTemp,
  patrolDept,
  remark,
  enclosure,
  purchaseCode,
  projectName,
  purchaseDate,
  purchasePrice,
  purchaseNumber,
  brand,
  manufacturer,
  supplier,
  manufacturerPhone,
  salesPhone,
  originPlace,
  ipPlace,
  macPlace,
  operatingSystem,
  systemVersion,
  isGenuine,
  configuration,
  amount,
  sendUser,
  sendTeam,
  pertainUnit,
});
/**
 * 资产列表
 * @param {
 *  pageSize
 *  pageNum
 *  query
 *  maintainMonth 维保临期（范围：0-120)
 *  meteringMonth 计量临期（范围：0-120)
 *  deptId 当前使用部门
 *  assetsType 资产类型
 *  pertainUnit 巡检单元
 *  isShowReview 是否显示审核进行中的数据(1【默认】：是，0：否)

 * }
 * @returns
 */
const list = ({
  pageSize = 9999,
  pageNum = 0,
  query = null,
  maintainMonth,
  meteringMonth,
  deptId,
  assetsType,
  pertainUnit,
  isShowReview,
} = {}) => Fetch.post('/bus/assets/page', {
  pageSize,
  pageNum,
  query,
  maintainMonth,
  meteringMonth,
  deptId,
  assetsType,
  pertainUnit,
  isShowReview,
});
/**
 *  资产更新
 * @param {*} param0
 * @returns
 */
const update = ({
  id,
  name,
  model,
  seriesNumb,
  useDate,
  years,
  equipmentState,
  assetsType,
  assetsSource,
  outLinked,
  isAutoCode,
  codePrefix,
  assetsCode,
  isPublic,
  isMetering,
  meteringTimer,
  useDept,
  place,
  personLiable,
  isMaintain,
  maintainTerm,
  maintainCompany,
  maintainUser,
  isPatrol,
  patrolTemp,
  patrolDept,
  remark,
  enclosure,
  purchaseCode,
  projectName,
  purchaseDate,
  purchasePrice,
  purchaseNumber,
  brand,
  manufacturer,
  supplier,
  manufacturerPhone,
  salesPhone,
  originPlace,
  ipPlace,
  macPlace,
  operatingSystem,
  systemVersion,
  isGenuine,
  configuration,
  amount,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/bus/assets/update', {
  id,
  name,
  model,
  seriesNumb,
  useDate,
  years,
  equipmentState,
  assetsType,
  assetsSource,
  outLinked,
  isAutoCode,
  codePrefix,
  assetsCode,
  isPublic,
  isMetering,
  meteringTimer,
  useDept,
  place,
  personLiable,
  isMaintain,
  maintainTerm,
  maintainCompany,
  maintainUser,
  isPatrol,
  patrolTemp,
  patrolDept,
  remark,
  enclosure,
  purchaseCode,
  projectName,
  purchaseDate,
  purchasePrice,
  purchaseNumber,
  brand,
  manufacturer,
  supplier,
  manufacturerPhone,
  salesPhone,
  originPlace,
  ipPlace,
  macPlace,
  operatingSystem,
  systemVersion,
  isGenuine,
  configuration,
  amount,
  sendUser,
  sendTeam,
});
/**
 * 资产变更详情
 * @param {*} id
 * @returns
 */
const changedDetail = (id) => Fetch.post('/bus/assets/get/info', {
  id,
});

/**
 * 资产导出
 * @param {*} ids
 * @returns
 */
const assetsExport = (ids = '') => Fetch.post('/bus/assets/export', {
  ids,
});
/**
 * 资产导入
 * @param {File} file
 * @returns
 */
const assetsImport = (file) => Fetch.post('/bus/assets/importExcel', {
  file,
});

/**
 * 资产导入模版下载
 * @returns
 */
const assetsExcelTemplate = () => Fetch.post('/bus/assets/downloadTemp', {}, { responseType: 'blob', });

export default {
  register,
  list,
  update,
  changedDetail,
  assetsExport,
  assetsImport,
  assetsExcelTemplate,
};
