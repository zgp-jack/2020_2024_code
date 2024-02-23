<!--
 * @Author: Q qiaopeng@medicalway.email
 * @Date: 2022-07-28 17:19:29
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-24 12:35:56
 * @FilePath: \ywt-vue\src\views\home\components\workCard.vue
 * @Description: 工单卡片
-->
<template>
  <el-card class="work-card" shadow="hover">
    <div v-show="workItem.type !== 'more'" class="header">
      <span v-show="workItem.level" class="type-icon" :style="{background:workTypeState.levelColor[workItem.level]}" /><span class="title">{{ workItem.title | faultRemarkFormatter }}</span>
    </div>
    <div v-show="workItem.type !== 'more'" class="body">
      <div class="info">
        <span>
          {{ workItem.timeTitle }}
          <span class="time">{{ workItem.time | removeSecondFormatter(workKey) }}</span>
        </span>
        <span v-if="workItem.hasOwnProperty('compRate')" class="progress">{{ workItem.compRate }}%</span>
      </div>
    </div>
    <div v-show="workItem.type !== 'more'" class="info footer" @click.stop>
      <div v-if="workItem.hasOwnProperty('type')" :style="{color:workTypeState.state.stateColor}">{{ workTypeState.state.title }}</div>
      <div v-else>{{ workItem.frequencyNow - 1 }} / {{ workItem.frequencyTimer }}</div>
      <component :is="whichOptionsMenu" v-if="workKey !== 'inspection'" ref="tableComponent" :only-view="CareView.onlyView" where-field="needSetting" :data="workItem" @click="clickOptionsMenu($event,workItem)" />
      <Btns v-else :buttons="inspection" />
    </div>
    <div v-show="workItem.type === 'more'" class="more" @click.stop="showMoreCards('more')">{{ workItem.title }} {{ moreCarsLen }}个<i class="el-icon-arrow-down" /> </div>
  </el-card>
</template>

<script>
import Btns from '@/components/btns';
import btnsConfigMixin from '../minxin/dropdownBtsMixin';

import {
  workState,
  faultRemarkFormatter,
  removeSecondFormatter,
} from '../filter';
export default {
  components: {
    Btns,
    orderOptionsMenu: () => import('../buttonMenu/orderOptionsMenu.vue'),
    taskOptionsMenu: () => import('../buttonMenu/taskOptionsMenu.vue'),
    researchOptionsMenu: () => import('../buttonMenu/researchOptionsMenu.vue'),
    projectOptionsMenu: () => import('../buttonMenu/projectOptionsMenu.vue'),
  },
  filters: {
    workState,
    faultRemarkFormatter,
    removeSecondFormatter,
  },
  mixins: [btnsConfigMixin],
  props: {
    workItem: {
      type: Object,
      default: () => ({}),
    },
    workKey: {
      type: String,
      default: '',
    },
    moreCarsLen: {
      type: Number,
      default: 0,
    },
  },
  inject: ['FrontPage', 'CareView'],
  data() {
    return {
      ropdownLinkIcon: 'el-icon-caret-bottom',
    };
  },
  computed: {
    workTypeState() {
      return workState(this.workItem, this.workKey);
    },
    whichOptionsMenu() {
      let useOptionsMenu = '';
      switch (this.workKey) {
        case 'order' :
          useOptionsMenu = 'orderOptionsMenu';
          break;
        case 'task' :
          useOptionsMenu = 'taskOptionsMenu';
          break;
        case 'research' :
          useOptionsMenu = 'researchOptionsMenu';
          break;
        case 'project' :
          useOptionsMenu = 'projectOptionsMenu';
          break;
      }
      return useOptionsMenu;
    },
  },
  methods: {
    showMoreCards(type) {
      if (type === 'more') {
        this.$emit('showMore', this.workKey, true);
      }
    },
    fetchData(type = '') {
      type ? this.$emit('refreshCard', this.workKey, type) : this.$emit('refreshCard', this.workKey);
    },
    clickOptionsMenu(type, row) {
      const menuName = `${this.whichOptionsMenu}Click`;
      // 工单-任务-调研-巡检-项目的全功能弹窗 由于以前的弹窗逻辑过于庞大 这里将对应方法抽离进 dropdownBtsMixin
      this[menuName](type, row);
    },
  },
};
</script>

<style lang="scss" scoped>
.work-card{
  border-radius: 2px;
  cursor: pointer;
  ::v-deep.el-card__body{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    padding: 0 !important;
  }
  .header{
    display: flex;
    align-items: center;
    line-height: 14px;
    // margin-bottom: 8px;
    .type-icon{
      width: 8px;
      height: 8px;
      display:inline-block;
      // background: #5FBF30;
      border-radius: 50%;
      margin-right: 5px;
    }
    .title{
      font-family: AlibabaPuHuiTi_2_65_Medium;
      font-weight: Bold;
      font-size: 14px;
      color: #334266;
      max-width: 90%;
      overflow: hidden; // 文字超长隐藏
      text-overflow:ellipsis; // 显示...
      white-space: nowrap; // 单行显示
    }
  }
  .body{
    .info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #7D8DB3;
      // margin-bottom: 8px;
    }

    .progress{
      color: #426ED7;
    }
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 22px;
    .dropdown-link-warp{
      cursor: pointer;
      font-size: 14px;
      padding: 1px 3px;
      line-height: 14px;
      background: #F0F1F5;
      border-radius: 2px;
    }
  }
  .more{
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: #426ED7;
    cursor: pointer;
  }
}
.time{
  font-size: 14px;
  color: #334266;
}
.dropdown-btn{
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #334266;
}
.qp-el-button{
  color: #334266;
  height: 30px;
  font-size: 14px;
}
</style>>

