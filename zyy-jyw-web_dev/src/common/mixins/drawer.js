export const OPERATOR_TYPES = {
  'CREATE': 'CREATE',
  'UPDATE': 'UPDATE',
  'VIEW': 'VIEW',
  'DELETE': 'DELETE',
  'EDIT': 'EDIT',
};
export const OperatorTypeMap = new Map([
  ['CREATE',
    '新增',
  ],
  ['UPDATE',
    '处理',
  ],
  ['EDIT',
    '编辑',
  ],
  ['VIEW',
    '查看',
  ],
  ['DELETE',
    '删除',
  ],
]);
export default {
  props: {
    // 弹窗或面板打开目的
    operatorType: {
      type: String,
      default: 'CREATE',
      validator: function (value) {
        return OperatorTypeMap.has(value);
      },
    },
    id: {
      type: [Number,
        String,
      ],
      default: null,
    },
  },
  data() {
    return {
      // 是否显示Loading
      loading: false,
      // 加载文案
      loadingText: '',
      // 加载图标
      loadingSpinner: '',

      // 详情接口,需要定义detailApi变量
      // detailApi: null,
      // 弹窗名称
      name: '',
      // 是否需要获取详情,默认需要,需要时需要定义detailApi变量,否则不需要
      needFetchDetail: true,
    };
  },
  methods: {
    // 通过id查询详情
    async fetchDetail() {
      this.loading = true;
      try {
        if (!this.detailApi) {
          throw new Error('请设置detailApi');
        }
        if (!this.id) {
          throw new Error('请设置id');
        }
        if (this.beforeFetchDetail) {
          await this.beforeFetchDetail();
        }
        const data = await this.detailApi(this.id);
        this.formData = Object.assign({}, this.formData, data);
        this.loading = false;
        if (this.afterFetchDetail) {
          await this.afterFetchDetail();
        }
      } catch (error) {
        this.loadingText = '数据加载失败';
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
  },
  async created() {
    // 如果是编辑或者查看操作，需要获取详情
    if (this.needFetchDetail && (this.operatorType === OPERATOR_TYPES.UPDATE || this.operatorType === OPERATOR_TYPES.VIEW || this.operatorType === OPERATOR_TYPES.EDIT)) {
      await this.fetchDetail();
    }
  },
  computed: {
    // 弹窗标题
    title() {
      const operatorLabel = OperatorTypeMap.get(this.operatorType);
      return `${operatorLabel}${this.name}`;
    },
  },
};
