<!--
评审方案 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code">{{ _itemCode }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <ResearchReviewPlan ref="researchReview" />
        </el-col>
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <el-row>
            <el-col v-if="shows.answer" :span="24">
              <AnswerInfo :height="height" :expand="true" />
            </el-col>
            <el-col v-if="shows.fault " :span="24">
              <FaultInfo :height="height" class="M-T-16" :expand="true" />
            </el-col>
            <el-col v-if="shows.demand" :span="24">
              <NeedInfo :height="height" :class="shows.fault?' M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.research" :span="24">
              <ResearchInfo :height="height" :class=" shows.demand ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.demandAnalysis">
              <DemandAnalysis :height="height" :class="shows.research ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.technicalAnalysis">
              <TechnicalAnalysis :height="height" :class="shows.research ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.technicalAnalysis">
              <DemandAssess :height="height" :class="shows.research ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.demandReview">
              <DemandReview :height="height" :class="shows.demandAssess ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col :span="24">
              <ProjectInfo :class="shows.project ? 'M-T-16':''" :expand="true" :height="height" />
            </el-col>

          </el-row>
        </el-col>
        <el-col :span="4" class="layout-panel-el-main-wrapper-col">
          <TimeLine />
        </el-col>
      </el-row>

    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper " :height="footerHeight">
      <template v-if="showFooter">
        <pure-button label="提交" :loading="submitButtonLoading" @click="submit" />
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import { mapMutations, } from 'vuex';
import { mixins_base, } from '@/minxins/project';
import TechnicalAnalysis from '../panels/technicalAnalysis.vue';
import DemandAssess from '../panels/demandAssess.vue';
import DemandAnalysis from '../panels/demandAnalysis.vue';
import DemandReview from '../panels/demandReview.vue';
export default {
  name: 'ReviewPlan',
  components: {
    AnswerInfo: () => import('../panels/answerInfo.vue'),
    FaultInfo: () => import('../panels/faultInfo.vue'),
    NeedInfo: () => import('../panels/needInfo.vue'),
    ProjectInfo: () => import('../panels/projectInfo.vue'),
    ResearchReviewPlan: () => import('../panels/researchViewPlan.vue'),
    ResearchInfo: () => import('../panels/researchInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
    TechnicalAnalysis,
    DemandAssess,
    DemandAnalysis,
    DemandReview,
  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '需求信息',
    },
    hiddenSaveButton: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      height: '',
      submitButtonLoading: false,
      result: {},
    };
  },
  computed: {
    footerHeight() {
      return (this.showFooter ? 60 : 16) + 'px';
    },
    _itemCode() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
    shows() {
      const data = this.getterPanelGroupData;
      return {
        answer: !!data.orderInfo || false,
        fault: !!data.orderFault || false,
        demand: !!data.demand || false,
        research: !!data.investigate || false,
        project: !!data.info || false,
        demandAnalysis: !!data.demandAnalysis || false,
        technicalAnalysis: !!data.technicalAnalysis || false,
        demandAssess: !!data.demandAssess || false,
        demandReview: !!data?.demandReview || false,
      };
    },
    shows_true_num() {
      const {
        answer,
        fault,
        demand,
        research,
        project,
        technicalAnalysis,
        demandAnalysis,
        demandAssess,
        demandReview,
      } = this.shows;
      const len = [answer,
        fault,
        demand,
        research,
        project,
        technicalAnalysis,
        demandAssess,
        demandAnalysis,
        demandReview
      ];
      return len.filter(e => e).length || 1;
    },
    shows_answer_fault_num() {
      const _is = [this.shows.answer, this.shows.fault];
      return _is.filter(e => e).length;
    },

  },
  updated() {
    this.$nextTick(() => {
      this.computedHeight();
    });
  },
  async created() {
  },
  mounted() {
    this.setDisabled();
    this.setExpand();
    this.$nextTick(() => {
      this.computedHeight();
    });
  },

  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND', 'SET_PANCEL_DISABLED']),

    setExpand() {
      let name = '';
      if (this.shows.project) {
        name = 'projectInfo';
      } else if (this.shows.demandReview) {
        name = 'demandReview';
      } else if (this.shows.demandAssess) {
        name = 'demandAssess';
      } else if (this.shows.demand) {
        name = 'needInfo';
      } else {
        //
      }
      this.SET_PANCEL_EXPAND({ name: name, expand: true, });
    },
    setDisabled() {
      if (this.shows.technicalAnalysis || this.demandAnalysis || this.shows.demandAssess || this.shows.demandReview) {
        this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      }
    },
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (35 * this.shows_true_num) - 16 * (this.shows_true_num - 1) - this.shows_answer_fault_num * 30 + 'px';
    },
    async  submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['researchReview'].submit();
        this.submitButtonLoading = false;
        this.$emit('done');
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      } finally {
        this.submitButtonLoading = false;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
@import '../../style/project.scss'
</style>
