<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-26 10:10:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-09 16:48:06
 * @Description:工单关联的通话记录
-->

<template>
  <el-skeleton animated :loading="loading" :rows="3">
    <template slot="template" />
    <template>
      <div>
        <ul :class="'type--'+linkedType">
          <li
            v-for="(item,index) in list"
            :key="linkedType+index"
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
  </el-skeleton>

</template>

<script>
import TicketApi from '../api';
export default {
  name: 'TicketLinkedCallRecordDialog',
  props: {
    linkedType: {
      type: Number,
      default: 1,
    },
    ticketId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [],
      loading: true,
    };
  },
  async created() {
    this.loading = true;
    const { list, } = await TicketApi.linkedCallRecordList({
      ticketId: this.ticketId,
      linkedType: this.linkedType,
    });
    this.loading = false;
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
