/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 13:42:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-02 15:28:36
 * @Description: 数据字典 store
 */
import Cookies from 'js-cookie';
import {
  getDepartmentList,
  getDiclist,
  getEngineerList,
} from '@/apis/dictionary';

import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';

const DepartmentKey = 'Department';
const DepartmentVersionKey = 'Department-Version';
const EngineerKey = 'Engineer';
const EngineerVersionKey = 'Engineer-Version';
const DicListKey = 'DicList';
const DicListVersionKey = 'Dic-List-Version';

const state = {
  engineerList: getJSON(EngineerKey) || [],
  engineerVersion: Cookies.get(EngineerVersionKey),
  departmentList: getJSON(DepartmentKey) || [],
  departmentVersion: Cookies.get(DepartmentVersionKey),
  dicList: getJSON(DicListKey) || [],
  dicListVersion: Cookies.get(DicListVersionKey),
  // 故障来源
  sourceList: getJSON(DicListKey)?.faultSource || [],
  // 紧急程度
  degreeList: getJSON(DicListKey)?.gradeUrgency || [],
  // 影响范围
  rangeList: getJSON(DicListKey)?.faultScope || [],
  // 响应类型
  responseList: getJSON(DicListKey)?.responseType || [],
  // 终止原因
  stopReasonList: getJSON(DicListKey)?.stopReason || [],
  // 暂停原因
  suspendReasonList: getJSON(DicListKey)?.suspendReason || [],
  // 转交原因
  transReasonList: getJSON(DicListKey)?.transReason || [],
  // 退回原因
  returnReasonList: getJSON(DicListKey)?.returnReception || [],
  // 故障分类
  faultTypeList: getJSON(DicListKey)?.faultClassification || [],
  // 审核未通过原因
  notPassReasonList: getJSON(DicListKey)?.noExamine || [],
  // 需求类型
  itemType: getJSON(DicListKey)?.itemType || [],
  // 涉及系统
  aboutSystem: getJSON(DicListKey)?.aboutSystem || [],
  // 需求紧急程度
  itemLevel: getJSON(DicListKey)?.itemLevel || [],
  // 状态
  itemProcessShow: getJSON(DicListKey)?.itemProcessShow || [],
  // 项目优先级
  itemPriority: getJSON(DicListKey)?.itemPriority || [],
  // 项目级别
  itemProjectLevel: getJSON(DicListKey)?.itemProjectLevel || [],
  // 终止说明
  itemTerminationReason: getJSON(DicListKey)?.itemTerminationReason || [],
  // 项目类型
  projectType: getJSON(DicListKey)?.projectType || [],
  // 工单升级中的紧急程度
  itemLevelList: getJSON(DicListKey)?.itemLevel || [],
  //  时间轴- 流程状态
  itemTimeLineStatus: getJSON(DicListKey)?.item_process_state || [],

  // 资产-设备状态
  equipmentStateList: getJSON(DicListKey)?.equipmentState || [],
  // 资产-维保公司
  maintainCompanyList: getJSON(DicListKey)?.maintainCompany || [],
  // 资产-资产类型
  assetsTypeList: getJSON(DicListKey)?.assetsType || [],
  // 资产-资产来源
  assetsSourceList: getJSON(DicListKey)?.assetsSource || [],
  // 资产-资产编号前缀
  codePrefixList: getJSON(DicListKey)?.codePrefix || [],
  // 资产-品牌
  brandList: getJSON(DicListKey)?.brand || [],
  // 资产-生产厂家
  manufacturerList: getJSON(DicListKey)?.manufacturer || [],
  // 资产-供应商
  supplierList: getJSON(DicListKey)?.supplier || [],
  // 工单状态
  orderAllProcessList: getJSON(DicListKey)?.orderAllProcess || [],
  // 会议-最小时间单元
  meetingTimeUnit: getJSON(DicListKey)?.metting_time_unit || [],
  // 会议-配套设备
  meetingDevice: getJSON(DicListKey)?.metting_device || [],
  // 会议-会议类型
  meetingType: getJSON(DicListKey)?.meeting_type || [],
  // 会议-会议状态
  meetingState: getJSON(DicListKey)?.meeting_room_state || [],
  // 合同-验收时间
  contractAcceptanceTime: getJSON(DicListKey)?.contract_time_type || [],

};

const mutations = {
  UPDATE_DEPARTMENT_LIST: (state, { list, version, }) => {
    state.departmentList = list;
    setJSON(DepartmentKey, list);
    state.departmentVersion = version;
    Cookies.set(DepartmentVersionKey, version);
  },
  UPDATE_ENGINEER_LIST: (state, { list, version, }) => {
    state.engineerList = list;
    setJSON(EngineerKey, list);
    state.engineerVersion = version;
    Cookies.set(EngineerVersionKey, version);
  },
  UPDATE_DIC_LIST: (state, { list, version, }) => {
    state.dicList = list;
    setJSON(DicListKey, list);
    state.sourceList = list.faultSource;
    state.degreeList = list.gradeUrgency;
    state.rangeList = list.faultScope;
    state.responseList = list.responseType;
    state.stopReasonList = list.stopReason;
    state.suspendReasonList = list.suspendReason;
    state.transReasonList = list.transReason;
    state.returnReasonList = list.returnReception;
    state.faultTypeList = list.faultClassification;
    state.notPassReasonList = list.noExamine;
    state.itemType = list.itemType;
    state.aboutSystem = list.aboutSystem;
    state.itemLevel = list.itemLevel;
    state.itemProcessShow = list.itemProcessShow;
    state.itemPriority = list.itemPriority;
    state.itemProjectLevel = list.itemProjectLevel;
    state.itemTimeLineStatus = list.item_process_state;
    state.itemLevelList = list.itemLevel;
    state.projectType = list.projectType;
    state.equipmentStateList = list.equipmentState;
    state.maintainCompanyList = list.maintainCompany;
    state.assetsTypeList = list.assetsType;
    state.assetsSourceList = list.assetsSource;
    state.codePrefixList = list.codePrefix;
    state.brandList = list.brand;
    state.manufacturerList = list.manufacturer;
    state.supplierList = list.supplier;
    state.orderAllProcessList = list.orderAllProcess;
    state.meetingTimeUnit = list.meeting_time_unit;
    state.meetingDevice = list.meeting_device;
    state.meetingType = list.meeting_type;
    state.meetingState = list.meeting_room_state;
    state.contractAcceptanceTime = list.contract_time_type;
    state.dicListVersion = version;

    Cookies.set(DicListVersionKey, version);
  },
};
const actions = {
  FETCH_DEPARTMENT_LIST: async ({ commit, }, version) => {
    if (state.departmentVersion !== version) {
      const { unit, } = await getDepartmentList();
      commit('UPDATE_DEPARTMENT_LIST', { list: unit, version, });
    }
  },
  FETCH_ENGINEER_LIST: async ({ commit, }, version) => {
    if (state.engineerVersion !== version) {
      const { user, } = await getEngineerList();
      commit('UPDATE_ENGINEER_LIST', { list: user, version, });
    }
  },
  FETCH_DIC_LIST: async ({ commit, }, version) => {
    if (state.dicListVersion !== version) {
      const { dic, } = await getDiclist();
      commit('UPDATE_DIC_LIST', { list: dic, version, });
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
