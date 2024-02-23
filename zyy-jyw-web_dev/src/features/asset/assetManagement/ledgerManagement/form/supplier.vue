/**
* @file supplier.vue
* @author huang
* @date 2023/10/31
* @description 供应商
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form label-width="120px">
    <el-form-item label="品牌">
      <DicSelect
        v-model="form.brand"
        dic-key="ast_asset_brand"
      />
    </el-form-item>
    <el-form-item label="生产厂家">
      <el-input v-model="form.manufacturer" />
    </el-form-item>
    <el-form-item label="产地">
      <el-input v-model="form.originPlace" />
    </el-form-item>
    <el-form-item label="售后电话">
      <el-input v-model="form.salesPhone" />
    </el-form-item>
    <el-form-item label="供应商">
      <el-input v-model="form.supplier" />
    </el-form-item>
    <el-form-item label="供应商电话">
      <el-input v-model="form.supplierPhone" />
    </el-form-item>
  </el-form>
</template>
<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import { isEmpty, pick, } from 'lodash-es';

export default {
  components: {
    DicSelect,
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
      form: {
        // 品牌(数据字典)
        brand: '',
        // 生产厂商
        manufacturer: '',
        // 产地
        originPlace: '',
        // 售后电话
        salesPhone: '',
        // 供应商
        supplier: '',
        // 供应商电话
        supplierPhone: '',
      },
    };
  },
  watch: {
    data: {
      handler: function (val) {
        if (val && !isEmpty(val)) {
          const d = pick(val, Object.keys(this.form));
          this.form = {
            ...d,
          };
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang='scss'
  scoped
>

</style>
