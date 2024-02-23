<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 17:42:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-22 15:11:24
 * @Description:卡片
-->
<template>
  <div class="bigScreenWrapper">
    <div class="header">
      <div class="header-left">
        <img :src="icon" class="header-left__icon">
        <span class="header-left__title">
          {{ title }}
        </span>
      </div>
      <div v-if="periodControlVisible" class="header-right">
        <span
          v-for="period in periodOptions"
          :key="period.value"
          :class="activatedPeriod === period.value ? 'active-text' : ''"
          class="header-right__text"
          @click="onClickPeriod(period)"
        >{{ period.label }}</span>
      </div>
    </div>
    <!-- <hr> -->
    <div class="body base-margin-top">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BigScreenCard',
  props: {
    title: {
      type: String,
      default: '标题',
    },
    periodControlVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icon: require('@/assets/diamond.svg'),
      activatedPeriod: 1,
      periodOptions: [
        {
          label: '今日',
          value: 1,
        },
        {
          label: '本月',
          value: 2,
        }
      ],
    };
  },
  methods: {
    onClickPeriod(period) {
      this.activatedPeriod = period.value;
      this.$emit('change', period);
    },
  },
};
</script>

<style lang="scss" scoped>
.bigScreenWrapper {
  display: flex;
  flex-direction: column;
  padding:10px 20px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.01),
     rgba(19,115,204,0.1),
  );
  height: 100%;
}
.header {
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #263341;
  &::before {
    content: "";
    position: absolute;
    bottom: -2px;
    right: 0;
    width: 15px;
    height: 3px;
    background: #ffffff;
    z-index: 1000;
  }
  &-left {
    flex: 1;
    &__icon {
      width: 12px;
      height: 12px;
    }
    &__title {
      opacity: 0.9;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
    }
  }
  &-right {
    flex: 1;
    text-align: right;
    &__text {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
}
.body{
  flex:1;
  overflow: hidden;

}
.active-text {
  color: #1890ff !important;
}

</style>
