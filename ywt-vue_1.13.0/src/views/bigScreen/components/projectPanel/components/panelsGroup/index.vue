<template>
  <el-row class="h-100">
    <el-col :span="17" class="h-100 container-left">
      <component :is="componentName" :data="data" :task-handle-data="processData" />
    </el-col>
    <el-col :span="7" class="h-100 container-right">
      <ProcessPanel :item-code="itemCode" :data="ProcessData" @loadState="getState" />
    </el-col>
  </el-row>
</template>

<script>
import ProcessPanel from '../../panels/process.vue';
import Demand from '../../panels/demand.vue';
import Investigate from '../../panels/Investigate.vue';
import Project from '../../panels/project.vue';
import ProjectTaskInfoPanel from '../../panels/taskInfoPanel.vue';
import _ from 'lodash';

export default {
  name: 'PanelsGroup',
  components: {
    ProcessPanel,
    Demand,
    Investigate,
    Project,
    ProjectTaskInfoPanel,
  },
  props: {
    itemCode: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      componentName: '',
      processData: {},
    };
  },
  computed: {
    ProcessData() {
      const process = this.data.process;
      if (process instanceof Array && process.length) {
        return process.reverse();
      }
      return [];
    },
    AllState() {
      return [
        {
          'state': 'demand_create',
          'name': '新建需求',
          'component': 'Demand',
        },
        {
          'state': 'demand_submit',
          'name': '提交需求',
          'component': 'Demand',

        },
        {
          'state': 'demand_dist',
          'name': '分配需求',
          'component': 'Demand',

        },
        {
          'state': 'investigate_submit',
          'name': '需求调研提交',
          'component': 'Investigate',

        },
        {
          'state': 'review_pass',
          'name': '需求审核通过(立项)',
          'component': 'Investigate',

        },
        {
          'state': 'review_nopass',
          'name': '需求审核不通过',
          'component': 'Investigate',

        },
        {
          'state': 'investigate_submit_next',
          'name': '需求继续调研提交',
          'component': 'Investigate',

        },
        {
          'state': 'termination',
          'name': '终止',
          'component': 'Investigate',

        },
        {
          'state': 'transfer_order',
          'name': '转工单',
          'component': 'Investigate',

        },
        {
          'state': 'item_create',
          'name': '新建项目',
          'component': 'Project',

        },
        {
          'state': 'scheme_submit',
          'name': '提交方案',
          'component': 'Project',

        },
        {
          'state': 'scheme_pass',
          'name': '方案评审通过',
          'component': 'Project',

        },
        {
          'state': 'scheme_nopass',
          'name': '方案评审不通过',
          'component': 'Project',

        },
        {
          'state': 'item_process',
          'name': '项目实施',
          'component': 'Project',

        },
        {
          'state': 'item_complement',
          'name': '项目补充信息',
          'component': 'Project',

        },
        {
          'state': 'item_submit',
          'name': '项目提交',
          'component': 'Project',

        },
        {
          'state': 'item_pass',
          'name': '项目确认通过',
          'component': 'Project',

        },
        {
          'state': 'item_nopass',
          'name': '项目确认不通过',
          'component': 'Project',

        },
        {
          'state': 'work_process',
          'name': '处理任务',
          'component': 'ProjectTaskInfoPanel',
          // 'component': ' ',

        },
        {
          'state': 'revoke',
          'name': '撤销',
          'component': '',
        },
        {
          'state': 'review_nopass_next',
          'name': '继续调研',
          'component': 'Investigate',

        }
      ];
    },
    MapAllState() {
      return _.keyBy(this.AllState, 'state');
    },
  },
  methods: {
    getState(data) {
      const state = data.processState;
      const componetName = this.MapAllState[state].component;
      if (componetName) {
        this.processData = data;
        this.componentName = componetName;
      }
    },
  },
};
</script>

<style  lang="scss">
.h-100{
  height: 100%;
}
.container{
  &-left{
      box-shadow: inset 0px 0px 0px #c9e5ff;
  // padding: 20px 20px 0 20px;
  }
  &-right{
  padding: 0px 20px 0 20px;

  }
}

</style>
