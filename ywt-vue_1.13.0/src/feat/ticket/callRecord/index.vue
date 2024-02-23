<!--
 * @Author: Pure 305737824@qq.com
 * @Date: 2023-06-27 14:06:26
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 10:01:45
 * @Description: 通话记录
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="columns"
        :query-condition="queryCondition"
        :list-api="listApi"
      >
        <template slot="header">
          <el-row
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >
            <el-col :span="3" class="base-margin-left">
              <dic-multi-select v-model="formData.type" :hard-list="callTypeList" size="mini" placeholder="电话类型" multiple collapse-tags />
            </el-col>
            <el-col :span="5" class="base-margin-left">
              <el-date-picker
                v-model="formData.time"
                size="mini"
                class="base-margin-right"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="通话时间"
                end-placeholder="通话时间"
              />
            </el-col>
            <el-col :span="3" class="base-margin-left">
              <el-input
                v-model="formData.outPhone"
                size="mini"
                placeholder="号码"
              />
            </el-col>

            <el-col :span="5" class="base-margin-left">
              <el-select v-model="formData.helpDeskUser" filterable multiple="" collapse-tags placeholder="服务台" size="mini" class="base-margin-right">
                <el-option
                  v-for="item in receptionList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <pure-button label="查询" type="default" @click="onQuery" />
              <pure-button label="重置" type="wire-frame" @click="onReset" />
            </el-col>

          </el-row>
        </template>
        <template slot="indexColumn">
          序号
        </template>
        <template
          slot="columns"
          slot-scope="{row,prop}"
        >
          <div v-if="prop ==='recordEnclosure'">
            <my-audio
              v-if="row.recordEnclosure"
              :key="row.recordEnclosure"
              :the-url="row.recordEnclosure"
            />
            <span v-else>无录音信息</span>
          </div>
          <span v-else-if="prop === 'type'" :class="'call-type--'+row.type">
            {{ row[prop] | phoneState }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import CallRecordApi from './api';
import MyAudio from '@/components/audio/audio';
import ServiceDeskApi from '@/feat/ticket/serviceDesk/api';
import PureTable from '@/feat/component/pureTable';
import DicMultiSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect';
export default {
  name: 'BzThjl',
  components: {
    PureTable,
    DicMultiSelect,
    MyAudio,
  },
  data() {
    return {
      columns: [{
        name: '类型',
        label: '类型',
        prop: 'type',
        id: 1,
        order: 1,
        checked: true,
      }, {
        name: '时间',
        label: '时间',
        prop: 'createTime',
        id: 2,
        order: 2,
        checked: true,
      }, {
        name: '号码',
        label: '号码',
        prop: 'outPhone',
        id: 3,
        order: 3,
        checked: true,
      }, {
        name: '人员',
        label: '人员',
        prop: 'callUserToName',
        id: 4,
        order: 4,
        checked: true,
      }, {
        name: '服务台',
        label: '服务台',
        prop: 'helpDeskUserToName',
        id: 5,
        order: 5,
        checked: true,
      }, {
        name: '录音',
        label: '录音',
        prop: 'recordEnclosure',
        id: 6,
        order: 6,
        checked: true,
      }],
      listApi: CallRecordApi.list,
      queryCondition: {
        startTime: null,
        endTime: null,
        type: null,
        outPhone: null,
        helpDeskUser: null,
      },
      formData: {
        type: null,
        time: [],
        outPhone: null,
        helpDeskUser: [],
      },
      callTypeList: [{
        name: '未接',
        value: 2,
      }, {
        name: '已接',
        value: 0,
      }, {
        name: '拨出',
        value: 1,
      }],
      receptionList: [],
    };
  },
  async created() {
    this.receptionList = await ServiceDeskApi.receptionList();
  },
  methods: {
    async onQuery() {
      const { time, helpDeskUser, ...other } = this.formData;
      this.queryCondition = Object.assign({}, this.queryCondition, other);
      this.queryCondition.helpDeskUser = helpDeskUser.join(',') || null;
      this.queryCondition.endTime = time?.[1] || null;
      this.queryCondition.startTime = time?.[0] || null;
      console.log(this.queryCondition);
    },
    async onReset() {
      this.formData.helpDeskUser = [];
      this.formData.time = [];
      this.formData.outPhone = null;
      this.formData.type = null;
      this.onQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
</style>
