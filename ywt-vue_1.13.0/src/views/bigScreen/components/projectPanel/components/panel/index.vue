<template>
  <el-container>
    <el-header height="auto" class="wrapper-header">
      <div class="wrapper-head">
        <b>
          {{ headerTop.title }}
        </b>
        <span>
          {{ headerTop.text }}
        </span>
      </div>
      <div v-if="$slots.headerBottom" class="wrapper-bottom">
        <slot name="header-bottom" />
        <!-- <span>
          <span></span>
        </span> -->
      </div>
    </el-header>
    <el-main class="wrapper-main">
      <slot />
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    headerTop: {
      type: Object,
      default: () => {
        return {
          title: '',
          text: '',
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  &-header {
    border-bottom: 2px solid #36404f;
    margin-bottom: 20px;
  }
  &-main{
    padding: 0 6px;
    &::-webkit-scrollbar{
      width: 4px;
    }
    &::-webkit-scrollbar-thumb{
      background-color:#1890ff;
      border-radius:0
    }
  }
  &-head {
    height: 38px;
    line-height: 38px;
    background: linear-gradient(90deg, #072b4d, rgba(5, 29, 51, 0));
    box-shadow: inset 2px 0px 0px #1890ff;
    > b {
      font-size: 18px;
      font-weight: 400;
      color: #c9e5ff;
      display: inline-block;
      margin-left: 22px;
    }
    > span {
      font-size: 16px;
      font-weight: 400;
      color: #c9e5ff;
      display: inline-block;
      margin-left: 68px;
    }
  }
  &-bottom {
    height: 32px;
    line-height: 32px;
    overflow: hidden;

    > span {
      font-size: 14px;
      font-weight: 400;
      color: #8f9fb7;

      &:nth-of-type(2){
        margin-left: 67px;
      }

      &:nth-of-type(3){
        margin-left: 67px;
      }
      > span {
        color: #ffffff;
      }
    }
  }
}
</style>
