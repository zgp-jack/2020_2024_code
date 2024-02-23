<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-04 11:20:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-08 16:55:04
 * @Description: 厂家报价-邀标面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      厂家报价
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-row>
      <el-col :span="12">邀标报价</el-col>
      <el-col :span="12">
        <span class="unit"> 报价截止时间：</span>

        <span :class="'time-'+disabled">{{ formData.quoteEndTime }}</span>
      </el-col>
    </el-row>
    <el-table
      :data="formData.manufacturerInfos"
      border
      class="base-margin-top"
      :cell-style="tableStyle.cellStyle"
      :cell-class-name="tableStyle.cellClassName"
    >
      <el-table-column
        label="序号"
        type="index"
        width="84"
        align="left"
      />
      <el-table-column
        prop="manufacturerName"
        label="报价厂家"
        width="auto"
        align="left"
        show-overflow-tooltip
      />
      <el-table-column
        prop="quoteMoney"
        label="费用(元)"
        width="153"
        align="left"
        show-overflow-tooltip
      >
        <template #default="{row}">
          {{ convertQuoteMoney(row) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="enclosure"
        label="附件"
        width="84"
        align="left"
        column-key="enclosure"
      >
        <template #default="{row}">
          <TableCellAttachment :data="row.enclosure" />
        </template>
      </el-table-column>
      <el-table-column v-if="!disabled" label="操作" align="left" width="84">
        <template #default="{row}">
          <pure-button
            v-if="row.state===1"
            label="催报"
            type="text"
            @click="onUrgeQuotePrice(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import TableCellAttachment from '@/views/project/components/tableCell/attachment.vue';
import tableStyle from '@/views/project/style/table';
import {
  isNumber,
} from 'lodash';
export default {
  name: 'QuotePriceWithBidPanel',
  components: {
    TableCellAttachment,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      name: 'QuotePriceWithBidPanel',
      formData: {},
      tableStyle,
    };
  },
  watch: {
    data: {
      handler(val) {
        this.formData = Object.assign({}, val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.formData = Object.assign({}, this.data);
  },
  methods: {
    async check(repairId) {
      await CarryInServiceApi.endQuotePrice(repairId);
    },
    async onUrgeQuotePrice({ repairId, manufacturerId, } = {}) {
      await CarryInServiceApi.urgeQuotePrice({ repairId, manufacturerId, });
      this.$message.success('已催报！');
    },
    convertQuoteMoney(row) {
      if (isNumber(row.quoteMoney)) {
        return row.quoteMoney.toLocaleString('en-US');
      }
      if (row.state === 1) {
        return this.disabled ? '未报价' : '待报价';
      }
      if (row.state === 2) {
        return '放弃报价';
      }
    },

  },
};
</script>

<style lang="scss" scoped>
.time-false {
  color: #f56c6c;
}
</style>
