/**
* @file otherInfo.vue
* @author huang
* @date 2023/10/31
* @description 其他信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item label="IP地址">
      {{ form.ipPlace }}

    </el-descriptions-item>
    <el-descriptions-item label="MAC地址">
      {{ form.macPlace }}

    </el-descriptions-item>
    <el-descriptions-item label="操作系统">
      {{ form.operatingSystemToName }} {{ form.systemVersion }}

    </el-descriptions-item>
    <el-descriptions-item label="配置信息">
      {{ form.configuration }}

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
        // IP地址
        ipPlace: '',
        // MAC地址
        macPlace: '',
        // 操作系统(数据字典)
        operatingSystemToName: '',
        // 系统版本
        systemVersion: '',
        // 配置信息
        configuration: '',
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
