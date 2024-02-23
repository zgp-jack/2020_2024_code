import Fetch from '@/utils/fetch';
const DataApi = {

  // 获取分类列表
  getCatalogPage: ({
    pageNum = 1,
    pageSize = 999,
  } = {}) => Fetch.post('sysDicCatalog/getPage', {
    pageNum,
    pageSize,
  }),

  // 获取分类信息
  // getCatalog(id,) {
  //   return request({
  //     url: '/sysDicCatalog/get',
  //     method: 'post',
  //     data: {
  //       id,
  //     },
  //   });
  // },

  // 删除字典分类
  deleteCatalog: ({
    id = null,
  } = {}) => Fetch.post('sysDicCatalog/delete', {
    id,
  }),

  // 保存字典分类
  saveOrUpdateCatalog: ({
    name = null,
    value = null,
    id = null,
    state = 1,
  } = {}) => Fetch.post('sysDicCatalog/saveOrUpdate', {
    name,
    value,
    id,
    state,
  }),

  // 获取字典项
  getItemPage: ({
    catalogId = null,
    pageNum,
    pageSize,
    parentId,
  } = {}) => Fetch.post('sysDicInfo/getPage', {
    catalogId,
    pageNum,
    pageSize,
    parentId,

  }),

  // 获取故障分类
  getFault: ({
    catalogId = 3,
    pageNum,
    pageSize,
    parentId,
  } = {}) => Fetch.post('sysDicInfo/getPage', {
    catalogId,
    pageNum,
    pageSize,
    parentId,

  }),

  // 获取字典项信息
  getItem: ({
    id = null,
  } = {}) => Fetch.post('sysDicInfo/get', {
    id,
  }),

  // 删除字典项
  deleteItem: ({
    id = null,
  } = {}) => Fetch.post('sysDicInfo/delete', {
    id,
  }),

  // 保存字典项
  saveOrUpdateItem: ({
    id = null,
    catalogId = null,
    name = null,
    value = null,
    orderNum = null,
    parentId = null,
    parm = null,
    state = 1,
  } = {}) => Fetch.post('sysDicInfo/saveOrUpdate', {
    id,
    catalogId,
    name,
    value,
    orderNum,
    parentId,
    parm,
    state,

  }),
};

// 厂家品牌
const BrandApi = {
  /**
   * 添加
   * @param {*} params
   */
  add: ({
    id = null,
    name = null,
    abbreviation = null,
    manufacturerType = null,
    contact = null,
    phone = null,
    remark = null,
    otherContacts = JSON.stringify({}),
  } = {}) => Fetch.post('sys/dic/manufacturer/create', {
    id,
    name,
    abbreviation,
    manufacturerType,
    contact,
    phone,
    remark,
    otherContacts,
  }),

  /**
   * 删除
   * @param {*} id
   */
  del: ({
    id,
  } = {}) => Fetch.post('sys/dic/manufacturer/delete', {
    id,
  }),

  /**
   * 修改
   * @param {} params
   */
  update: ({
    id = null,
    name = null,
    abbreviation = null,
    manufacturerType = null,
    contact = null,
    phone = null,
    remark = null,
    otherContacts = JSON.stringify({}),
  } = {}) => Fetch.post('sys/dic/manufacturer/update', {
    id,
    name,
    abbreviation,
    manufacturerType,
    contact,
    phone,
    remark,
    otherContacts,
  }),

  /**
   * 列表初始化
   * @param {*} sw
   */
  init: ({
    pageNum,
    pageSize,
    query = null,
  } = {}) => Fetch.post('sys/dic/manufacturer/page', {
    pageNum,
    pageSize,
    query,
  }),

};

const AssetApi = {
  /**
   * 添加
   */
  add: ({
    name = null,
    parentId = null,
    id = null,
    state = 1,
  } = {}) => Fetch.post('sys/dic/assets/create', {
    name,
    parentId,
    id,
    state,
  }),
  /**
   * 更新数据
   */
  update: ({
    name = null,
    parentId = null,
    id = null,
    state = 1,
  } = {}) => Fetch.post('sys/dic/assets/update', {
    name,
    parentId,
    id,
    state,
  }),
  /**
   *  删除
   *
   */
  del: ({
    id,
  } = {},) => Fetch.post('sys/dic/assets/delete', {
    id,
  }),
  /**
   *   初始化
   */
  init: ({
    pageNum,
    pageSize,
    parentId = null,
  } = {}) => Fetch.post('sys/dic/assets/page', {
    pageNum,
    pageSize,
    parentId,
  }),
};

const DictionaryApi = {
  DataApi,
  BrandApi,
  AssetApi,
};

export default DictionaryApi;
