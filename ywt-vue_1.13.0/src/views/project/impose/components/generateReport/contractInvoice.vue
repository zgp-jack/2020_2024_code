<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-15 18:33:36
 * @FilePath: \ywt-vue-qp\src\views\project\impose\components\generateReport\contractInvoice.vue
 * @Description:
-->
<template>
  <div>
    <div v-if="isTrueData">
      <div
        v-for="(item, idx) in contractInvoiceList"
        :key="item.uid"
        style="margin-bottom:20px"
      >
        <DescriptionsTab
          :data-info="
            dataInfos(item, 'contractInvoiceList', [
              'payPlanList',
              'receiptList'
            ])
          "
          :basis-config="{
            title: `合同${idx + 1}`,
            column: 4,
            direction: 'horizontal'
          }"
          v-on="$listeners"
        />
        <div
          v-for="(el, index) in item.payPlanList"
          :key="index"
          style="margin-bottom:20px"
        >
          <DescriptionsTab
            :data-info="dataInfos(el, 'payPlanList', ['contractPayList'])"
            :basis-config="{
              title: `合同${idx + 1}：付款分期${index + 1}`,
              column: 4,
              direction: 'horizontal'
            }"
            v-on="$listeners"
          />
          <div
            v-for="(val, id) in el.contractPayList"
            :key="id"
            style="margin-bottom:20px"
          >
            <DescriptionsTab
              :data-info="dataInfos(val, 'contractPayList',[],id+1)"
              :basis-config="{ title: '', column: 4, direction: 'horizontal' }"
              v-on="$listeners"
            />
          </div>
        </div>
        <div
          v-for="(el, index) in item.receiptList"
          :key="el.uid"
          style="margin-bottom:20px"
        >
          <DescriptionsTab
            :data-info="dataInfos(el, 'receiptList')"
            :basis-config="{
              title: `合同${idx + 1}：开票分期${index + 1}`,
              column: 4,
              direction: 'horizontal'
            }"
            v-on="$listeners"
          />
        </div>
      </div>
    </div>
    <el-empty v-else class="not-data" description="暂无数据" />
  </div>
</template>

<script>
import * as tabConfig from './tabConfig';
import DescriptionsTab from './descriptionsTab.vue';
export default {
  components: {
    DescriptionsTab,
  },
  props: {
    componentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      contractInvoiceList: [],
      tabConfig: {},
    };
  },
  computed: {
    isTrueData() {
      const type = JSON.stringify(this.componentData);
      if (type === '{}' || type === '[]') {
        return false;
      } else {
        return true;
      }
    },
    dataInfos() {
      // list：需要处理的数据 valKey：需要使用的模板 delKey：需要过滤的字段 防止页面渲染空白或报错
      return (list, valKey, delKey, labelIndex) => {
        var tep = { ...this.tabConfig[valKey], };
        const transitList = { ...list, };
        if (!list) {
          return tep;
        }
        if (delKey && delKey.length) {
          delKey.forEach(key => {
            delete transitList[key];
          });
        }
        for (const key in transitList) {
          tep[key] = {
            ...this.tabConfig[valKey][key],
            content: transitList[key],
          };
          if (labelIndex && key === 'payDate') {
            tep[key]['label'] = `${tep[key].label}${labelIndex}`;
          }
        }
        valKey === 'contractPayList' && console.log(tep);
        return tep;
      };
    },
  },
  created() {
    this.contractInvoiceList = this.componentData;
    this.tabConfig = tabConfig;
  },
};
</script>

<style></style>
