<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template #header>
          <el-row type="flex" class="  base-margin-right base-margin-left base-margin-top">
            <el-col :span="24">
              <PureButtonGroup
                :options="btnGroup"
                style="margin-left: 0"
                @change="clickTabs"
              />
            </el-col>
            <el-col :span="24" class="t-r">

              <pure-button type="wire-frame" :disabled="exportButtonDisabled" label="导出任务" @click="onExportTask" />

              <pure-button label="新增任务" @click="clickAddTask" />
            </el-col>
          </el-row>
          <!-- class="base-margin-right" -->
          <el-row class="base-margin-left base-margin-right  base-margin-top">
            <el-col :span="24">
              <el-form inline size="small" :model="searchForm">
                <el-row type="flex" :gutter="16" style="flex-wrap:wrap">

                  <el-col :xs="8" :sm="6" :md="6" :lg="3" :xl="3" class="m-b-16 ">
                    <el-form-item class="w-100">
                      <search v-model="searchForm.keyWord" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="3" :xl="3" class="m-b-16">
                    <el-form-item class="w-100">
                      <UserSelect v-model="searchForm.leaderUser" multiple :placeholder="'责任人'" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="3" :xl="3" class="m-b-16">
                    <el-form-item class="w-100">
                      <el-select v-model="searchForm.state" placeholder="请选择">
                        <el-option
                          v-for="item in StateList"
                          :key="item.code"
                          :label="item.text"
                          :value="item.code"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="5" :xl="5" class="m-b-16">
                    <el-form-item class="w-100 tag">
                      <UserSelect v-model="searchForm.joinUser" class="w-100  " multiple :placeholder="'参与人'" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="3" :xl="3" class="m-b-16">
                    <el-form-item class="w-100">
                      <ProjectSelect v-model="searchForm.item" value-type="itemCode" placeholder="项目选择" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="3" :xl="3" class="m-b-16">
                    <el-form-item class="w-100">
                      <DicSelectMultiple v-model="searchForm.taskTypeId" :dic-key="'taskType'" collapse-tags filterable placeholder="任务类型" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="6" :lg="4" :xl="4" class="m-b-16">
                    <el-form-item class="w-100 tag">
                      <GroupSelect v-model="searchForm.group" />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="8" :sm="6" :md="6" :lg="8" :xl="8">
                    <el-form-item class="w-100">
                      <el-date-picker
                        v-model="searchForm.dateTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="8" :sm="6" :md="24" :lg="{span:8,offset:8}" :xl="{span:8,offset:8}" class="t-r">
                    <pure-button type="wire-frame" label="查询" @click="onSearch" />
                  </el-col>
                </el-row>

              </el-form>
            </el-col>
          </el-row>
        </template>
        <template #body>
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              lazy
              row-key="id"
              :data="data"
              :indent="2"
              :load="lazyLoad"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              :tree-props="{children: 'children', hasChildren: 'child'}"
              :cell-style="tableStyle.cellStyle"
            >
              <el-table-column
                v-for="v in tableColumn"
                :key="v.prop"
                :type="v.type"
                :label="v.label"
                :prop="v.prop"
                :formatter="v.formatter "
                :width="v.width"
                align="left"
                :fixed="v.fixed"
                :show-overflow-tooltip="v.overflow"
              >
                <template v-if="v.slot" #default="{row}">
                  <OptionsMenu :data="row" @click="clickOptionsMenu($event,row)" />
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
import TaskApi from '@/apis/synthesize/taskManagement';
import index_mixins from './mixins/index.mixin';
import _ from 'lodash';
import tableStyle from '@/views/project/style/table';
import PaginationTable from '@/minxins/common/paginationTable';
import OptionsMenu from './components/optionsMenu.vue';
import AddTask from './components/panel/addTask.vue';
import Assign from '@/views/components/engineer/userSelect.vue';
import Handle from './components/task/handle.vue';
import Passed from './components/task/passed.vue';
import Stoped from './components/task/stop.vue';
import ChildTask from './components/task/childTask.vue';
import PureButtonGroup from '@/components/button/buttonGroup.vue';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';
import UserSelect from '@/views/project/components/userSelect/index';
import ProjectSelect from '@/views/project/components/select/selectProject.vue';
import DicSelectMultiple from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';
import GroupSelect from '@/feat/system/group/component/groupSelect.vue';
import downLoadFile from '@/utils/downLoad';

