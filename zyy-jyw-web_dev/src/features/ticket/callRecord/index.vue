<!--通话记录-->
<template>
  <TableLayout>
    <pure-table
      ref="pureTable"
      :columns="columns"
      :list-api="listApi"
      :query-condition="queryCondition"
      style="padding: 0 10px;"
    >
      <template #header>
        <query-panel
          @query="onQuery"
          @reset="onReset"
        >
          <el-form-item>
            <el-input
              v-model="formData.keywords"
              placeholder="电话号码/工单号"
            />
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formData.type"
              placeholder="电话类型"
            >
              <el-option :value="0" label="已接" />
              <el-option :value="1" label="呼出" />
              <el-option :value="2" label="未接" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="formData.time"
              align="right"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <user-select
              v-model="formData.reception"
              :multiple="false"
              collapse-tags
              placeholder="坐席人"
            />
          </el-form-item>
          <el-form-item>
            <dic-select
              v-model="formData.dealType"
              dic-key="obs_deal_type"
              style="width: 100%"
              placeholder="处置类型"
            />
          </el-form-item>

        </query-panel>
      </template>
      <template #indexColumn>
        序号
      </template>
      <template #columns="{row,prop}">
        <!--  电话类型-->
        <template v-if="prop==='callType'">
          <pure-type-text
            :config="CALL_TYPE"
            :type="row[prop]"
          />
        </template>
        <!--  通话时间-->
        <template v-else-if="prop==='createTime'">
          {{ row[prop] | timeFormat }}
        </template>
        <!--  录音-->
        <template v-else-if="prop==='recording'">
          <pure-audio :the-url="row[prop]" />
        </template>
        <template v-else>
          {{ row[prop] }}
        </template>
      </template>
    </pure-table>
  </TableLayout>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import TicketCallRecordApi from './api';
import { CALL_TYPE, } from './config';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';

export default {
  name: '',
  components: {
    UserSelect,
    DicSelect,
    QueryPanel,
  },
  data() {
    return {
      CALL_TYPE,
      columns: [
        {
          name: '(关联)工单号',
          label: '(关联)工单号',
          prop: 'orderNum',
          id: 1,
          order: 1,
          checked: true,
        },
        {
          name: '电话类型',
          label: '电话类型',
          prop: 'callType',
          id: 1,
          order: 1,
          checked: true,
        },
        {
          name: '电话号码',
          label: '电话号码',
          prop: 'phone',
          id: 3,
          order: 3,
          checked: true,
        }, {
          name: '号码所属人',
          label: '号码所属人',
          prop: 'user',
          id: 4,
          order: 4,
          checked: true,
        }, {
          name: '处置类型',
          label: '处置类型',
          prop: 'dealTypeToName',
          id: 1,
          order: 1,
          checked: true,
        }, {
          name: '通话时间',
          label: '通话时间',
          prop: 'createTime',
          id: 2,
          order: 2,
          checked: true,
        }, {
          name: '录音',
          label: '录音',
          prop: 'recording',
          id: 6,
          order: 6,
          checked: true,
        }, {
          name: '坐席人',
          label: '坐席人',
          prop: 'nickName',
          id: 6,
          order: 6,
          checked: true,
        },
      ],
      formData: {
        // 处置类型
        dealType: '',
        time: [],
        // 开始时间(yyyy-MM-dd HH:mm:ss)
        startTime: '',
        // 结束时间(yyyy-MM-dd HH:mm:ss)
        endTime: '',
        // 电话号码/工单号
        keywords: '',
        // 坐席人id
        reception: '',

        // 电话类型：0已接，1呼出，2未接
        type: '',
      },
      listApi: TicketCallRecordApi.callRecordList,
      queryCondition: {
        startTime: null,
        endTime: null,
        type: null,
        outPhone: null,
        helpDeskUser: null,
      },
      callTypeList: [
        {
          name: '未接',
          value: 2,
        }, {
          name: '已接',
          value: 0,
        }, {
          name: '拨出',
          value: 1,
        },
      ],
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    initList() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    async onQuery() {
      this.queryCondition = {
        ...this.formData,
      };
      this.queryCondition.startTime = this.formData.time?.[0] || null;
      this.queryCondition.endTime = this.formData.time?.[1] || null;
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    async onReset() {
      this.formData = {
        // 处置类型
        dealType: '',
        time: [],
        startTime: '',
        endTime: '',
        keywords: '',
        reception: '',
        type: '',
      };
      this.queryCondition = {
        startTime: null,
        endTime: null,
        type: null,
        outPhone: null,
        helpDeskUser: null,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
  },
};
</script>

<style lang="scss"
       scoped
>
//@import "~@/styles/ticket.scss";
</style>
