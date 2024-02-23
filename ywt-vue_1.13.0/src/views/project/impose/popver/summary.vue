<template>
  <el-popover
    placement="bottom"
    width="500"
    trigger="hover"
    :open-delay="600"
    @show="hoverColumn"
    @close="onClose"
  >
    <div v-loading="loading" class="popover-container">
      <ProcessListSummary v-if="result && result.length" :data-list="result" :type="'popver'" />
      <el-result v-if="result && !result.length" icon="info" title="暂无数据" />
    </div>

    <span slot="reference">{{ value }}</span>
  </el-popover>
</template>

<script>
import ProcessListSummary from '../processList/summary.vue';
import ProjectApi from '@/apis/project/index';
import moment from 'moment';
export default {
  components: {
    ProcessListSummary,
  },
  props: ['value', 'rowData'],
  data() {
    return {
      loading: false,
      result: null,
    };
  },
  methods: {
    onClose() {
      this.result = null;
    },
    async  hoverColumn() {
      this.loading = true;
      const params = {
        projectId: this.rowData.itemCode,
        startTime: moment().startOf('week').subtract(1, 'week',).add(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().endOf('week').subtract(1, 'week').add(1, 'days').format('YYYY-MM-DD'),
        members: '',
      };
      const res = await ProjectApi.impose.getProjectSummary(params);
      this.result = res;
      this.loading = false;
    },
  },
};
</script>

<style  lang="scss" scoped>
.popover-container {
  height: 200px;
  overflow: auto;
  &::-webkit-scrollbar-thumb {
    background-color: #e2e3e7;
    border-radius: 3px;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }
}
</style>
