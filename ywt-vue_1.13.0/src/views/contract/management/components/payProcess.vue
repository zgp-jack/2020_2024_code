<!-- 付款 -->
<template>
  <el-popover
    v-model="visible"
    style=" height: 400px"
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
          <el-timeline-item v-for="(v,i) in result" :key="i " placement="top" hide-timestamp>
            <el-row class="list-item-top">
              <el-col :span="12">
                <span>
                  {{ v.payDate | date('YYYY-MM-DD') }}
                </span>
              </el-col>
              <el-col :offset="1" :span="5">
                <span>
                  {{ v.createUser ? userMap[v.createUser].name : '-' }}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="list-item-bottom">
                <el-descriptions :column="1" size="mini" :colon="false" :label-style="labelStyle" :content-style="contentStyle">
                  <!-- <el-descriptions-item label="应付金额">{{ v.payablePrice.toLocaleString() }}元</el-descriptions-item> -->
                  <el-descriptions-item label="实付金额">{{ v.payPrice | formatCash }}元</el-descriptions-item>
                  <el-descriptions-item label="付款单位">{{ v.payCompanyId && enterpriseMap[v.payCompanyId] !=undefined? enterpriseMap[v.payCompanyId].name : '-' }}</el-descriptions-item>
                </el-descriptions></el-col>
            </el-row>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无数据！" />

      </div>
    </template>
    <span slot="reference" :style="`color:${colorMap[value].color}`" @mouseover="hoverSpan" @mouseleave="visible = false">
      {{ colorMap[value].text[1] }}
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
    value: {
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
    ...mapState('contract/index', ['enterpriseList', 'userList']),
    enterpriseMap() {
      return _.keyBy(this.enterpriseList, 'id');
    },
    userMap() {
      return _.keyBy(this.userList, 'id');
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
      if (this.value !== 1) {
        this.visible = true;
      }
    },
    async hoverColumn() {
      this.loading = true;
      this.result = await ConrtactApis.PayApi.payProcess(this.id);
      this.loading = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.list-item-top{

 span{
   font-size: 14px;
font-weight: 400;
color: #000;
 }
}
.list-item-bottom{
color:#879BBA;
font-size:14px
}
.hyyPopverClass{
  max-height: 380px;
  overflow: auto;
}

</style>
