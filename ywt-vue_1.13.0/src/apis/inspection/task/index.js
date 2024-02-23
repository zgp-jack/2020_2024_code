/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-18 10:57:29
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 17:49:24
 * @Description:巡检任务接口
 */
import Fetch from '@/utils/fetch';

/**
 * 资产/部门类型分页
 * @param {
 *
 * assetsType
 * deptId
 * query
 * pageSize
 * pageNum
 * } param0
 * @returns
 */
const listByPropOrDept = ({
  assetsType,
  deptId,
  query,
  pageSize,
  pageNum,

} = {}) => Fetch.post('/bus/inspection/work/assets/page', {
  assetsType,
  deptId,
  query,
  pageSize,
  pageNum,
});
/**
 * 巡检单元分页
 * @param {
 * unitFolder
 * unit
 * query
 * pageSize
 * pageNum
 * } param0
 * @returns
 */
const listByinspectionUnit = ({
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/inspection/work/unit/page', {
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
});
/**
 * 保存巡检
 *
 * @param {
 * id 任务ID
 * result 巡检结果（字典：inspectionResult）
 * remark 详细说明
 * processPhoto 过程照片
 * errorMake 【当为异常时必填】巡检异常办法（字典：errorMake）
 * rectificationTime 【当为异常（限期整改）时必填】整改时间
 * faultType 【当为异常（转工单）时必填】故障分类
 * faultRemark 【当为异常（转工单）时必填】故障描述
 * reqTime 【当为异常（转工单）时必填】预计工时
 * details 巡检内容启用与实测值JSON （id【内容ID】，writeValue【填写实测值】，processResult【最终结果，1（默认）正常，0异常】，processRemark【整改要求及处罚意见】）
 * repairPhone 报修电话（默认当前人登录电话
 * degree 紧急程度
 * rangeType 影响范围
 * dispatchUser 指派人
 * dispatchTeam 指派小组
 * } param0
 * @returns
 */
const saveInspection = ({
  id,
  result,
  remark,
  processPhoto,
  errorMake,
  rectificationTime,
  faultType,
  faultRemark,
  reqTime,
  details,
  repairPhone,
  degree,
  rangeType,
  dispatchUser,
  dispatchTeam,
} = {}) => Fetch.post('/bus/inspection/work/save', {
  id,
  result,
  remark,
  processPhoto,
  errorMake,
  rectificationTime,
  faultType,
  faultRemark,
  reqTime,
  details,
  repairPhone,
  degree,
  rangeType,
  dispatchUser,
  dispatchTeam,
});
/**
 * 提交巡检
 *
 * @param {
 * id 任务ID
 * result 巡检结果（字典：inspectionResult）
 * remark 详细说明
 * processPhoto 过程照片
 * errorMake 【当为异常时必填】巡检异常办法（字典：errorMake）
 * rectificationTime 【当为异常（限期整改）时必填】整改时间
 * faultType 【当为异常（转工单）时必填】故障分类
 * faultRemark 【当为异常（转工单）时必填】故障描述
 * reqTime 【当为异常（转工单）时必填】预计工时
 * details 巡检内容启用与实测值JSON （id【内容ID】，writeValue【填写实测值】，processResult【最终结果，1（默认）正常，0异常】，processRemark【整改要求及处罚意见】）
 * repairPhone 报修电话（默认当前人登录电话
 * degree 紧急程度
 * rangeType 影响范围
 * dispatchUser 指派人
 * dispatchTeam 指派小组
 * } param0
 * @returns
 */
const submitInspection = ({
  id,
  result,
  remark,
  processPhoto,
  errorMake,
  rectificationTime,
  faultType,
  faultRemark,
  reqTime,
  details,
  repairPhone,
  degree,
  rangeType,
  dispatchUser,
  dispatchTeam,
  orderCreateTime,
  learningId,
  responseType,
  deptId,
} = {}) => Fetch.post('/bus/inspection/work/confirm', {
  id,
  result,
  remark,
  processPhoto,
  errorMake,
  rectificationTime,
  faultType,
  faultRemark,
  reqTime,
  details,
  repairPhone,
  degree,
  rangeType,
  dispatchUser,
  dispatchTeam,
  orderCreateTime,
  learningId,
  responseType,
  deptId,
});
/**
 * 获取巡检详情（有流程）
 * @param {*} id
 * @returns
 */
const detailWithProcess = (id) => Fetch.post('/bus/inspection/work/infoAndProcess', {
  id,
});
/**
 * 获取巡检详情（无流程）
 * @param {
 *  id 任务ID
 *  state 状态（1：提交，0：保存，不传：全部）
 * }
 * @returns
 */
const detail = ({
  id,
  state,
}) => Fetch.post('/bus/inspection/work/info', {
  id,
  state,
});
/**
 * 获取巡检任务历史记录
 * @param {
 *  id 任务id
 *  state 状态（1：提交(历史)，0：保存（当前），不传：全部）
 *
 * }
 * @returns
 */
const history = ({
  id,
  state = 1,
}) => Fetch.post('/bus/inspection/work/process', {
  id,
  state,
});

export default {
  listByPropOrDept,
  listByinspectionUnit,
  saveInspection,
  submitInspection,
  detailWithProcess,
  detail,
  history,
};
