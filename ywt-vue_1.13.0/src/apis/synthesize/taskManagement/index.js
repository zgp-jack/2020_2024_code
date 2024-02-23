
import request from '@/utils/request';
import Fetch from '@/utils/fetch';

const TaskApi = {
  /**
   * 导出excel
   * @returns
   */
  exportExcel: (params) => Fetch.post('bus/taskInfo/exportExcel', {
    taskInfoDetailsVos: params || '',
  }),
  // 下载任务压缩包
  downZip: (params) => Fetch.post('bus/taskInfo/exportZip', {
    taskInfoDetailsVos: params || '',
  }, { responseType: 'blob', },),

  init: ({
    pageNum,
    pageSize,
    query = '',
    states = '',
    leaders = '',
    joinUsers = '',
    itemCode = '',
    status = -1,
    taskTypeId = '',
    teamId = '',
    startTime = '',
    endTime = '',
  } = {}) => Fetch.post('bus/taskInfo/list', {
    pageNum,
    pageSize,
    taskName: query,
    states,
    leaders,
    joinUsers,
    itemCode,
    status,
    taskTypeId,
    teamId,
    startTime,
    endTime,
  }),

  save(params) {
    return request({
      url: 'bus/taskInfo/add',
      method: 'post',
      data: params,
    });
  },
  submit(taskId) {
    return request({
      url: 'bus/taskInfo/submit',
      method: 'post',
      data: {
        taskId,
      },
    });
  },

  update(params) {
    return request({
      url: 'bus/taskInfo/edit',
      method: 'post',
      data: params,
    });
  },

  detail(id) {
    return request({
      url: 'bus/taskInfo/details',
      method: 'post',
      data: {
        id,
      },
    });
  },

  del(id) {
    return request({
      url: 'bus/taskInfo/del',
      method: 'post',
      data: {
        id,
      },
    });
  },

  assign() {

  },
  /**
   * 类型(1通过2驳回)
   * @param {*} params
   */
  review(params = { taskId: '', reason: '', type: '', }) {
    return request({
      url: 'bus/taskInfo/audit',
      method: 'post',
      data: params,
    });
  },

  handle(params) {
    return request({
      url: 'bus/taskInfo/deal',
      method: 'post',
      data: params,
    });
  },

  transfer(params) {
    return request({
      url: 'bus/taskInfo/transfer',
      method: 'post',
      data: params,
    });
  },
  /**
 * 任务的 在暂停 、开启 、关闭
 * @param {} params
 */
  operate(params) {
    return request({
      url: 'bus/taskInfo/process',
      method: 'post',
      data: params,
    });
  },
  /**
   * 任务完成
   * @param {*} params
   */
  complaete(params) {
    return request({
      url: 'bus/taskInfo/finish',
      method: 'post',
      data: params,
    });
  },

  /**
   * 懒加载子节点
   */
  lazyChild(taskId) {
    return request({
      url: 'bus/taskInfo/listChild',
      method: 'post',
      data: { taskId, },
    });
  },

  /**
 *  统计
 */
  typeCount() {
    return request({
      url: 'bus/taskInfo/stats',
      method: 'post',
      data: { },
    });
  },
  /**
 * 子任务的添加
 */
  addChild(params) {
    return request({
      url: 'bus/taskInfo/addChild',
      method: 'post',
      data: params,
    });
  },
  /**
 * 子任务的编辑
 */
  childEdit(params) {
    return request({
      url: 'bus/taskInfo/editChild',
      method: 'post',
      data: params,
    });
  },
  open(taskId) {
    return request({
      url: 'bus/taskInfo/start',
      method: 'post',
      data: { taskId, },
    });
  },
  /**
   * 进度获取
   * @param {} taskId
   */
  processList(taskId) {
    return request({
      // url: 'bus/taskProcess/rateList',
      url: 'bus/taskProcess/dealList',
      method: 'post',
      data: { taskId, },
    });
  },

};

export default TaskApi;
