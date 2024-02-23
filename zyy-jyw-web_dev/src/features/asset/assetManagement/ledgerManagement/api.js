import request from '@/common/utils/request';

/**
 * 资产编辑
 */
const assetEdit = ({
  // 资产编号
  assetsCode,
  // 资产来源(数据字典)
  assetsSource,
  // 资产类型(数据字典)
  assetsType,
  // 品牌(数据字典)
  brand,
  // 配置信息
  configuration,
  // 附件
  enclosure,
  // 设备状态(数据字典)
  equipmentState,
  // id
  id,
  // IP地址
  ipPlace,
  // 是否公共设备
  isPublic,
  // MAC地址
  macPlace,
  // 维保公司
  maintainCompany,
  // 资产维护类型(1用户 2小组 3科室)
  maintainInsideType,
  // 指定维护对象标识
  maintainObjId,
  // 维保期限
  maintainTerm,
  // 维保责任人
  maintainUser,
  // 生产厂商
  manufacturer,
  // 保养维护周期
  meteringTimer,
  // 保养维护周期单位(数据字典)
  meteringUnit,
  // 规格型号
  model,
  // 名称
  name,
  // 操作系统(数据字典)
  operatingSystem,
  // 产地
  originPlace,
  // 使用责任人
  personLiable,
  // 所属巡检单元
  pertainUnit,
  // 所在位置
  place,
  // 项目名称
  projectName,
  // 采购编号
  purchaseCode,
  // 采购日期
  purchaseDate,
  // 采购数量
  purchaseNumber,
  // 采购价格
  purchasePrice,
  // 备注
  remark,
  // 售后电话
  salesPhone,
  // 设备S/N码
  seriesNumb,
  // 供应商
  supplier,
  // 供应商电话
  supplierPhone,
  // 系统版本
  systemVersion,
  // 使用日期
  useDate,
  // 使用科室
  useDept,
  // 使用年限单位
  useUnit,
  // 使用年限
  years,
} = {}) => request.post('/ast/sign/edit', {

  assetsCode,
  assetsSource,
  assetsType,
  brand,
  configuration,
  enclosure,
  equipmentState,
  id,
  ipPlace,
  isPublic,
  macPlace,
  maintainCompany,
  maintainInsideType,
  maintainObjId,
  maintainTerm,
  maintainUser,
  manufacturer,
  meteringTimer,
  meteringUnit,
  model,
  name,
  operatingSystem,
  originPlace,
  personLiable,
  pertainUnit,
  place,
  projectName,
  purchaseCode,
  purchaseDate,
  purchaseNumber,
  purchasePrice,
  remark,
  salesPhone,
  seriesNumb,
  supplier,
  supplierPhone,
  systemVersion,
  useDate,
  useDept,
  useUnit,
  years,
});
/**
 * 单个资产登记
 * @returns {Promise<AxiosResponse<any>>}
 */
const singleAssetAdd = ({
  // 资产编号
  assetsCode,
  // 资产来源(数据字典)
  assetsSource,
  // 资产类型(数据字典)
  assetsType,
  // 品牌(数据字典)
  brand,
  // 配置信息
  configuration,
  // 附件
  enclosure,
  // 设备状态(数据字典)
  equipmentState,
  // IP地址
  ipPlace,
  // 是否公共设备
  isPublic,
  // MAC地址
  macPlace,
  // 维保公司
  maintainCompany,
  // 资产维护类型(1用户 2小组 3科室)
  maintainInsideType,
  // 指定维护对象标识
  maintainObjId,
  // 维保期限
  maintainTerm,
  // 维保责任人
  maintainUser,
  // 生产厂商
  manufacturer,
  // 保养维护周期
  meteringTimer,
  // 保养维护周期单位(数据字典)
  meteringUnit,
  // 规格型号
  model,
  // 名称
  name,
  // 操作系统(数据字典)
  operatingSystem,
  // 产地
  originPlace,
  // 使用责任人
  personLiable,
  // 所属巡检单元
  pertainUnit,
  // 所在位置
  place,
  // 项目名称
  projectName,
  // 采购编号
  purchaseCode,
  // 采购日期
  purchaseDate,
  // 采购数量
  purchaseNumber,
  // 采购价格
  purchasePrice,
  // 备注
  remark,
  // 售后电话
  salesPhone,
  // 设备S/N码
  seriesNumb,
  // 供应商
  supplier,
  // 供应商电话
  supplierPhone,
  // 系统版本
  systemVersion,
  // 使用日期
  useDate,
  // 使用科室
  useDept,
  // 使用年限单位
  useUnit,
  // 使用年限
  years,
} = {}) => request.post('/ast/sign/add', {
  assetsCode,
  assetsSource,
  assetsType,
  brand,
  configuration,
  enclosure,
  equipmentState,
  ipPlace,
  isPublic,
  macPlace,
  maintainCompany,
  maintainInsideType,
  maintainObjId,
  maintainTerm,
  maintainUser,
  manufacturer,
  meteringTimer,
  meteringUnit,
  model,
  name,
  operatingSystem,
  originPlace,
  personLiable,
  pertainUnit,
  place,
  projectName,
  purchaseCode,
  purchaseDate,
  purchaseNumber,
  purchasePrice,
  remark,
  salesPhone,
  seriesNumb,
  supplier,
  supplierPhone,
  systemVersion,
  useDate,
  useDept,
  useUnit,
  years,
});

