import request from '@/common/utils/request';

export function getDicListByType(type) {
  return request.get(`/system/dict/data/type/${type}`);
}

export function getBigScreenConfigData(data) {
  return request.get('/system/bigScreenConfig/getConfig', data);
}

export function updateBigScreenConfigData(data) {
  return request.put('/system/bigScreenConfig/updateConfig', data);
}

export function getDepartmentCodeConfigData(data) {
  return request.get('/system/departCodeConfig/getConfig', data);
}

export function updateDepartmentCodeConfigData(data) {
  return request.put('/system/departCodeConfig/updateConfig', data);
}

export function getAssetCodeConfigData(data) {
  return request.get('/system/assetCodeConfig/getConfig', data);
}

export function updateAssetCodeConfigData(data) {
  return request.put('/system/assetCodeConfig/updateConfig', data);
}

export function getWorkOrderAuditConfigData(data) {
  return request.get('/system/orderReviewConfig/getConfig', data);
}

export function updateWorkOrderAuditConfigData(data) {
  return request.post('/system/orderReviewConfig/save', data);
}

export function getAttendanceConfigData(data) {
  return request.get('/system/serviceAttendanceConfig/getConfig', data);
}

export function updateAttendanceConfigData(data) {
  return request.put('/system/serviceAttendanceConfig/updateConfig', data);
}

// 查询系统工单故障分类耗时配置树形结构
export function getTimelinessConfigTreeData(data) {
  return request.get('/system/timelinessConfig/queryTreeList', data);
}

export function getRateConfig(data) {
  return request.get('/system/timelinessConfig/getRateConfig', data);
}

export function updateTimelinessConfigData(data) {
  return request.put('/system/timelinessConfig/updateTime', data);
}
/* 修改系统时效性评级规则配置 */
export function updateRateConfig(data) {
  return request.put('/system/timelinessConfig/updateRateConfig', data);
}

export function getWorkOrderTipsConfigData(data) {
  return request.get('/system/alarmPromptConfig/getConfig', data);
}

export function updateWorkOrderTipsConfigData(data) {
  return request.put('/system/alarmPromptConfig/updateConfig', data);
}

export function getWorkOrderAcceptDepartmentConfigData(data) {
  return request.get('/system/receiveDepartConfig/queryAllList', data);
}

export function updateWorkOrderAcceptDepartmentConfigData(data) {
  return request.post('/system/receiveDepartConfig/saveList', data);
}

// 获取科室列表
export function getDepartmentListData(data) {
  return request.get('/system/dept/list', data);
}

export function getWorkOrderEvaluateConfigData(data) {
  return request.get('/system/orderEvaluateConfig/getConfig', data);
}

export function updateWorkOrderEvaluateConfigData(data) {
  return request.put('/system/orderEvaluateConfig/updateConfig', data);
}
// 知识审核
export function getKnowledgeReviewConfigData(data) {
  return request.get('/system/knowledgeReviewConfig/getConfig', data);
}

export function updateKnowledgeReviewConfigData(data) {
  return request.put('/system/knowledgeReviewConfig/updateConfig', data);
}

export function getFaultTypeListData(data) {
  return request.get('/system/knowledgeReviewConfig/getFaultTypeList', {
    params: {
      ...data,
    },
  });
}

export function addKnowledgeReviewConfigData(data) {
  return request.post('/system/knowledgeReviewConfig/add', data);
}

export function editKnowledgeReviewConfigData(data) {
  return request.put('/system/knowledgeReviewConfig/edit', data);
}

// 自动派单
export const getorderAutoDispatchConfigData = (data) => {
  return request.get('/system/orderAutoDispatchConfig/getConfig', data);
};

export const getOrderFaultTypeListData = (data) => {
  return request.get('/system/orderAutoDispatchConfig/getFaultTypeList', {
    params: { ...data, },
  });
};

export const getRepairDepartListData = (data) => {
  return request.get('/system/orderAutoDispatchConfig/getRepairDepartList', {
    params: { ...data, },
  });
};

export const updateOrderConfigData = (data) => {
  return request.put('/system/orderAutoDispatchConfig/updateConfig', data);
};

export const addOrderAutoDispatch = (data) => {
  return request.post('/system/orderAutoDispatchConfig/add', data);
};

export const editOrderAutoDispatch = (data) => {
  return request.put('/system/orderAutoDispatchConfig/edit', data);
};

export const getReminderRulesConfigData = (data) => {
  return request.get('/system/reminderRulesConfig/getConfig', data);
};

export const updateReminderRulesConfigData = (data) => {
  return request.put('/system/reminderRulesConfig/updateConfig', data);
};

export const getOrderExpectedTimeConfigData = (data) => {
  return request.get('/system/orderExpectedTimeConfig/getConfig', data);
};

/* 获取期望完成时间类型 */
export const getOrderExpectedTimeConfigType = (data) => {
  return request.get('/system/orderExpectedTimeConfig/getExpectedTimeType', data);
};

export const updateOrderExpectedTimeConfigData = (data) => {
  return request.put('/system/orderExpectedTimeConfig/updateConfig', data);
};

export const getReceiveDepartConfigData = (data) => {
  return request.get('/system/receiveDepartConfig/getConfig', data);
};

export const updateReceiveDepartConfigData = (data) => {
  return request.put('/system/receiveDepartConfig/updateConfig', data);
};

export const getOrderReminderConfigData = (data) => {
  return request.get('/system/orderReminderConfig/getConfig', data);
};

export const updateOrderReminderConfigData = (data) => {
  return request.put('/system/orderReminderConfig/updateConfig', data);
};
