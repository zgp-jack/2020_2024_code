<!--  -->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <div class="flex base-margin-left base-margin-top">
            <pure-button label="新增合同" @click="clickAdd" />
            <pure-button v-popover:popover label="查询" type="wire-frame" />
            <el-popover
              ref="popover"
              placement="bottom"
              width="522"
              trigger="click"
            >
              <template #default>
                <el-form size="mini" label-width="90px" :model="searchForm" label-position="right">
                  <el-form-item label="合同名称">
                    <el-input v-model="searchForm.name" />
                  </el-form-item>
                  <el-form-item label="合同编号">
                    <el-input v-model="searchForm.number" />
                  </el-form-item>
                  <el-form-item label="所属项目">
                    <SelectProject v-model="searchForm.itemCode" value-type="itemCode" />
                  </el-form-item>
                  <el-form-item label="所属科室">
                    <department-cascader v-model="searchForm.officeId" class="w-100" />
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="20">
                          <el-form-item label="计划付款">
                            <el-input-number
                              v-model="searchForm.payDays"
                              style="width:100%"
                              controls-position="right"
                              :max="9999"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col class="t-r" :span="4">
                          天内
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="12">
                      <el-row>
                        <el-col :span="20">
                          <el-form-item label="维保到期">
                            <el-input-number
                              v-model="searchForm.qaDays"
                              style="width:100%"
                              controls-position="right"
                              :max="9999"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col class="t-r" :span="4">
                          天内
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-form-item label="乙方单位">
                    <el-select v-model="searchForm.companybId" filterable class="w-100">
                      <el-option
                        v-for="v in enterpriseList"
                        :key="v.id"
                        :label="v.name"
                        :value="v.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="丙方单位">
                    <el-select v-model="searchForm.companycId" filterable class="w-100">
                      <el-option
                        v-for="v in enterpriseList"
                        :key="v.id"
                        :label="v.name"
                        :value="v.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item class="t-r">
                    <el-button size="mini" type="default" @click="clickReset">清空</el-button>

                    <el-button size="mini" type="primary" @click="clickSearch">查询</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </el-popover>

          </div>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              size="large"
              :cell-style="tableStyle.cellStyle"
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                v-for="v in tableConfig"
                :key="v.prop"
                :type="v.type"
                :prop="v.prop"
                :label="v.label"
                :width="v.width"
                :formatter="v.formatter"
                align="left"
              >
                <el-table-column
                  v-for="i in v.children"
                  :key="i.prop"
                  :type="i.type"
                  :prop="i.prop"
                  :label="i.label"
                  :width="i.width"
                  :formatter="i.formatter"
                  align="left"
                />
                <template v-if="v.slot" #default="{row}">
                  <el-button type="text" size="mini" @click="clickLook(row)">查看</el-button>
                  <el-button type="text" size="mini" @click="clickHandel(row)">处理</el-button>
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
import tableConfig from './config/table';
import ConrtactApis from '@/apis/contract';
import ProjectAPI from '@/apis/project';
import { mapActions, mapMutations, mapState, } from 'vuex';
import { arrayToTree, } from '@/utils/common';
import tableStyle from '@/views/project/style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader';
import SelectProject from '@/views/project/components/select/selectProject.vue';
import Template from './components/template.vue';
import drawerWidth from '@/views/project/common/width/drawer';

