<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-15 18:33:16
 * @FilePath: \ywt-vue-qp\src\views\project\impose\components\generateReport\componentData.vue
 * @Description:项目实施
-->
<template>
  <div>
    <div v-if="isTrueData">
      <Q-table
        :table-data="componentData.implementStarts"
        :columns="tableColumn"
        :stripe="true"
        style="height:100%"
        class="qp-table"
      />
      <div v-for="(item,idx) in componentData.handleList" :key="idx" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item.itemWork,'itemWork',['endTime','startTime'])" :basis-config="{title: `处理任务：${item.itemWork.name}`,column: 4,direction: 'horizontal',}" v-on="$listeners" />
        <div v-for="(el,index) in item.handleResultList" :key="index" style="margin-bottom:20px">
          <DescriptionsTab :data-info="dataInfos(el,'handleResultList',['id'])" :basis-config="{title: '',column: 4,direction: 'horizontal',}" v-on="$listeners" />
        </div>
      </div>
      <div v-for="(item,idx) in componentData['enterInfoList']" :key="`${idx}qp`" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'enterInfoList')" :basis-config="{title: '确认结果',column: 4,direction: 'horizontal',}" v-on="$listeners" />
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
      tableColumn: Object.freeze(
        [
          {
            label: '任务序号',
            prop: 'indexNum',
          },
          {
            label: '任务名称',
            prop: 'name',
          },
          {
            label: '责任人',
            prop: 'principal',
          },
          {
            label: '参与人',
            prop: 'users',
          },
          {
            label: '计划完成时间',
            prop: 'endTime',
          },
          {
            label: '实际完成时间',
            prop: 'realFinishTime',
          },
          {
            label: '完成情况',
            prop: 'finish',
          }
        ]
      ),
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
        valKey === 'handleResultList' && console.log(tep);
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
