import { member, } from '@/filters';
import { arrayToString, } from '@/utils/common';
import _ from 'lodash';
// 操作项目的 处理 PS：后面通过Hook 去处理
const state = {
  // 需求编号
  itemCode: '',
  // 需求基本信息
  researchInfo: {},
  // 是否是查看模式
  isLook: false,
  //  面板禁用选项
  pancelDisabledOptions: {
    needInfo: false,
    researchInfo: false,
    researchView: false,
    projectInfo: false,
    researchViewPlan: false,
    answerInfo: false,
    faultInfo: false,
    demandAnalysis: false,
    technicalAnalysis: false,
    demandAssess: false,
    demandReview: false,
    preliminaryLevel: false,

  },
  // 面板 编辑
  pancelEditOptions: {
    needInfo: false,
    researchInfo: false,
  },
  //  面板的 展开控制
  pancelExpandOptions: {
    needInfo: false,
    faultInfo: false,
    answerInfo: false,
    researchInfo: false,
    projectInfo: false,
    summary: false,
    mettingInfo: false,
    demandAnalysis: false,
    technicalAnalysis: false,
    demandAssess: false,
    demandReview: false,
    preliminaryLevel: false,

  },
  // 组装面板数据
  panelGroupData: {},
  // 事件 操作
  events: {
    submit: null,
    save: null,
    sendSuccess: null,
    process: null,
    addTask: null,
    templateUpdate: null,
    // 合同新增 实施的列表更新
    imposeList: null,
    // 针对数据字典操作
    treeClick: null,
    // 资产类别
    assetsSwitchCallBack: null,
    // 合同详情更新
    contractDetail: null,
    // 投票的操作 列表更新
    submitVote: null,
  },
  // 任务列表
  taskListMap: {},
  // 选中的 任务 id
  checkedTaskIDs: '',
  // 项目实施
  imposeOptionsVisibles: {
    apply: false,
    attachment: false,
    metting: false,
    contract: false,
  },
  // 附加数据
  attachment: {},
  // 是否查看任务列表
  isLookTask: false,
  // 确认结果 还是 评审 默认评审
  confirmOrReview: 'review',
  // 用于 任务编辑权限控制
  // leader: '最高权限' join: '仅可对任务编辑' taskLoader: '可以对当前任务负责人 = 自己 进行编辑+添加+删除' taskJoin:'可以对当前任务参与人 包含 自己 进行编辑' 
  taskPermissionName: '',
};
const mutations = {
  /**
    * 设置需求编号
    */
  SET_ITEM_CODE: (state, data) => {
    state.itemCode = data;
  },

  /**
 *   需求基本信息
 */
  SET_RESEARCH_INFO: (state, data) => {
    const value = Object.assign({}, data);
    if (!Object.values(data).length) {
      state.researchInfo = value;
      return;
    }
    state.researchInfo = value;
    let users = null;
    if (value.users instanceof Array && value.users.length) {
      users = value.users;
    } else if (value.user && value.users.length) {
      if (/\d+\,?$/g.test(value.users)) {
        users = value.users?.split(',').map(Number) || [];
      }
    } else {
      users = [];
    }
    state.researchInfo.users = users;
  },
  /**
   * 附件数据
   */
  SET_ATTACHMENT_DATA: (state, data) => {
    state.attachment = data;
  },

  /**
 * 是否是查看模式
 */
  SET_PERVIEW: (state, data) => {
    state.isLook = data;
  },
  /**
   * 设置 不同面板的禁用状态
   */
  SET_PANCEL_DISABLED: (state, data) => {
    state.pancelDisabledOptions[data.name] = data.disabled;
  },
  /**
   * 设置  不同面板的编辑状态
   */
  SET_PANCEL_EDIT: (state, data) => {
    state.pancelEditOptions[data.name] = data.edit;
  },
  /**
   * 设置不同面板的 收缩展开
   */
  SET_PANCEL_EXPAND: (state, data) => {
    state.pancelExpandOptions[data.name] = data.expand;
    for (const i in state.pancelExpandOptions) {
      if (i !== data.name) {
        state.pancelExpandOptions[i] = false;
      }
    }
  },
  /**
   * 事件注入
   */
  SET_INJECT_EVENT: (state, data) => {
    state.events[data.name] = data.fun;
    // 是否开始就执行一次 ，默认不执行
    if (data.immediate) {
      data.fun();
    }
  },
  /**
   * 写入任务列表
   */
  SET_TASK_LIST: (state, data) => {
    if (data.length) {
      for (const i of data) {
        _.set(i, 'isChecked', false);
      }
      state.taskListMap = _.keyBy(data, 'id');
    } else {
      state.taskListMap = {};
    }
  },
  /**
   *  任务列表 IDs
   */
  SET_TASK_ID: (state, data) => {
    state.checkedTaskIDs = arrayToString(data);
  },
  /**
   * 设置 任务列表中的 cheecked 状态
   */
  SET_TASK_CHECKED: (state, data) => {
    state.taskListMap[data.row.parentId].isChecked = data.checked;
    state.taskListMap[data.row.id].isChecked = data.checked;
  },
  /**
   * 写入 面板数据
   */
  SET_PANEL_GROUP_DATA: (state, data) => {
    state.panelGroupData = data;
  },
  /**
   * 操作 项目实施 申请/会议/发票/合同 的查看
   */
  SET_IMPOSE_OPTIONS: (state, data) => {
    state.imposeOptionsVisibles[data.name] = data.visible;
  },
  /**
   *   写入 是否查看任务列表
   */
  SET_LOOK_TASK: (state, data) => {
    state.isLookTask = data;
  },
  /**
   *  设置 确认结果 还是 评审
   */
  SET_CONFIRM_REVIEW: (state, data) => {
    state.confirmOrReview = data;
  },
  SET_TASK_PERMISSION_NAME: (state, data) => {
    state.taskPermissionName = data;
  },
};
const getters = {
  taskList: state => {
    return _.uniqBy(Object.values(state['taskListMap']), 'id');
  },
  // 参与人员
  participants: state => {
    const list = _.uniqBy(Object.values(state['taskListMap']), 'id');
    if (!list.length) {
      return [];
    }
    const principals = [];
    for (const i of list) {
      if (i.principal) {
        principals.push(member(i.principal));
      }
    }

    const people = _.map(_.filter(list, 'users'), 'users');
    let participants = [];
    if (people.length) {
      participants = people.join(',').split(',');
    }

    return _.uniq([...participants, ..._.uniq(principals)]);
  },
  // 任务列表的id
  checkedTaskIds: (state, gett) => {
    return arrayToString(_.map(_.filter(gett.taskList, (v) => {
      return v.state !== 2 && v.quoteId === 0;
    }), 'id'));
  },
  getterPanelGroupData: (state) => {
    return state['panelGroupData'] || {};
  },

};
const actions = {
  FETCEH_RESET_PANCEL_DISABLED_OPTIONS: ({ commit, state, }, d) => {
    const options = state.pancelDisabledOptions;
    for (const i in options) {
      commit('SET_PANCEL_DISABLED', { name: i, disabled: false, });
    }
  },
  FETCH_PERFORM_EVENT: ({ dispatch, coomit, state, }, d) => {
    if (state.events[d.name] && state.events[d.name]() instanceof Function) {
      state.events[d.name](d.name, d);
    }
  },
  FETCH_PANEL_DATA: ({ commit, }, d) => {
    commit('SET_PANEL_GROUP_DATA', d);
  },
  FETCH_TASK_LIST_DISABLED: ({ commit, state, getters, }, d) => {
    //  const setDisabled = function (val) {
    //   for (let i of val) {
    //     if (i.parentId) {

    //     }
    //   }
    // };

    // const setDisabled = function (val) {
    //   if (val.row.parentId) {
    //     commit('SET_TASK_CHECKED', val);
    //   }
    // };
    // setDisabled(d);
    // if (d.row.children.length) {
    //   for (const i of d.row.children) {
    //     setDisabled({ row: i, checked: d.checked, is: 1, });
    //   }
    // }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

