import request from '@/utils/request';
import Fetch from '@/utils/fetch';

const ConrtactApi = {
  /**
  * 添加模板
  * @param {*} params
  */
  add(params) {
    return request({
      url: 'contract/create',
      method: 'post',
      data: params,
    });
  },
  /**
   * 初始化
   */
  init: ({
    pageNum,
    pageSize,
    name = '', // 合同名称
    number = '', // 合同号
    itemCode = '', // 项目编号
    officeId = '', // 科室ID
    payDays = undefined, // 计划付款？天内
    qaDays = undefined, // 维保到期？天内
    companybId = '', // 乙方ID
    companycId = '', // 丙方ID
    contractState,
  } = {}) => Fetch.post('contract/list', {
    pageNum,
    pageSize,
    name,
    number,
    itemCode,
    officeId,
    payDays,
    qaDays,
    companybId,
    companycId,
    contractState,
  }),

  /**
   * 获取详情
   */
  detail(id) {
    return request({
      url: 'contract/details',
      method: 'post',
      data: {
        id,
      },
    });
  },
  /**
 * 保存编辑 的数据
 */

  edit(params) {
    return request({
      url: 'contract/edit',
      method: 'post',
      data: params,
    });
  },
  /**
   * 删除合同
   * @param {} id
   */
  del(id) {
    return request({
      url: 'contract/del',
      method: 'post',
      data: {
        id,
      },
    });
  },

};

const PayApi = {
  /**
   * 获取付款信息列表
   * @param {} contractPayPlanId
   */
  init(contractPayPlanId) {
    return request({
      url: '/contract/pay/details/list',
      method: 'post',
      data: {
        contractPayPlanId,
      },
    });
  },
  /**
   * 添加付款信息
   *
   */
  create(params) {
    return request({
      url: '/contract/pay/details/create',
      method: 'post',
      data: params,
    });
  },
  /**
   * 查询 支付计划 流程
   */
  payProcess(contractId) {
    return request({
      url: 'contract/pay/details/listContract',
      method: 'post',
      data: {
        contractId,
      },
    });
  },
};

const TemplateApi = {
  init: ({
    pageNum,
    pageSize,
    name = '',
  } = {}) => Fetch.post('contract/pay/template/list', {
    pageNum,
    pageSize,
    query: name,
  }),
  /**
   * 创建合同模板
   * @param {*} params
   */
  create(params) {
    return request({
      url: 'contract/pay/template/create',
      method: 'post',
      data: params,
    });
  },
  /**
   * 删除
   * @param {*} id
   */
  del(id) {
    return request({
      url: 'contract/pay/template/del',
      method: 'post',
      data: {
        id,
      },
    });
  },
  /**
   * 详情
   * @param {*} id
   */
  detail(id) {
    return request({
      url: 'contract/pay/template/details',
      method: 'post',
      data: {
        id,
      },
    });
  },
  /**
 *  修改合同
 * @param {*} params
 */
  update(params) {
    return request({
      url: 'contract/pay/template/edit',
      method: 'post',
      data: params,
    });
  },

  /**
 *查询已启用合同模板
 */
  enable() {
    return request({
      url: 'contract/pay/template/enableList',
      method: 'post',
      data: {},
    });
  },
  /**
   * 启用 禁用
   */
  off(params) {
    return request({
      url: 'contract/pay/template/editStates',
      method: 'post',
      data: params,
    });
  },
};
/**
 * 发票
 */
const InvoiceApi = {
  create(params) {
    return request({
      url: 'contract/receipt/add',
      method: 'post',
      data: params,
    });
  },
  update(params) {
    return request({
      url: 'contract/receipt/edit',
      method: 'post',
      data: params,
    });
  },
  del(id) {
    return request({
      url: 'contract/receipt/del',
      method: 'post',
      data: {
        id,
      },
    });
  },
  process(contractId) {
    return request({
      url: 'contract/receipt/list',
      method: 'post',
      data: {
        contractId,
      },
    });
  },
};

const ConrtactApis = {
  ConrtactApi,
  TemplateApi,
  PayApi,
  InvoiceApi,
};

export default ConrtactApis;