export default {
  name: 'ZhRwgl',
  components: {
    OptionsMenu,
    PureButtonGroup,
    UserSelect,
    ProjectSelect,
    DicSelectMultiple,
    GroupSelect,
  },
  mixins: [index_mixins, PaginationTable],
  data() {
    return {
      tableStyle,
      loading: false,
      exportButtonDisabled: false,
      partial: {
        childId: null,
        parentId: null,
        parentLeaderId: null,
        type: '',
        index: null,
      },
      listApi: TaskApi.init,
      searchForm: {
        group: '',
        dateTime: [],
        keyWord: '',
        leaderUser: '',
        joinUser: '',
        state: '-1',
        item: '',
        taskTypeId: '',
      },
      btnGroup: [{
        name: '全部',
        count: '',
        code: 'all',
      }, {
        name: '我参与的',
        count: '',
        code: 'part',
        state: 5,

      }, {
        name: '我负责的',
        count: '',
        code: 'process',
        state: 1,
      }, {
        name: '待我审核',
        count: '',
        code: 'audit',
        state: 2,

      },
      {
        name: '我审核的',
        count: '',
        code: 'audited',
        state: 4,

      },
      {
        name: '我创建的',
        count: '',
        code: 'create',
        state: 3,
      }],

    };
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    // 导出任务 前置条件：必须筛选
    async onExportTask() {
      const arr = [];
      const loading = this.$loading({
        text: '下载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const res = await TaskApi.init(Object.assign({}, this.queryCondition, { pageSize: 99999, pageNum: 0, }));
      const data = res?.list || [];
      const len = data?.length || 0;

      try {
        this.exportButtonDisabled = true;
        for (let i = 0; i < len; i++) {
          arr.push({
            ...data[i],
            taskOrder: i + 1,
          });

          if (data[i].child) {
            const res = await TaskApi.lazyChild(data[i].id);
            const values = res.map((subItem, subIndex) => {
              return {
                ...subItem,
                taskOrder: `${i + 1}.${subIndex + 1}`,
              };
            });
            arr.push(...values);
          }
        }
        const date_time = this.$options.filters.date(Date.now(), 'YYYY-MM-DD');
        // Excel 下载
        const xlsxName = `任务信息-${date_time}.xlsx`;
        const xlsxRes = await TaskApi.exportExcel(JSON.stringify(arr),);
        downLoadFile(xlsxRes, xlsxName, async () => {
          // zip 下载
          const zipName = `任务信息-${date_time}.zip`;
          const zipRes = await TaskApi.downZip(JSON.stringify(arr),);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(zipRes);
          link.download = zipName;
          link.click();
        });
      } catch (err) {
        this.$message.error(err);
        //
      } finally {
        this.exportButtonDisabled = false;
        loading.close();
      }
    },

    clickTabs(v) {
      const btnGroupMap = {
        '全部': '',
        '我参与的': 5,
        '我负责的': 1,
        '待我审核': 2,
        '我审核的': 4,
        '我创建的': 3,
      };
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.states = btnGroupMap[v] || '';
      this.fetchData();
    },
    onSearch: _.debounce(function () {
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.status = Number(this.searchForm.state);
      this.queryCondition.leaders = this.searchForm.leaderUser;
      this.queryCondition.joinUsers = this.searchForm.joinUser;
      this.queryCondition.itemCode = this.searchForm.item;
      this.queryCondition.taskTypeId = this.searchForm.taskTypeId;
      this.queryCondition.query = this.searchForm.keyWord;
      this.queryCondition.teamId = this.searchForm.group;
      this.queryCondition.startTime = this.searchForm.dateTime ? this.searchForm.dateTime[0] || '' : '';
      this.queryCondition.endTime = this.searchForm.dateTime ? this.searchForm.dateTime[1] || '' : '';

      this.fetchData();
    }, 300),
    async clickOptionsMenu(type, row) {
      this.$set(this.partial, 'parentId', row?.parentId || null);
      this.$set(this.partial, 'childId', row.id);

      this.$set(this.partial, 'type', type);

      switch (type) {
        case 'search':
          if (row?.parentId) {
            this.$dialog({
              title: '查看',
              width: dialogWidth.mini_px,
              position: 'center',
              component: () => <ChildTask data={row} type={type} onDone={this.onDone} />,
            });
          } else {
            this.$drawer({
              title: '任务',
              width: drawerWidth.medium_px,
              position: 'right-bottom',
              component: () => <AddTask info={row} onDone={this.fetchData} type={type}/>,
            });
          }

          break;

        case 'del':
          this.$confirm(`是否删除「${row.taskName}」任务?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await TaskApi.del(row.id);
            this.fetchData();
          }).catch();

          break;

        case 'edit':

          if (row?.parentId) {
            this.$dialog({
              title: '编辑',
              width: dialogWidth.mini_px,
              position: 'center',
              component: () => <ChildTask data={row} where={'index'} type={type} onDone={this.fetchData} />,
            });
          } else {
            this.$set(this.partial, 'parentId', row.id || null);
            this.$drawer({
              title: '任务',
              width: drawerWidth.medium_px,
              position: 'right-bottom',
              component: () => <AddTask info={row} onDone={this.fetchData} type={type}/>,
            });
          }
          break;
        case 'addChild':

          this.$set(this.partial, 'parentId', row.id || null);

          this.$dialog({
            title: '添加子任务',
            width: dialogWidth.mini_px,
            position: 'center',
            component: () => <ChildTask disabledDate={[row.planStartDate, row.planEndDate]} data={row} where={'index'} type={type} onDone={this.fetchData} />,
          });

          break;
        case 'handle':
          this.$dialog({
            title: '处理任务',
            width: dialogWidth.mini_px,
            position: 'center',
            top: '15vh',
            component: () => <Handle info={row} onDone={this.fetchData} />,
          });
          break;
        case 'assign':
          this.$drawer({
            component: () => <Assign onDone={this.Assign} />,
          });
          break;
        case 'passed':
          this.$dialog({
            title: '转交任务',
            width: dialogWidth.mini_px,
            position: 'center',
            top: '15vh',
            component: () => <Passed data={row} onDone={this.fetchData}/>,
          });
          break;
        case 'stop':
          this.$dialog({
            title: '暂停',
            width: dialogWidth.mini_px,
            position: 'center',
            top: '15vh',
            component: () => <Stoped data={row} type={type} onDone={this.fetchData} />,
          });
          break;
        case 'open':
          await TaskApi.open(row.id);
          this.fetchData();
          break;
        case 'end':
          this.$set(this.partial, 'parentId', row.parentId || row.id);

          this.$dialog({
            title: '终止',
            width: dialogWidth.mini_px,
            position: 'center',
            top: '15vh',
            component: () => <Stoped data={row} type={type} onDone={this.fetchData}/>,
          });
          break;
        case 'review':
          this.$drawer({
            title: '审核任务',
            width: drawerWidth.medium_px,
            position: 'right-bottom',
            component: () => <AddTask info={row} onDone={this.fetchData} type={type}/>,
          });
          break;
        case 'submit':
          await TaskApi.submit(row.id);
          this.fetchData();
          break;
      }
    },

    async Assign(data) {
      await TaskApi.assign(data.id);
      this.fetchData();
    },
    async lazyLoad(tree, treeNode, resolve) {
      this.$set(this.partial, 'index', tree.index);
      this.$set(this.partial, 'parentId', tree.id);
      this.$set(this.partial, 'parentLeaderId', tree.leaderUser);
      const rs = await TaskApi.lazyChild(tree.id);
      const sortResult = _.sortBy(rs, 'taskOrder', function (v) {
        return new Date(v['createTime']).getTime();
      });
      for (let i = 0; i < sortResult.length; i++) {
        Object.assign(sortResult[i], { index: `${tree.index}.${i + 1}`, parentLeaderId: tree.leaderUser, });
      }
      tree.child = true;
      resolve(sortResult);
    },

    async countInit() {
      const result = await TaskApi.typeCount();
      const btnGroupMap = _.keyBy(this.btnGroup, 'code');
      for (const i in result) {
        if (btnGroupMap[i]) {
          btnGroupMap[i].count = result[i] || '';
        }
      }
    },
    convertListData(list) {
      for (let i = 0; i < list.length; i++) {
        Object.assign(list[i], { index: i + 1, });
      }
      this.updateSubNode();
      this.countInit();
      return list;
    },
    async updateSubNode() {
      if (this.partial.parentId) {
        const lazyTreeNodeMap = this.$refs.table.store.states.lazyTreeNodeMap;
        const rs = await TaskApi.lazyChild(this.partial.parentId);
        for (let i = 0; i < rs.length; i++) {
          Object.assign(rs[i], { index: `${this.partial.index}.${i + 1}`, parentLeaderId: this.partial.parentLeaderId, });
        }
        this.$set(lazyTreeNodeMap, this.partial.parentId, rs);
      }
    },
    clickAddTask() {
      this.$drawer({
        title: '任务',
        width: drawerWidth.medium_px,
        position: 'right-bottom',
        component: () => <AddTask onDone={this.fetchData} type='edit'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag{
::v-deep .el-form-item__content{
    width: 100%;
  }
}

.t-r{
  text-align: right;

}
.m{
  &-b{
    &-16{
  margin-bottom: 16px;

    }
  }
}
.w-100{
   width: 100%;

}

::v-deep .el-form-item--small.el-form-item{
  margin-bottom: 0 !important;
  margin-right:24px;
}
::v-deep .el-range-input{
  font-size: 18px;
}
</style>
