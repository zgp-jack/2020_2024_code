import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import { setTableColumns, getTableColumns, } from '@/apis/common/index';

// 默认排序规则
// 表头
const TABLE_COLUMNS = [
  {
    label: '项目名称',
    prop: 'title',
    width: '245px',
    fixed: true,
    'show-overflow-tooltip': false,
    show: true,
  },
  {
    label: '负责人',
    prop: 'principal',
    width: '102px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '参与人员',
    prop: 'users',
    width: '142px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '开始日期',
    prop: 'startTime',
    width: '200px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '结束日期',
    prop: 'endTime',
    width: '200px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '进度',
    prop: 'totalProgress',
    width: '94px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '实际完成日期',
    prop: 'updateTime',
    width: '220px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '附件',
    prop: 'enclosure',
    width: '60px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '变更',
    prop: 'applyNum',
    width: '60px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '会议',
    prop: 'meetingNum',
    width: '60px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '合同/发票',
    prop: 'contractWaitNum',
    width: '110px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '状态',
    prop: 'enforceState',
    width: '110px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  }
];

const TableColumnKey = 'project-impose-table-column';

const state = {
  tableColumns: getJSON(TableColumnKey) || TABLE_COLUMNS,
};

const mutations = {
  UPDATE_TABLE_COLUMNS: (state, tableColumns) => {
    state.tableColumns = tableColumns;
    setJSON(TableColumnKey, tableColumns);
  },
};
const actions = {
  GET_TABLE_COLUMNS: async ({ commit, }) => {
    const res = await getTableColumns({ type: 'ProjectImpose', });
    if (res) {
      commit('UPDATE_TABLE_COLUMNS', JSON.parse(res.permission));
    }
  },
  UPDATE_TABLE_COLUMNS: async ({ commit, }, tableColumns) => {
    commit('UPDATE_TABLE_COLUMNS', tableColumns);
    setTableColumns({ permission: JSON.stringify(tableColumns), type: 'ProjectImpose', });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
