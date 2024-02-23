<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-28 17:19:29
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-22 16:19:56
 * @FilePath: \ywt-vue\src\views\home\components\engineerCard.vue
 * @Description: 工程师卡片
-->
<template>
  <div class="container" :style="{'padding-left':!userItem.isGroupCard ? '20px': ''}">
    <div class="header">
      <div class="name" :style="{'font-size':!userItem.isGroupCard ? '16px': ''}">{{ userItem.name }}</div>
      <div class="total">{{ allTotal }}</div>
    </div>
    <div class="body">
      <div v-for="(item,idx) in groupBtnOptions" :key="idx" class="work">
        <div>{{ item.name }}</div>
        <div class="num">{{ item.count }}</div>
      </div>
    </div>
    <div class="line" />
  </div>
</template>

<script>
import HomeApi from '@/apis/home';
export default {
  props: {
    userItem: {
      type: Object,
      default: () => ({}),
    },
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['CareView'],
  data() {
    return {
      allTotal: 0,
      groupBtnOptions: [],
    };
  },
  watch: {
    groupBtnOptions: {
      handler(newVal, oldVal) {
        this.allTotal = 0;
        newVal.forEach(work => {
          if (work.count) {
            this.allTotal += work.count;
          }
        });
      },
      deep: true,
      immediate: true,
    },
    isChange: {
      handler(newVal, oldVal) {
        newVal && this.$emit('updateHomePageNum', this.groupBtnOptions,);
      },
      deep: true,
    },
    'CareView.cardApiParams': {
      handler(newVal, oldVal) {
        this.getRedData();
      },
      deep: true,
    },
  },
  created() {
    this.getRedData();
  },
  methods: {
    async getRedData() {
      const apiParamsData = { ...this.userItem, ...this.CareView.apiParams, };
      const redData = await HomeApi.redData(apiParamsData);
      this.groupBtnOptions = [{
        count: redData.orderCount || 0,
        name: '工单',
      }, {
        count: redData.taskCount || 0,
        name: '任务',
      }, {
        count: redData.itemDemandCount || 0,
        name: '调研',
      }, {
        count: redData.inspectionCount || 0,
        name: '巡检',
      }, {
        count: redData.itemCount || 0,
        name: '项目',
      }];
      this.isChange && this.$emit('updateHomePageNum', this.groupBtnOptions,);
    },
  },
};
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: #ffffff;
  box-sizing: border-box;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px 4px 0 0;
  .name{
    font-family: AlibabaPuHuiTi_2_75_SemiBold;
    font-weight: 600;
    font-size: 20px;
    color: #334266;
    letter-spacing: 0;
    line-height: 18px;
  }
  .total{
    width: 30px;
    height: 18px;
    font-size: 16px;
    background: #F5A664;
    color: #fff;
    border-radius: 9px;
    text-align: center;
  }
}
.body{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .work{
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-weight: 400;
    font-size: 14px;
    color: #C0C4CC;
    .num{
      margin-top: 6px;
      color: #7D8DB3;
    }
  }
}
.line{
  width: 196px;
  height: 1px;
  background: #E6EAF2;
  position:absolute;
  bottom: -11px;
  left: -6px;
}
</style>>

