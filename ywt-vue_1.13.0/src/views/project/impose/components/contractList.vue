<!--  -->
<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <PureButtonGroup
            :options="btnGroup"
            style="margin-left: 0"
            @change="clickTabs"
          />
        </el-col>
        <el-col :span="6">
          <search v-model.trim="query.name" />
        </el-col>
        <el-col class="t-r" :offset="0" :span="4">
          <pure-button type="wire-frame" label="新增合同" :disabled="!IsPrincipal" @click="clickAdd" />
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <el-table v-loading="loading" :data="result.list" border>
        <el-table-column type="index" label="序号" width="85px" align="left" />
        <el-table-column prop="name" show-overflow-tooltip label="合同名称" />
        <el-table-column align="left" label="付款情况">
          <el-table-column #default="{row}" width="180px" align="left" label="付款状态" prop="payState">
            <PayProcess :id="row.id" :value="row.payState" />
          </el-table-column>
          <el-table-column #default="{row}" width="180px" align="left" label="应付(元)" prop="contractPrice">
            {{ row.contractPrice | formatCash }}
          </el-table-column>
          <el-table-column #default="{row}" width="180px" align="left" label="待付(元)" prop="unpaidPrice">
            {{ row.unpaidPrice | formatCash }}
          </el-table-column>
        </el-table-column>
        <el-table-column align="left" label="开票情况">
          <el-table-column #default="{row}" width="180px" align="left" label="开票状态" prop="receiptState">
            <BillProcess :id="row.id" :state="row.receiptState" :contract-price="row.contractPrice" />
          </el-table-column>
          <el-table-column #default="{row}" width="180px" align="left" label="应开(元)" prop="contractPrice">
            {{ row.contractPrice | formatCash }}
          </el-table-column>
          <el-table-column #default="{row}" width="180px" align="left" label="待开(元)" prop="unpaidReceiptPrice">
            {{ row.unpaidReceiptPrice | formatCash }}
          </el-table-column>
        </el-table-column>
        <el-table-column #default="{row}" align="left" label="操作" width="220px">
          <el-button type="text" size="mini" @click="clickLook(row)">查看</el-button>
          <el-button type="text" size="mini" @click="clickHandel(row)">处理</el-button>
          <el-button type="text" size="mini" @click="clickEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="clickDel(row)">删除</el-button>
        </el-table-column>

      </el-table>
    </el-main>
    <el-footer class="footer">
      <el-pagination
        :current-page="result.pageNum"
        :page-size="result.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="result.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import { debounce, } from 'lodash';
import ContractPanel from '@/views/contract/management/components/template.vue';
import { mapActions, mapMutations, mapState, } from 'vuex';
import PureButtonGroup from '@/components/button/buttonGroup.vue';
import PayProcess from '@/views/contract/management/components/payProcess.vue';
import BillProcess from '@/views/contract/management/components/billProcess.vue';

export default {
  components: {
    PureButtonGroup,
    PayProcess,
    BillProcess,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      searchVal: '',
      loading: false,
      btnGroup: [{
        name: '进行中',
        count: '',
        code: 'all',
      }, {
        name: '已完成',
        count: '',
        code: 'part',
        state: 5,

      }],
      query: {
        pageNum: 0,
        pageSize: 10,
        name: '', // 合同名称
        number: '', // 合同号
        itemCode: '', // 项目编号
        officeId: '', // 科室ID
        payDays: undefined, // 计划付款？天内
        qaDays: undefined, // 维保到期？天内
        companybId: '', // 乙方ID
        companycId: '', // 丙方ID
        // 合同状态 1进行中 2已完成
        contractState: 1,
      },

      result: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapState('login', {
      UserId: (data) => {
        return data.userInfo.id;
      },
    }),
    IsPrincipal() {
      return this.data.principal === this.UserId;
    },
  },
  watch: {
    query: {
      handler: debounce(function () {
        this.init();
      }, 300),
      deep: true,
    },
  },
  mounted() {
    this.init();
    this.DISPATHCH_ENTERPRISE_LIST();
  },
  methods: {
    ...mapMutations('contract/index', ['SET_OPTIONS_MODEL']),
    ...mapActions('contract/index', ['DISPATHCH_ENTERPRISE_LIST']),
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),
    clickTabs(v) {
      const btnGroupMap = {
        '进行中': 1,
        '已完成': 2,
      };
      this.query.contractState = btnGroupMap[v];
    },
    handleSizeChange(N) {
      this.query.pageSize = N;
    },
    handleCurrentChange(P) {
      this.query.pageNum = P;
    },
    clickLook(row) {
      this.renderTemplateFun(row, 'look');
    },
    clickAdd() {
      this.renderTemplateFun();
    },
    // 处理
    clickHandel(r) {
      this.renderTemplateFun(r, 'handle');
    },
    // 编辑
    clickEdit(r) {
      this.renderTemplateFun(r, 'edit');
    },
    clickDel(r) {
      this.$confirm(`是否删除「${r.name}」合同?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await ConrtactApis.ConrtactApi.del(r.id);
        this.init();
        this.FETCH_PERFORM_EVENT({ name: 'imposeList', });
        this.$message.success('删除成功');
      }).catch({});
    },
    renderTemplateFun(r = {}, model = 'add',) {
      this.SET_OPTIONS_MODEL(model);
      const whereInfo = {
        where: 'project',
        itemCode: this.data.itemCode,
      };
      this.$innerDrawer({
        width: '1300px',
        component: () => <ContractPanel info={r} onDone={this.onDone} whereInfo={whereInfo}/>,
      });
    },
    onDone() {
      this.init();
    },
    async init() {
      this.loading = true;
      const data = {
        ...this.query,
      };
      data.itemCode = this.data?.itemCode || '';
      const rs = await ConrtactApis.ConrtactApi.init(data);
      this.result = rs;
      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
  text-align: right;
}
.footer{
display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
}

.main{
  min-height: 480px;
  // max-height: 480px;
  overflow: auto;
}
</style>
