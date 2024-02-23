import store from '@/store';

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
  }, {
    label: '简称',
    width: '300px',
    prop: 'abbreviation',
    formatter: (v) => {
      return v['abbreviation'] || '-';
    },
  },
  {
    label: '类型',
    width: '100px',
    prop: 'manufacturerType',
    formatter: (v) => {
      const dic = store.state['dictionary']['dicList']['manufacturerType'];
      return (dic.filter((e) => e.value === (v['manufacturerType']).toString()))[0].name || '-';
    },
  }, {
    label: '主要联系人',
    width: '130px',
    prop: 'contact',
  }, {
    label: '联系电话',
    width: '',
    prop: 'phone',
  },
  {
    label: '操作',
    width: '140px',
    slot: true,
  }];

export default config;
