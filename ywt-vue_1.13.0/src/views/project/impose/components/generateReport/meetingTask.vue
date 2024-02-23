<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-08-15 18:30:57
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-15 18:33:49
 * @FilePath: \ywt-vue-qp\src\views\project\impose\components\generateReport\componentData.vue
 * @Description:会议任务
-->
<template>
  <div>
    <div v-if="isTrueData">
      <!-- 会议 -->
      <Q-table
        :table-data="componentData.meetingInfoList"
        :columns="tableColumn"
        :stripe="true"
        :table-height="setTableHeight(componentData.meetingInfoList.length)"
        class="qp-table"
      />
      <div
        v-for="(item, idx) in componentData.meetingDetailList"
        :key="uuid(idx)"
        style="margin-bottom: 20px"
      >
        <DescriptionsTab
          :data-info="dataInfos(item.meetingBook, 'meetingBook')"
          :basis-config="{
            title: `会议${idx + 1}：预定信息`,
            column: 4,
            direction: 'horizontal',
          }"
          v-on="$listeners"
        >
          <div
            v-for="(el, index) in innerTable(item.meetingBook.meetingPersons, {
              person: '',
              phone: '',
            })"
            :key="index"
            class="inner-item"
          >
            <div>
              <span class="inner-title">联系人{{ index + 1 }}:</span><span class="inner-info">{{ el.person }}/{{ el.phone }}</span>
            </div>
          </div>
        </DescriptionsTab>
        <DescriptionsTab
          :data-info="dataInfos(item.meetingSummary, 'meetingSummary')"
          :basis-config="{
            title: `会议${idx + 1}：会议纪要`,
            column: 4,
            direction: 'horizontal',
          }"
          v-on="$listeners"
        />
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 20px">
          会议{{ idx + 1 }}：会议任务
        </div>
        <Q-table
          :table-data="item.taskList"
          :columns="templateTaskListTableColumn"
          :stripe="true"
          :table-height="setTableHeight(item.taskList.length)"
          class="qp-table"
        />
        <div
          v-for="(el, index) in item.taskDetailList"
          :key="uuid(index)"
          style="margin-bottom: 20px"
        >
          <DescriptionsTab
            :data-info="
              dataInfos(el, 'taskDetailList', [
                'taskHandleInfoList',
                'compTime',
                'createTime',
                'createUser',
                'planEndDate',
                'planStartDate',
                'taskCateId'
              ])
            "
            :basis-config="{
              title: `处理任务：${el.taskName}`,
              column: 4,
              direction: 'horizontal',
            }"
            v-on="$listeners"
          />
          <div
            v-for="(val, id) in el.taskHandleInfoList"
            :key="uuid(id)"
            style="margin-bottom: 20px"
          >
            <DescriptionsTab
              :data-info="dataInfos(val, 'taskHandleInfoList')"
              :basis-config="{ title: '', column: 4, direction: 'horizontal' }"
              v-on="$listeners"
            />
          </div>
        </div>
      </div>
      <div v-show="componentData.templateTaskList.length" style="font-size: 16px; font-weight: bold; margin-bottom: 20px">
        临时任务
      </div>
      <Q-table
        v-show="componentData.templateTaskList.length"
        :table-data="componentData.templateTaskList"
        :columns="templateTaskListTableColumn"
        :stripe="true"
        class="qp-table"
      />
      <div
        v-for="(item, idx) in componentData.templateTaskDetailList"
        :key="uuid(idx)"
        style="margin-bottom: 20px"
      >
        <DescriptionsTab
          v-if="item.taskCateId === '1'"
          :data-info="
            dataInfos(item, 'templateTaskDetailList_1', [
              'taskHandleInfoList',
              'compTime',
              'planEndDate',
              'planStartDate',
              'taskCateId'
            ])
          "
          :basis-config="{
            title: `任务${item.indexNum}`,
            column: 4,
            direction: 'horizontal',
          }"
          v-on="$listeners"
        />
        <DescriptionsTab
          v-else
          :data-info="
            dataInfos(item, 'templateTaskDetailList_2', [
              'taskHandleInfoList',
              'compTime',
              'planEndDate',
              'planStartDate',
              'level',
              'giveTime',
              'giveUser',
              'office',
              'auditUser',
              'itemName',
              'mustAttr',
              'taskCate',
              'taskCateId'
            ])
          "
          :basis-config="{
            title: `任务${componentData.templateTaskDetailList[idx - 1].indexNum}：子任务${item.indexNum}`,
            column: 4,
            direction: 'horizontal',
          }"
          v-on="$listeners"
        />
        <div
          v-for="(el, num) in item.taskHandleInfoList"
          :key="uuid(num)"
          style="margin-bottom: 20px"
        >
          <DescriptionsTab
            :data-info="dataInfos(el, 'taskHandleInfoList')"
            :basis-config="{ title:``, column: 4, direction: 'horizontal' }"
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
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableColumn: Object.freeze([
        { label: '会议序号', type: 'index', width: '100px', },
        {
          label: '会议主题',
          prop: 'title',
        },
        {
          label: '会议时间',
          prop: 'time',
        },
        {
          label: '任务总数',
          prop: 'total',
          width: '150px',
        },
        {
          label: '已完成',
          prop: 'finish',
        },
        {
          label: '未完成',
          prop: 'disFinish',
        }
      ]),
      templateTaskListTableColumn: Object.freeze([
        {
          label: '任务序号',
          prop: 'taskOrder',
        },
        {
          label: '任务名称',
          prop: 'taskName',
        },
        {
          label: '责任人',
          prop: 'leaderUser',
        },
        {
          label: '参与人',
          prop: 'partUser',
        },
        {
          label: '计划完成时间',
          prop: 'planEndDate',
        },
        {
          label: '完成情况',
          prop: 'states',
        },
        {
          label: '实际完成时间',
          prop: 'compTime',
        }
      ]),
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
          delKey.forEach((key) => {
            delete transitList[key];
          });
        }
        for (const key in transitList) {
          tep[key] = {
            ...this.tabConfig[valKey][key],
            content: transitList[key],
          };
        }
        valKey === 'templateTaskDetailList_1' && console.log(list, tep);
        return tep;
      };
    },
    innerTable() {
      return (list, valKey) => {
        var resList = [];
        JSON.parse(list).forEach((item, idx) => {
          var obj = { ...valKey, };
          for (const key in valKey) {
            obj[key] = item[key];
          }
          resList.push(obj);
        });
        return resList;
      };
    },
    setTableHeight() {
      return (columnLen) => {
        // 51:表格每行高度 44.2：表头高度
        return columnLen * 51 + 44.2 + '';
      };
    },
    uuid() {
      return (idx) => {
        var s = [];
        var uuidA = '';
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        uuidA = s.join('');
        return `${uuidA}${idx}`;
      };
    },
  },
  created() {
    this.tabConfig = tabConfig;
  },
};
</script>

<style scoped lang="scss">
.inner-item {
  width: 100%;
  height: 42px;
  border: 1px solid #e6ebf5;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .inner-title {
    width: 150px;
    height: 40px;
    padding-left: 10px;
    line-height: 40px;
    display: inline-block;
    background: #fafafa;
    border-right: 1px solid #e6ebf5;
  }
  .inner-info {
    height: 40px;
    display: inline-block;
    line-height: 40px;
    margin-left: 10px;
  }
}
.inner-item:last-of-type {
  margin: 0px;
}
</style>
