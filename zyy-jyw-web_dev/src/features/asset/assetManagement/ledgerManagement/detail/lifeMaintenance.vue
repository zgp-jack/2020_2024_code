/**
* @file lifeMaintenance.vue
* @author huang
* @date 2023/10/27
* @description 寿命保养
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="2"
    border
  >
    <el-descriptions-item label="使用日期">
      {{ form.useDate }}
    </el-descriptions-item>
    <el-descriptions-item label="使用年限">
      {{ form.years }}{{ form.userUnitToName }}

    </el-descriptions-item>
    <el-descriptions-item
      label="保养维护"
    >
      {{ form.meteringTimer }}
      {{ form.meteringUnitToName }}
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
        useDate: '',
        // 使用年限单位
        userUnitToName: '',
        // 使用年限
        years: '',
        // 保养维护周期
        meteringTimer: '',
        // 保养维护周期单位(数据字典)
        meteringUnitToName: '',
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
