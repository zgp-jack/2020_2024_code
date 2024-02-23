<!--  -->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <div class="flex base-margin-left base-margin-top">
            <pure-button label="新增" @click="clickAdd" />
          </div>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="data"
              :header-cell-style="{ textAlign: 'center' }"
              border
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              lazy
              :load="lazyLoad"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column
                v-for="(v, i) in columnConfig"
                :key="i"
                :label="v.label"
                :prop="v.prop"
                :type="v.type"
                :width="v.width"
                :align="v.align"
              >
                <template v-if="v.slot" #default="{ row }">
                  <el-button
                    type="text"
                    size="mini"
                    @click="clickEdit(row)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="clickDel(row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template #footer>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </pure-table-area>

    </el-main>
    <el-aside
      class="base-layout-aside aside-wrapper"
      width="356px"
    >
      <el-container>
        <el-header class="wrapper-right-header" height="32px">
          <span> 数据字典 </span>

          <el-button
            size="mini"
            type="text"
            @click="addType"
          >新增类别</el-button>
        </el-header>
        <el-main class="wrapper-right-main">
          <el-row class="searchInput">
            <el-col :span="24">
              <el-input
                v-model="searchTree"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                size="mini"
              />
            </el-col>
          </el-row>
          <el-tree
            ref="tree"
            class="tree-container"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            highlight-current
            @node-click="clickTreeNode"
          >
            <template #default="{ node,data }">
              <el-row class="custom-tree-content">
                <el-col :span="20" class="custom-tree-content--left">
                  <span>
                    {{ node.label }}
                  </span>
                </el-col>
                <el-col :span="4" class="custom-tree-content--right">
                  <i class="el-icon-edit" @click.stop="cilckEdit(data)" />

                  <!-- <i class="el-icon-delete" @click.stop="cilckDel(data)" /> -->

                </el-col>
              </el-row>
            </template>
          </el-tree>
        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import columnConfig from './config/table';
import DictionaryApi from '@/apis/dictionary/center';
import _ from 'lodash';
import PaginationTable from '@/minxins/common/paginationTable';

export default {

  name: 'XtszZdwhSjzd',
  components: {
    // Search: () => import('@/components/input/search.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Add: () => import('../../components/data/add.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Setting: () => import('../../components/data/setting.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Class: () => import('../../components/data/class.vue'),

  },
  mixins: [PaginationTable],
  data() {
    return {
      columnConfig,
      maxOrderNumber: 0,

      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      searchTree: '',
      currentTreeData: {},
      listApi: DictionaryApi.DataApi.getItemPage,
    };
  },
  computed: {
  },
  watch: {
    searchTree: _.debounce(function (n, o) {
      this.$refs.tree.filter(n);
    }, 300),

  },

  mounted() {
    this.fetchData();
    this.getDataTreeData();
  },
  methods: {

    /**
     * 删除
     */
    async cilckDel(r) {
      this.$confirm(`确定删除「${r.name}」吗?!`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(async () => {
        await DictionaryApi.DataApi.deleteCatalog({ id: r.id, });
        this.getDataTreeData();
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {});
    },
    addType() {
      this.$dialog({
        position: 'center',
        width: '548px',
        title: '新增类别',
        component: () => <Class onDone={this.onDoneClass}/>,
      });
    },
    /**
     * 点击tree 节点
     */
    async clickTreeNode(data) {
      this.currentTreeData = data;
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.catalogId = data.id;
      this.fetchData();
    },
    /**
   * 获取数据字典的 分类数据
   */
    async getDataTreeData() {
      this.treeData = (await DictionaryApi.DataApi.getCatalogPage()).list;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    clickEdit(data) {
      this.$dialog({
        position: 'center',
        width: '548px',
        title: '编辑',
        component: () => <Add info={data} options={'edit'} onDone={this.onDone} />,
      });
    },
    clickAdd() {
      if (JSON.stringify(this.currentTreeData) === '{}') {
        this.$message.warning('请选择字典分类');
        return;
      }
      this.$dialog({
        position: 'center',
        width: '548px',
        title: '新增',
        component: () => (
          <Add maxOrderNumber={this.maxOrderNumber} options={'add'} info={this.currentTreeData} onDone={this.onDone} />
        ),
      });
    },
    clickDel(r) {
      this.$confirm(`确定删除「${r.name}」吗?!`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(async () => {
          try {
            await DictionaryApi.DataApi.deleteItem({ id: r.id, });
            this.onDone();
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          } catch (error) {
            this.$message.error(error);
          }
        })
        .catch(() => {});
    },

    cilckEdit(r) {
      const d = _.cloneDeep(r);
      this.$dialog({
        position: 'center',
        width: '688px',
        title: '编辑类别',
        component: () => <Class info={d} onDone={this.onDoneClass}/>,
      });
    },
    onDoneClass() {
      this.getDataTreeData();
    },
    onDone() {
      this.fetchData();
    },
    async lazyLoad(tree, treeNode, resolve) {
      const data = {
        pageNum: 0,
        pageSize: 999,
        parentId: tree.id,
      };
      const rs = await DictionaryApi.DataApi.getItemPage(data);
      const result = rs.list.map(e => {
        return {
          ...e,
          hasChildren: !!e.child,
        };
      });
      tree.hasChildren = true;
      this.tableList = [...this.tableList, ...result];
      resolve(result);
    },
    convertListData(list) {
      if (list.length) {
        for (const i of list) {
          this.$set(i, 'hasChildren', !!i.child);
        }
        this.tableList = list;
        this.maxOrderNumber = _.maxBy(list, 'orderNum').orderNum + 1;
      }
      return list;
    },

  },
};
</script>
<style lang='scss' scoped>
.t-r {
  text-align: right;
}
.data{
  &-el{
    &-main{
      padding-right: 16px;

      &-container{
      padding: 0 16px;
background: #fff;
      }
    }
  }
}
.wrapper-header{
  // display: flex;
  line-height: 50px;
  // align-items: center;
}
.wrapper-container{
  background: #fff;
  padding: 0 16px 0 0;
}
// .wrapper-right-header {
//   background: #d7e5f9;
//   padding-left: 24px;
//   line-height: 32px;
//   > span {
//     font-weight: 500;
//     font-size: 14px;
//     letter-spacing: 1px;
//     color: #2d405e;
//   }
// }
.wrapper-right-main{
  background:#fff;
}
.tree-container{
  padding: 0 12px;
}
.searchInput{
  margin: 6px 12px;
}
.wrapper-right-header {
  background: #E2E3E7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 5px;
  > .active {
    background-color: #fff;
    color: #1890ff;
  }
  > span {
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 1px;
    padding: 8px 16px;
    color: #456ADD;
    display: inline-block;
    cursor: pointer;
    background-color: #fff;
  }
}
.custom {
  &-tree {
    &-content {
      line-height: normal;
      flex: 1;
      display: flex;
      align-items: center;
      &--left {
        > span {
          font-size: 18px;
          font-weight: 400;
          color: #2d405e;
        }
      }
      &--right {
        // display: flex;
        // justify-content: space-between;
        // padding: 0 5px;
        text-align: right;
        > i {
          font-size: 16px;
          font-weight: 400;
          color: #979797;
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
}
.pagination-container {
  text-align: right;
  // margin: 16px 24px 0 0;
}
</style>
