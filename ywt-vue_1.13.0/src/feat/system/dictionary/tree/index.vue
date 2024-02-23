<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 16:09:58
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:38
 * @Description:树形字典
-->
<template>
  <el-container class="no-padding-right">
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <pure-button label="新增" @click="onCreateItem()" />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :data="data"
              :header-cell-style="{'textAlign':'center'}"
              border
              lazy
              :load="lazyLoad"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'child'}"
            >
              <el-table-column label="序号" type="index" width="85" align="left" show-overflow-tooltip />
              <el-table-column label="名称" prop="name" width="auto" align="left" show-overflow-tooltip />
              <el-table-column label="是否启用" prop="state" width="100px" align="left" show-overflow-tooltip>
                <template #default="{row}">
                  <el-switch v-model="row.state" :active-value="1" :inactive-value="0" @change="onChangeItemState(row)" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200px" align="left" show-overflow-tooltip>
                <template #default="{row,column}">
                  <el-button type="text" size="mini" @click="onAddItem(row,column)">添加子类</el-button>
                  <el-button type="text" size="mini" @click="onUpdateItem(row,column)">编辑</el-button>
                  <el-button type="text" size="mini" @click="onDeleteItem(row,column)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer">
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
    <el-aside style="width: 288px; height: 100%">
      <el-container>
        <el-header class="wrapper-right-header" height="32px">
          <span> 树形字典 </span>

          <el-button
            size="mini"
            type="text"
            @click="onAddCategory"
          >新增类目</el-button>
        </el-header>
        <el-main class="wrapper-right-main">
          <el-tree
            ref="tree"
            class="tree-container"
            :data="categories"
            :props="defaultProps"
            highlight-current
            @node-click="onClickNode"
          >
            <template #default="{ node }">
              <el-row class="custom-tree-content">
                <el-col :span="20" class="custom-tree-content--left">
                  <span>
                    {{ node.label }}
                  </span>
                </el-col>
                <el-col :span="4" class="custom-tree-content--right">
                  <i class="el-icon-edit" @click.stop="onUpdateCategory(node.data)" />

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
import DicTreeApi from './api';
import CategoryDialog from './dialog/category.vue';
import CategoryItemDialog from './dialog/item.vue';

import PaginationTable from '@/minxins/common/paginationTable';

export default {
  name: 'XtszZdwhSxzd',
  mixins: [PaginationTable],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      listApi: DicTreeApi.itemList,
      categories: [],
    };
  },

  async mounted() {
    await this.fetchCategory();
    await this.fetchData();
  },
  methods: {
    async onClickNode(data) {
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.catalogId = data.id;
      this.fetchData();
    },
    async  fetchCategory() {
      const { list, } = await DicTreeApi.list();
      this.categories = list;
      this.queryCondition.catalogId = list[0].id;
    },
    onCreateItem(parentName, parentId, isTopLevel = true) {
      const data = {
        catalogId: this.queryCondition.catalogId,
        parentName,
        parentId,
      };
      this.$dialog({
        width: '688px',
        title: '新增子项',
        position: 'center',
        component: () => <CategoryItemDialog data={data} onDone={() => this.afterDealItem(parentId, isTopLevel)}/>,
      });
    },
    onAddCategory() {
      this.$dialog({
        width: '688px',
        title: '新增类目',
        position: 'center',
        component: () => <CategoryDialog onDone={this.fetchCategory} operatorType='CREATE'/>,
      });
    },
    async lazyLoad(tree, treeNode, resolve) {
      const { list, } = await DicTreeApi.itemList({
        catalogId: treeNode.catalogId,
        parentId: tree.id,
        pageSize: 9999,
      });
      console.log(treeNode, list);
      resolve(list);
    },
    onUpdateCategory(data) {
      this.$dialog({
        width: '688px',
        title: '编辑类目',
        position: 'center',
        component: () => <CategoryDialog onDone={this.fetchCategory} operatorType='UPDATE' data={data}/>,
      });
    },
    onAddItem(row) {
      this.onCreateItem(row.name, row.id, !row.parentId);
    },
    onUpdateItem(row) {
      const data = {
        catalogId: this.queryCondition.catalogId,
        name: row.name,
        value: row.value,
        id: row.id,
      };
      this.$dialog({
        width: '688px',
        title: '编辑',
        position: 'center',
        component: () => <CategoryItemDialog data={data} onDone={() => this.afterDealItem(row.parentId)} operatorType='UPDATE'/>,
      });
    },
    // 当处理item(create,update,delete)后，如果是最顶层，则重新查询顶层数据，如果是子项,刷新父项,
    // 如果是第一层，也需要刷新列表，以解决顶层数据没有子集时，level为'',导致新增子项后，子集indent有问题的bug
    afterDealItem(pid, needFetchData) {
      if (pid) {
        if (needFetchData) {
          this.fetchData();
        }
        this.refreshRow(pid);
      } else {
        this.fetchData();
      }
    },
    async onChangeItemState(row) {
      const data = {
        catalogId: this.queryCondition.catalogId,
        id: row.id,
        name: row.name,
        value: row.value,
        state: row.state,
      };
      await DicTreeApi.updateItem(data);
      this.$message.success('状态变更成功');
    },
    async refreshRow(id) {
      const { list, } = await DicTreeApi.itemList({
        parentId: id,
      });
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, list);
    },
    async onDeleteItem(row) {
      try {
        await this.$confirm(`确认删除'${row.name}'项吗？`, '提示', { confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning', });
        await DicTreeApi.deleteItem(row.id);
        this.$message.success('删除成功!');
        this.afterDealItem(row.parentId);
      } catch (error) {
        if (error && error !== 'cancel') {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
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
