import request from '@/common/utils/request';

/* 顶部 */
/* 我的服务台 */
export function getMyObstaclesServer({
  beginDate,
  endDate,
} = {}) {
  return request.get(`/obstacles/home/server`,
    {
      params: {
        beginDate, endDate,
      },
    });
}
/* 我的工单 */
export function getMyObstaclesFault({
  beginDate,
  endDate,
} = {}) {
  return request.get(`/obstacles/home/fault`,
    {
      params: {
        beginDate, endDate,
      },
    });
}
/* 我的巡检 */
export function getMyInsTask({
  beginDate,
  endDate,
} = {}) {
  return request.get(`/ins/home/task`,
    {
      params: {
        beginDate, endDate,
      },
    });
}
/* 我的整改 */
export function getMyInsRectify({
  beginDate,
  endDate,
} = {}) {
  return request.get(`/ins/home/rectify`,
    {
      params: {
        beginDate, endDate,
      },
    });
}
/* 报障待处理 */
export function getMyObstaclesTodo() {
  return request.get(`/obstacles/home/todo`);
}
/* 巡检待处理 */
export function getMyInspectionTodo() {
  return request.get(`/ins/home/todo`);
}
/* 告警消息 */
export function getOrderWarningList({
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/obstacles/home/order/warning`, {
    params: {
      pageNum, pageSize,
    },
  });
}

export function getMessageList(params) {
  return request.get('/system/message/list', {
    params: {
      ...params,
    },
  });
}

export function batchRead(ids) {
  return request.post(`/system/message/batchReading/${ids}`);
}

export function allRead() {
  return request.post('/system/message/allReading');
}

/* 报修来源统计(总数) */
export function orderSourceTotal() {
  return request.get(`/obstacles/home/order/source/total`);
}
/* 报修来源统计（折线图） */
export function getOrderSourceLine({
  type,
} = {}) {
  return request.get(`/obstacles/home/order/source`,
    {
      params: {
        type,
      },
    });
}
/* 报修故障分类排名 */
export function getOrderFaultRank() {
  return request.get(`/obstacles/home/order/fault/rank`);
}
/* 工程师接单数排名 */
export function getOrderUserRank() {
  return request.get(`/obstacles/home/order/user/rank`);
}
