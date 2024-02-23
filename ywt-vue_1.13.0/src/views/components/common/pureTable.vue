<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 15:45:25
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-17 16:00:04
 * @Description:表格封装
-->
<template>
  <div class="table-area">
    <div v-if="$slots.header" class="table-area-header base-margin-bottom">
      <slot name="header" />
    </div>
    <div class="table-area-body">
      <div ref="tableWrapper" class="table-wrapper">
        <el-table
          ref="table"
          v-loading="loading"
          border
          :data="data"
          :max-height="tableMaxHeight"
        >
          <slot name="body" />
        </el-table>
      </div>
    </div>
    <div class="table-area-footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
  </div>
</template>

<script>
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
  watch: {
    searchValue(val) {
      delayCallBack(1000, () => {
        this.queryCondition.query = val;
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
  methods: {
    // pageSize改变时触发
    onSizeChange(val) {
      this.pageSize = val;
      this.queryCondition.pageSize = this.pageSize;
      this.fetchData();
      this.setTableMaxHeight();
    },
    // currentPage改变时触法
    onCurrentChange(val) {
      this.currentPage = val;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
      this.setTableMaxHeight();
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
        this.$message({
          type: 'error',
          message: error,
        });
        this.emptyText = '获取数据失败';
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
};
</script>

<style lang="scss" scoped>

</style>
