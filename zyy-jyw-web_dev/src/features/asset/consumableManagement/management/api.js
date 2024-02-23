import request from '@/common/utils/request';
// 分页查询
const getList = ({
  pageNum,
  pageSize,
  keyword,
  // 库存情况 1正常 2达到预警值 3无库存
  reserveState,
  supplierId,
  type,
} = {}) => request.post('/ast/consumable/list', {
  pageNum,
  pageSize,
  keyword,
  reserveState,
  supplierId,
  type,
});
// 编辑耗材
const editConsumable = ({
  // 附件
  enclosure,
  // id
  id,
  // 规格型号
  model,
  // 名称
  name,
  // 单价
  price,
  // 备注
  remark,
  // 安全库存
  safeReserve,
  // 供应商
  supplierId,
  // 分类(数据字典)
  type,
  // 使用单位(数据字典)
  unit,
} = {}) => request.put('/ast/consumable', {
  enclosure,
  id,
  model,
  name,
  price,
  remark,
  safeReserve,
  supplierId,
  type,
  unit,
});

// 下载耗材模版
const downloadTemplate = () => request.get('/ast/consumable/template', {
  responseType: 'blob',
});
// 耗材导入
const importConsumable = '/ast/consumable/import';
// 耗材登记
const registerConsumable = ({
  // 附件
  enclosure,
  // 规格型号
  model,
  // 名称
  name,
  // 单价
  price,
  // 备注
  remark,
  // 安全库存
  safeReserve,
  // 供应商
  supplierId,
  // 分类(数据字典)
  type,
  // 使用单位(数据字典)
  unit,
} = {}) => request.post('/ast/consumable', {
  enclosure,
  model,
  name,
  price,
  remark,
  safeReserve,
  supplierId,
  type,
  unit,
});
// 耗材入库
const enterConsumable = ({
  // 附件
  enclosure,
  // 备注
  remark,
  // 耗材列表
  reverseList,
} = {}) => request.put('/ast/consumable/in', {
  enclosure,
  remark,
  reverseList,
});
// 耗材出库
const outConsumable = ({
  // 附件
  enclosure,
  // 备注
  remark,
  // 耗材列表
  reverseList,
} = {}) => request.put('/ast/consumable/out', {
  enclosure,
  remark,
  reverseList,
});
// 耗材删除
const deleteConsumable = (ids) => request.delete(`/ast/consumable/${ids}`);
// 耗材详情
const detailConsumable = (id) => request.get(`/ast/consumable/${id}`);
export default {
  getList,
  editConsumable,
  downloadTemplate,
  importConsumable,
  registerConsumable,
  enterConsumable,
  outConsumable,
  deleteConsumable,
  detailConsumable,
};
