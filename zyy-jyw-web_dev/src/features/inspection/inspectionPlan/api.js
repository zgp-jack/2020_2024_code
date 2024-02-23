import request from '@/common/utils/request';

/* 巡检计划资产分页查询 */
const planAstList = (data) => request.post('/inspection/plan/planAstList', data);

/* 巡检计划单元分页查询 */
const planUnitList = (data) => request.post('/inspection/plan/planUnitList', data);

/* 巡检计划选择配置项 */
const planItemList = (data) => request.get('/inspection/plan/planItemList', data);

/* 查询巡检计划选择单元 */
const getUnitList = (data) => request.get('/inspection/plan/unitList', data);

/* 查询巡检计划选择所有单元 */
const unitAllList = (data) => request.get('/inspection/plan/unitAllList', data);

/* 查询巡检计划选择资产 */
const getAstList = (data) => request.get('/inspection/plan/astList', data);

/* 查询巡检计划选择所有资产 */
const astAllList = (data) => request.get('/inspection/plan/astAllList', data);

/* 切换状态 */
const editState = (data) => request.put('/inspection/plan/editState', data);

/* 切换状态 */
const addPlan = (data) => request.post('/inspection/plan/add', data);

/* 切换状态 */
const editPlan = (data) => request.put('/inspection/plan/edit', data);

/* 巡检计划获取详情 */
const getInfo = (id) => request.get(`/inspection/plan/${id}`);

/* 获取资产配置项 */
const getAstItemList = (id) => request.get(`/inspection/plan/getAstItemList/${id}`);

/* 获取单元配置项 */
const getUnitItemList = (id) => request.get(`/inspection/plan/getUnitItemList/${id}`);

export default {
  planAstList,
  planUnitList,
  planItemList,
  editState,
  addPlan,
  editPlan,
  getUnitList,
  getAstList,
  getInfo,
  getAstItemList,
  getUnitItemList,
  unitAllList,
  astAllList,
};
