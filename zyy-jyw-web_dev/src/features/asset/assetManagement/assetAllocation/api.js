import request from '@/common/utils/request';

// 资产调拨分页查询
const getList = ({
  pageNum,
  pageSize,
  // 操作时间结束
  createEndTime,
  // 操作时间开始
  createStartTime,
  // 操作人
  createUser,
  // 调入科室
  inDept,
} = {}) => request.post('/ast/allocate/list', {
  pageNum,
  pageSize,
  createEndTime,
  createStartTime,
  createUser,
  inDept,
});

// 资产调拨
const assetAllocation = ({
  // 资产条目(资产id集合)
  astList,
  // 调入科室
  inDept,
  // 调拨原因
  reason,
} = {}) => request.post('/ast/allocate', {
  astList,
  inDept,
  reason,
});

// 调拨详情
const assetAllocationDetail = (id) => request.get(`/ast/allocate/${id}`);

// 撤销
const revoke = (id) => request.delete(`/ast/allocate/${id}`);

// 可选资产
const getOptionalAsset = (
  {
    // * 排除科室
    excludeDept,
    // * 排除状态  1正常 2报废
    excludeEquipmentState,
    // * 指定科室
    useDept,
  } = {}) => request.get('/ast/sign/option', {
  params: {
    excludeDept,
    excludeEquipmentState,
    useDept,
  },
});
export default {
  getList,
  assetAllocation,
  assetAllocationDetail,
  revoke,
  getOptionalAsset,
};
