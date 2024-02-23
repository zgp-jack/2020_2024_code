import request from '@/common/utils/request'

;
// 巡检记录-单元-列表
const getInspectionRecordUnitList = (data) => request.post('/ins/record/unit/list', data);
// 巡检记录详情查询
const getInspectionRecordDetail = (id) => request.get(`/ins/record/${id}`);

// 巡检记录资产列表
const getInspectionRecordAssetsList = (data) => request.post('/ins/record/ast/list', data);

// 异常整改-巡检单元查询
const getAbnormalRectificationUnitList = (data) => request.post('/ins/rectify/unit/list', data);
// 异常整改-资产查询
const getAbnormalRectificationAssetsList = (data) => request.post('/ins/rectify/ast/list', data);
// 异常整改-详情
const getAbnormalRectificationDetail = (id) => request.get(`/ins/rectify/detail/${id}`);
// 异常整改-整改
const abnormalRectification = (data) => request.put('/ins/rectify/rectify', data);
// 异常整改-转交
const abnormalRectificationTransfer = (data) => request.put('/ins/rectify/transmit', data);
// 巡检项配置-资产类型列表
const getInspectionConfigAssetList = ({
  // 资产类型
  assetsType,
  //  是否配置巡检项
  itemSetting,
  keyword,
  pageNum,
  pageSize,
} = {}) => request.get('/ins/item/ast/list', {
  params: {
    assetsType,
    itemSetting,
    keyword,
    pageNum,
    pageSize,
  },
});
// 巡检项配置-巡检单元列表
const getInspectionConfigUnitList = ({
  // 单元目录
  directory,
  // 是否配置巡检项
  itemSetting,
  // 关键字
  keyword,
  pageNum,
  pageSize,
} = {}) => request.get('/ins/item/unit/list', {
  params: {
    directory,
    itemSetting,
    keyword,
    pageNum,
    pageSize,
  },
});
// 巡检项配置-编辑巡检项
const editInspectionConfig = (data) => request.put('/ins/item', data);
// 巡检项配置-新增巡检配置项
const addInspectionConfig = (data) => request.post('/ins/item', data);
// 巡检项配置-当前巡检项查询
const getCurrentInspectionConfig = ({
  isEnable,
  itemName,
  parentId,
  parentType,
} = {}) => request.get(`/ins/item/list`, { params: {
  isEnable,
  itemName,
  parentId,
  parentType,
}, });
// 巡检项配置-删除巡检项
const delInspectionConfig = (ids) => request.delete(`/ins/item/${ids}`);
// 巡检项配置-获取配置项详情
const getInspectionConfigItemDetail = (id) => request.get(`/ins/item/${id}`);

export default {
  getInspectionRecordUnitList,
  getInspectionRecordDetail,
  getInspectionRecordAssetsList,
  getAbnormalRectificationUnitList,
  getAbnormalRectificationAssetsList,
  getAbnormalRectificationDetail,
  abnormalRectification,
  abnormalRectificationTransfer,
  getInspectionConfigAssetList,
  getInspectionConfigUnitList,
  editInspectionConfig,
  addInspectionConfig,
  getCurrentInspectionConfig,
  delInspectionConfig,
  getInspectionConfigItemDetail,
};
