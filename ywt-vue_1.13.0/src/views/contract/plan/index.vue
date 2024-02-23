<!--  -->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <div class="flex base-margin-left base-margin-top">
            <pure-button label="新增模板" @click="clickAdd" />
          </div>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              :cell-style="tableStyle.cellStyle"
              border
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              :data="data"
              @row-click="clickColumn"
            >
              <el-table-column show-overflow-tooltip type="index" label="序号" width="60px" align="left" />
              <el-table-column show-overflow-tooltip prop="name" label="模板名称" />
              <el-table-column show-overflow-tooltip label="是否启用" align="left" width="100px">
                <template #default="{row}">
                  <el-switch v-model="row.states" :active-value="1" :inactive-value="0" @change="changeSwitch($event,row)" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120px" align="left">
                <template #default="{row}">
                  <el-button type="text" size="mini" @click.stop="clickEdit(row)">编辑</el-button>
                  <el-button type="text" size="mini" @click.stop="clickDel(row)">删除</el-button>
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
    <el-aside width="1028px" style="margin:0">
      <el-container>
        <el-main v-loading="rightLoading" class="wrapper-col">
          <template v-if="isData">
            <el-row class="row-tag">
              <el-col :span="3">
                <h5>基础信息</h5>
              </el-col>
              <el-col :span="3">
                <span>创建人:<small>{{ rightBaseData.user | member }}</small></span>
              </el-col>
              <el-col :span="7">
                <span>创建时间:<small>{{ rightBaseData.createTime | date }}</small></span>
              </el-col>
            </el-row>
            <el-row class="row-tag">
              <el-col :span="24">
                <h6>基础信息 <b>{{ rightBaseData.name }}</b></h6>
              </el-col>
            </el-row>
            <hr>
            <el-table :data="rightBaseData.templateInfo" border :cell-style="tableStyle.cellStyle">
              <el-table-column align="left" type="index" width="85px" label="分期" />
              <el-table-column align="left" show-overflow-tooltip label="付款说明" prop="explan" width="auto" />
              <el-table-column align="left" label="付款比例" :formatter="formatterRate" width="100px" />
              <el-table-column align="left" show-overflow-tooltip :formatter="formatterPlan" label="计划付款日期" width="350px" />
            </el-table>
          </template>

          <el-result v-else icon="info" title="提示" sub-title="无数据，去新增模板" />

        </el-main>
      </el-container>
    </el-aside>
  </el-container>
</template>

<script>
import ConrtactApis from '@/apis/contract';
import tableStyle from '@/views/project/style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import Template from './components/template.vue';
import { keyBy, } from 'lodash';
import { mapActions, mapState, } from 'vuex';
export default {
  name: 'HtFkjhmb',
  components: {
  },
  mixins: [PaginationTable],
  data() {
    return {
      tableStyle,
      rightLoading: false,
      userList: [],
      isData: false,
      rightBaseData: {
        user: '',
        createTime: '',
        name: '',
        templateInfo: [],
      },
      initRight: true,
      listApi: ConrtactApis.TemplateApi.init,
    };
  },
  computed: {
    ...mapState('dictionary', ['contractAcceptanceTime']),
    PayTypes() {
      return this.contractAcceptanceTime;
    },
  },
  created() {
    this.DISPATCHT_GET_USER_LIST();
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),

    formatterPlan(row, column, cellValue, index) {
      const payTypesMap = keyBy(this.PayTypes, 'value');
      return payTypesMap[row.payType].name + '之后' + row.days + '天';
    },
    formatterRate(row, column, cellValue, index) {
      return row.payRate + '%';
    },
    clickColumn(row, column, event) {
      this.baseInit(row.id);
    },
    clickEdit(r) {
      this.$drawer({
        width: '1144px',
        component: () => <Template info={r} onDone={this.fetchData} />,
      });
    },

    afterFetchData() {
      if (this.initRight) {
        this.requestRightData(true);
      }
    },
    requestRightData(isInit) {
      if (isInit && this.data.length) {
        this.baseInit(this.data[0].id);
      } else {
        this.rightBaseData = this.$options.data().rightBaseData;
        this.isData = false;
      }
    },

    async changeSwitch(v, r) {
      event.stopPropagation();

      const params = {
        id: r.id,
        states: v,
      };
      await ConrtactApis.TemplateApi.off(params);
      this.initRight = false;
      this.fetchData();
    },
    clickDel(r) {
      this.$confirm(`是否删除「${r.name}」模板?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await ConrtactApis.TemplateApi.del(r.id);
        this.initRight = true;
        this.fetchData();
        this.$message.success('删除成功');
      });
    },

    async baseInit(id) {
      if (id) {
        this.rightLoading = true;
        this.rightBaseData = await ConrtactApis.TemplateApi.detail(id);
        this.rightBaseData.user = this.rightBaseData.createUser;
        for (const i of this.rightBaseData.templateInfo) {
          i.payRate = i.payRate * 100;
        }
        this.rightLoading = false;
        this.isData = true;
      } else {
        this.isData = false;
        this.rightLoading = false;
      }
    },
    clickAdd() {
      if (!this.data.length) {
        this.initRight = true;
      }
      this.$drawer({
        width: '1144px',
        component: () => <Template onDone={this.fetchData} />,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.wrapper-col,
.wrapper-row {
  height: 100%;
}
.wrapper-col {
  padding: 0 16px;
  &:first-child {
    border-right: 1px solid #ecf0f7;
  }
  &:last-child {
    border-left: 1px solid #ecf0f7;
  }
}

.row-tag {
  height: 46px;
  display: flex;
  align-items: center;
  h5 {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-weight: 500;
    color: #2d405e;
  }
  span {
    font-size: 18px;
    font-weight: 400;
    color: #879bba;
    > small {
      font-size: 18px;
      font-weight: 400;
      color: #2d405e;
      display: inline-block;
      margin-left: 3px;
    }
  }
  h6 {
    font-size: 18px;
    font-weight: 400;
    color: #879bba;
    > b {
      font-size: 18px;
      font-weight: 400;
      color: #2d405e;
    }
  }
}
hr {
  border: none;
  height: 1px;
  background-color: #ecf0f7;
}
.t-r {
  text-align: right;
}
.w-100 {
  width: 100%;
}
</style>
