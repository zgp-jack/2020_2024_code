
const config = [
  {
    label: '序号',
    width: '60px',
    type: 'index',
    align: 'center',

  },
  {
    label: '名称',
    width: '',
    prop: 'name',
    align: 'left',

  }, {
    label: '编码',
    width: '200px',
    prop: 'value',
    align: 'center',

  }, {
    label: '额外参数',
    width: '200px',
    prop: 'parm',
    align: 'center',

  }, {
    label: '操作',
    width: '200px',
    align: 'center',

    slot: true,
  }];

export default config;
