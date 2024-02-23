/**
* @file transferWorkOrder.vue
* @author huang
* @date 2023/10/11
* @description 转工单信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <hyy-panel-card>
    <div slot="header">转工单信息</div>
    <el-row :gutter="16">
      <el-col :span="12">
        <fault-info-card
          :data="itemData"
          class="fault-info-panel"
        />
      </el-col>
      <el-col :span="12">
        <report-info-card
          :data="itemData"
          class="report-info-panel"
        />
      </el-col>
    </el-row>
  </hyy-panel-card>
</template>
<script>
import FaultInfoCard from '@/features/ticket/common/panel/dealInfo/faultInfo.vue';
import ReportInfoCard from '@/features/ticket/common/panel/dealInfo/reportInfo.vue';

export default {
  components: {
    FaultInfoCard,
    ReportInfoCard,
  },
  props: {
    itemData: {
      type: Object,
      default: () => {
      },
    },
  },
};
</script>

<style lang='scss'
  scoped
>
.fault-info-panel {
  &::v-deep .pure-card__body {
    height: 100%
  }
}

.report-info-panel {
  &::v-deep .pure-card__body {
    height: 100%

  }
}

</style>
