<template>
  <div class="big-screen-container wrapper">
    <header class="wrapper-header">
      <div class="wrapper-header-left">
        <h4 class="wrapper-header-left__title">{{ itemTitle }}</h4>
      </div>
      <div class="wrapper-header-center">
        <div class="notice-wrapper">
          <!-- <span class="notice__text">通知公告</span>
          <span class="notice__content">
            晚上8点到3号楼院办大会议室参加全体会议。
          </span> -->
        </div>
      </div>
      <div class="wrapper-header-right">
        <b class="wrapper-header-right__time">
          {{ currentTime | date('YYYY-MM-DD HH:mm:ss') }}
        </b>
      </div>
    </header>
    <grid-layout
      :layout.sync="layoutList"
      :col-num="12"
      :row-height="290"
      :is-draggable="true"
      :is-resizable="false"
      :vertical-compact="false"
      :margin="[10, 30]"
      :max-rows="2"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="(item) in layoutList"
        :key="item.i"
        :item="watchitem(item)"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :is-resizable="false"
        :is-draggable="item.isDraggable"
        @move="moveEvent"
        @moved="movedEvent"
      >
        <div class="item-wrapper">
          <slot :item="item">
            <component :is="item.component" v-bind="item.componentProps" />
          </slot>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { GridLayout, GridItem, } from 'vue-grid-layout';
import _ from 'lodash';
export default {
  components: {
    GridLayout,
    GridItem,
  },
  props: {
    itemTitle: {
      type: String,
      default: '',
    },
    layoutList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      historyLayoutList: [],
      newX: 0,
      newY: 0,
      curBox: '',
      currentTime: Date.now(),
    };
  },
  created() {
    // 将传入的layoutList 做个深拷贝，用于比对
    this.historyLayoutList = _.cloneDeep(this.layoutList);
    const self = this;
    setInterval(() => {
      self.currentTime = Date.now();
    }, 1000);
  },
  methods: {
    watchitem(item) {
      if (this.curBox !== item.i) {
        for (let j = 0; this.historyLayoutList[j] !== undefined; j++) {
          if (this.historyLayoutList[j].i === item.i) {
            item.x = this.historyLayoutList[j].x;
            item.y = this.historyLayoutList[j].y;
          }
        }
      }
      return item;
    },
    moveEvent(i) {
      this.curBox = i;
    },
    movedEvent(i, newX, newY) {
      for (let j = 0; this.historyLayoutList[j] !== undefined; j++) {
        if (this.historyLayoutList[j].i === i) {
          this.newX = this.historyLayoutList[j].x;
          this.newY = this.historyLayoutList[j].y;
          this.historyLayoutList[j].x = newX;
          this.historyLayoutList[j].y = newY;
        }
      }
      for (let j = 0; this.historyLayoutList[j] !== undefined; j++) {
        if (i !== this.historyLayoutList[j].i && this.historyLayoutList[j].x === newX && this.historyLayoutList[j].y === newY) {
          this.historyLayoutList[j].x = this.newX;
          this.historyLayoutList[j].y = this.newY;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.big {
  &-screen {
    &-container {
      background: url("~@/assets/bigScreen/bg.png") no-repeat;
      height: 100%;
    }
  }
}
.item{
  &-wrapper{
    height: 100%;
  }
}
.notice {
  &-wrapper {
    position: absolute;
    bottom: 16px;
  }
  &__text {
    opacity: 0.8;
    font-size: 16px;
    font-weight: bold;
    font-family: AlibabaPuHuiTi_2_75_SemiBold,
      AlibabaPuHuiTi_2_75_SemiBold-Regular;
    // font-weight: 400;
    color: #e64645;
  }
  &__content {
    opacity: 0.8;
    font-size: 16px;
    margin-left: 14px;
    font-family: AlibabaPuHuiTi_2_55_Regular,
      AlibabaPuHuiTi_2_55_Regular-Regular;
    font-weight: 400;
    color: #fff;
  }
}
.wrapper {
  &-header {
    height: 60px;
    line-height: 60px;
    display: flex;
    width: 100%;
    background: url("~@/assets/bigScreen/header.png") no-repeat;
    background-size: 100%;

    &-left {
      width: 340px;
      &__title {
        padding: 0;
        margin: 0 0 0 30px;
        font-size: 30px;
        font-weight: 400;
        background-image: linear-gradient(180deg, #e6e6e6 38%, #1890ff 86%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    &-center {
      flex: 1;
      line-height: 0;
      position: relative;
    }
    &-right {
      // width:300px ;
      // text-align: center;
      &__time {
        display: inline-block;
        margin: 0 30px 0 0;
        font-size: 18px;
        font-family: Quantico, Quantico-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        padding: 0 2px;
      }
    }
  }
}
</style>
