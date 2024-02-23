import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import { setTableColumns, getTableColumns, } from '@/apis/common/index';

// 默认排序规则
// 表头
const TABLE_COLUMNS = [
  {
    name: '需求/项目名称',
    prop: 'title',
    order: 1,
    id: 1,
    checked: true,
  },
  {
    name: '负责人/责任人',
    prop: 'principal',
    order: 20,
    id: 2,
    checked: true,
  },
  {
    name: '参与人员',
    prop: 'users',
    order: 3,
    id: 3,
    checked: true,
  },
  {
    name: '提出/开始日期',
    prop: 'startTime',
    order: 4,
    id: 4,
    checked: true,
  },
  {
    name: '期望完成/结束时间',
    prop: 'endTime',
    order: 5,
    id: 5,
    checked: true,
  },
  {
    name: '进度',
    prop: 'totalProgress',
    order: 6,
    id: 6,
    checked: true,
  },
  {
    name: '状态',
    prop: 'showState',
    order: 7,
    id: 7,
    checked: true,
  }
];

const TableColumnKey = 'project-search-table-column';

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
    const res = await getTableColumns({ type: 'ProjectSearch', });
    if (res) {
      commit('UPDATE_TABLE_COLUMNS', JSON.parse(res.permission));
    }
  },
  UPDATE_TABLE_COLUMNS: async ({ commit, }, tableColumns) => {
    commit('UPDATE_TABLE_COLUMNS', tableColumns);
    setTableColumns({ permission: JSON.stringify(tableColumns), type: 'ProjectSearch', });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
