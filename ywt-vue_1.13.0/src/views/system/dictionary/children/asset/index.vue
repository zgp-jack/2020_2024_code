
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <pure-button label="新增资产" @click="clickAddAsset" />
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
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column
                v-for="(v, i) in columnConfig"
                :key="i"
                :label="v.label"
                :prop="v.prop"
                :type="v.type"
                :width="v.width"
                :formatter="v.formatter"
                :align="v.prop !='name' ?'center':'left'"
              >
                <template v-if="v.slot" #default="{row,column}">
                  <el-button type="text" size="mini" @click="clickAddChild(row,column)">添加子类</el-button>
                  <el-button type="text" size="mini" @click="clickEdit(row,column)">编辑</el-button>
                  <el-button type="text" size="mini" @click="clickDel(row,column)">删除</el-button>
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
  </el-container>
</template>
<script>
import columnConfig from './config/table';
import DictionaryApi from '@/apis/dictionary/center';
import { mapMutations, } from 'vuex';
import _ from 'lodash';
import PaginationTable from '@/minxins/common/paginationTable';
import Add from '../../components/asset/type.vue';

export default {
  name: 'XtszZdwhZclb',
  mixins: [PaginationTable],
  data() {
    return {
      columnConfig,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      PID: 0,
      ID: 0,
      result: {},
      option: '',
      listApi: DictionaryApi.AssetApi.init,
      // 用于装载所有的列表数据
      tableList: [],
    };
  },

  mounted() {
    this.fetchData();
    this.SET_INJECT_EVENT({ name: 'assetsSwitchCallBack', fun: this.fetchData, });
  },
  methods: {
    ...mapMutations('project/index', ['SET_INJECT_EVENT']),
    convertListData(list) {
      if (list.length) {
        for (const i of list) {
          i.hasChildren = !!i.hasChildren;
        }
      }
      this.tableList = list;
      return list;
    },

    async lazyLoad(tree, treeNode, resolve) {
      const data = {
        pageNum: 0,
        pageSize: 999,
        parentId: tree.id,
      };
      const rs = await DictionaryApi.AssetApi.init(data);
      tree.hasChildren = true;
      this.tableList = [...this.tableList, ...rs.list];
      resolve(rs.list);
    },

    // 编辑
    clickEdit(r) {
      this.PID = r.parentId;
      this.ID = r.id;
      this.renderComponentFun('编辑资产', r, 'edit');
    },
    // 获取父节点数据
    getParentData(PID) {
      if (!PID) {
        return {};
      }
      const listMap = _.keyBy(this.tableList, 'id');
      return listMap[PID];
    },
    // 删除
    async clickDel(v) {
      this.$confirm(`确定删除「${v.name}」吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await DictionaryApi.AssetApi.del({ id: v.id, });
          if (v.parentId) {
            const lazyTreeNodeMap = this.$refs.table.store.states.lazyTreeNodeMap;
            // 找出被删除的值
            let treeNodeArr = [];
            treeNodeArr = lazyTreeNodeMap[v.parentId];
            _.remove(treeNodeArr, (r) => {
              return r.id === v.id;
            });
            const orginType = treeNodeArr.length ? treeNodeArr : [];
            this.$set(this.$refs.table.store.states.lazyTreeNodeMap, v.parentId, orginType);
          }
          this.$message.success('删除成功!');
          this.fetchData();
        } catch (error) {
          this.$message.error(error);
        }
      });
    },
    // 添加子类
    clickAddChild(r, c) {
      this.ID = r.id;
      this.PID = r.parentId || 0;
      this.renderComponentFun('添加子类', r, 'child');
    },
    // 新增资产
    clickAddAsset() {
      this.renderComponentFun();
    },
    onDone(data) {
      this.fetchData();
      // 适用于添加  不适用编辑当前数据
      const lazyTreeNodeMap = this.$refs.table.store.states.lazyTreeNodeMap;
      if (this.option === 'child') {
        if (JSON.stringify(lazyTreeNodeMap) === '{}' || lazyTreeNodeMap[this.ID] === undefined) {
          this.$set(lazyTreeNodeMap, this.ID, [data]);
        } else if (lazyTreeNodeMap[this.ID]) {
          this.$set(lazyTreeNodeMap, this.ID, [...lazyTreeNodeMap[this.ID], data]);
        }
      }

      if (this.option === 'edit') {
        if (this.PID) {
          const currentEditVal = lazyTreeNodeMap[this.PID];
          const currentEditValMap = _.keyBy(currentEditVal, 'id');
          currentEditValMap[this.ID].name = data.name;
          this.$set(this.$refs.table.store.states.lazyTreeNodeMap, this.PID, currentEditVal);
        }
      }
    },
    renderComponentFun(title = '新增资产', row = {}, optionsName = 'add') {
      this.option = optionsName;
      this.$dialog({
        position: 'center',
        width: '548px',
        title: title,
        component: () => <Add onDone={this.onDone} info={row} changeOptionsName={optionsName} tableList={this.tableList}/>,
      });
    },
  },
};
</script>
<style lang='scss' scoped>

</style>
