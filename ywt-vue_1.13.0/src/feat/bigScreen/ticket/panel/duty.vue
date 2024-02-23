<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-22 10:26:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-24 15:24:21
 * @Description:人员排班情况面板
-->
<template>
  <Card
    v-loading="loading"
    title="人员排班情况"
    element-loading-background="#01070da6"
  >
    <el-row class="text-content">
      <el-col :span="24">
        <span>
          今日排班({{ today }})
        </span>
      </el-col>
    </el-row>
    <el-row v-for="(item,index) in data" :key="index" class="data-content">
      <el-col :span="8">
        <span class="text-time">
          {{ item.scheduleTime }}
        </span>
      </el-col>
      <el-col :span="16">
        <span v-for="(childItem,ind) in item.users" :key="ind" class="text-name">{{ childItem }}</span>
      </el-col>
    </el-row>
  </Card>
</template>

<script>
import Card from '../../component/card';
import TicketBigScreenApi from '../api';
import moment from 'moment';
export default {
  components: {
    Card,
  },
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  computed: {
    today() {
      return moment().format('YYYY-MM-DD');
    },
  },
  async mounted() {
    this.loading = true;
    this.data = await TicketBigScreenApi.duty({ time: this.today, }) || [];
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.text {
  &-content {
    padding-left: 20px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: #1890ff;
    }
  }
  &-time {
    font-size: 14px;
    font-weight: 400;
    color: #c9e5ff;
  }
  &-name{
     font-size: 14px;
    font-weight: 400;
    color: #c9e5ff;
    margin-left: 20px;
    display: inline-block;
  }
}
.data {
  &-content {
    padding-left: 20px;
    margin-top: 30px;

  }
}
</style>
