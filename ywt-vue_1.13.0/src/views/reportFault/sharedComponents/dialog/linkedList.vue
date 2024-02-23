<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-23 18:39:51
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-29 22:41:49
 * @Description:关联通话记录列表
-->
<template>
  <div>
    <ul :class="'type--'+type">
      <li
        v-for="(item,index) in list"
        :key="type+index"
      >
        <el-row class="base-margin-bottom">
          <el-col :span="12">
            <span class="label">报修时间</span>
            <span>{{ item.createTime }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">服务台</span>
            <span> {{ item.receptionToName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span class="label">报修科室</span>
            <span>{{ item.deptIdToName }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">报修人</span>
            <span>{{ item.user }} {{ item.phone }}</span>
          </el-col>
        </el-row>

      </li>

    </ul>
  </div>
</template>

<script>
import TicketApi from '@/apis/reportFault/workOrder';
export default {
  props: {
    type: {
      type: Number,
      default: 1,
    },
    orderNum: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [],
    };
  },
  async created() {
    const { list, } = await TicketApi.relateCallRecordList({
      orderNum: this.orderNum,
      linkedType: this.type,
    });
    this.list = list;
  },
};
</script>

<style lang="scss" scoped>

ul {
  list-style: none;
  font-size: $--pure-base-font-size;
  margin:0;
  li {
    color: #334266;
    border-left: 4px solid #ED6969;
    padding: 16px  0 16px 16px;
    border-radius: 2px;
    + li {
      margin-top: 48px;
    }
    .label {
      color: #7d8db3;
      margin-right: 8px;
    }
  }

}
.type {
  &--1 {
    li {
      border-color: #ED6969;
    }
  }
  &--2 {
    li {
      border-color: #426ED7;
    }
  }
  &--3 {
    li {
      border-color: #E6A23C;
    }
  }
}
</style>
