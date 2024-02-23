
import vm from '@/main';
import { mapState, } from 'vuex';
import { pay_status, } from '../../config/table';
import moment from 'moment';
const r = vm.$createElement;
import store from '@/store';
import { formatCash, } from '@/filters';

function priceToLocaleString(v, filed) {
  if (v[filed]) {
    return formatCash(v[filed]);
  }
  return '-';
}
function renderStatus(state) {
  if (state) {
    return r('span', {
      style: {
        color: pay_status[state].color,
      },
      domProps: {
        innerHTML: pay_status[state].text[1],
      },
    });
  }
  return '-';
}

const mixinsTable = {
  computed: {
    ...mapState('contract/index', ['optionsModel']),
    ...mapState('dictionary', ['contractAcceptanceTime']),
    PayTypes() {
      return this.contractAcceptanceTime;
    },
    isHandle() {
      return ['handle', 'look'].includes(this.optionsModel);
    },
    showOptins() {
      return ['handle'].includes(this.optionsModel);
    },
    showMoreTableColumn() {
      return ['look', 'handle'].includes(this.optionsModel);
    },

    payTableConfig() {
      let config = [];
      let opt = [];
      let edits = [];
      if (this.showOptins) {
        opt = [{
          slot: true,
          prop: 'options',
          label: '操作',
          width: '150px',
        }];
      }
      if (this.showMoreTableColumn) {
        edits = this.edit;
      }
      config = [...this.base, ...edits, ...opt];
      return config;
    },
  },
  data() {
    return {
      spanStyle: {
        'font-weight': 400,
        color: '#879bba',
      },
      base: [
        {
          type: 'index',
          label: '分期',
          width: '60px',
        },
        {
          prop: 'explan',
          label: '付款说明',
          width: this.isHandle ? '300px' : '',
          formatter: (row, column, cellValue, index) => {
            const r = this.renderTemplate ? this.memoTemplate(row, index) : row['explan'];
            return r;
          },
        },
        {
          prop: 'payRate',
          label: '付款比例',
          width: '150px',
          formatter: (row, column, cellValue, index) => {
            const r = this.renderTemplate ? this.billTemplate(row, index) : (row['payRate'] + '%');
            return r;
          },
        },
        {
          prop: 'plan',
          label: '计划付款日期',
          width: '350px',
          formatter: (row, column, cellValue, index) => {
            const contractState = store.state['contract/index'];
            if (this.isHandle) {
              let time = '';
              if (row.payType === 1) {
                time = moment(contractState.detailData.signDate).add(row['days'] - 1, 'days').format('YYYY-MM-DD');
              } else if (row.payType === 2) {
                time = moment(contractState.detailData.checkDate).add(row['days'] - 1, 'days').format('YYYY-MM-DD');
              } else {
                time = moment(contractState.detailData.qaDate).add(row['days'] - 1, 'days').format('YYYY-MM-DD');
              }
              return time;
            } else {
              return this.planTemplate(row, index);
            }
          },
        }
      ],
      edit: [{
        label: '付款金额(元)',
        props: 'customPrice',
        children: [{
          label: '应付',
          prop: 'payablePrice',
          formatter: (v) => {
            return priceToLocaleString(v, 'payablePrice');
          },
        }, {
          label: '已付',
          prop: 'paidPrice',
          formatter: (v) => {
            return priceToLocaleString(v, 'paidPrice');
          },
        }],

      }, {
        label: '付款状态',
        prop: 'payState',
        formatter: (v) => {
          return renderStatus(v['payState']);
        },
      }],
    };
  },
  methods: {
    memoTemplate(v, i) {
      return this.$createElement('el-row', {}, [
        this.$createElement('el-col', { props: { span: 24, }, },
          [
            this.$createElement('el-form-item', {
              props: {
                prop: `table.${i}.explan`,

                rules: {
                  required: true,
                  trigger: 'blur',
                  message: '付款说明不能为空',
                },

              },
            }, [
              this.$createElement('el-input', {
                props: {
                  value: v['explan'],
                  size: 'mini',
                },
                on: {
                  input: (value) => {
                    v['explan'] = value;
                  },
                },
              })
            ])

          ])
      ]);
    },

    billTemplate(v, i) {
      return this.$createElement('el-row', {}, [
        this.$createElement('el-col', {
          props: { span: 24, },
        }, [
          this.$createElement('el-form-item', {
            props: {
              prop: `table.${i}.payRate`,

              rules: [{
                required: true,
                trigger: 'blur',
                message: '付款比例不能为空',
              }],
            },
          }, [
            this.$createElement('el-input', {
              props: {
                value: v['payRate'],
                size: 'mini',
              },
              on: {
                input: (value) => {
                  const val = value.replace(/[^\d]/g, '');

                  v['payRate'] = val;
                },
              },
            },),
            this.$createElement('span', {
              domProps: {
                innerHTML: '%',
              },
              style: {
                ...this.spanStyle,
                'margin-left': '5px',
              },
            })
          ]
          )
        ])

      ]);
    },

    planTemplate(v, i) {
      const options = this.PayTypes.map((e) => {
        return this.$createElement('el-option', {
          props: {
            value: Number(e.value),
            label: e.name,
          },
        });
      });

      return this.$createElement('el-form-item', {}, [
        this.$createElement('el-row', {}, [
          this.$createElement('el-col', { props: { span: 10, }, }, [
            this.$createElement('el-form-item', {
              props: {
                prop: `table.${i}.payType`,
                rules: [{
                  required: true,
                  trigger: 'change',
                  message: '请选择计划',
                }],
              },
            }, [
              this.$createElement('el-select', {
                props: {
                  size: 'mini',
                  value: v['payType'],
                },
                on: {
                  change: (val) => {
                    v['payType'] = val;
                  },
                },
              }, options)
            ])

          ]),
          this.$createElement('el-col', {
            props: { span: 4, }, style: {
              'text-align': 'center',
            },
          }, [this.$createElement('span', {
            domProps: {
              innerHTML: '之后',
            },
            style: this.spanStyle,
          })]),
          this.$createElement('el-col', {
            props: { span: 10, },

          }, [
            this.$createElement('el-form-item', {
              props: {
                prop: `table.${i}.days`,
                rules: [{
                  required: true,
                  trigger: 'blur',
                  message: '天数不能为空',
                  type: 'string',
                  transform: (v) => String(v),
                }, {
                  type: 'number',
                  transform: (v) => Number(v),
                }],
              },
              style: {
                margin: 0,
              },
            }, [
              this.$createElement('el-input', {
                props: {
                  value: v['days'],
                  size: 'mini',
                },
                on: {
                  input: (value) => {
                    const val = value.replace(/[^\d]/g, '');
                    v['days'] = val;
                  },
                },
              }),
              this.$createElement('span', {
                domProps: {
                  innerHTML: '天',
                },
                style: {
                  ...this.spanStyle,
                  'margin-left': '10px',
                },
              })
            ])
          ])

        ])
      ]);
    },

  },

};

export default mixinsTable;
