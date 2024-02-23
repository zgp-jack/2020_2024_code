<!-- 开票 -->
<template>
  <el-popover
    v-model="visible"
    placement="bottom"
    width="320"
    trigger="manual"
    :close-delay="100"
    :open-delay="600"
    @show="hoverColumn"
  >
    <template #default>
      <div v-loading="loading">
        <el-timeline v-if="result.length" class="hyyPopverClass">
          <el-timeline-item
            v-for="(v, i) in result"
            :key="i"
            placement="top"
            hide-timestamp
          >
            <el-row class="list-item-top">
              <el-col :span="12">
                <span>
                  {{ v.receiptDate | date("YYYY-MM-DD") }}
                </span>
              </el-col>
              <el-col :offset="1" :span="5">
                <span>
                  {{ v.receiptUser || "-" }}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="list-item-bottom">
                <el-descriptions
                  :column="1"
                  size="mini"
                  :colon="false"
                  :label-style="labelStyle"
                  :content-style="contentStyle"
                >
                  <el-descriptions-item
                    label="应开金额"
                  >{{ contractPrice | formatCash }}元</el-descriptions-item>
                  <el-descriptions-item
                    label="实开金额"
                  >{{ v.receiptPrice | formatCash }}元</el-descriptions-item>
                  <el-descriptions-item label="开票单位">{{
                    v.companyId && enterpriseMap[v.companyId] != undefined
                      ? enterpriseMap[v.companyId].name
                      : "-"
                  }}</el-descriptions-item>
                </el-descriptions></el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无数据！" />
      </div>
    </template>
    <span slot="reference" :style="`color:${colorMap[state].color}`" @mouseover="hoverSpan" @mouseleave="visible = false">
      {{ colorMap[state].text[0] }}
    </span>
  </el-popover>
</template>

<script>
import _ from 'lodash';
import { pay_status, } from '../config/table';
import ConrtactApis from '@/apis/contract';
import { mapState, } from 'vuex';
export default {
  name: 'PrrcessTimeLine',
  props: {
    contractPrice: {
      type: [String, Number],
      default: '',
    },
    state: {
      type: [String, Number],
      default: '',
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      result: [],
      loading: false,
      visible: false,
    };
  },
  computed: {
    ...mapState('contract/index', ['enterpriseList']),
    enterpriseMap() {
      return _.keyBy(this.enterpriseList, 'id');
    },
    colorMap() {
      return pay_status;
    },
    labelStyle() {
      return {
        color: '#879BBA',
        'font-size': '14px',
      };
    },
    contentStyle() {
      return {
        color: '#2D405E',
        'font-size': '14px',
      };
    },
  },
  mounted() {
  },
  methods: {
    hoverSpan() {
      if (this.state !== 1) {
        this.visible = true;
      }
    },
    async hoverColumn() {
      this.loading = true;
      this.result = await ConrtactApis.InvoiceApi.process(this.id);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item-top {
  span {
    font-size: 14px;
    font-weight: 400;
    color: #000;
  }
}
.list-item-bottom {
  color: #879bba;
  font-size: 14px;
}
.hyyPopverClass {
  max-height: 380px;
  overflow: auto;
}
</style>
