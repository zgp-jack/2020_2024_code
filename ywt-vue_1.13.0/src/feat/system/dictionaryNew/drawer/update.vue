<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-14 15:30:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:54:42
 * @Description:
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">配置字典项 <pure-button :disabled="creating||hasEditRow" label="新增字典项" @click="onAddItem(null)" /></div>

    </div>
    <div class="body  base-margin-bottom">
      <div class="table-content">
        <el-table
          ref="table"
          border
          :data="list"
          height="100%"
          lazy
          :load="lazyLoad"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'child'}"
        >
          <el-table-column label="字典项" prop="name" show-overflow-tooltip="">
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <span style="display:inline-block;width:500px">
                  <el-input
                    v-model="row.name"
                    placeholder="请输入"
                    size="mini"
                    :maxlength="100"
                  />
                </span>

              </template>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="启停" prop="state" width="92px">
            <template #default="{row}">
              <el-switch
                v-model="row.state"
                :disabled="!row.edit"
                :active-value="1"
                :inactive-value="0"
                @change="onChangeItemState(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="230px" align="left" show-overflow-tooltip>
            <template #default="{row,column}">
              <template v-if="row.edit">
                <el-button
                  size="mini"
                  type="text"
                  @click="onSubmit(row)"
                >保存</el-button>
                <el-button
                  size="mini"
                  type="text"
                  @click="onCancel(row)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  v-if="type===1"
                  :disabled="hasEditRow||creating"
                  type="text"
                  size="mini"
                  @click="onAddChild(row)"
                >添加子类</el-button>
                <el-button
                  :disabled="hasEditRow||creating"
                  type="text"
                  size="mini"
                  @click="onUpdateItem(row,column)"
                >编辑</el-button>
                <el-popconfirm
                  title="确定删除吗？"
                  @confirm="onDeleteItem(row,column)"
                >
                  <el-button
                    slot="reference"
                    :disabled="hasEditRow||creating"
                    type="text"
                    class="base-margin-left"
                    size="mini"
                  >删除</el-button>
                </el-popconfirm>
              </template>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer" />
  </div>

</template>

<script>
import DictionaryApi from '../api';
import FormDialog from '@/minxins/common/formDialog';
export default {
  mixins: [FormDialog],
  props: {
    id: {
      type: Number,
      default: null,
    },
    categoryId: {
      type: Number,
      default: null,
    },
    type: { // 层级(0单层1多层)
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      needFetchDetail: false,
      list: [],
      creating: false,
      hasEditRow: false,
      maps: new Map(),
    };
  },
  mounted() {
    this.fetchCategory();
  },
  methods: {
    async fetchCategory() {
      this.loading = true;
      const { list, } = await DictionaryApi.itemList({ catalogId: this.id, });
      this.list = list.map(item => {
        item.edit = false;
        return item;
      });
      this.loading = false;
    },
    async lazyLoad(tree, treeNode, resolve) {
      const { list, } = await DictionaryApi.itemList({
        catalogId: treeNode.catalogId,
        parentId: tree.id,
        pageSize: 9999,
      });
      resolve(list);
    },
    onChangeItemState(row) {},
    async onAddChild(row) {
      const store = this.$refs.table.store;
      this.creating = true;
      const map = store.states.lazyTreeNodeMap;
      if (!map[row.id]) {
        const { list, } = await DictionaryApi.itemList({
          categoryId: this.id,
          parentId: row.id,
          pageSize: 9999,
        });
        list.unshift({
          edit: true,
          name: null,
          state: 1,
          categoryId: this.id,
          parentId: row.id,
          isTopLevel: !row.parentId,
          id: -999,
        });
        this.$set(map, row.id, list);
      } else {
        const list = map[row.id];
        list.unshift({
          edit: true,
          name: null,
          state: 1,
          categoryId: this.id,
          parentId: row.id,
          isTopLevel: !row.parentId,
          id: -999,
        });
        this.$set(map, row.id, list);
      }
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, true);
        this.$refs.table.doLayout();
      });
    },
    onAddItem(parentId, isTopLevel = true) {
      if (this.hasEditRow) {
        return;
      }
      this.creating = true;
      this.list.push({
        edit: true,
        name: null,
        state: 1,
        categoryId: this.id,
        isTopLevel: true,
        parentId,
        id: null,
      });
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
      });
    },
    onUpdateItem(row) {
      if (this.creating || this.hasEditRow) {
        return;
      }
      row.edit = !row.edit;
      this.hasEditRow = true;
    },
    async onDeleteItem(row) {
      await DictionaryApi.deleteItem(row.id);
      this.afterDealItem(row.parentId);
    },
    async onSubmit(row) {
      if (!row.name) {
        return this.$message.error('请输入字典项名');
      }
      await DictionaryApi.addItem({ id: row.id === -999 ? null : row.id, categoryId: this.id,
        parentId: row.parentId,
        state: row.state,
        name: row.name,
      });
      if (this.creating) {
        this.$message.success('新增成功！');
      } else {
        this.$message.success('更新成功！');
      }
      this.afterDealItem(row.parentId, row.isTopLevel);
      this.hasEditRow = false;
      this.creating = false;
    },
    onCancel(row) {
      if (this.creating) {
        if (row.parentId) {
          const store = this.$refs.table.store;

          const map = store.states.lazyTreeNodeMap;
          const list = map[row.parentId];
          list.shift();
          this.$set(map, row.parentId, list);
        } else {
          this.list.pop();
        }
      } else {
        row.edit = !row.edit;
      }
      this.afterDealItem(row.parentId);
      this.creating = false;
      this.hasEditRow = false;
    },
    // 当处理item(create,update,delete)后，如果是最顶层，则重新查询顶层数据，如果是子项,刷新父项,
    // 如果是第一层，也需要刷新列表，以解决顶层数据没有子集时，level为'',导致新增子项后，子集indent有问题的bug
    afterDealItem(pid, needFetchData) {
      if (pid) {
        if (needFetchData) {
          this.fetchCategory();
        }
        this.refreshRow(pid);
      } else {
        this.fetchCategory();
      }
    },
    async refreshRow(id) {
      const { list, } = await DictionaryApi.itemList({
        categoryId: this.categoryId,
        parentId: id,
      });
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, list.map(item => {
        item.edit = false;
        return item;
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
}
 .table-content{
    position: absolute;
    width: 100%;
    height: 100%;
 }
</style>
