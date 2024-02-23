/**
* @file purchaseInfo.vue
* @author huang
* @date 2023/10/31
* @description 采购信息
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form label-width="120px">
    <el-form-item label="采购日期">
      <el-date-picker
        v-model="form.purchaseDate"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        placeholder="请选择"
      />
    </el-form-item>
    <el-form-item label="采购编号">
      <el-input
        v-model="form.purchaseCode"
        placeholder="请输入"
      />
    </el-form-item>
    <el-form-item label="采购价格">
      <el-input v-model="form.purchasePrice" v-number>
        <template #append>
          元
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="采购数量">
      <el-input-number v-model="form.purchaseNumber" />
    </el-form-item>
    <el-form-item label="所属项目">
      <el-input v-model="form.projectName" />
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
