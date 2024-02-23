import request from '@/common/utils/request';

// 新增字典类型
const addDictionary = (params = {
  createBy: '',
  createTime: '',
  // 字典所属
  dictBelong: '',
  // 字典主键
  dictId: '',
  // 字典层级
  dictLevel: '',
  // 字典名称
  dictName: '',
  // 字典类型
  dictType: '',
  params: '',
  remark: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.post('/system/dict/type', params);

// 获取字典数据列表
const getDictionaryList = (params = {
  createBy: '',
  createTime: '',
  // 样式属性（其他样式扩展）
  cssClass: '',
  'default': '',
  // 字典编码
  dictCode: '',
  // 字典标签
  dictLabel: '',
  // 字典排序
  dictSort: '',
  // 字典类型
  dictType: '',
  // 字典键值
  dictValue: '',
  // 是否默认（Y是 N否）
  isDefault: '',
  // 表格字典样式
  listClass: '',

  // 上级Id
  parentId: '',
  remark: '',
  searchValue: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
  // 字典所属(0系统,1用户)
  dictBelong: '',
}) => request.get('/system/dict/type/list', {
  params,
});
// 修改字典类型
const updateDictionary = (params = {
  createBy: '',
  createTime: '',
  // 字典所属
  dictBelong: '',
  // 字典主键
  dictId: '',
  // 字典层级
  dictLevel: '',
  // 字典名称
  dictName: '',
  // 字典类型
  dictType: '',
  params: '',
  remark: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.put('/system/dict/type', params);

// 刷新字典缓存
const refreshDictionary = () => request.delete('/system/dict/type/refreshCache');

// 删除字典类型
const deleteDictionary = (dictIds) => request.delete(`/system/dict/type/${dictIds}`,);

// 根据字典类型查询字典数据信息
const getDictionaryTypeDataInfo = ({ dictType, }) => request.get(`/system/dict/data/type/${dictType}`,);
// 字典数据列表
const getDictionaryDataList = (params = {
  createBy: '',
  createTime: '',
  // 样式属性（其他样式扩展）
  cssClass: '',
  default: '',
  // 字典编码
  dictCode: '',
  // 字典标签
  dictLabel: '',
  // 字典排序
  dictSort: '',
  // 字典类型
  dictType: '',
  // 字典键值
  dictValue: '',
  // 是否默认（Y是 N否）
  isDefault: '',
  // 表格字典样式
  listClass: '',
  // 上级Id
  parentId: '',
  remark: '',
  searchValue: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.get('/system/dict/data/list', {
  params,
});

// 获取字典数据详情
const getDictionaryDetail = (dictId) => request.get(`/system/dict/type/${dictId}`,);

// 修改字典数据
const updateDictionaryData = (params = {
  createBy: '',
  createTime: '',
  // 样式属性（其他样式扩展）
  cssClass: '',
  // 字典编码
  dictCode: '',
  // 字典标签
  dictLabel: '',
  // 字典排序
  dictSort: '',
  // 字典类型
  dictType: '',
  // 字典键值
  dictValue: '',
  // 是否默认（Y是 N否）
  isDefault: '',
  // 表格字典样式
  listClass: '',
  params: '',
  // 上级Id
  parentId: '',
  remark: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.put('/system/dict/data', params);

// 新增字典数据
const addDictionaryDetail = (params = {
  createBy: '',
  createTime: '',
  // 样式属性（其他样式扩展）
  cssClass: '',
  // 字典编码
  dictCode: '',
  // 字典标签
  dictLabel: '',
  // 字典排序
  dictSort: '',
  // 字典类型
  dictType: '',
  // 字典键值
  dictValue: '',
  // 是否默认（Y是 N否）
  isDefault: '',
  // 表格字典样式
  listClass: '',
  // params: '',
  // 上级Id
  parentId: '',
  remark: '',
  // 状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.post('/system/dict/data', params);

// 删除字典数据
const deleteDictionaryData = (dictCodes) => request.delete(`/system/dict/data/${dictCodes}`,);

// 查询所有字典类型列表
const getDictionaryTypeList = () => request.get('/system/dict/type/optionselect',);

/**
 * 获取数据字典缓存
 */
const getCachedList = () => request.get('/system/dict/data/cache');
export default {
  addDictionary,
  refreshDictionary,
  deleteDictionary,
  getDictionaryList,
  updateDictionary,
  getDictionaryTypeDataInfo,
  getDictionaryDetail,
  updateDictionaryData,
  addDictionaryDetail,
  deleteDictionaryData,
  getDictionaryDataList,
  getDictionaryTypeList,
  getCachedList,
};
