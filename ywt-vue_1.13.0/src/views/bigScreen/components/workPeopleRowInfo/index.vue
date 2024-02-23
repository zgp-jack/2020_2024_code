<!--
  排班
-->

<template>
  <Wrapper title="人员排班情况">
    <el-row class="text-content">
      <el-col :span="24">
        <span>
          今日排班({{ ToDay }})
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
  </Wrapper>
</template>

<script>
import Wrapper from '../wrapper/index.vue';
import BigScreenApi from '@/apis/bigScreen/index';
import moment from 'moment';
export default {
  components: {
    Wrapper,
  },
  data() {
    return {
      data: [],
    };
  },
  computed: {
    ToDay() {
      return moment().format('YYYY-MM-DD');
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initData();
    });
  },
  methods: {
    async initData() {
      this.data = await BigScreenApi.WorkPeopleRowInfo({ time: this.ToDay, }) || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  &-content {
    padding-left: 20px;
    margin-top: 15px;
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
