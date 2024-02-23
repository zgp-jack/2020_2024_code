/**
* @file detail.vue
* @author huang
* @date 2023/11/8
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      详情
    </template>
    <el-tabs>
      <el-tab-pane label="耗材信息">
        <detail-consumable-info :data="detailData.consumable" />
      </el-tab-pane>
      <el-tab-pane label="申领记录">
        <detail-application-history :data="detailData.claims" />
      </el-tab-pane>
      <el-tab-pane

        label="入库记录"
      >
        <detail-enter-history :data="detailData.warehouse" />
      </el-tab-pane>
      <el-tab-pane

        label="出库记录"
      >
        <detail-out-history :data="detailData.outOfWarehouse" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </template>
  </drawer-template>

</template>
<script>
import DetailApplicationHistory from '../detail/applicationHistory.vue';
import DetailConsumableInfo from '../detail/consumableInfo.vue';
import DetailEnterHistory from '../detail/enterHistory.vue';
import DetailOutHistory from '../detail/outHistory.vue';
import ConsumableApi from '../api';
import DrawerTemplate from '@//common/components/drawer/template.vue';
import PureButton from '@/common/components/button/index.vue';

export default {
  components: {
    PureButton,
    DetailApplicationHistory,
    DetailConsumableInfo,
    DetailEnterHistory,
    DetailOutHistory,
    DrawerTemplate,

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
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init() {
      const res = await ConsumableApi.detailConsumable(this.data.id);
      // const {claims,consumable,outOfWarehouse,warehouse} = res
      this.detailData = res;
    },
    cancel() {
      this.$emit('done');
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
