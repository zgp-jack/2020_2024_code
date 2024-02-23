/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-01 17:37:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-07 18:30:27
 * @Description: 人员画像VUEX
 */

import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
const PersonaTableColumnKey = 'Persona-table-column';
const PERSONA_TABLE_COLUMN = [{
  name: '姓名',
  label: '姓名',
  prop: 'name',
  id: 1,
  order: 1,
  checked: true,

},
{
  name: '性别',
  label: '性别',
  prop: 'genderToName',
  id: 2,
  order: 2,
  checked: true,
},
{
  name: '出生日期',
  label: '出生日期',
  prop: 'birthday',
  id: 3,
  order: 3,
  checked: true,
},
{
  name: '籍贯',
  label: '籍贯',
  prop: 'nativePlace',
  id: 4,
  order: 4,
  checked: true,
},
{
  name: '最高学历',
  label: '最高学历',
  prop: 'educationToName',
  id: 5,
  order: 5,
  checked: true,
},
{
  name: '所在科室',
  label: '所在科室',
  prop: 'deptIdToName',
  id: 6,
  order: 6,
  checked: true,
},
{
  name: '职位',
  label: '职位',
  prop: 'position',
  id: 7,
  order: 7,
  checked: true,

},
{
  name: '工作小组',
  label: '工作小组',
  prop: 'teamIdToName',
  id: 8,
  order: 8,
  checked: true,
},
{
  name: '联系电话',
  label: '联系电话',
  prop: 'phone',
  id: 9,
  order: 9,
  checked: true,
}
];
const state = {
  personaTableColumn: getJSON(PersonaTableColumnKey) || PERSONA_TABLE_COLUMN,
};
const mutations = {
  UPDATE_PERSONA_TABLE_COLUMN: (state, { personaTableColumn, }) => {
    state.personaTableColumn = personaTableColumn;
    setJSON(PersonaTableColumnKey, personaTableColumn);
  },
};
const actions = {
  UPDATE_PERSONA_TABLE_COLUMN: async ({ commit, }, personaTableColumn) => {
    commit('UPDATE_PERSONA_TABLE_COLUMN', { personaTableColumn, });
  },
};
export default {
  namespaced: true,
  namespace: 'synthesizePersona',
  state,
  mutations,
  actions,
};
