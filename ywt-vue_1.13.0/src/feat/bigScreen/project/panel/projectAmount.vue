<!--
  项目汇总
-->

<template>
  <div class="container">
    <span class="text-date"> {{ theYear | date("YYYY") }}年度 </span>
    <el-row class="item-row">
      <el-col
        class="item-col vertical-right  horizontal-bottom  top10 left10"
        :span="12"
      >
        <img :src="icon_count" class="icon">
        <div class="label-container">
          <span class="label-value offset sum">
            {{ data.itemNum.toLocaleString() }}
          </span>
          <small class="label-text">项目总数</small>
        </div>
      </el-col>
      <el-col
        class="item-col vertical-left  horizontal-bottom  top10 right10 "
        :span="12"
      >
        <img :src="icon_timeOut" class="icon">
        <div class="label-container">
          <span class="label-value offset timeOut">
            {{ data.overtime }}
          </span>
          <small class="label-text">超时</small>
        </div>
      </el-col>
    </el-row>
    <el-row class="item-row">
      <el-col
        class="item-col  vertical-right  horizontal-top   bottom10 left10 "
        :span="12"
      >
        <img :src="icon_over" class="icon">
        <div class="label-container">
          <span class="label-value offset completed">
            {{ data.complete }}
          </span>
          <small class="label-text">已完成</small>
        </div>
      </el-col>
      <el-col
        class="item-col vertical-left  horizontal-top   bottom10 right10"
        :span="12"
      >
        <img :src="icon_progress" class="icon">
        <div class="label-container">
          <span class="label-value offset underway">
            {{ data.processon }}
          </span>
          <small class="label-text">进行中</small>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BigScreenApi from '../api';
const icon_count = require('@/assets/bigScreen/itemCount.svg');
const icon_timeOut = require('@/assets/bigScreen/timeOut.svg');
const icon_over = require('@/assets/bigScreen/over.svg');
const icon_progress = require('@/assets/bigScreen/progress.svg');

export default {
  components: {},
  data() {
    return {
      data: {
        complete: 0,
        itemNum: 0,
        overtime: 0,
        processon: 0,
      },
      theYear: new Date(),
      icon_count,
      icon_timeOut,
      icon_over,
      icon_progress,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.data = await BigScreenApi.ProjectAmount();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.01),
    rgba(19, 115, 204, 0.1)
  );
}
.baseBorder {
  position: absolute;
  content: "";
  opacity: 0.2;
  background: #c9e5ff;
}
.vertical-right {
  &::before {
    @extend .baseBorder;
    width: 1px;
    height: 60%;
    right: 0;
  }
}
.vertical-left {
  &::before {
    @extend .baseBorder;
    width: 1px;
    height: 60%;
    left: 0;
  }
}
.top10 {
  &::before {
    top: 10%;
  }
}
.bottom10 {
  &::before {
    bottom: 10%;
  }
}

.left10 {
  &::after {
    left: 10% !important;
  }
}
.right10 {
  &::after {
    right: 10% !important;
  }
}
.horizontal-bottom {
  &::after {
    @extend .baseBorder;
    width: 60%;
    height: 1px;
    bottom: 0;
  }
}
.horizontal-top {
  &::after {
    @extend .baseBorder;
    width: 60%;
    height: 1px;
    top: 0;
  }
}

.icon {
  width: 50px;
  height: 50px;
  margin-left: 30px;
}

.item {
  &-row {
    height: 50%;
  }
  &-col {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.label {
  &-container {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
  }
  &-value {
    font-size: 30px;
    font-family: "Quantico" !important;
    font-weight: 400;
    text-align: left;
    margin-bottom: 5px;
  }
  &-text {
    opacity: 0.65;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    margin-top: 5px;
  }
}
.text {
  &-date {
    display: inline-block;
    font-family: "Quantico" !important;
    opacity: 0.85;
    font-size: 25px;
    font-weight: 700;
    color: #ffffff;
    position: absolute;
    top: 45%;
    left: 41%;
  }
}
// .offset {
//   position: absolute;
//   top: 40px;
//   left: 30%;
// }
.sum {
  color: #1890ff;
}
.timeOut {
  color: #cc5352;
}
.completed {
  color: #14cc89;
}
.underway {
  color: #53c7d9;
}
</style>
