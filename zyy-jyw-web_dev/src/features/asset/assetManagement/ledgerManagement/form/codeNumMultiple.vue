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
    <el-form-item label="登记数量">
      <el-input-number
        v-model="form.signCount"
      />
    </el-form-item>
    <el-form-item label="设备S/N码">
      <el-input
        v-model="form.seriesNumb"
        :rows="4"
        placeholder="顺序输入设备S/N码，使用英文逗号[,]隔开。若无对应S/N码则填入英文减号[-]。例：123ABCDE45F6G，-，789HIJKLM0N1O"
        type="textarea"
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
        signCount: '',
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
