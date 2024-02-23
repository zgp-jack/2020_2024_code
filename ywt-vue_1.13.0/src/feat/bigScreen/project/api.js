
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

export default {
  ProjectAmount,
  ProjectTypeSum,
  ProjectTotalView,
  ProjectDeparment,
  ProjectProcess,
};
