<!--
  项目汇总
-->

<template>
  <div class="container">
    <span class="text-date">
      {{ theYear | date('YYYY') }}年度
    </span>
    <el-row class="item-row">
      <el-col class="item-col" :span="12">
        <span class="text offset sum">
          {{ data.itemNum }}
        </span>
      </el-col>
      <el-col class="item-col" :span="12">
        <span class="text offset timeOut">
          {{ data.overtime }}
        </span>
      </el-col>
    </el-row>
    <el-row class="item-row">
      <el-col class="item-col" :span="12">
        <span class="text offset completed">
          {{ data.complete }}
        </span>
      </el-col>
      <el-col class="item-col" :span="12">
        <span class="text offset underway">
          {{ data.processon }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BigScreenApi from '@/apis/bigScreen/index';
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
  width: 600px;
  // background: url("~@/assets/bigScreen/itemAmount.svg") no-repeat 100% 100%;
  position: relative;
}
.item {
  &-row {
    height: 50%;
  }
  &-col {
    position: relative;
    height: 100%;
  }
}
.text {
  font-size: 30px;
  font-family: "Quantico" !important;
  font-weight: 400;
  text-align: left;
  &-date {
    display: inline-block;
    font-family: "Quantico" !important;
    opacity: 0.85;
    font-size: 25px;
    font-weight: 700;
    color: #ffffff;
    position: absolute;
    top: 42%;
    left: 41%;
  }
}
.offset {
  position: absolute;
  top: 40px;
  left: 30%;
}
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
