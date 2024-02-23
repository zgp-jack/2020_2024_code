<template>
  <div class="h-100">
    <el-radio-group v-model="currentTab" size="mini" class="base-margin-bottom">
      <el-radio-button v-for="(item) in tabList" :key="item.label" :label="item.label">{{ item.text }}</el-radio-button>
    </el-radio-group>
    <component
      :is="currentTab"
      ref="component"
      class="h-100"
      v-bind="$attrs"
      :data="data"
    />
  </div>
</template>

<script>
import FaultInfoPanel from './dealInfo/faultInfo.vue';
import AssistInfoPanel from './dealInfo/assistInfo.vue';
import DealInfoPanel from './dealInfo/dealInfo.vue';
import EvaluationInfoPanel from './dealInfo/evaluationInfo.vue';
import ReportInfoPanel from './dealInfo/reportInfo.vue';
export default {
  name: 'TicketDealInfoPanel',
  components: {
    FaultInfoPanel,
    AssistInfoPanel,
    DealInfoPanel,
    EvaluationInfoPanel,
    ReportInfoPanel,
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {
          info: null,
          fault: null,
        };
      },
    },
  },
  data() {
    return {
      currentTab: null,
      tabList: [],
    };
  },
  watch: {
    data: {
      handler: function (val) {
        console.log(this.data, 'ss');
        if (this.data.evaluate) {
          this.tabList.push({
            label: 'EvaluationInfoPanel',
            text: '评价信息',
          });
        }
        if (this.data.makeList) {
          this.tabList.push({
            label: 'DealInfoPanel',
            text: '处理记录',
          });
        }
        if (this.data.assistList) {
          this.tabList.push({
            label: 'AssistInfoPanel',
            text: '协作信息',
          });
        }
        if (this.data.fault) {
          this.tabList.push({
            label: 'FaultInfoPanel',
            text: '故障信息',
          });
        }
        if (this.data.info) {
          this.tabList.push({
            label: 'ReportInfoPanel',
            text: '报修信息',
          });
        }
        this.currentTab = this.tabList[0]?.label || null;
      },
      deep: true,
      immediate: true,
    },

  },
  mounted() {
    console.log(this.data);
  },
  created() {
    console.log(this.data);
  },
};
</script>

<style lang="scss" scoped>

</style>
