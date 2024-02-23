/**
* @file lifeMaintenance.vue
* @author huang
* @date 2023/10/27
* @description 寿命保养
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-form label-width="120px">
    <el-form-item label="使用日期">
      <el-date-picker v-model="form.useDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" />
    </el-form-item>
    <el-form-item label="使用年限">
      <el-input
        v-model.number="form.years"
        v-number
        class="input-with-select"
        placeholder="请输入内容"
      >
        <div
          slot="append"
          style="width: 60px"
        >

          <dic-select
            v-model="form.useUnit"
            :clearable="false"
            :filterable="false"
            dic-key="ast_asset_use_unit"
          />
        </div>

      </el-input>

    </el-form-item>
    <el-form-item label="保养维护">
      <template #label>
        保养维护
        <el-tooltip
          class="item"
          content="设备周期定时校准/维护/更新等"
          effect="dark"
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </template>
      <el-input
        v-model="form.meteringTimer"
        v-number
        class="input-with-select"
        placeholder="请输入内容"
      >
        <div
          slot="append"
          style="width: 60px"
        >
          <dic-select
            v-model="form.meteringUnit"
            :clearable="false"
            :filterable="false"
            dic-key="ast_asset_metering_unit"
          />
        </div>

      </el-input>

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
        useDate: '',
        // 使用年限单位
        useUnit: '',
        // 使用年限
        years: '',
        // 保养维护周期
        meteringTimer: '',
        // 保养维护周期单位(数据字典)
        meteringUnit: '',
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
