<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-22 10:34:15
 * @FilePath: \big-screenc:\Users\cunzhe\Desktop\全院\ywt-vue-qp\src\views\project\impose\components\generateReport\establishedProject.vue
 * @Description:项目立项
-->
<template>
  <div>
    <div v-if="isTrueData">
      <!-- 方案制定 -->
      <DescriptionsTab :data-info="dataInfos(componentData.itemInfo,'itemInfo',['endTime','startTime'])" :basis-config="{title: '方案制定',column: 4,direction: 'horizontal',}" v-on="$listeners" />
      <!-- 里程碑 -->
      <div v-for="(item,idx) in componentData.workList" :key="idx+1" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'workList',['startTime','endTime'])" :basis-config="{title: !item.parent ? `里程碑${item.indexNum}` :'',column: 4,direction: 'horizontal',}" v-on="$listeners" />
      </div>
      <!-- 方案评审 -->
      <div v-for="(item,idx) in componentData.itemReviewList" :key="idx" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'itemReviewList')" :basis-config="{title: '方案评审',column: 4,direction: 'horizontal',}" v-on="$listeners" />
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
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
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
      return (list, valKey, delKey) => {
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
        }
        return tep;
      };
    },
  },
  created() {
    this.tabConfig = tabConfig;
  },
};
</script>

<style>

</style>
