<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-07 00:11:41
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 00:41:39
 * @Description:
-->
<template>
  <div class=" quarterlyContainer el-date-editor el-input el-input--mini el-input--prefix el-input--suffix el-date-editor--year">
    <div @click="showDate">
      <el-input v-model="choseValue" size="small" prefix-icon="el-icon-date" style="width:100%" placeholder="请选择" />
    </div>
    <div v-show="showPanel" class="quarterly-body el-picker-panel el-date-picker el-popper">
      <div class="el-picker-panel__body-wrapper">
        <div class="el-picker-panel__body">
          <div class="el-date-picker__header el-date-picker__header--bordered">
            <button type="button" aria-label="前一年" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="prev" />
            <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
            <button type="button" aria-label="后一年" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right" @click="next" />
          </div>
          <div class="el-picker-panel__content">
            <table class="el-month-table">
              <tr v-for="(item,index) in fullDate" :key="index">
                <td v-for="(item,index) in item" :key="index">
                  <a class="cell" @click="selectQuarter(item)">{{ item }}</a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div x-arrow="" class="popper__arrow" style="left: 35px;" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultVal: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      value: '',
      showPanel: false,
      year: new Date().getFullYear(),
      fullDate: [
        ['第一季度', '第二季度'],
        ['第三季度', '第四季度']
      ],
      choseValue: '',
    };
  },
  mounted() {
    if (this.defaultVal) {
      const value = this.defaultVal;
      const arr = value.split('-');
      this.year = Number(arr[0]);
      const month = arr[1];
      console.log(arr, month);
      let q = '';
      switch (month) {
        case '01':
        case '02':
        case '03':
          q = '第一季度';
          break;
        case '04':
        case '05':
        case '06':
          q = '第二季度';
          break;
        case '07':
        case '08':
        case '09':
          q = '第三季度';
          break;
        case '10':
        case '11':
        case '12':
          q = '第四季度';
          break;
      }
      this.choseValue = `${this.year}年${q}`;
    }
  },
  methods: {
    // 点击input框
    showDate() {
      this.showPanel = !this.showPanel;
    },
    // 上一年
    prev() {
      this.year = this.year * 1 - 1;
    },
    // 下一年
    next() {
      this.year = this.year * 1 + 1;
    },
    // 点击选项事件
    selectQuarter(item) {
      let quarter = '';
      switch (item) {
        case '第一季度':
          this.choseValue = this.year + '年' + '第一季度';
          quarter = `${this.year}-01`;
          break;
        case '第二季度':
          this.choseValue = this.year + '年' + '第二季度';
          quarter = `${this.year}-04`;
          break;
        case '第三季度':
          this.choseValue = this.year + '年' + '第三季度';
          quarter = `${this.year}-07`;
          break;
        case '第四季度':
          this.choseValue = this.year + '年' + '第四季度';
          quarter = `${this.year}-10`;
          break;
      }
      this.showPanel = false;
      this.$emit('getQuarterly', quarter);
    },
  },
};
</script>
<style lang="scss" scoped>
  .quarterlyContainer{
    position: relative;
    .quarterly-body{
      position: absolute;
      z-index: 2079;
    }
    .el-popper[x-placement^=bottom] {
      margin-top: 12px;
    }
  }
</style>
