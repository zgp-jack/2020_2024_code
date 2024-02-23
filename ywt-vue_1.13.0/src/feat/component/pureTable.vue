<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 15:45:25
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 10:05:41
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
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-table-column v-if="selection" type="selection" :align="defaultAlign" fixed />
          <el-table-column
            v-if="!hideIndex"
            label="序号"
            :align="defaultAlign"
            type="index"
            width="85px"
            :fixed="true"
            show-overflow-tooltip
          >
            <template #header="{column,$index}">
              <slot name="indexColumn" v-bind="{column,$index}" />
            </template>
            <template slot-scope="{row,$index}">
              <slot v-if="$scopedSlots.indexColumnContent" name="indexColumnContent" v-bind="{row,$index}" />
              <template v-else>
                {{ $index + 1 }}
              </template>
            </template>

          </el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="item.prop+index+item.width"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :align="item.align||defaultAlign"
            :show-overflow-tooltip="true"
            :filters="filterConfig[item.prop]&&filterConfig[item.prop].filters"
            :filter-method="filterConfig[item.prop]&&filterConfig[item.prop].filterMethod"
            :fixed="item.fixed"
          >
            <template slot-scope="{row,$index,column}">
              <slot v-bind="{row,$index,column,prop:item.prop}" name="columns" />
            </template>
          </el-table-column>
          <el-table-column v-if="$scopedSlots.operationColumn" label="操作" :align="defaultAlign" :width="operationColumnWidth" fixed="right">
            <template slot-scope="scope">
              <slot v-bind="scope" name="operationColumn" />
            </template>
          </el-table-column>
          <slot />
        </el-table>
      </div>
    </div>
    <div v-if="showPagination" class="table-area-footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 表头数据
    columns: {
      type: Array,
      default: () => [],
    },
    // 隐藏序号列
    hideIndex: {
      type: Boolean,
      default: false,
    },
    // 操作列宽度
    operationColumnWidth: {
      type: Number,
      default: 200,
    },
    // 列表接口 需要定义listApi变量
    listApi: {
      type: Function,
      default: null,
    },
    // 查询条件
    queryCondition: {
      type: Object,
      default: function () {
        return {};
      },
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    selection: {
      type: Boolean,
      default: false,
    },
    defaultAlign: {
      type: String,
      default: 'left',
    },
    // filter配置
    filterConfig: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
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
      // queryCondition: {},
      // 表格最大高度
      tableMaxHeight: 100,
      // 列表接口 需要定义listApi变量
      // listApi: null,
    };
  },
  watch: {
    queryCondition: {
      handler() {
        this.queryCondition.pageNum = 1;
        this.currentPage = 1;
        this.fetchData();
      },
      deep: true,
    },

  },
  created() {
    this.fetchData();
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
        const { list, total, } = await this.listApi({
          ...this.queryCondition,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        });
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
};
</script>

<style lang="scss" scoped>
.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
}

.table-area-header {
  width: 100%;
}
.table-area-body,.table-area-footer {
  padding: 0 16px;
}
.table-area-body {
  flex: 1;
  width: 100%;
  overflow: hidden;
  min-height: 100px;
}
.table-area-footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-end;
  ::v-deep .el-pagination {
    padding:16px 0;
  }
}
</style>
