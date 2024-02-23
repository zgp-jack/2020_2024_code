/**
* @file codeNum.vue
* @author huang
* @date 2023/10/27
* @description  编码编号
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item label="资产编号">
      {{ form.assetsCode }}
    </el-descriptions-item>
    <el-descriptions-item label="设备S/N码">
      {{ form.seriesNumb }}
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
        seriesNumb: '',
        assetsCode: '',
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
