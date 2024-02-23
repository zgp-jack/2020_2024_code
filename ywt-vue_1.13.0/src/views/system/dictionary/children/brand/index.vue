<!--  -->
<template>

  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
            <pure-button label="新增" @click="clickAdd" />
          </div>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table :data="data" :header-cell-style="{'textAlign':'center'}" border>
              <el-table-column
                v-for="(v, i) in columnConfig"
                :key="i"
                v-loading="loading"
                :label="v.label"
                :prop="v.prop"
                :type="v.type"
                :width="v.width"
                :formatter="v.formatter"
                align="left"
                :empty-text="emptyText"
                :max-height="tableMaxHeight"
              >
                <template v-if="v.slot" #default="{row}">
                  <el-button type="text" size="mini" @click="clickEdit(row)">编辑</el-button>
                  <el-button type="text" size="mini" @click="clickDel(row)">删除</el-button>
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
  </el-container>

</template>

<script>
import columnConfig from './config/table';
import DictionaryApi from '@/apis/dictionary/center';
import PaginationTable from '@/minxins/common/paginationTable';
import Add from '../../components/brand/add.vue';

export default {
  name: 'XtszZdwhCjpp',
  mixins: [PaginationTable],
  data() {
    return {
      columnConfig,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      listApi: DictionaryApi.BrandApi.init,

    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    clickAdd() {
      this.renderComponentFu();
    },
    clickEdit(v) {
      this.renderComponentFu(v);
    },
    async clickDel(v) {
      this.$confirm(`确定删除「${v.name}」吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await DictionaryApi.BrandApi.del({ id: v.id, });
          this.$message.success('删除成功!');
          this.fetchData();
        } catch (error) {
          this.$message.error(error);
        }
      });
    },
    renderComponentFu(params = {}) {
      this.$dialog({
        position: 'center',
        width: '688px',
        title: '新增',
        component: () => <Add info={params} onDone={this.fetchData}/>,
      });
    },

  },
};
</script>
<style lang='scss' scoped>

</style>
