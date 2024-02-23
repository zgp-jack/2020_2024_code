<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:48:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-11 15:02:06
 * @Description:绩效考核统计时间
-->
<template>
  <div>
    <div class="title base-margin-top">绩效考核统计时间<span v-if="operatorType==='UPDATE'" class="tip">设置时，号数仅能填入1-31的整数数字，当截止数填入为30或31，而现实截止月只有28号时，则截止时间为28号。例：设置数据范围为“本月1号 至 本月31号”，当到2月时，则实际统计时间为“2月1日 至 2月28日”。</span></div>
    <div v-if="operatorType==='VIEW'" class="double-margin-bottom">
      <span class="unit">统计时间 </span><span class="period">{{ periodLabel }}</span>
    </div>
    <div v-if="operatorType==='UPDATE'" class="base-margin-bottom">
      <span class="unit">统计时间 </span>
      <dic-select v-model="formData.startType" dic-key="examine_type" type="string" size="mini" class="select margin-right-8" />
      <el-select v-model="formData.startDay" class="input" size="mini">
        <el-option
          v-for="item in monthDayOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>号
      <span class="unit margin-right-8">至</span>
      <dic-select v-model="formData.endType" dic-key="examine_type" type="string" size="mini" class="select margin-right-8" />
      <el-select v-model="formData.endDay" class="input" size="mini">
        <el-option
          v-for="item in monthDayOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>号
    </div>
    <div class="base-margin-bottom">
      <pure-button v-if="operatorType!=='UPDATE'" label="编辑" @click="onClickUpdate" />
      <pure-button v-if="operatorType==='UPDATE'" label="保存" @click="onSubmit" />
      <pure-button v-if="operatorType==='UPDATE'" label="取消" @click="operatorType='VIEW'" />
    </div>
  </div>

</template>

<script>
import SettingApi from '../api';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
export default {
  components: {
    DicSelect,
  },
  data() {
    return {
      formData: {
        startType: '1',
        startDay: 1,
        endType: '1',
        endDay: 31,
      },
      operatorType: 'VIEW',
    };
  },
  computed: {
    monthDayOption() {
      const option = [];
      for (let i = 1; i <= 31; i++) {
        option.push({
          value: i,
          label: i,
        });
      }
      return option;
    },
    periodLabel() {
      return `${this.formData.startTypeToName}${this.formData.startDay}号 至 ${this.formData.endTypeToName}${this.formData.endDay}号`;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const data = await SettingApi.baseInfoDetail();
        this.formData = Object.assign({}, this.formData, data);
        if (this.formData.id) {
          this.operatorType = 'VIEW';
          this.$emit('changeId', this.formData.id);
        } else {
          this.operatorType = 'UPDATE';
        }
      } catch (error) {
        console.error(error);
      }
    },
    onClickUpdate() {
      this.operatorType = 'UPDATE';
    },
    async onSubmit() {
      try {
        let data = {};
        if (this.formData.id) {
          data = await SettingApi.updateBaseInfo(this.formData);
        } else {
          data = await SettingApi.createBaseInfo(this.formData);
        }
        this.formData = Object.assign({}, this.formData, data);
        this.operatorType = 'VIEW';
        this.$emit('changeId', this.formData.id);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.period {
  color: #334266;
}
.tip {
  font-size: 14px;
  color: #7d8db3;
  margin-left: 40px;
}
.select {
  width: 120px;
}
.input {
  width: 100px;
}
.margin-right-8 {
  margin-right: 8px;
}
</style>
