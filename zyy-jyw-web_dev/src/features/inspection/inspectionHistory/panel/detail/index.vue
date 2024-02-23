<template>
  <drawer-template>
    <template #title>
      巡检
      <hyy-sub-label-text
        :value="data.unitCode"
        label="编号"
      />

    </template>
    <el-container>
      <el-main>
        <inspection-result :item-data="data" />
        <inspection-content :item-data="data.taskItemVoList" />
        <inspection-rectification-time :item-data="data.rectify" />
        <transfer-work-order :item-data="data.transferOrder" />
      </el-main>
    </el-container>
  </drawer-template>

</template>

<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import InspectionResult from './inspectionResult.vue';
import InspectionContent from './inspectionContent.vue';
import InspectionRectificationTime from './inspectionRectificationTime.vue';
import TransferWorkOrder from './transferWorkOrder.vue';

export default {
  components: {
    DrawerTemplate,
    InspectionResult,
    InspectionContent,
    InspectionRectificationTime,
    TransferWorkOrder,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
