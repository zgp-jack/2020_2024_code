
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-28 14:42:26
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-12 09:58:27
 * @Description: 分页表格相关
 */

import { delayCallBack, } from '@/utils/common';
export default {
  data() {
    return {
      /** ******分页相关********* */
      // 总条目书
      total: 0,
      // 每页显示条目个数
      pageSize: 10,
      // 每页显示个数选择器的选项设置
      pageSizes: [10, 20, 30, 40],
      // 当前页数
      currentPage: 0,
      // 页码按钮的数量，当总页数超过该值时会折叠
      pagerCount: 7,
      /**
       * 组件布局
       * sizes
       * prev
       * pager
       * next
       * jumper
       * total
       * slot
       */
      layout: 'total, sizes, prev, pager, next, jumper',
      /** ******表格相关********* */
      loading: false,
      // 空数据时显示的文本内容
      emptyText: '暂无数据',
      // 表格数据
      data: [],
      // 查询条件
      queryCondition: {},
      // 表格最大高度
      tableMaxHeight: 100,
      // 模糊查询的字段
      searchValue: '',
      // 列表接口 需要定义listApi变量
      // listApi: null,
    };
  },
  methods: {
    // pageSize改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryCondition.pageSize = this.pageSize;
      this.fetchData();
      this.setTableMaxHeight();
    },
    // currentPage改变时触法
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
      this.setTableMaxHeight();
    },
    // 执行完相应操作后触发,默认情况为重新查询列表数据
    onPerformedOpertion() {
      this.fetchData();
    },
    // 获取表格数据 如果需要转换数据请在methods中定义 convertListData 方法
    async fetchData() {
      try {
        if (!this.listApi) {
          throw new Error('请设置listApi');
        }
        if (this.beforeFetchData) {
          await this.beforeFetchData();
        }
        this.loading = true;
        const { list, total, } = await this.listApi(this.queryCondition);
        const data = list || [];
        if (this.convertListData) {
          this.data = this.convertListData(data);
        } else {
          this.data = data;
        }
        this.total = total;
        this.loading = false;
        if (this.afterFetchData) {
          await this.afterFetchData();
        }
        this.emptyText = '暂无数据';
      } catch (error) {
        this.loading = false;
        this.emptyText = '获取数据失败';
        throw error;
      }
    },
    // 设置表格最大高度
    async setTableMaxHeight() {
      if (this.$refs.tableWrapper) {
        this.tableMaxHeight = this.$refs.tableWrapper.clientHeight > 100 ? this.$refs.tableWrapper.clientHeight : 100;
      } else {
        console.error('请为table包裹一层并设置ref');
      }
    },

  },
  watch: {
    searchValue(val) {
      delayCallBack(1000, () => {
        this.queryCondition.query = val;
        this.queryCondition.pageNum = 1;
        this.fetchData();
      });
    },
  },
  created() {
    this.queryCondition.pageSize = this.pageSize;
    this.queryCondition.pageNum = this.currentPage;
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableMaxHeight();
    });
    window.addEventListener('resize', this.setTableMaxHeight);
  },

  activated() {
    this.setTableMaxHeight();
    window.addEventListener('resize', this.setTableMaxHeight);
    this.fetchData();
  },
  deactivated() {
    window.removeEventListener('resize', this.setTableMaxHeight);
  },
  destroyed() {
    window.removeEventListener('resize', this.setTableMaxHeight);
  },
};
