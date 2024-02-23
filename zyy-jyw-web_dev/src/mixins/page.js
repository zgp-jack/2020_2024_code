export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [
        10,
        20,
        50,
        100,
      ],
      total: 0,
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getListData();
    },
    // 处理最后一页最后一条数据删除分页显示问题
    calcLastPage(n = 1) {
      const totalPage = Math.ceil((this.total - n) / this.pageSize);
      const currentPage =
        this.currentPage > totalPage ? totalPage : this.currentPage;
      this.currentPage = currentPage < 1 ? 1 : currentPage;
    },
    onSearch() {
      this.currentPage = 1;
      this.getListData();
    },
  },
};
