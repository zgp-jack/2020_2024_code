<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 17:38:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:39:35
 * @Description:主面板-调研表格
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
              :max-height="tableMaxHeight"
              border
              :data="data"
              :empty-text="emptyText"
            >
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="75px"
              />
              <el-table-column label="需求标题" prop="title" show-overflow-tooltip align="left" />
              <el-table-column label="处理人" prop="makeUserToName" show-overflow-tooltip align="left" />
              <el-table-column label="紧急程度" prop="level" show-overflow-tooltip align="left">
                <template #default="{row}">
                  <span :style="{ color: color(row['level']) }">
                    {{ row['level'] | needLevel }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="showState" show-overflow-tooltip align="left">
                <template #default="{row}">
                  <span :style="{ color: color(row['showState']) }">
                    {{ row['showState'] | needStatus }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="期望完成时间" prop="endTime" show-overflow-tooltip align="left">
                <template #default="{row}">
                  <template v-if="row['endTime']">
                    {{ row['endTime'] | date('YYYY-MM-DD') }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="是否超时" prop="isOvertime" show-overflow-tooltip align="left">
                <template #default="{row}">
                  <span :class="'over-time-' + row['isOvertime']">
                    {{ row['isOvertime'] ? "是" : "否" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="200px">
                <template #default="scope">
                  <TableOptionsMenu
                    :data="scope.row"
                    where-field="needSetting"
                    @click="clickOptions($event, scope.row)"
                  />
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
import HomeApi from '@/apis/home';
import { mixins_base, mixins_project_index, } from '@/minxins/project/index';
import ProjectAPI from '@/apis/project';
import End from '@/views/project/components/task/end.vue';
import ToOrder from '@/views/project/needSetting/components/toOrder.vue';
import TableArea from '@/views/components/common/tableArea.vue';
import { find, } from 'lodash';
import drawerWidth from '@/views/project/common/width/drawer';
import dialogWidth from '@/views/project/common/width/dialog';

import TableOptionsMenu from '@/views/project/needSetting/components/optionsMenu.vue';
import AddNewPanel from '@/views/project/components/panelsGroup/addNew.vue';
import Research from '@/views/project/components/panelsGroup/research.vue';
import Assign from '@/views/project/components/panelsGroup/assign.vue';
import Review from '@/views/project/components/panelsGroup/review.vue';
import DialogPause from '@/views/project/needSetting/dialog/pause.vue';

const _colorConfig = [
  {
    field: '1/end_project_order/item_before_project',
    color: '2D405E',
    memo: '黑色',
  },
  {
    field: '2/demand_inv_review/implement_start/item_program_review',
    color: 'E6A23C',
    memo: '深黄色',
  },
  {
    field: '3/demand_init/program_review_reject/reject_end/demand_pause',
    color: 'F56C6C',
    memo: '红色',
  },
  {
    field: 'item_establish/end_termination/implement_over',
    color: '67C23A',
    memo: '绿色',
  },
  {
    field: 'end_inv_reject',
    color: 'C0C4CC',
    memo: '灰色',
  },
  {
    field: 'demand_inv/demand_inv_review_next',
    color: '409EFF',
    memo: '蓝色',
  }
];

export default {
  components: {
    TableOptionsMenu,
    // eslint-disable-next-line vue/no-unused-components
    AddNewPanel,
    // eslint-disable-next-line vue/no-unused-components
    Research,
    // eslint-disable-next-line vue/no-unused-components
    TableArea,
    // eslint-disable-next-line vue/no-unused-components
    Review,
  },
  mixins: [PaginationTable, mixins_base, mixins_project_index],
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
      listApi: HomeApi.researchList,
      panelArguments: {
        demand: {
          width: drawerWidth.small_px,
          props: {
            title: '需求信息',
            hiddenSaveButton: true,
            showFooter: true,
            showTimeLine: true,
          },
        },
        research: {
          width: drawerWidth.larger_pr,
          props: {
            title: '调研',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
        review: {
          width: drawerWidth.larger_pr,
          props: {
            title: '评审',
            hiddenSaveButton: true,
            showFooter: true,
          },
        },
      },
    };
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
  async created() {
    this.DISPATCHT_GET_USER_LIST();
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
      this.$emit('update');
      this.fetchData();
    },
    optionsEnd(row) {
      this.$dialog({
        title: '终止',
        subTitle: `项目编号:${row.itemCode}`,
        position: 'center',
        width: dialogWidth.small_px,
        component: () => <End onDone={this.onDrawerDone} where={'demand'} />,
      });
    },
    optionsToOrder() {
      this.$dialog({
        title: '转工单',
        width: dialogWidth.small_px,
        position: 'center',
        component: () => <ToOrder onDone={this.onDrawerDone} />,
      });
    },
    optionsBack(row) {
      this.$confirm('此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await ProjectAPI.base.backDemand(row.itemCode);
          this.onDrawerDone();
        } catch (e) {
          this.$message.error(e);
        }
      }).catch(() => {});
    },
    optionsDelete(row) {
      this.$confirm(`是否删除「${row.title}」?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await ProjectAPI.demand.del(row.id);
          this.onDrawerDone();
        } catch (e) {
          this.$message.error(e);
        }
      }).catch(() => {});
    },
    optionsPause(row) {
      this.$dialog({
        title: '暂停原因',
        component: () => <DialogPause itemCode={row.itemCode} onDone={this.onDrawerDone}/>,
      });
    },
    async optionsOpen(row) {
      await ProjectAPI.base.demandOrProjectOpen(row.itemCode);
      this.$message.success({
        message: '开启成功!',
        onClose: this.onDrawerDone(),
      });
    },

    async clickOptions(v, r) {
      this.SET_ITEM_CODE(r.itemCode);
      this.SET_RESEARCH_INFO({ ...r, });

      if (['del', 'back', 'end', 'toOrder', 'pause', 'open'].includes(v)) {
        if (v === 'del') {
          this.optionsDelete(r);
        } else if (v === 'back') {
          this.optionsBack(r);
        } else if (v === 'end') {
          this.optionsEnd(r);
        } else if (v === 'toOrder') {
          this.optionsToOrder();
        } else if (v === 'pause') {
          this.optionsPause(r);
        } else {
          this.optionsOpen(r);
        }
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      try {
        this.SET_PERVIEW(false);
        await this.FETCEH_RESET_PANCEL_DISABLED_OPTIONS();
        const result = await ProjectAPI.base.getAllProjectData(r.itemCode);
        await this.FETCH_PANEL_DATA(result);
        loading.close();
        switch (v) {
        // 编辑状态
          case 'edit':
            this.panelArguments.demand.props.showFooter = true;
            this.panelArguments.demand.props.showTimeLine = true;
            this.panelArguments.demand.width = drawerWidth.small_px;
            this.renderPanelFn(
              'AddNewPanel',
              this.panelArguments.demand.width,
              this.panelArguments.demand.props
            );
            break;
          case 'search':
            this.perviewOptions(r.showState);
            break;
          case 'distribute':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.renderPanelFn(Assign, drawerWidth.larger_pr, { });
            break;
          case 'demand_inv':
            break;
          case 'research':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.panelArguments.research.props.showFooter = true;
            this.renderPanelFn(
              'Research',
              this.panelArguments.research.width,
              this.panelArguments.research.props
            );
            break;
          case 'review':
            this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
            this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
            this.renderPanelFn(
              'Review',
              this.panelArguments.review.width,
              this.panelArguments.review.props
            );
            break;
        }
      } catch (error) {
        this.$message.error(error);
        loading.close();
      }
    },
    /**
     * 渲染各种面板
     */
    renderPanelFn(componentName, width, props) {
      const self = this;
      this.$drawer({
        width: width,
        component: () => {
          return self.$createElement(componentName, {
            props: props,
            on: {
              done: () => {
                self.onDrawerDone();
              },
            },
          });
        },
      });
    },
    /**
     * 针对查看操作的处理
     */
    perviewOptions(type) {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchView', disabled: true, });
      if (
        [
          'demand_init',
          'demand_inv',
          'end_termination',
          null
        ].includes(type)
      ) {
        this.panelArguments.demand.props.showFooter = false;
        this.panelArguments.demand.props.showTimeLine = true;
        this.panelArguments.demand.width = drawerWidth.small_px;

        this.renderPanelFn(
          'AddNewPanel',
          this.panelArguments.demand.width,
          this.panelArguments.demand.props
        );
      } else if (
        [
          'demand_inv_review_next',
          'end_project_order',
          'end_inv_reject',
          'item_establish',
          'demand_inv_review'
        ].includes(type)
      ) {
        if (type === 'demand_inv_review') {
          this.panelArguments.research.props.title = '评审信息';
        } else if (type === 'item_establish') {
          this.panelArguments.research.props.title = '立项信息';
        }
        this.panelArguments.research.props.showFooter = false;
        this.renderPanelFn(
          'Research',
          this.panelArguments.research.width,
          this.panelArguments.research.props
        );
      }
    },

    color(text) {
      const rs = find(_colorConfig, (v, i) => {
        return v.field.includes(text.toString());
      });
      return `#${rs.color}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.over-time-1 {
  font-size: 14px;
  font-weight: 400;
  color: #f56c6c;
}
</style>
