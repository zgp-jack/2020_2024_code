import ProjectApi from '@/apis/project/index';
import store from '@/store/index';
import vm from '@/main.js';
import DemandPanel from '@/views/project/components/panelsGroup/demandAll.vue';
import { Loading, } from 'element-ui';
import drawerWidth from '../../common/width/drawer';
/**
 * 查看所有的需求面板
 * @param {string} itemCode
 * @param {string} width
 */
async function SearchDemandPanel(itemCode, width = drawerWidth.larger_pr) {
  if (!itemCode) {
    throw Error('itemCode为空');
  }
  const load = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  store.commit('project/index/SET_ITEM_CODE', itemCode);
  const result = await ProjectApi.base.getAllProjectData(itemCode);

  await store.dispatch('project/index/FETCH_PANEL_DATA', result,);

  load.close();
  vm.$innerDrawer({
    width: width,
    component: () => {
      return vm.$createElement(DemandPanel, {
        props: {},
        on: {
          done: () => {
          },
        },

      });
    },
  });
}

export default SearchDemandPanel;
