/**
* @file supplier.vue
* @author huang
* @date 2023/10/31
* @description 供应商
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item label="品牌">
      {{ form.brandToName }}

    </el-descriptions-item>
    <el-descriptions-item label="生产厂家">
      {{ form.manufacturer }}
    </el-descriptions-item>
    <el-descriptions-item label="产地">
      {{ form.originPlace }}
    </el-descriptions-item>
    <el-descriptions-item label="售后电话">
      {{ form.salesPhone }}
    </el-descriptions-item>
    <el-descriptions-item label="供应商">
      {{ form.supplier }}
    </el-descriptions-item>
    <el-descriptions-item label="供应商电话">
      {{ form.supplierPhone }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>
import { isEmpty, pick, } from 'lodash-es';

export default {
  components: {},
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
        brandToName: '',
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
