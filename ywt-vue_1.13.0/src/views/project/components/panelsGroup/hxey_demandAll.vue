<!-- 用于展示 需求管理所有看板-->
<template>

  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">查看</span>
      <span class="layout-panel-el-header-wrapper--code ">需求编号:{{ itemCode }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="Span.left">
          <component :is="LeftShowComponent.component" />
        </el-col>
        <el-col v-if="RightShowComponent.length" class="layout-panel-el-main-wrapper-col P-R-16" :span="Span.right">
          <el-row>
            <el-col v-for="(item,index) in RightShowComponent" :key="index" :span="24">
              <component :is="item.component" :height="height" :class="index != 0? 'M-T-16':''" :expand="true" />
            </el-col>
          </el-row>
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col" :span="Span.timeLine">
          <TimeLinePanel />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper" height="16px" />
  </el-container>

</template>

<script>
import { mixins_base, } from '@/minxins/project';
import DemandPanel from '../panels/needInfo.vue';
import TimeLinePanel from '../timeLine/index.vue';
import InvestigatePanel from '../panels/researchInfo.vue';
import FaultInfoPanel from '../panels/faultInfo.vue';
import AnswerInfoPanel from '../panels/answerInfo.vue';
import TechnicalAnalysisPanel from '../panels/technicalAnalysis.vue';
import DemandAssessPanel from '../panels/demandAssess.vue';
import DemandAnalysisPanel from '../panels/demandAnalysis.vue';
import DemandReviewPanel from '../panels/demandReview.vue';
import ProjectInfoPanel from '../panels/projectInfo.vue';
import PreliminaryLevelPanel from '../panels/preliminaryLevel.vue';

import { mapMutations, } from 'vuex';
import drawerWidth from '../../common/width/drawer';

export default {
  components: {
    TimeLinePanel,
  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '',
    },
    where: {
      type: String,
      default: 'demand',
    },
    width: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      height: '',
    };
  },
  computed: {
    Shows() {
      const data = this.getterPanelGroupData;
      return {
        // 接听
        answer: !!data.orderInfo || false,
        // 故障
        fault: !!data.orderFault || false,
        // 需求
        demand: !!data.demand || false,
        // 调研
        investigate: !!data.investigate || false,
        // 初定级
        preliminaryLevel: !!data.firstGrading || false,

        // 需求分析
        demandAnalysis: !!data.demandAnalysis || false,
        // 技术分析
        technicalAnalysis: !!data.technicalAnalysis || false,
        // 需求评估
        demandAssess: !!data.demandAssess || false,
        // 需求评审
        demandReview: !!data?.demandReview || false,
        // 项目信息
        projectInfo: !!data?.info || false,
      };
    },
    ShowsComponent() {
      const { answer, fault, demand, investigate, preliminaryLevel, demandAnalysis, technicalAnalysis, demandAssess, demandReview, projectInfo, } = this.Shows;
      const showComponent = [{
        show: answer,
        component: AnswerInfoPanel,
        expandName: 'answerInfo',
      },
      {
        show: fault,
        component: FaultInfoPanel,
        expandName: 'faultInfo',

      },
      {
        show: demand,
        component: DemandPanel,
        expandName: 'needInfo',

      },
      {
        show: investigate,
        component: InvestigatePanel,
        expandName: 'researchInfo',
      },
      {
        show: preliminaryLevel,
        component: PreliminaryLevelPanel,
        expandName: 'preliminaryLevel',
      },
      {
        show: demandAnalysis,
        component: DemandAnalysisPanel,
        expandName: 'demandAnalysis',

      },
      {
        show: technicalAnalysis,
        component: TechnicalAnalysisPanel,
        expandName: 'technicalAnalysis',

      },
      {
        show: demandAssess,
        component: DemandAssessPanel,
        expandName: 'demandAssess',

      },
      {
        show: demandReview,
        component: DemandReviewPanel,
        expandName: 'demandReview',
      }, {
        show: this.where === 'demand' ? false : projectInfo,
        component: ProjectInfoPanel,
        expandName: 'projectInfo',
      }];

      return showComponent;
    },
    ComputedShowComponent() {
      console.log(this.ShowsComponent, this.where, 'ShowsComponent');
      const showComponents = this.ShowsComponent.filter((item) => item.show);
      return showComponents.reverse();
    },
    LeftShowComponent() {
      return this.ComputedShowComponent[0];
    },
    RightShowComponent() {
      return this.ComputedShowComponent.slice(1).reverse();
    },
    Span() {
      if (this.width === drawerWidth.small_px) {
        return {
          left: 18,
          right: 0,
          timeLine: 6,
        };
      } else if (this.RightShowComponent.length) {
        return {
          left: 10,
          right: 10,
          timeLine: 4,
        };
      } else {
        return {
          left: 20,
          right: 0,
          timeLine: 4,
        };
      }
    },
    ShowsAnswerFaultNum() {
      const { answer, fault, } = this.Shows;
      const val = [answer, fault];
      const trues = val.filter((e) => e);
      const num = trues.length;
      return num;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.computedHeight();
    });
    this.setDisabled();
    this.controlExpand();
  },
  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND', 'SET_PANCEL_DISABLED']),
    setDisabled() {
      this.SET_PANCEL_DISABLED({ name: 'needInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchViewPlan', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'projectInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'researchInfo', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });
    },
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      const rightNum = this.RightShowComponent.length;
      this.height = mainClientHeight - (35 * rightNum) - (16 * (rightNum - 1)) - (this.ShowsAnswerFaultNum * 30) + 'px';
    },
    controlExpand() {
      let name = '';
      if (this.RightShowComponent.length) {
        name = this.RightShowComponent[this.RightShowComponent.length - 1].expandName;
        this.SET_PANCEL_EXPAND({ name: name, expand: true, });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../../style/project.scss';

</style>
