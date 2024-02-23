<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 17:39:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:38:44
 * @Description:主面板-巡检表格
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
              <el-table-column
                v-for="(item, index) in tableColumns"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{ row }">
                  <span
                    v-if="item.prop === 'isOvertime'"
                    :class="'over-time-' + row[item.prop]"
                  >
                    {{ row[item.prop] ? "是" : "否" }}
                  </span>
                  <span v-else-if="item.prop === 'endTime'">
                    {{ row[item.prop] }}
                  </span>
                  <span v-else-if="item.prop === 'completedProgress'">
                    {{ convertCompletedProgress(row) }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="120px">
                <template slot-scope="{ row }">
                  <pure-button
                    v-if="row.frequencyNow > 1"
                    type="text"
                    label="查看"
                    @click="handleViewTask(row)"
                  />
                  <pure-button
                    v-if="queryCondition.showRange === 0"
                    type="text"
                    label="巡检"
                    @click="handleInspection(row)"
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
import Inspection from '@/views/inspection/task/dialog/inspection.vue';
import InspectionDetail from '@/views/inspection/task/dialog/inspectionDetail.vue';
import TableArea from '@/views/components/common/tableArea.vue';
export default {
  components: {
    TableArea,
  },
  mixins: [PaginationTable],
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
      frequencyUnitMap: {},
      listApi: HomeApi.inspectionList,
      tableColumns: [
        {
          label: '巡检名称',
          prop: 'name',
        },
        {
          label: '处理人',
          prop: 'makeUserToName',
        },
        {
          label: '完成进度',
          prop: 'completedProgress',
        },
        {
          label: '巡检科室',
          prop: 'deptIdToName',
        },
        {
          label: '所在位置',
          prop: 'place',
        },
        {
          label: '巡检到期时间',
          prop: 'endTime',
        },
        {
          label: '是否超时',
          prop: 'isOvertime',
        }
      ],
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
    const frequencyUnitData =
      this.$store.state['dictionary']['dicList']['frequencyUnit'] || [];
    frequencyUnitData.map((item) => {
      this.frequencyUnitMap[item.value] = item.name;
    });
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

    // 查看
    async handleViewTask(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => (
          <InspectionDetail
            taskId={row.exeId}
            actionType='view'
            propertyName={row.propertyName}
          />
        ),
      });
    },
    // 巡检
    async handleInspection(row) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => (
          <Inspection
            actionType='update'
            taskId={row.exeId}
            propertyName={row.propertyName}
            onDone={this.onDrawerDone}
          />
        ),
      });
    },
    onDrawerDone() {
      this.$emit('update');
      this.fetchData();
    },
    // 转换巡检频次
    convertInspectionFrequency(row) {
      return `${row.frequencyTimer}次/${row.frequencyInterval}${
        this.frequencyUnitMap[row.frequencyUnit]
      }`;
    },
    // 转换完成进度
    convertCompletedProgress(row) {
      return `${row.frequencyNow - 1}/${row.frequencyTimer}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.over-time-1 {
  color: #f56c6c;
}
</style>
