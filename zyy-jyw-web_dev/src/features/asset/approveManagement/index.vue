/**
* @file index.vue
* @author huang
* @date 2023/11/7
* @description 审批管理
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container>
    <el-header>
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          v-for="item in tabsConfig"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />

      </el-tabs>
    </el-header>
    <el-main>
      <component :is="tabsConfigMap[activeName].componentName" />
    </el-main>
  </el-container>
</template>
<script>
import TableAssetTransfer from './table/assetTransfer.vue';
import TableAssetLending from './table/assetLending.vue';
import TableAssetDisposal from './table/assetDisposal.vue';
import TableConsumable from './table/consumable.vue';
import { keyBy, } from 'lodash-es';

export default {
  components: {
    TableAssetTransfer,
    TableAssetLending,
    TableAssetDisposal,
    TableConsumable,
  },
  data() {
    return {
      activeName: '1',
      tabsConfig: [
        {
          label: '资产转移',
          name: '1',
          componentName: 'table-asset-transfer',
        }, {
          label: '资产借用',
          name: '2',
          componentName: 'table-asset-lending',
        }, {
          label: '资产处置',
          name: '3',
          componentName: 'table-asset-disposal',
        }, {
          label: '耗材申领',
          name: '4',
          componentName: 'table-consumable',
        },
      ],
    };
  },
  computed: {
    tabsConfigMap() {
      return keyBy(this.tabsConfig, 'name');
    },
  },
  methods: {},
};
</script>

<style lang='scss'
  scoped
>

</style>
