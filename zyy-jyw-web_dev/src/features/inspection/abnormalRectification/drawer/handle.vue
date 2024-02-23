/**
* @file handle.vue
* @author huang
* @date 2023/11/10
* @description 去处理
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      处理
    </template>

    <panel-rectification-time :item-data="detailData" />
    <panel-inspection-content :item-data="detailData.taskItemList" />
    <panel-handle-rectify-result ref="result" />
    <template #footer>
      <pure-button
        label="确定"
        @click="submit"
      />
      <pure-button label="取消" />

    </template>
  </drawer-template>
</template>
<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import PanelRectificationTime from '../panel/detail/rectificationTime.vue';
import PanelHandleRectifyResult from '../panel/handle/rectifyResult.vue';
import InspectionApi from '@/features/inspection/api';
import PanelInspectionContent from '@/features/inspection/inspectionHistory/panel/detail/inspectionContent.vue';
import PureButton from '@/common/components/button/index.vue';

export default {
  components: {
    PureButton,
    DrawerTemplate,
    PanelRectificationTime,
    PanelHandleRectifyResult,
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
    submit() {
      this.$refs.result.submit(this.data, () => {
        this.$emit('done');
      });
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
