<template>
  <div class="bigScreenWrapper">
    <div class="header">
      <div class="header-left">
        <img :src="icon" class="header-left__icon">
        <span class="header-left__title">
          {{ title }}
        </span>
      </div>
      <div v-if="showControl" class="header-right">
        <span
          v-for="item in text"
          :key="item.code"
          :class="activeCode === item.code ? 'active-text' : ''"
          class="header-right__text"
          @click="clickText(item)"
        >{{ item.text }}</span>
      </div>
    </div>
    <!-- <hr> -->
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BigScreenWrapper',
  props: {
    title: {
      type: String,
      default: 'title',
    },
    showControl: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icon: require('@/assets/diamond.svg'),
      activeCode: 'toDay',
      text: [
        {
          text: '今日',
          code: 'toDay',
        },
        {
          text: '本月',
          code: 'theMonth',
        }
      ],
    };
  },
  methods: {
    clickText(item) {
      this.activeCode = item.code;
      this.$emit('choose', item);
    },
  },
};
</script>

<style lang="scss" scoped>
.bigScreenWrapper {
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    0,
    rgba(12, 72, 128, 0.05),
    rgba(12, 72, 128, 0.05)
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
    bottom: -3px;
    right: 0;
    width: 15px;
    height: 6px;
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
