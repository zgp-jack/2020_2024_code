<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-12-30 09:23:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-30 09:45:59
 * @Description:
-->
<template>

  <el-form
    inline
    class="form"
    size="mini"
  >
    <el-form-item label="相同故障工单">
      <el-input v-model="time" class="value" type="number" @input="onInput" />
      <el-select v-model="timeUnit" placeholder="" class="unit" @change="onSubmit">
        <el-option label="分钟" :value="1" />
        <el-option label="小时" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item label="内大于等于">
      <el-input v-model="count" class="value" type="number" :min="1" :max="99" @input="onInput" />
      <span class="unit">条时，弹窗提示</span>
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '../api.js';
import { delayCallBack, } from '@/utils/common';
export default {
  data() {
    return {
      // 时间节点
      time: 30,
      timeUnit: 1,
      // 阈值条数
      count: 5,
      debounce: 1000,
    };
  },
  mounted() {
    this.fetchDetail();
  },
  methods: {
    async fetchDetail() {
      try {
        const data = await OtherSettingApi.warningConfigDetail();
        this.time = data?.warningTime;
        this.timeUnit = data?.unit;
        this.count = data?.waringCount;
      } catch (error) {
        console.log(error);
      }
    },
    onInput(val) {
      delayCallBack(this.debounce, () => {
        this.onSubmit();
      });
    },
    async onSubmit() {
      try {
        await OtherSettingApi.updateWarningConfig({
          warningTime: this.time,
          unit: this.timeUnit,
          warningCount: this.count,
        });
        this.$message({
          type: 'success',
          message: '设置成功',
        });
      } catch (error) {
        console.log(error);
        this.$message({
          type: 'error',
          message: '设置失败',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.value,.unit {
  width: 100px;

}
.unit {
  margin-left: 8px;
}
.form {
  padding: 0 20px;
}
.placeholder {
  width: 80px;
}
</style>>
