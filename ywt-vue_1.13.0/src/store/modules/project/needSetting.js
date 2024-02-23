import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import { setTableColumns, getTableColumns, } from '@/apis/common/index';

// 默认排序规则
// 表头
const TABLE_COLUMNS = [
  {
    label: '需求标题',
    prop: 'title',
    width: '246px',
    fixed: true,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '科室',
    prop: 'organizers',
    width: '200px',
    fixed: false,
    'show-overflow-tooltip': false,
    show: true,
  },
  {
    label: '提出人',
    prop: 'sponsor',
    width: '120px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '调研负责人',
    prop: 'principal',
    width: '125px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '调研成员',
    prop: 'users',
    width: '240px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '提出日期',
    prop: 'startTime',
    width: '145px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '期望完成日期',
    prop: 'endTime',
    width: '145px',
    fixed: false,
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '需求来源',
    prop: 'itemType',
    width: '120px',
    fixed: 'right',
    'show-overflow-tooltip': true,
    show: true,
  },
  {
    label: '附件',
    prop: 'enclosure',
    width: '60px',
    fixed: 'right',
    'show-overflow-tooltip': false,
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

const TableColumnKey = 'project-needSetting-table-column';

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
    const res = await getTableColumns({ type: 'ProjectNeedSetting', });
    if (res) {
      commit('UPDATE_TABLE_COLUMNS', JSON.parse(res.permission));
    }
  },
  UPDATE_TABLE_COLUMNS: async ({ commit, }, tableColumns) => {
    commit('UPDATE_TABLE_COLUMNS', tableColumns);
    setTableColumns({ permission: JSON.stringify(tableColumns), type: 'ProjectNeedSetting', });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
