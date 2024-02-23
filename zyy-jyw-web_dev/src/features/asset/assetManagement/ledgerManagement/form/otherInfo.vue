/**
* @file otherInfo.vue
* @author huang
* @date 2023/10/31
* @description 其他信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form label-width="120px">
    <el-form-item label="IP地址">
      <el-input
        v-model="form.ipPlace"
        placeholder="请填写IP地址"
      />
    </el-form-item>
    <el-form-item label="MAC地址">
      <el-input
        v-model="form.macPlace"
        placeholder="请填写MAC地址"
      />
    </el-form-item>
    <el-form-item label="操作系统">
      <el-col :span="12">
        <dic-select
          v-model="form.operatingSystem"
          dic-key="ast_asset_operating_system"
        />
      </el-col>
      <el-col
        :offset="1"
        :span="11"
      >
        <el-input
          v-model="form.systemVersion"
          placeholder="系统版本信息"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="配置信息">
      <el-input
        v-model="form.configuration"
        placeholder="请填写配置信息"
      />
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
        // IP地址
        ipPlace: '',
        // MAC地址
        macPlace: '',
        // 操作系统(数据字典)
        operatingSystem: '',
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
