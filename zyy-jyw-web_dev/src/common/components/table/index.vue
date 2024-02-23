<template>
  <div class="table-area">
    <div
      v-if="$slots.header"
      class="table-area-header"
    >
      <slot name="header" />
    </div>
    <div class="table-area-body">
      <div
        ref="tableWrapper"
        class="table-wrapper"
      >
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          :max-height="tableMaxHeight"
          border
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-table-column
            v-if="selection"
            :align="defaultAlign"
            fixed
            type="selection"
          />
          <el-table-column
            v-if="!hideIndex"
            :align="defaultAlign"
            :fixed="true"
            label="序号"
            show-overflow-tooltip
            type="index"
            width="85px"
          >
            <template #header="{column,$index}">
              <slot
                name="indexColumn"
                v-bind="{column,$index}"
              />
            </template>
            <template slot-scope="{row,$index}">
              <slot
                v-if="$scopedSlots.indexColumnContent"
                name="indexColumnContent"
                v-bind="{row,$index}"
              />
              <template v-else>
                {{ $index + 1 }}
              </template>
            </template>

          </el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="item.prop+index+item.width"
            :align="item.align||defaultAlign"
            :filter-method="filterConfig[item.prop]&&filterConfig[item.prop].filterMethod"
            :filters="filterConfig[item.prop]&&filterConfig[item.prop].filters"
            :fixed="item.fixed"
            :label="item.label"
            :prop="item.prop"
            :show-overflow-tooltip="true"
            :width="item.width"
          >
            <template slot-scope="{row,$index,column}">
              <slot
                name="columns"
                v-bind="{row,$index,column,prop:item.prop}"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="$scopedSlots.operationColumn"
            :align="defaultAlign"
            :width="operationColumnWidth"
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <slot
                name="operationColumn"
                v-bind="scope"
              />
            </template>
          </el-table-column>
          <slot />
        </el-table>
      </div>
    </div>
    <el-row
      v-if="showPagination"
      class="table-area-footer"
      type="flex"
    >
      <el-col :span="12">
        <slot name="leftFooter" />
      </el-col>

      <el-col
        :span="12"
        class="align-right"
      >

        <el-pagination
          :current-page="currentPage"
          :layout="layout"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Axios from 'axios';
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
    // 默认选中值
    defaultSelected: {
      type: Array,
      default: () => [],
    },
    //
    defaultSelectedKey: {
      type: String,
      default: '',
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
      pageSizes: [
        10,
        20,
        50,
        100,
      ],
      // 当前页数
      currentPage: 1,
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
      layout: 'total, prev, pager, next, sizes, jumper',
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
      },
      deep: true,
      immediate: true,
    },

  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      // this.fetchData();
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
      this.fetchData(1);
      this.setTableMaxHeight();
    },
    // currentPage改变时触法
    handleCurrentChange(val) {
      console.log('handleCurrentChange');
      this.currentPage = val;
      this.fetchData();
      this.setTableMaxHeight();
    },

    // 获取表格数据 如果需要转换数据请在methods中定义 convertListData 方法
    async fetchData(pageNum = 0) {
      try {
        if (!this.listApi) {
          throw new Error('请设置listApi');
        }
        if (this.beforeFetchData) {
          await this.beforeFetchData();
        }
        if (pageNum) {
          this.currentPage = pageNum;
        }
        this.loading = true;
        const result = await this.getPageList();
        const list = result?.rows ?? [];
        const total = result?.total ?? 0;
        const data = list || [];
        if (this.convertListData) {
          this.data = this.convertListData(data);
        } else {
          this.data = data;
        }
        this.total = total;
        this.loading = false;
        this.$nextTick(() => {
          if (this.defaultSelected.length && this.defaultSelectedKey) {
            const values = this.defaultSelected.map(item => item[this.defaultSelectedKey]);
            this.data.forEach((item) => {
              if (values.includes(item[this.defaultSelectedKey])) {
                this.$refs.table.toggleRowSelection(item, true);
              }
            });
          }
        });

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
    async onSearch() {
      this.loading = true;
      this.currentPage = 1;
      const result = await this.getPageList();
      const list = result?.rows ?? [];
      const total = result?.total ?? 0;
      const data = list || [];
      if (this.convertListData) {
        this.data = this.convertListData(data);
      } else {
        this.data = data;
      }
      this.total = total;
      this.loading = false;
    },
    async onDel(n = 1) {
      const totalPage = Math.ceil((this.total - n) / this.pageSize);
      const pageNum = this.currentPage > totalPage ? totalPage : this.currentPage;
      this.currentPage = pageNum < 1 ? 1 : pageNum;
      this.loading = true;
      const result = await this.getPageList();
      const list = result?.rows ?? [];
      const total = result?.total ?? 0;
      const data = list || [];
      if (this.convertListData) {
        this.data = this.convertListData(data);
      } else {
        this.data = data;
      }
      this.total = total;
      this.loading = false;
    },
    async getPageList() {
      const result = await this.listApi({
        ...this.queryCondition,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }).catch((err) => {
        console.log(err);
        if (!Axios.isCancel(err)) {
          this.$message.error('服务器异常，请刷新后重试或联系管理员');
        }
        this.loading = false;
      });
      return result;
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

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}

.table-area-header {
  width: 100%;
  //@include background_color_imp('color-bg');
}

.table-area-body, .table-area-footer {
}

.table-area-body {
  flex: 1;
  width: 100%;
  overflow: hidden;
  min-height: 100px;
}

.table-area-footer {
  //display: flex;
  //flex-direction: column;
  width: 100%;
  //align-items: flex-end;
  justify-content: center;
  align-items: center;

  ::v-deep .el-pagination {
    padding: 16px 0;

    &.is-background {
      .el-pager li {
        @include background_color_imp('color-white');
        @include border_color_imp('color-text-placeholder');
        @include font_color_imp('color-text-placeholder');
        border: 1px solid;
        border-radius: 4px;
      }

      .el-pager li:not(.disabled) {
        &.active {
          @include background_color_imp('color-primary');
        }

      }
    }
  }
}
</style>
