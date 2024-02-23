<!--  -->
<template>
  <el-main>
    <el-container>
      <el-header height="auto" style="padding:0 26px 0 26px">
        <el-row>
          <el-col :span="12">
            <Search style="width: 200px" />
          </el-col>
          <el-col :span="12" class="t-r">
            <el-button type="primary" size="mini" @click="cliikAddRule">新增会议室</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main style="margin-top:16px">
        <el-container>
          <el-aside width="24px" style="text-algin:center">
            <i class="el-icon-setting" />
          </el-aside>
          <el-container style="padding:0 26px 0 0px;">
            <el-table :data="testData" border>
              <el-table-column type="index" label="序号" width="50px" align="left" />
              <el-table-column
                v-for="v in tableConfig"
                :key="v.prop"
                :prop="v.prop"
                :label="v.label"
                :formatter="v.formatter"
                align="left"
              >
                <template v-if="v.slot">
                  <el-button type="text" size="mini">编辑</el-button>
                  <el-button type="text" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-container>
        </el-container>
      </el-main>
      <el-footer class="pagination-container">
        <el-pagination
          :current-page="result.pageNum"
          :page-size="result.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="result.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-footer>
    </el-container>
  </el-main>
</template>

<script>
import tableConfig from '../config/tableConfig';
import testData from '../config/testData';

export default {
  components: {
    Search: () => import('@/components/input/search.vue'),
    // eslint-disable-next-line vue/no-unused-components
    RulePanel: () => import('./panel/addRule.vue'),
  },
  data() {
    return {
      tableConfig,
      testData,
      result: {},
      SW: {
        keyWord: '',
        W: {
          code: '',
        },
        N: 20,
        P: 1,
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    handleSizeChange(i) {
      this.SW.N = i;
    },
    cliikAddRule() {
      this.$drawer({
        width: '580px',
        component: () => <RulePanel/>,
      });
    },
    handleCurrentChange(i) {
      this.SW.P = i;
    },
  },
};
</script>
<style lang='scss' scoped>
.pagination-container {
  text-align: right;
  margin: 16px 24px 0 0;
}
.t-r{
    text-align: right;
}
</style>
