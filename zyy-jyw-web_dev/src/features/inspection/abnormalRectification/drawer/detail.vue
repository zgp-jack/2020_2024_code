/**
* @file detail.vue
* @author huang
* @date 2023/11/10
* @description  整改结果
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      查看
    </template>

    <panel-rectify-result :item-data="detailData" />
    <panel-rectification-time :item-data="detailData" />
    <panel-inspection-content :item-data="detailData.taskItemList" />
  </drawer-template>
</template>
<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import PanelRectificationTime from '../panel/detail/rectificationTime.vue';
import PanelRectifyResult from '../panel/detail/rectifyResult.vue';
import InspectionApi from '@/features/inspection/api';
import PanelInspectionContent from '@/features/inspection/inspectionHistory/panel/detail/inspectionContent.vue';

export default {
  components: {
    DrawerTemplate,
    PanelRectificationTime,
    PanelRectifyResult,
    PanelInspectionContent,
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  data() {
    return {
      detailData: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.data?.id) {
        this.detailData = await InspectionApi.getAbnormalRectificationDetail(this.data.id);
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>
::v-deep .pure-card__body {
  padding: 0 !important;
}
</style>