const payTableConfig = [
  {
    prop: 'instalment',
    label: '分期',
  },
  {
    prop: 'memo',
    label: '付款说明',
  },
  {
    prop: 'date',
    label: '计划付款日期',
  },
  {
    prop: 'scale',
    label: '付款比例(%)',
  },
  {
    prop: 'Amount',
    label: '付款金额(元)',
    children: [
      {
        prop: 'dealWith',
        label: '应付',
      },
      {
        prop: 'paid',
        label: '已付',
      }
    ],
  },
  {
    prop: 'payStatus',
    label: '付款状态',
  },
  {
    prop: 'bill',
    label: '发票开具',
  },
  {
    prop: 'attachment',
    label: '附件',
  },
  {
    prop: 'options',
    label: '操作',
    slot: true,
  }
];
export default {
  name: 'HtHtgl',
  components: {
    SelectProject,
    DepartmentCascader,
  },
  mixins: [PaginationTable],
  data() {
    return {
      tableStyle,
      loading: true,
      tableConfig,
      result: {},
      num: 1,
      listApi: ConrtactApis.ConrtactApi.init,
      payTableConfig,
      showInfo: true,
      SW: {
        P: 1,
        N: 10,
        params: {},
      },
      searchForm: {
        // 合同名称
        name: '',
        // 合同号
        number: '',
        // 项目编号
        itemCode: '',
        // 科室ID
        officeId: null,
        // 计划付款？天内
        payDays: undefined,
        // 维保到期？天内
        qaDays: undefined,
        // 乙方ID
        companybId: '',
        // 丙方ID
        companycId: '',

      },
    };
  },
  computed: {
    ...mapState('contract/index', ['itemList', 'enterpriseList']),
    ...mapState({
      departmentListTree: (v) => {
        return arrayToTree(
          v.dictionary['departmentList'],
          {
            pfield: 'parent',
            ufield: 'id',
            sub_name: 'children',
          },
          null
        );
      },

    }),

  },
  activated() {
    this.getImposeContractDetail();
  },
  mounted() {
    this.DISPATCHT_GET_USER_LIST();
    this.DISPATHCH_ENTERPRISE_LIST();
    this.getImposeContractDetail();
    this.fetchData();
    this.getProjectList();
  },
  methods: {
    ...mapMutations('contract/index', ['SET_ITEMLIST', 'SET_OPTIONS_MODEL', 'SET_ENTERPRISE_LIST']),
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    ...mapActions('contract/index', ['DISPATHCH_ENTERPRISE_LIST']),

    async getImposeContractDetail() {
      const info = this.$route.params || {};
      if (Object.values(info).length) {
        this.renderTemplateFun(info, 'look');
      }
    },

    // 获取项目列表
    async getProjectList() {
      const SW = {
        W: {
          code: 'all',
          keyWord: '',
        },
        P: 1,
        N: 999,
      };
      const result = await ProjectAPI.setUp.getListData({
        pageNum: SW.P,
        pageSize: SW.N,
        code: SW.W.code,
      });
      this.SET_ITEMLIST(result.list);
    },

    // 查看
    clickLook(r) {
      this.renderTemplateFun(r, 'look');
    },
    // 处理
    clickHandel(r) {
      this.renderTemplateFun(r, 'handle');
    },
    // 编辑
    clickEdit(r) {
      this.renderTemplateFun(r, 'edit');
    },
    // 清空
    clickReset() {
      for (const i in this.searchForm) {
        this.searchForm[i] = '';
      }
      this.currentPage = 0;
      this.queryCondition = this.searchForm;
      this.fetchData.pageNum = this.currentPage;
      this.fetchData();
    },
    // 查询
    clickSearch() {
      // this.SW.params = this.searchForm;
      this.currentPage = 0;
      this.queryCondition = this.searchForm;
      this.fetchData.pageNum = this.currentPage;

      this.fetchData();
    },
    clickAdd() {
      this.renderTemplateFun();
    },
    clickDel(r) {
      this.$confirm(`是否删除「${r.name}」合同?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await ConrtactApis.ConrtactApi.del(r.id);
        this.fetchData();
        this.$message.success('删除成功');
      });
    },
    renderTemplateFun(r = {}, model = 'add',) {
      // this.data = r;
      this.SET_OPTIONS_MODEL(model);
      this.$drawer({
        width: drawerWidth.medium_px,
        component: () => <Template info={r} onDone={this.fetchData} />,
      });
    },

  },
};
</script>
<style lang='scss' scoped>

</style>
