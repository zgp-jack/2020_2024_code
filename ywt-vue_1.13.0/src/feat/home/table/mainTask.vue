<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 17:37:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:39:53
 * @Description:主面板-任务表格
-->
<template>
  <el-container>
    <el-main>
      <table-area>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :data="data"
              border
              lazy
              :indent="2"
              :load="lazyLoad"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              row-key="id"
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
                show-overflow-tooltip
              >
                <template v-if="v.slot" #default="{row}">
                  <OptionsMenu :data="row" @click="clickOptionsMenu($event,row)" />
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
      </table-area>
    </el-main>
  </el-container>
</template>
<script>
import PaginationTable from '@/minxins/common/paginationTable';
import TaskApi from '@/apis/synthesize/taskManagement';
import index_mixins from '@/views/synthesize/taskManagement/mixins/index.mixin';
import _ from 'lodash';
import tableStyle from '@/views/project/style/table';
import HomeApi from '@/apis/home';
import TableArea from '@/views/components/common/tableArea.vue';
export default {
  components: {
    OptionsMenu: () => import('@/views/synthesize/taskManagement/components/optionsMenu.vue'),
    // eslint-disable-next-line vue/no-unused-components
    AddTask: () => import('@/views/synthesize/taskManagement/components/panel/addTask.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Assign: () => import('@/views/components/engineer/userSelect.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Handle: () => import('@/views/synthesize/taskManagement/components/task/handle.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Passed: () => import('@/views/synthesize/taskManagement/components/task/passed.vue'),
    // eslint-disable-next-line vue/no-unused-components
    Stoped: () => import('@/views/synthesize/taskManagement/components/task/stop.vue'),
    // eslint-disable-next-line vue/no-unused-components
    ChildTask: () => import('@/views/synthesize/taskManagement/components/task/childTask.vue'),
    TableArea,

  },
  mixins: [PaginationTable, index_mixins],
  props: {
    queryData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      tableColumns: [{
        label: '故障描述',
        prop: '',
      }, {
        label: '处理人',
        prop: '',
      }, {
        label: '紧急程度',
        prop: '',
      }, {
        label: '状态',
      }, {
        label: '报修时间',
        prop: '',
      }, {
        label: '是否超时',
        prop: '',
      }],
      tableStyle,
      searchValue: '',
      selectedBtn: '全部',
      listApi: HomeApi.taskList,

      loading: false,
      partial: {
        childId: null,
        parentId: null,
        parentLeaderId: null,

        type: '',
        index: null,
      },
      btnGroup: [{
        name: '全部',
        num: '',
        code: 'all',
      }, {
        name: '待我处理',
        num: '',
        code: 'process',
        state: 1,
      }, {
        name: '待我审核',
        num: '',
        code: 'audit',
        state: 2,

      },
      // {
      //   name: '待提交',
      //   num: '',
      //   code: 'submit',
      //   state: 0,

      // },
      {
        name: '我创建的',
        num: '',
        code: 'create',
        state: 3,

      }, {
        name: '我审核的',
        num: '',
        code: 'audited',
        state: 4,

      }, {
        name: '我参与的',
        num: '',
        code: 'part',
        state: 5,

      }],

    };
  },
  computed: {
    columns() {
      return _.filter(this.tableColumn, (v) => {
        return v.prop !== 'compTime';
      });
    },
  },

  watch: {

    queryData: {
      handler(newVal) {
        this.queryCondition.startTime = newVal.dateRange?.[0];
        this.queryCondition.endTime = newVal.dateRange?.[1];
        this.queryCondition.sendUser = newVal.sendUser?.join(',');
        this.queryCondition.waitWork = newVal.waitWork;
        this.queryCondition.showRange = newVal.showRange;
        this.fetchData();
      },
      deep: true,
    },
  },
  mounted() {
    this.queryCondition.startTime = this.queryData.dateRange?.[0];
    this.queryCondition.endTime = this.queryData.dateRange?.[1];
    this.queryCondition.sendUser = this.queryData.sendUser?.join(',');
    this.queryCondition.waitWork = this.queryData.waitWork;
    this.queryCondition.showRange = this.queryData.showRange;
    this.queryCondition.pageNum = this.currentPage;
    this.queryCondition.pageSize = this.pageSize;
    this.fetchData();
  },

  methods: {
    onDrawerDone() {
      this.fetchData();
      this.$emit('update');
    },
    async clickOptionsMenu(type, row) {
      this.$set(this.partial, 'parentId', row?.parentId || null);
      this.$set(this.partial, 'childId', row.id);

      this.$set(this.partial, 'type', type);

      switch (type) {
        case 'search':
          if (row?.parentId) {
            this.$dialog({
              title: '查看',
              width: '648px',
              position: 'center',
              component: () => <childTask data={row} type={type} onDone={this.onDone} />,
            });
          } else {
            this.$drawer({
              title: '任务',
              width: '1280px',
              position: 'right-bottom',
              component: () => <AddTask info={row} onDone={this.onDrawerDone} type={type}/>,
            });
          }

          break;

        case 'del':
          await TaskApi.del(row.id);
          this.onDrawerDone();
          break;

        case 'edit':
          if (row?.parentId) {
            this.$dialog({
              title: '编辑',
              width: '648px',
              position: 'center',
              component: () => <childTask data={row} where={'index'} type={type} onDone={this.onDrawerDone} />,
            });
          } else {
            this.$set(this.partial, 'parentId', row.id || null);

            this.$drawer({
              title: '任务',
              width: '1144px',
              position: 'right-bottom',
              component: () => <AddTask info={row} onDone={this.onDrawerDone} type={type}/>,
            });
          }
          break;
        case 'addChild':

          this.$set(this.partial, 'parentId', row.id || null);
          this.$dialog({
            title: '添加子任务',
            width: '648px',
            position: 'center',
            component: () => <childTask disabledDate={[row.planStartDate, row.planEndDate]} data={row} where={'index'} type={type} onDone={this.onDrawerDone} />,
          });

          break;
        case 'handle':
          this.$dialog({
            title: '处理任务',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Handle info={row} onDone={this.onDrawerDone} />,
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
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Passed data={row} onDone={this.onDrawerDone}/>,
          });
          break;
        case 'stop':
          this.$dialog({
            title: '暂停',
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Stoped data={row} type={type} onDone={this.onDrawerDone} />,
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
            width: '648px',
            position: 'center',
            top: '15vh',
            component: () => <Stoped data={row} type={type} onDone={this.onDrawerDone}/>,
          });
          break;
        case 'review':
          this.$drawer({
            title: '审核任务',
            width: '1144px',
            position: 'right-bottom',
            component: () => <AddTask info={row} onDone={this.onDrawerDone} type={type}/>,
          });
          break;
        case 'submit':
          await TaskApi.submit(row.id);
          this.onDrawerDone();
          break;
      }
    },

    async Assign(data) {
      await TaskApi.assign(data.id);
      this.onDrawerDone();
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
          btnGroupMap[i].num = result[i] || '';
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
        width: '1280px',
        position: 'right-bottom',
        component: () => <AddTask onDone={this.onDrawerDone} type='edit'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
