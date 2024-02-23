/**
* @file addAsset.vue
* @author huang
* @date 2023/10/27
* @description 资产详情
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      详情
    </template>
    <hyy-anchor>
      <hyy-anchor-item title="基础信息">
        <form-base-info
          ref="baseInfo"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="编码编号">
        <form-code-num
          ref="codeNum"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="寿命保养">
        <form-life-maintenance
          ref="lifeMaintenance"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="维保维护">
        <template #subTitle>
          <el-tooltip
            class="item"
            content="无维保公司或维保到期后,该资产维护工作自动转移至设定维护方"
            effect="dark"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
        <form-maintenance
          ref="maintenance"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="采购信息">
        <form-purchase-info
          ref="purchaseInfo"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="供应商">
        <form-supplier
          ref="supplier"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="其他信息">
        <form-other-info
          ref="otherInfo"
          :data="detailData"
        />
      </hyy-anchor-item>
    </hyy-anchor>
    <template #footer>
      <pure-button
        label="编辑"
        type="minor"
        @click="onEdit"
      />
    </template>
  </drawer-template>

</template>
<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import FormBaseInfo from '../detail/baseInfo.vue';
import FormCodeNum from '../detail/codeNum.vue';
import FormLifeMaintenance from '../detail/lifeMaintenance.vue';
import FormMaintenance from '../detail/maintenance.vue';
import FormPurchaseInfo from '../detail/purchaseInfo.vue';
import FormSupplier from '../detail/supplier.vue';
import FormOtherInfo from '../detail/otherInfo.vue';
import LedgerManagementApi from '../api';
import DrawerAddAsset from './addAsset.vue';
import { pxToPercentage, } from '@/common/utils/convert';

export default {
  components: {
    DrawerTemplate,
    FormBaseInfo,
    FormCodeNum,
    FormLifeMaintenance,
    FormMaintenance,
    FormPurchaseInfo,
    FormSupplier,
    FormOtherInfo,
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
      detailData: null,
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.data && this.data?.id) {
        this.detailData = (await LedgerManagementApi.getAssetDetail(this.data.id))?.astInfo || {};
      }
    },
    onEdit() {
      this.$drawer({
        width: pxToPercentage(816),
        component: () => <DrawerAddAsset data={this.data}
          onDone={this.init}
        />,
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
