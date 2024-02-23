import request from '@/common/utils/request';

/* 巡检任务资产分页查询 */
const taskAstList = (data) => request.post('/ins/task/ast/list', data);

/* 巡检任务单元分页查询 */
const taskUnitList = (data) => request.post('/ins/task/unit/list', data);

/* 巡检任务去转交 */
const transmit = (data) => request.post('/ins/task/transmit', data);

/* 巡检任务获取详情 */
const getInfo = (id) => request.get(`/ins/task/getInfo/${id}`);

/* 巡检任务修改 */
const editTask = (data) => request.put('/ins/task/editTask', data);

export function getList(data) {
  return request.get('/inspection/unit/list', data);
}

export default {
  taskAstList,
  taskUnitList,
  transmit,
  editTask,
  getInfo,
};
