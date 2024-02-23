<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-19 17:58:15
 * @FilePath: \big-screenc:\Users\cunzhe\Desktop\全院\ywt-vue-qp\src\views\project\impose\components\generateReport\componentData.vue
 * @Description:需求管理
-->
<template>
  <div>
    <div v-if="isTrueData">
      <!-- 需求信息 -->
      <DescriptionsTab :data-info="dataInfos(componentData.demandInfo,'demandInfo')" :basis-config="{title: '需求信息',column: 4,direction: 'horizontal',}" v-on="$listeners">
        <div v-for="(el,index) in innerTable(componentData.demandInfo.proposers,{organizer:'',sponsor:'',phone:''})" :key="index" class="inner-item">
          <div style="width:calc(100% / 3)"><span class="inner-title">提出科室{{ index + 1 }}:</span><span class="inner-info">{{ el.organizer }}</span></div>
          <div style="width:calc(100% / 3)"><span class="inner-title">提出人{{ index + 1 }}:</span><span class="inner-info">{{ el.sponsor }}</span></div>
          <div style="width:calc(100% / 3)"><span class="inner-title">联系电话{{ index + 1 }}:</span><span class="inner-info">{{ el.phone }}</span></div>
        </div>
      <!-- {{ componentData.demandInfo.proposers }} -->
      </DescriptionsTab>
      <!-- 调研成员分配 -->
      <DescriptionsTab :data-info="dataInfos(componentData.investigateUser,'investigateUser')" :basis-config="{title: '调研成员分配',column: 4,direction: 'horizontal',}" v-on="$listeners" />
      <!-- 调研信息 -->
      <div v-for="(item,idx) in componentData.investigate" :key="idx" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos( item,'investigate',['dayDetail'])" :basis-config="{title: `调研信息${idx + 1}`,column: 4,direction: 'horizontal',}" v-on="$listeners" />
        <Q-table
          :table-data="JSON.parse(item.dayDetail)"
          :columns="tableColumn"
          class="qp-table"
        />
      </div>
      <!-- 初定级 -->
      <div v-for="(item,idx) in componentData.firstGrading" :key="idx+'q'" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'firstGrading')" :basis-config="{title: '初定级',column: 4,direction: 'horizontal',}" v-on="$listeners" />
      </div>
      <!-- 需求分析 -->
      <div v-for="(item,idx) in componentData.demandAnalyses" :key="idx+'i'" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'demandAnalyses')" :basis-config="{title: '需求分析',column: 4,direction: 'horizontal',}" v-on="$listeners" />
      </div>
      <!-- 技术分析 -->
      <div v-for="(item,idx) in componentData.technicalAnalyses" :key="idx+'a'" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'technicalAnalyses')" :basis-config="{title: `技术分析：第${idx + 1}次`,column: 4,direction: 'horizontal',}" v-on="$listeners" />
      </div>
      <!-- 需求评估 -->
      <div v-for="(item,idx) in componentData.demandAssessList" :key="idx+'o'" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'demandAssessList',['projectType'])" :basis-config="{title: `需求评估`,column: 4,direction: 'horizontal',}" v-on="$listeners" />
      </div>
      <!-- 需求评审 -->
      <div v-for="(item,idx) in componentData.demandReviewList" :key="idx+'p'" style="margin-bottom:20px">
        <DescriptionsTab :data-info="dataInfos(item,'demandReviewList',['projectType'])" :basis-config="{title: `需求评审`,column: 4,direction: 'horizontal',}" v-on="$listeners" />
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
          { label: '序号', type: 'index', width: '85px', },
          {
            label: '组员',
            prop: 'name',
          },
          {
            label: '工时（天）',
            prop: 'time',
          },
          {
            label: '备注',
            prop: 'desc',
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
      // list：需要处理的数据 valKey：需要使用的模板 delKey：需要过滤的字段
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
        valKey === 'demandReviewList' && console.log(tep);
        return tep;
      };
    },
    innerTable() {
      return (list = [], valKey) => {
        var resList = [];
        list.forEach((item, idx) => {
          var obj = { ...valKey, };
          for (const key in valKey) {
            obj[key] = item[key];
          }
          resList.push(obj);
        });
        return resList;
      };
    },
  },
  created() {
    this.tabConfig = tabConfig;
  },
  methods: {

  },
};
</script>

<style  lang="scss" scoped>
.inner-item{
    width: 100%;
    height: 42px;
    border: 1px solid #e6ebf5;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom:10px;
    .inner-title{
      width: 150px;
      height: 40px;
      padding-left: 10px;
      line-height: 40px;
      display: inline-block;
      background: #fafafa;
      border-right:1px solid #e6ebf5;
    }
    .inner-info{
       height: 40px;
       display: inline-block;
      line-height: 40px;
      margin-left: 10px;
    }
  }
  .inner-item:last-of-type{
    margin:0px;
  }
  .not-data{
    position: absolute;
    top: 50%;
    left: calc(50% - 100px);
    transform: translate(-50% , -50%);
  }
</style>
