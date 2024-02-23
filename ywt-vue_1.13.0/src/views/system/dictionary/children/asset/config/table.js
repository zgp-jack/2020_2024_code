import vm from '@/main';

import stroe from '@/store';
import DictionaryApi from '@/apis/dictionary/center';
import { Message, } from 'element-ui';
import _ from 'lodash';
const r = vm.$createElement;

const config = [
  {
    label: '序号',
    width: '60px',
    type: 'index',
  },
  {
    label: '名称',
    width: '',
    prop: 'name',
    // formatter: (v) => {
    //   return `${v['name']}---${v.id}`;
    // },
  }, {
    label: '是否启用',
    width: '100px',
    prop: 'state',
    formatter: (v) => {
      return r('el-switch', {
        props: {
          value: v['state'],
          inactiveValue: 0,
          // inactiveText: '禁用',
          activeValue: 1,
          // activeText: '启用',
        },
        on: {
          change: _.debounce(async function (val) {
            try {
              v['state'] = val;
              await DictionaryApi.AssetApi.update(v);
              stroe.dispatch('project/index/FETCH_PERFORM_EVENT', { name: 'assetsSwitchCallBack', });
            } catch (e) {
              Message.error(e);
              v['state'] = val ? 0 : 1;
            }
          }, 300),
        },
      });
    },
  }, {
    label: '操作',
    width: '200px',
    slot: true,
  }];

export default config;
