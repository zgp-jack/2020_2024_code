/**
* @file addAsset.vue
* @author huang
* @date 2023/10/27
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <drawer-template>
    <template #title>
      {{ title }}
    </template>
    <hyy-anchor>
      <hyy-anchor-item title="基础信息">
        <form-base-info
          ref="baseInfo"
          :data="detailData"
        />
      </hyy-anchor-item>
      <hyy-anchor-item title="编码编号">
        <template v-if="isMultiple">
          <form-code-num-multiple
            ref="codeNum"
            :data="detailData"
          />
        </template>
        <template v-else>
          <form-code-num
            ref="codeNum"
            :data="detailData"
          />
        </template>
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
        label="保存"
        @click="submit"
      />
      <pure-button
        label="取消"
        type="minor"
        @click="cancel"
      />
    </template>
  </drawer-template>

</template>
<script>
import DrawerTemplate from '@/common/components/drawer/template.vue';
import FormBaseInfo from '../form/baseInfo.vue';
import FormCodeNum from '../form/codeNum.vue';
import FormCodeNumMultiple from '../form/codeNumMultiple.vue';
import FormLifeMaintenance from '../form/lifeMaintenance.vue';
import FormMaintenance from '../form/maintenance.vue';
import FormPurchaseInfo from '../form/purchaseInfo.vue';
import FormSupplier from '../form/supplier.vue';
import FormOtherInfo from '../form/otherInfo.vue';
import LedgerManagementApi from '../api';

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
    FormCodeNumMultiple,
  },

  props: {
    // 是否是 批量添加多个资产  默认单个
    isMultiple: Boolean,
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
  computed: {
    title() {
      return this.data && this.data?.id ? '编辑资产' : '添加资产';
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.data && this.data?.id) {
        this.detailData = (await LedgerManagementApi.getAssetDetail(this.data.id))?.astInfo || {};
      }
    },
    async submit() {
      //
      const baseInfoValue = await this.$refs.baseInfo.submit();
      const codeNumValue = this.$refs.codeNum.$data.form;
      const lifeMaintenanceValue = this.$refs.lifeMaintenance.$data.form;
      const maintenanceValue = await this.$refs.maintenance.submit();
      const purchaseInfoValue = this.$refs.purchaseInfo.$data.form;
      const supplierValue = this.$refs.supplier.$data.form;
      const otherInfoValue = this.$refs.otherInfo.$data.form;

      if (baseInfoValue.valid && maintenanceValue.valid) {
        const formData = {
          ...baseInfoValue.form,
          ...codeNumValue,
          ...lifeMaintenanceValue,
          ...maintenanceValue.form,
          ...purchaseInfoValue,
          ...supplierValue,
          ...otherInfoValue,
        };
        try {
          if (this.data && this.data?.id) {
            formData['id'] = this.data.id;
            await LedgerManagementApi.assetEdit(formData);
          } else {
            if (this.isMultiple) {
              await LedgerManagementApi.batchAssetAdd(formData);
            } else {
              await LedgerManagementApi.singleAssetAdd(formData);
            }
          }

          this.$notify({
            type: 'success',
            message: '保存成功!',
          });
          this.$emit('done');
        } catch (err) {
          this.$notify({
            type: 'error',
            message: err,
          });
        }
      }
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
