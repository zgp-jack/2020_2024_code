<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-28 17:19:29
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-24 11:47:56
 * @FilePath: \ywt-vue\src\views\home\components\workWarp.vue
 * @Description: 工种容器
-->
<template>
  <div class="container">
    <div class="header" :style="{background:work.color}">
      {{ work.title }}：{{ cardLen }}
    </div>
    <div v-if="cardLen > 0" class="body">
      <WorkCard
        v-for="(item ,idx ) in orderCardDatalist"
        ref="workCard"
        :key="idx"
        :work-key="work.key"
        :more-cars-len="moreCarsLen"
        :work-item="item"
        class="card"
        :class="(idx+1) % 7 === 0 ?'row-last':''"
        @showMore="showMore"
        @refreshCard="refreshCard"
        @click.native="openCard(item,work.key)"
      />
    </div>
    <div v-else v-loading="severLoading" class="body null-data" element-loading-text="正在加载中..." element-loading-spinner="el-icon-loading">
      <span v-show="!severLoading">暂无数据...</span>
    </div>
    <div v-show="hasMore[work.key]" class="fold-card" @click="showMore(work.key,false)">
      <span class="line" /><span>收起 <i class="el-icon-arrow-up" /></span><span class="line" />
    </div>
  </div>
</template>

<script>
import btnsConfigMixin from '../minxin/dropdownBtsMixin';
import WorkCard from './workCard';
import TicketInfoDrawer from '@/feat/ticket/drawer/ticket.vue';
import AddTask from '@/views/synthesize/taskManagement/components/panel/addTask.vue';
import InspectionDetail from '@/views/inspection/task/dialog/inspectionDetail.vue';
// import ItemSet from '@/views/project/components/panelsGroup/itemSet.vue';
export default {
  components: {
    WorkCard,
  },
  mixins: [btnsConfigMixin],
  props: {
    work: {
      type: Object,
      default: () => ({}),
    },
    cardApiParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      hasMore: {
        order: false,
        task: false,
        research: false,
        project: false,
        inspection: false,
      },
      order: [],
      task: [],
      research: [],
      inspection: [],
      project: [],
      severLoading: false,
      apiParamData: {},
    };
  },
  computed: {
    orderCardDatalist() {
      if (this[this.work.key].length > 7 && !this.hasMore[this.work.key]) {
        let lastCard = {};
        lastCard = { title: '查看剩余', type: 'more', };
        const cards = [...this[this.work.key]].splice(0, 6);
        return [...cards, lastCard];
      } else {
        return this[this.work.key];
      }
    },
    cardLen() {
      return this[this.work.key].length;
    },
    moreCarsLen() {
      return this[this.work.key].length - 6;
    },
    rowLen() {
      return Math.ceil(this.orderCardDatalist.length / 7);
    },
  },
  watch: {
    cardApiParams: {
      handler(newVal, oldVal) {
        this.apiParamData = { ...newVal, };
        if (this.work.key === 'project') {
          this.apiParamData.processStr = 'implement_start,item_before_project,reject_end,end_project,implement_over';
        } else {
          delete this.apiParamData.processStr;
        }
        this.getCardDataList();
      },
      deep: true,
    },
  },
  created() {

  },

  methods: {
    // 用户切换刷新操作
    tabRefreshCard() {
    this.$refs.workCard?.fetchData();
    },
    async refreshCard(cardType, next) {
      const res = await this.getCardDataList(cardType);
      console.log(res, next);
      res && await this.getCardDataList(next);
    },
    showMore(key, val) {
      this.hasMore[key] = val;
    },
    async getCardDataList() {
      this.severLoading = true;
      const res = await this.work.api(this.apiParamData).then(res => {
        this[this.work.key] = this.compatibleKeyFun(this.work.key, res.list);
      });
      return res;
    },
    compatibleKeyFun(dataType, severData) {
      const compatibleData = [];
      severData.forEach(item => {
        if (dataType === 'order') {
          const { currState, faultRemark, sendDateTime, } = item;
          compatibleData.push({ title: faultRemark, time: sendDateTime, type: currState, timeTitle: '派单时间:', ...item, });
        } else if (dataType === 'task') {
          const { states, taskName, planEndDate, compRate, } = item;
          compatibleData.push({ title: taskName, time: planEndDate, type: states, compRate, timeTitle: '截止时间:', ...item, });
        } else if (dataType === 'research') {
          const { showState, title, startTime, } = item;
          compatibleData.push({ title, time: startTime, type: showState, timeTitle: '提出时间:', ...item, });
        } else if (dataType === 'inspection') {
          const { name, endTime, frequencyNow, frequencyTimer, } = item;
          compatibleData.push({ title: name, time: endTime, frequencyNow, frequencyTimer, timeTitle: '到期时间:', ...item, });
        } else {
          const { title, endTime, showState, } = item;
          compatibleData.push({ title, time: endTime, timeTitle: '截止时间:', type: showState, ...item, });
        }
      });
      this.severLoading = false;
      return compatibleData;
    },
    // 查看卡片
    openCard(card, cardType) {
      if (card.type === 'more') return false;
      cardType === 'order' && this.openOrderDrawer(card.orderNum);
      cardType === 'task' && this.openTaskDrawer(card);
      cardType === 'research' && this.openResearchDrawer(card);
      cardType === 'inspection' && this.openInspectionDrawer(card);
      cardType === 'project' && this.openProjectDrawer(card);
    },
    // 查看工单卡
    openOrderDrawer(id) {
      this.$drawer({
        width: '87.917%',
        component: () => <TicketInfoDrawer operatorType='VIEW' id={id}/>,
      });
    },
    // 查看任务卡
    openTaskDrawer(card) {
      this.$drawer({
        title: '任务',
        width: '1280px',
        position: 'right-bottom',
        component: () => <AddTask info={card} onDone={this.onDrawerDone} type={'search'}/>,
      });
    },
    // 查看调研卡
    openResearchDrawer(card) {
      this.researchOptionsMenuClick('search', card);
    },
    // 查看巡检卡
    openInspectionDrawer(card) {
      this.$drawer({
        width: '1688px',
        position: 'right-bottom',
        component: () => (
          <InspectionDetail
            taskId={card.exeId}
            actionType='view'
            propertyName={card.propertyName}
          />
        ),
      });
    },
    // 查看项目卡
    openProjectDrawer(card) {
      this.projectOptionsMenuClick('search', card);
      // const props = {
      //   hiddenSaveButton: true,
      //   showFooter: false,
      //   title: '项目信息',
      // };
      // this.$drawer({
      //   width: '87.917%',
      //   component: () => <ItemSet operatorType='VIEW' props={props}/>,
      // });
    },
    onDrawerDone() {
      this.$emit('update');
    },
  },
};
</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  .header{
    width: 100%;
    height: 26px;
    color: #fff;
    border-radius: 2px;
    line-height: 26px;
    text-align: left;
    padding-left: 10px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .body{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    .card{
      flex-direction: row;
      margin: 0 7px 0px 0;
      width: calc(100% / 7 - 6px);
      height: 92px;
      padding: 0 10px;
    }
    .row-last{
      margin: 0 0px 8px 0;
    }
  }
  .null-data{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 86px;
    font-weight: 400;
    font-size: 16px;
    color: #686868;
    letter-spacing: 1px;
  }
  .fold-card{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    line-height: 14px;
    margin: 7px 0 15px 0;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: #334266;
    cursor: pointer;
    .line{
      display: inline-block;
      height: 1px;
      width: calc(100% / 2 - 30px);
      line-height: 14px;
      background: rgba(26,33,51,0.25);
    }
  }
  .fold-card:hover{
    color: #426ED7;
  }
}

</style>>

