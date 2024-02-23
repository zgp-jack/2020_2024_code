/**
* @file codeNum.vue
* @author huang
* @date 2023/10/27
* @description  编码编号
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form label-width="120px">
    <el-form-item label="资产编号">
      <el-input
        v-model="form.assetsCode"
        placeholder="未填写则系统自动分配"
      />
    </el-form-item>
    <el-form-item label="设备S/N码">
      <el-input
        v-model="form.seriesNumb"
        placeholder="请输入"
      />
    </el-form-item>
  </el-form>
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
