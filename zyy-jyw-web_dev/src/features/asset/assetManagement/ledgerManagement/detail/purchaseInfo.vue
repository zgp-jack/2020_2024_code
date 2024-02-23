/**
* @file purchaseInfo.vue
* @author huang
* @date 2023/10/31
* @description 采购信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item label="采购日期">
      {{ form.purchaseDate | timeFormat }}
    </el-descriptions-item>
    <el-descriptions-item label="采购编号">
      {{ form.purchaseCode }}
    </el-descriptions-item>
    <el-descriptions-item label="采购价格">
      {{ form.purchasePrice }}元
    </el-descriptions-item>
    <el-descriptions-item label="采购数量">
      {{ form.purchaseNumber }}
    </el-descriptions-item>
    <el-descriptions-item label="所属项目">
      {{ form.projectName }}
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>
import { isEmpty, pick, } from 'lodash-es';

export default {
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
        // 采购编号
        purchaseCode: '',
        // 采购日期
        purchaseDate: '',
        // 采购数量
        purchaseNumber: '',
        // 采购价格
        purchasePrice: '',
        //  所属项目
        projectName: '',
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
