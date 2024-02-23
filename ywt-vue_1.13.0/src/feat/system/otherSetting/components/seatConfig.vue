<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-12-20 10:36:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-22 14:50:42
 * @Description:
-->
<template>

  <el-form
    inline
    class="form"
    size="mini"
  >
    <el-form-item label="上线可推迟">
      <el-input v-model="delay" class="value" type="number" @input="onInput" />
      <el-select v-model="delayUnit" placeholder="" class="unit" @change="onSubmit">
        <el-option label="分钟" value="minute" />
        <el-option label="小时" value="hour" />
      </el-select>
    </el-form-item>
    <el-form-item label="" class="placeholder" />
    <el-form-item label="下线可提前">
      <el-input v-model="forward" class="value" type="number" @input="onInput" />
      <el-select v-model="forwardUnit" placeholder="" class="unit" @change="onSubmit">
        <el-option label="分钟" value="minute" />
        <el-option label="小时" value="hour" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import OtherSettingApi from '../api.js';
import { delayCallBack, } from '@/utils/common';
export default {
  data() {
    return {
      // 上线推迟时间
      delay: 30,
      delayUnit: 1,
      // 下线提前时间
      forward: 30,
      forwardUnit: 1,
      debounce: 1000,
    };
  },
  mounted() {
    this.fetchDetail();
  },
  methods: {
    async fetchDetail() {
      try {
        const data = await OtherSettingApi.seatConfigDetail();
        this.delay = data?.delayTime;
        this.delayUnit = data?.onlineUnit;
        this.forward = data?.leadTime;
        this.forwardUnit = data?.offlineUnit;
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
        await OtherSettingApi.updateSeatConfig({
          delayTime: this.delay,
          delayTimeUnit: this.delayUnit,
          leadTime: this.forward,
          leadTimeUnit: this.forwardUnit,
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

