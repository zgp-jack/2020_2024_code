import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import { setTableColumns, getTableColumns, } from '@/apis/common/index';

// 默认排序规则
// 表头
const TABLE_COLUMNS = [
  {
    label: '项目标题',
    prop: 'title',
    width: '245px',
    fixed: true,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '提出人',
    prop: 'sponsor',
    width: '100px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '项目负责人',
    prop: 'principal',
    width: '130px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '参与人员',
    prop: 'joinUser',
    width: '240px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '提出日期',
    prop: 'startTime',
    width: '150px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '期望完成日期',
    prop: 'endTime',
    width: '150px',
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
    label: '状态',
    prop: 'showState',
    width: '200px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  }
];

const TableColumnKey = 'project-setup-table-column';

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
    const res = await getTableColumns({ type: 'ProjectSetup', });
    if (res) {
      commit('UPDATE_TABLE_COLUMNS', JSON.parse(res.permission));
    }
  },
  UPDATE_TABLE_COLUMNS: async ({ commit, }, tableColumns) => {
    commit('UPDATE_TABLE_COLUMNS', tableColumns);
    setTableColumns({ permission: JSON.stringify(tableColumns), type: 'ProjectSetup', });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
