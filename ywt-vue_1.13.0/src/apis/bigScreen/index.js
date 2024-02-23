
import Fetch from '@/utils/fetch';

/**
 * 项目数量
 */
const ProjectAmount = () => Fetch.post('/bus/bigScreen/item/getItemStatistics', {});
/**
 *项目分类
 */
const ProjectTypeSum = ({ projectLevel, } = {}) => Fetch.post('/bus/bigScreen/item/getItemListByType', { projectLevel, });
/**
 * 项目总体视图
 */
const ProjectTotalView = () => Fetch.post('/bus/bigScreen/item/getItemList', {});
/**
 * 项目科室排名
 */
const ProjectDeparment = () => Fetch.post('/bus/bigScreen/item/getItemDeptOrder', {});
/**
 * 项目流程
 */

const ProjectProcess = ({ itemCode, } = {}) => Fetch.post('/bus/bigScreen/item/getProcessList', { itemCode, });

/**
 * 工单报修类型
 * 查询时间范围1今日2本月
 */
const WorkOrderRepairClass = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getOrderTypeData', {});

/**
 * 报修科室排名
 * 查询时间范围1今日2本月
 */
const WorkDeparmentRank = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getOrderDeptData', {});
/**
 * 故障列表排名
 * 查询时间范围1今日2本月
 */
const WorkFaultClassRank = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getOrderFaultTypeData', {});
/**
 * 院区及科室报修
 */
const WorkDeparmentRepair = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getOrderHospitalData', {});
/**
 * 工程师接单数
 */
const WorkEngineerOrderNum = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getOrderEngineerData', {});
/**
 * 会议安排
 */
const WorkMeetingArrange = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getMeetingList', {});
/**
 * 进行中的工单
 */
const WorkInProgressOrder = ({ dateType, } = {}) => Fetch.post('/bus/bigScreen/order/getProcessOrder', {});
/**
 * 人员排班情况
 */
const WorkPeopleRowInfo = ({ time, } = {}) => Fetch.post('/bus/bigScreen/order/getTodaySchedulData', { time, });
/**
 *  报警消息弹窗
 */
const AlertMessage = 'orderwarningws';
/**
 *  报警消息列表
 */
const AlertMsgList = (params = { pageNum: 0, pageSize: 10, }) => Fetch.post('/busOrderFault/getWarningPage', params);

export default {
  ProjectAmount,
  ProjectTypeSum,
  ProjectTotalView,
  ProjectDeparment,
  ProjectProcess,
  WorkOrderRepairClass,
  WorkDeparmentRank,
  WorkFaultClassRank,
  WorkDeparmentRepair,
  WorkEngineerOrderNum,
  WorkMeetingArrange,
  WorkInProgressOrder,
  WorkPeopleRowInfo,
  AlertMessage,
  AlertMsgList,
};