/**
 * 批量登记
 */
const batchAssetAdd = ({
  // 资产来源(数据字典)
  assetsSource,
  // 资产类型(数据字典)
  assetsType,
  // 品牌(数据字典)
  brand,
  // 配置信息
  configuration,
  // 附件
  enclosure,
  // 设备状态(数据字典)
  equipmentState,
  // IP地址
  ipPlace,
  // 是否公共设备
  isPublic,
  // MAC地址
  macPlace,
  // 维保公司
  maintainCompany,
  // 资产维护类型(1用户 2小组 3科室)
  maintainInsideType,
  // 指定维护对象标识
  maintainObjId,
  // 维保期限
  maintainTerm,
  // 维保责任人
  maintainUser,
  // 生产厂商
  manufacturer,
  // 保养维护周期
  meteringTimer,
  // 保养维护周期单位(数据字典)
  meteringUnit,
  // 规格型号
  model,
  // 名称
  name,
  // 操作系统(数据字典)
  operatingSystem,
  // 产地
  originPlace,
  // 使用责任人
  personLiable,
  // 所属巡检单元
  pertainUnit,
  // 所在位置
  place,
  // 项目名称
  projectName,
  // 采购编号
  purchaseCode,
  // 采购日期
  purchaseDate,
  // 采购数量
  purchaseNumber,
  // 采购价格
  purchasePrice,
  // 备注
  remark,
  // 售后电话
  salesPhone,
  // 设备S/N码
  seriesNumb,
  // 登记数量
  signCount,
  // 供应商
  supplier,
  // 供应商电话
  supplierPhone,
  // 系统版本
  systemVersion,
  // 使用日期
  useDate,
  // 使用科室
  useDept,
  // 使用年限单位
  useUnit,
  // 使用年限
  years,
} = {}) => request.post('/ast/sign/batchAdd', {

  assetsSource,
  assetsType,
  brand,
  configuration,
  enclosure,
  equipmentState,
  ipPlace,
  isPublic,
  macPlace,
  maintainCompany,
  maintainInsideType,
  maintainObjId,
  maintainTerm,
  maintainUser,
  manufacturer,
  meteringTimer,
  meteringUnit,
  model,
  name,
  operatingSystem,
  originPlace,
  personLiable,
  pertainUnit,
  place,
  projectName,
  purchaseCode,
  purchaseDate,
  purchaseNumber,
  purchasePrice,
  remark,
  salesPhone,
  seriesNumb,
  signCount,
  supplier,
  supplierPhone,
  systemVersion,
  useDate,
  useDept,
  useUnit,
  years,

});

/**
 * 获取资产列表
 * @returns {Promise<AxiosResponse<any>>}
 */
const getAssetList = ({
  // 资产类型
  assetsType,
  // 设备状态
  equipmentState,
  // 关键字
  keyword,
  // 当前记录起始索引
  pageNum,
  // 每页显示记录数
  pageSize,
  // 巡检单元
  pertainUnit,
  // 使用科室
  useDept,
  // 剩余年限状态 0正常 1到期
  useState,
  // 保养周期状态 0正常 1待保养.
  meteringState,
} = {}) => request.get('/ast/sign/list', {
  params: {
    assetsType,
    equipmentState,
    keyword,
    pageNum,
    pageSize,
    pertainUnit,
    useDept,
    useState,
    meteringState,

  },
});

/**
 * 导出
 */
const assetExport = ({
  //  资产类型
  assetsType,
  //  设备状态
  equipmentState,
  //  关键字
  keyword,
  //  保养周期状态 0正常 1待保养
  meteringState,
  //  巡检单元
  pertainUnit,
  //  使用科室
  useDept,
  //  剩余年限状态 0正常 1到期
  useState,
} = {}) => request.get('/ast/sign/export', {
  responseType: 'blob',
  params: {
    assetsType,
    equipmentState,
    keyword,
    meteringState,
    pertainUnit,
    useDept,
    useState,
  }, });

/**
 * 获取详情
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
const getAssetDetail = (id) => request.get(`/ast/sign/${id}`);

/**
 * 到期处置
 * @param dispose
 * @param id
 * @param timer
 * @param unit
 * @returns {Promise<AxiosResponse<any>>}
 */
const expireDispose = ({
  // 处置方式 1续用 2报废
  dispose,
  // id
  id,
  // 续用周期
  timer,
  // 续用周期单位 1年 2月 3周 4天
  unit,
} = {}) => request.put('/ast/sign/dispose', {
  dispose,
  id,
  timer,
  unit,
});
/**
 * 删除资产
 */
const deleteAsset = (ids) => request.delete(`/ast/sign/${ids}`);

/**
 * 资产导入
 */
const importAsset = '/ast/sign/import';

/**
 * 下载资产模版
 *
 */
const downloadAssetTemplate = () => request.get('/ast/sign/template', {
  responseType: 'blob',
});

/**
 * 资产打印
 */
const assetPrint = (ids) => request.get('/ast/sign/print', {
  params: {
    ids,
  },
});

export default {
  singleAssetAdd,
  getAssetList,
  batchAssetAdd,
  getAssetDetail,
  expireDispose,
  assetEdit,
  deleteAsset,
  importAsset,
  downloadAssetTemplate,
  assetExport,
  assetPrint,
};
