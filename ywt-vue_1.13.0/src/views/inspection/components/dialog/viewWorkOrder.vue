<!--查看工单弹窗-->
<template>
  <div
    style="
    height:100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 1338px;
  "
  >
    <div style="margin-bottom: 20px;">
      巡检
    </div>
    <el-row :gutter="13" type="flex" justify="center" style="height: calc(100% - 92px);">
      <el-col style="display:flex;flex-direction:column">
        <fault-info :fault="fault" :disabled="true" />
      </el-col>
      <el-col style="height: 100%">
        <process-info :make="make" :disabled="true" />
      </el-col>
      <el-col style="height: 100%">
        <processingFlow />
      </el-col>
    </el-row>
    <el-button size="mini" style="width:100px;margin:10px 0 20px 0;" type="primary" plain>返回巡检</el-button>
  </div>
</template>

<script>
import FaultInfo from '@/views/reportFault/sharedComponents/panel/faultInfo';
import ProcessInfo from '@/views/reportFault/sharedComponents/panel/processInfo.vue';
import processingFlow from '../panel/processingFlow';
export default {
  components: {
    FaultInfo,
    ProcessInfo,
    processingFlow,
  },
  props: {

    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      info: {},
    };
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
</style>

