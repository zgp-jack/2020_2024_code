import request from '@/utils/request';
import Fetch from '@/utils/fetch';
/**
 * 整个项目模块公共
 */
const base = {

  /**
   *  获取流程进度
   */
  getProgress: (code) => {
    return request({
      url: `busItemProcess/getItemList`,
      method: 'post',
      data: {
        itemCode: code,
      },
    });
  },

  /**
   * 获取总体数据包
   */
  getAllProjectData: (itemCode) => {
    return request({
      url: 'busItemInfo/getWorkDetail',
      method: 'post',
      data: {
        itemCode,
      },
    });
  },
  /**
 * 终止项目
 */
  endProject(params) {
    return request({
      url: 'busItemProcess/termination',
      method: 'post',
      data: params,
    });
  },
  /**
 * 撤销项目
 */
  backItem(itemCode) {
    return request({
      url: 'busItemInfo/revoke',
      method: 'post',
      data: {
        itemCode,
      },
    });
  },
  /**
   *
   * 需求撤销
   */
  backDemand(itemCode) {
    return request({
      url: 'busItemInfo/demand/revoke',
      method: 'post',
      data: {
        itemCode,
      },
    });
  },
  /**
   * 需求和项目 暂停
   */
  demandOrProjectPause: ({ itemCode, remark, } = {}) => Fetch.post('busItemProcess/pause', { itemCode, remark, }),
  /**
   * 需求和项目开启
   */
  demandOrProjectOpen: (itemCode) => Fetch.post('busItemProcess/open', { itemCode, }),

};
// 需求
const demand = {
  /**
   * 需求统计分析
   * @param {*} param0
   * @returns
   */
  statics: ({
    endTime,
    startTime,
    template = 2,
    pageNum,
    pageSize,
    query = '',
    beginDate = '',
    endDate = '',
    organizer = '',
  }
  = {}) => Fetch.post('/busItemDemand/demandStatistics', {
    endTime,
    startTime,
    template,
    pageNum,
    pageSize,
    query,
    beginDate,
    endDate,
    organizer,
  }),
  /**
   * 未分配需求数
   */
  unassignedDeamndNum: () => Fetch.post('/busItemDemand/beAllocated', {}),

  /**
 * 创建和保存需求
 */
  createOrSaveNeedInfo(params, prefixed) {
    return request({
      url: `/busItemDemand/${prefixed}`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 * 获取需求列表
 * 1
 */
  getNeedList: ({
    pageNum,
    pageSize,
    query = '',
    code = '',
    level = '',
    showState = '',
    itemSource = '',
    principal = '',
    users = '',
  } = {}) => Fetch.post('busItemDemand/getPage', {
    pageNum,
    pageSize,
    query,
    temp: code,
    level,
    showState,
    itemSource,
    principal,
    users,
  }),

  /**
   * 删除需求
   * @param {*} code
   */
  del(id) {
    return request({
      url: `/busItemDemand/delete`,
      method: 'post',
      data: { id, },
    });
  },
  /**
 * 获取进度
 */
  getProgress(code) {
    return request({
      url: `busItemProcess/getItemList`,
      method: 'post',
      data: {
        itemCode: code,
      },
    });
  },

  /**
 *  获取需求 编辑页面数据
 */

  getNeedInfo(code) {
    return request({
      url: `/busItemDemand/getDetail`,
      method: 'post',
      data: {
        itemCode: code,
      },
    });
  },

  /**
 * 需求分配 1
 */

  setAssign(params) {
    return request({
      url: `busItemProcess/distribution`,
      method: 'post',
      data: {
        ...params,
      },
    });
  },

  /**
 * 获取流程面板 红点数量
 */

  getProcessNumm: () => {
    return request({
      url: `/busItemDemand/getPcRedInfo`,
      method: 'post',
      data: {},
    });
  },
  /**
 * 获取调研信息
 */

  getReachInfo(code) {
    return request({
      url: `busItemInvestigate/getDetail`,
      method: 'post',
      data: {
        itemCode: code,
      },
    });
  },
  /**
 * 提交 保存 调研信息
 */
  confirmOrSaveRearchInfo(apiname, params) {
    return request({
      url: `busItemInvestigate/${apiname}`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 *  评审 不同状态的提交 1
 */
  submitReview(params, apiName = 'pass',) {
    return request({
      url: `busItemProcess/demandReview/${apiName}`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 * 发起投票1
 */
  submitVote(params) {
    return request({
      url: `busVote/initiate/demand`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 * 获取下次投票轮次信息
 */
  getNextVoteInfo(code) {
    return request({
      url: `busVote/index/demand`,
      method: 'post',
      data: { linked: code, },
    });
  },
  /**
 * 获取评审审核页面数据
 */

  getReViewInfo(code) {
    return request({
      url: `busItemDemand/getReviewDetail`,
      method: 'post',
      data: {
        itemCode: code,
      },
    });
  },

  /**
 * 追加投票
 */
  addedVote(id, users) {
    return request({
      url: `busVote/replenish`,
      method: 'post',
      data: {
        id,
        users,
      },
    });
  },
  /**
 * 撤销投票
 */
  backVote(id) {
    return request({
      url: `busVote/revoke`,
      method: 'post',
      data: {
        id,
      },
    });
  },
  /** *
 * 获取投票数据
 */
  getVoteData(code, id) {
    const params = {
      itemCode: code,
    };
    if (id) {
      Object.assign(params, { processId: id, });
    }
    return request({
      url: `busVote/info/demand`,
      method: 'post',
      data: params,
    });
  },
  /**
   * 提交需求分析
   * @param {*} params
   * @returns
   */
  submitDemandAnalysis: (params = {}) => Fetch.post('/busitemdemandanalysis/submit', params),
  /**
   * 保存或更新需求分析
   * @param {} params
   * @returns
   */
  updateDemandAnalysis: (params = {}) => Fetch.post('/busitemdemandanalysis/saveOrUpdate', params),
  /**
   * 项目编号查询最新的需求分析
   * @param {*} itemCode
   * @returns
   */
  searchDemandNewAnalysis: (itemCode = '') => Fetch.get('/busitemdemandanalysis/getTheNew', {
    itemCode,
  }),
  /**
   * 根据项目编号查询该需求的分析列表
   * @param {*} itemCode
   * @returns
   */
  searchDemandHistoryAnalysisList: (itemCode = '') => Fetch.get('/busitemdemandanalysis/listByItemCode', {
    itemCode,
  }),
  /**
   *  评估评审操作记录
   */
  searchReviewHistory: (reviewId = '') => Fetch.get('/busitemdemandreviewlog/getByReviewId', { reviewId, }),
  /**
   * 提交技术分析
   * @param {*} params
   * @returns
   */
  submitTechnicalAnalysis: (params = {}) => Fetch.post('/busitemtechnicalanalysis/submit', params),
  /**
   * 保存或更新技术分析
   * @param {*} params
   * @returns
   */
  updateTechnicalAnalysis: (params = {}) => Fetch.post('/busitemtechnicalanalysis/saveOrUpdate', params),

  /**
   * 提交需求评估
   * @param {} params
   * @returns
   */
  submitDemandAssess: (params = {}) => Fetch.post('/busItemProcess/demandAssess', params),
  /**
   * 保存需求评估
   * @param {*} params
   * @returns
   */
  updateDemandAssess: (params = {}) => Fetch.post('/busitemdemandreview/saveOrUpdate', params),
  /**
   * 提交需求评审
   * @param {*} params
   * @returns
   */
  submitDemandReview: (params = {}) => Fetch.post('/busItemProcess/demandReview', params),
  /**
   *  获取需求评估 操作记录
   * @param {} itemCode
   * @returns
   */
  getDemandReviewHistoryLog: (itemCode) => Fetch.post('/busitemdemandreviewlog/getByItemCode', { itemCode, }),
  /**
   * 提交初定级
   */
  submitPreliminaryLevel: (params) => Fetch.post('/busItemProcess/firstGrading', params),
  /**
   * 保存或更新 初定级
   */
  updatePreliminaryLevel: (params) => Fetch.post('/bus/module/item/demand/firstGrading/saveOrUpdate', params),
  /**
   * 需求管理导出
   */
  exportExcel: ({
    temp,
    query,
    level,
    principal,
    showState,
    users,
    itemSource,
  } = {}) => Fetch.post('/busItemDemand/demandPageExportExcel', {
    temp,
    query,
    level,
    principal,
    showState,
    users,
    itemSource,
  }),

};
// 立项
const setUp = {

  /**
 * 创建和保存项目立项
 *
 */
  createOrSaveSetup(params, prefixed) {
    return request({
      url: `busItemInfo/${prefixed}`,
      method: 'post',
      data: { ...params, },
    });
  },
  /**
   * 删除未提交
   */
  del(id) {
    return request({
      url: 'busItemInfo/delete',
      method: 'post',
      data: {
        id,
      },
    });
  },
  /**
 *  获取流程红点数据
 *
 */
  getProcessData() {
    return request({
      url: `busItemInfo/getRedInfo`,
      method: 'post',
      data: {},
    });
  },

  /**
 * 获取列表数据
 *
 */
  // getListData(params) {
  //   return request({
  //     url: 'busItemInfo/getPage',
  //     method: 'post',
  //     data: {
  //       temp: params.W.code,
  //       query: params.keyWord,
  //       ...params.W.filterValues,
  //       pageNum: params.P,
  //       pageSize: params.N,
  //       id: params.W.id,
  //     },
  //   });
  // },
  getListData: ({
    pageNum,
    pageSize,
    code = '',
    query = '',
    level = '',
    principal = '',
    sponsor = '',
    showState = '',
    users = '',
    id = '',
  } = {}) => Fetch.post('busItemInfo/getPage', {
    pageNum,
    pageSize,
    temp: code,
    query,
    level,
    principal,
    sponsor,
    showState,
    users,
    id,
  }),

  /**
 * 创建任务
 */
  createdTask(params) {
    return request({
      url: 'busItemWork/save',
      method: 'post',
      data: {
        ...params,
      },
    });
  },
  /**
 * 获取任务列表
 */
  getTaskList(params) {
    return request({
      url: 'busItemInfo/getWorkList',
      method: 'post',
      data: {
        ...params,
      },
    });
  },
  /**
 * 保存模板
 */
  saveTemplate(params) {
    return request({
      url: 'busItemWork/saveTemp',
      method: 'post',
      data: {
        ...params,
      },
    });
  },

  /**
 * 获取模板列表
 */
  getTemplateList() {
    return request({
      url: 'busItemTemp/getList',
      method: 'post',
      data: {},
    });
  },

  /**
 * 引用模板
 */

  qutoTemplate(code, id) {
    return request({
      url: 'busItemWork/quote',
      method: 'post',
      data: {
        itemCode: code,
        tempId: id,
      },
    });
  },

  /**
 * 删除任务
 */
  deletedTask(id) {
    return request({
      url: 'busItemWork/delete',
      method: 'post',
      data: {
        id,
      },
    });
  },

  /**
 * 编辑任务
 */
  editedTask(params) {
    return request({
      url: 'busItemWork/update',
      method: 'post',
      data: {
        ...params,
      },
    });
  },

  /**
 * 编辑子任务
 */
  editedTaskChlid(params) {
    return request({
      url: 'busItemWork/updateChild',
      method: 'post',
      data: {
        ...params,
      },
    });
  },

  /**
 * 创建子任务
 */
  createdTaskChild(params) {
    return request({
      url: 'busItemWork/saveChild',
      method: 'post',
      data: {
        ...params,
      },
    });
  },

  /**
 * 获取编辑数据
 */
  getEditData: (itemCode) => Fetch.post('busItemInfo/getDetail', { itemCode, }),
  /**
 * 评审通过
 */
  reviewPass(params) {
    return request({
      url: `busItemProcess/infoReview/${params.result}`,
      method: 'post',
      data: params,
    });
  },

  /**
 * 结果确认  不通过 和 通过
 * @param {} itemCode
 */
  confirmResult(params, apiName = 'pass') {
    return request({
      url: `busItemProcess/itemReview/${apiName}`,
      method: 'post',
      data: params,
    });
  },
  /**
 * 获取方案制定编辑页面数据
 * 1
 */

  reviewInfo(itemCode) {
    return request({
      url: 'busItemInfo/getWorkDetail',
      method: 'post',
      data: {
        itemCode,
      },
    });
  },
  /**
 * 导入任务模板
 * itemCode
 * file
 */
  importExcel: (params) => Fetch.post('/busItemWork/importWork', params),
};
// 实施
const impose = {
  /**
   * 获取 项目实施列表
   *
   */
  getImposeListGantt(params) {
    return request({
      url: `busItemInfo/getImplPage`,
      method: 'post',
      data: {
        temp: params.W.code,
        query: params.keyWord,
        pageNum: params.P,
        pageSize: params.N,
      },
    });
  },

  getImposeListMain: ({
    pageNum,
    pageSize,
    query = '',
    code = '',
    // / 负责人
    principalStr = '',
    // / 项目级别
    projectLevelStr = null,
    // / 项目完成时间开始
    realDateBegin = '',
    // / 项目完成时间结束
    realDateEnd = '',
    // / 小组
    teamId = '',
    // 项目实施状态
    enforceState = '',
  } = {}) => Fetch.post('busItemInfo/getImplPage', {
    pageNum,
    pageSize,
    query,
    temp: code,
    principalStr,
    projectLevelStr,
    realDateBegin,
    realDateEnd,
    teamId,
    enforceState,
  }),

  /**
   *  处理 项目实施
   *
   */
  handleImpose(params) {
    return request({
      url: `busItemWork/make`,
      method: 'post',
      data: params,
    });
  },

  /**
   *  获取任务评审历史
   */
  taskInjectHistory(id) {
    return request({
      url: `busItemWork/getMakeList`,
      method: 'post',
      data: {
        workId: id,
      },
    });
  },

  /**
   * 任务处理
   */
  handleTask(params) {
    return request({
      url: `busItemWork/make`,
      method: 'post',
      data: params,
    });
  },
  /**
 *
 * 任务处理补充
 */
  handletaskAppend(params) {
    return request({
      url: `busItemWork/additional`,
      method: 'post',
      data: params,
    });
  },

  /**
   * 确认结果
   *
   */
  confirmResult: ({
    itemCode,
    remark,
  }) => Fetch.post('busItemProcess/implReview/confirm', {
    remark,
    itemCode,
  }),

  /**
   * 获取  申请列表
   */

  changeList(itemCode) {
    return request({
      url: `busItemWorkReview/change/list`,
      method: 'post',
      data: { itemCode, },
    });
  },

  /**
   * 变更申请
   * @param {} params
   */
  changeApply(params, field) {
    let data = {};
    if (field === 'apply') {
      data = params;
    }
    if (field !== 'apply') {
      data = {
        changeId: params,
      };
    }
    return request({
      url: `busItemWorkReview/change/${field}`,
      method: 'post',
      data: data,
    });
  },
  /**
    * 保存变更申请
    */
  saveChangeApply: (itemCode) => Fetch.post('/busItemInfo/saveChange', { itemCode, }),
  /**
   * 项目实施甘特图
   */
  queryGantt: ({ code, keyWord, pageNum, pageSize, } = {}) => Fetch.post('/busItemInfo/getGanttSearch', {
    temp: code,
    query: keyWord,
    pageNum: pageNum,
    pageSize: pageSize,
  }),

  /**
   * 新增项目总结
   * @param {*} param0
   * @returns
   */
  submitProjectSummary: ({ projectId, content, enclosure, } = {}) => Fetch.post('/v1/post/project/perpetrate/summary', {
    projectId,
    content,
    enclosure,
  }),

  /**
   * 查询项目周报-项目总结
   * @param {*} param0
   * @returns
   */
  getProjectSummary: ({ projectId, startTime, endTime, members, } = {}) => Fetch.post('/v1/get/project/perpetrate/weekly/project_summary',
    { projectId, startTime, endTime, members, }
  ),

  /**
   * 查询项目中任务负责人和参与人
   * @param {*} projectId
   * @returns
   */
  getProjectPrincipalAndParticipant: (projectId) => Fetch.post('/v1/get/project/perpetrate/member/principal_and_participant', { projectId, }),
  /**
   * 查询项目周报子任务记录
   * @param {*} param0
   * @returns
   */
  getProjectWeeklySubTaskHistory: ({ projectId, startTime, endTime, members, } = {}) => Fetch.post('/v1/get/project/perpetrate/weekly/subtask_history', { projectId, startTime, endTime, members, }),

  /**
   * 查询项目周报-相关待办
   * @param {*} param0
   * @returns
   */
  getProjectWeeklyToDo: ({ projectId, startTime, endTime, members, planStartTime, planEndTime, } = {}) => Fetch.post('/v1/get/project/perpetrate/weekly/todo', { projectId, startTime, endTime, members, planStartTime, planEndTime, }),

  /**
   * 项目终止
   */
  termination: ({ itemCode, remark, } = {}) => Fetch.post('/v1/post/item/impl/termination', { itemCode, remark, }),
  /**
   * 项目重启
   * @param {*}
   * @returns
   */
  restart: ({ itemCode, remark, } = {}) => Fetch.post('/v1/post/item/impl/restart', { itemCode, remark, }),

};
const template = {
  /**
 * 创建模板
 *
 */
  // createTemplate(params) {
  //   return request({
  //     url: `/busItemTemp/save`,
  //     method: 'post',
  //     data: { ...params, },
  //   });
  // },
  /**
 * 编辑某个模板
 */
  // editTemplate(params) {
  //   return request({
  //     url: `/busItemTemp/update`,
  //     method: 'post',
  //     data: { ...params, },
  //   });
  // },

  /**
  * 模板 创建-编辑 操作
  * @param {*} params
  * @param {*} isEdit  默认 创建
  */
  createOrEditTemplate(params, isEdit = false) {
    return request({
      url: `/busItemTemp/${isEdit ? 'update' : 'save'}`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 * 获取模板列表
 */
  templateList(params = {}) {
    return request({
      url: `/busItemTemp/getList`,
      method: 'post',
      data: params,
    });
  },
  /**
 * 删除某个模板
 */
  deleteTemplate(id) {
    return request({
      url: `/busItemTemp/delete`,
      method: 'post',
      data: {
        id: id,
      },
    });
  },

  /**
 * 获取对应模板的任务列表
 */
  getTaskList(tempId, parentId = 1) {
    return request({
      url: `/busItemTemp/getWorkList`,
      method: 'post',
      data: {
        tempId,
        // parentId,
      },
    });
  },

  /**
 * 创建任务
 */
  createTask(params) {
    return request({
      url: `/busItemTemp/saveWork`,
      method: 'post',
      data: { ...params, },
    });
  },

  /**
 * 删除任务
 */
  deleteTask(id) {
    return request({
      url: `/busItemTemp/deleteWork`,
      method: 'post',
      data: { id: id, },
    });
  },

  /**
 * 编辑某个任务
 */
  editTask(params) {
    return request({
      url: `/busItemTemp/updateWork`,
      method: 'post',
      data: { ...params, },
    });
  },

};
/**
 * 项目查询
 */
const search = {
  search: ({
    pageNum,
    pageSize,
    startTime = '',
    endTime = '',
    level = '',
    showStateStr = '',
    principal = '',
    users = '',
    createUser = '',
    query = '',
  } = {}) => Fetch.post('busItemDemand/getItemDemandAll', {
    pageNum,
    pageSize,
    startTime,
    endTime,
    level,
    showStateStr,
    principal,
    users,
    createUser,
    query,
  }),
  /**
   * 項目统计分析
   * @param {} param
   * @returns
   */
  projectStatistics: ({
    pageNum,
    pageSize,
    template,
  } = {}) => Fetch.post('/bus/item/progress/getItemCount', {
    pageNum,
    pageSize,
    template,
  }),

};
/**
 *  项目名称列表
 * @returns
 */
const projectNameList = () => Fetch.post('/busItemInfo/getList', {});

/**
 *  需求看板
 */
const demandBoard = {
  /**
   * 根据用户角色查询需求看板的表头配置
   *  @param {*} type  1需求2项目
   * @param {} userId
   * @returns
   */
  searchRoleTableColumnConfig: (userId, type = 1) => Fetch.post('/busitemkanbanpermission/get', {
    userId,
    type,
  }),
  /**
   * 保存或修改需求看板表头配置
   *  @param {*} type  1需求2项目
   * @param {*} params
   * @returns
   */
  updateTableColumnConfig: (params, type = 1) => Fetch.post('/busitemkanbanpermission/saveOrUpdate', {
    permission: params,
    type: type,
  }),
  /**
   * 列表数据
   * @param {*} params
   * @returns
   */
  searchList: ({
    direction = '',
    orderBy = '',
    orderByAndDirection = '',
    pageNum = 1,
    pageSize = 10,
    query = '',
    organizer = null,
    itemType = null,
    level = null,
    isProjectApproval = null,
    processState = null,

  } = {}) => Fetch.post('/busItemDemand/pageKanban', {
    direction,
    orderBy,
    orderByAndDirection,
    pageNum,
    pageSize,
    query,
    organizer,
    itemType,
    level,
    isProjectApproval,
    processState,
  }),
  /**
   * 项目看板数据查询
   */
  searchProjectBoardList: ({
    direction = '',
    orderBy = '',
    orderByAndDirection = '',
    pageNum = 1,
    pageSize = 10,
    query = '',
    principal = null,
    projectLevel = null,
    priority = null,
    showState = null,
    gradingEndTime = '',
    gradingStartTime = '',
    projectEndBeginTime = '',
    projectEndEndTime = '',
    projectStartBeginTime = '',
    projectStartEndTime = '',
  } = {}) => Fetch.post('/busItemInfo/itemKanbanPage', {
    query,
    principal,
    projectLevel,
    priority,
    direction,
    orderBy,
    orderByAndDirection,
    showState,
    pageNum,
    gradingEndTime,
    gradingStartTime,
    projectEndBeginTime,
    projectEndEndTime,
    projectStartBeginTime,
    projectStartEndTime,
    pageSize,
  }),
  /**
   * 项目看板项目编辑
   */
  projectBoardEdit: (params) => Fetch.post('/busItemInfo/editBusItemInfo', params),

  /**
   * 项目看板 项目 里程碑保存创建
   * @param {*} params
   * @returns
   */
  projectBoardTaskSave: (params) => Fetch.post('/busItemWork/saveKanban', params),
  /**
   * 项目看板 项目子任务保存创建
   *
   */
  projectBoardTaskChildSave: (params) => Fetch.post('/busItemWork/saveChildKanban', params),
  /**
   *  项目看板 任务删除
   */
  projectBoardTaskDel: (params) => Fetch.post('/busItemWork/deleteKanban', { id: params, }),
  /**
   * 项目看板导出
   */
  exportProject: ({
    createUser,
    endTime,
    itemType,
    itemUser,
    principal,
    priority,
    projectLevel,
    showState,
    startTime,
    title,
    user,

  } = {}) => Fetch.post('/v1/post/busItemInfo/itemKanbanPage/export', {
    createUser,
    endTime,
    itemType,
    itemUser,
    principal,
    priority,
    projectLevel,
    showState,
    startTime,
    title,
    user,
  }),
  /**
   * 需求看板导出
   */
  demandExport: ({
    isProjectApproval,
    itemType,
    level,
    organizer,
    processState,
    query,
  } = {}) => Fetch.post('/v1/post/busItemDemand/pageKanban/export', {
    isProjectApproval,
    itemType,
    level,
    organizer,
    processState,
    query,
  }),
};
/**
 *  导出联合查询
 */
const exportJointQueryExcel = ({
  pageNum,
  pageSize,
  startTime = '',
  endTime = '',
  level = '',
  showStateStr = '',
  principal = '',
  users = '',
  createUser = '',
  query = '',
} = {}) => Fetch.post('/busItemDemand/exportItemDemandAll', {
  pageNum,
  pageSize,
  startTime,
  endTime,
  level,
  showStateStr,
  principal,
  users,
  createUser,
  query,
});

const ProjectAPI = {
  base,
  demand,
  setUp,
  impose,
  template,
  search,
  demandBoard,
  projectNameList,
  exportJointQueryExcel,
};

export default ProjectAPI;
