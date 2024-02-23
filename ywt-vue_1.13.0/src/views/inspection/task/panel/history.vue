<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-19 14:31:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-23 10:19:29
 * @Description:历史记录
-->
<template>
  <pure-card class="max-height">
    <div slot="header">历史记录</div>
    <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(item, index) in list"
        :key="index"
        :timestamp="item.updateTime|timestamp"
        placement="top"
      >
        <div style="margin-bottom: 8px">
          <span>
            {{ item.makeUserToName }}

            <span
              class="state"
              :class="[
                item.result===2?'state--exception': 'state--normal'
              ]"
            >
              {{ item.result===2?'异常':'正常' }}
            </span>

          </span>
        </div>
        <template v-if="item.result === 2">
          <div v-if="item.errorMake===2" style="margin-bottom: 8px">
            <span>
              转工单
              <el-link type="primary" @click="handleViewWorkOrder(item.orderNum)">{{ '#' +item.orderNum.replace(/[^0-9]/ig, '') }}</el-link>
            </span>
          </div>
          <div v-if="item.errorMake===1" style="margin-bottom: 8px">
            <span>
              限期整改
              <span>{{ item.rectificationTime|timestamp('YYYY-MM-DD') }}</span>
            </span>
          </div>
        </template>

        <div style="margin-bottom: 8px">
          <span class="frequency">频次
            <span>{{ convertInspectionFrequency(item) }}</span>
          </span>
        </div>
        <div style="margin-bottom: 8px">
          <span class="progress">进度
            <span>
              {{ convertCompletedProgress(item) }}
            </span>
          </span>
        </div>
        <div>
          <el-button
            size="mini"
            @click="handleViewInspection(item)"
          >查看</el-button>
        </div>

      </el-timeline-item>
    </el-timeline>
  </pure-card>
</template>

<script>
import InspectionTaskApi from '@/apis/inspection/task';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import ViewWorkOrder from '@/views/reportFault/sharedComponents/dialog/viewWorkOrder.vue';
export default {
  props: {
    taskId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      list: [],
      frequencyUnitMap: {},
    };
  },
  async created() {
    const frequencyUnitData = this.$store.state['dictionary']['dicList']['frequencyUnit'] || [];
    frequencyUnitData.map(item => {
      this.frequencyUnitMap[item.value] = item.name;
    });
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        if (!this.taskId) {
          return;
        }
        this.list = await InspectionTaskApi.history({ id: this.taskId, });
        this.list = this.list.filter(item => item.state !== 0);
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    // 转换巡检频次
    convertInspectionFrequency(row) {
      return `${row.frequencyTimer}次/${row.frequencyInterval}${this.frequencyUnitMap[row.frequencyUnit]}`;
    },
    // 转换完成进度
    convertCompletedProgress(row) {
      return `${row.frequencyNow}/${row.frequencyTimer}`;
    },
    // 查看某一进度巡检
    async handleViewInspection(row) {
      this.$emit('view', row.id);
    },
    // 查看工单
    async handleViewWorkOrder(orderNum) {
      const data = await WorkOrderApi.detail(orderNum);

      this.$innerDrawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => <ViewWorkOrder data={data}/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.state {
  font-size: 14px;
  font-weight: 400;
  &--exception {
    color: #F56C6C;
  }
  &--normal {
    color: #2D405E;
  }
}
.progress,.frequency {
  font-size: 14px;
  font-weight: 400;
  color: #879bba;
  span {
    margin-left:6px;
    color: #2d405e;
  }
}

</style>
