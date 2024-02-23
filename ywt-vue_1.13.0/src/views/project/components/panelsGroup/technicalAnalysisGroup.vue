<!--
技术分析 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code">{{ ItemCodeText }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <TechnicalAnalysis ref="technicalAnalysis" />
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
            <el-col v-if="shows.preliminaryLevel" :span="24">
              <PreliminaryLevel
                :height="height"
                :class="shows.preliminaryLevel ? 'M-T-16' : ''"
                :expand="true"
              />
            </el-col>
            <el-col v-if="shows.demandAnalysis" :span="24">
              <DemandAnalysis :height="height" :class="shows.research ? 'M-T-16':''" :expand="true" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" class="layout-panel-el-main-wrapper-col">
          <TimeLine />
        </el-col>
      </el-row>

    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper " :height="FooterHeight">
      <template v-if="showFooter">
        <pure-button label="提交" :loading="submitButtonLoading" @click="submit" />
        <pure-button

          :loading="saveButtonLoading"
          type="wire-frame"
          label="保存"
          @click="save"
        />
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import { mapMutations, } from 'vuex';
import { mixins_base, } from '@/minxins/project';
import AnswerInfo from '../panels/answerInfo.vue';
import FaultInfo from '../panels/faultInfo.vue';
import NeedInfo from '../panels/needInfo.vue';
import DemandAnalysis from '../panels/demandAnalysis.vue';
import ResearchInfo from '../panels/researchInfo.vue';
import TimeLine from '../timeLine/index.vue';
import TechnicalAnalysis from '../panels/technicalAnalysis.vue';
import PreliminaryLevel from '../panels/preliminaryLevel.vue';

export default {
  name: 'TechnicalAnalysisGroup',
  components: {
    AnswerInfo,
    FaultInfo,
    NeedInfo,
    DemandAnalysis,
    ResearchInfo,
    TimeLine,
    TechnicalAnalysis,
    PreliminaryLevel,

  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '需求分析',
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
      saveButtonLoading: false,
      result: {},
    };
  },
  computed: {
    ItemCodeText() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
    FooterHeight() {
      return (this.showFooter ? 60 : 16) + 'px';
    },
    shows_answer_fault_num() {
      const _is = [this.shows.answer, this.shows.fault];
      return _is.filter(e => e).length;
    },
    shows() {
      const data = this.getterPanelGroupData;
      return {
        answer: !!data.orderInfo || false,
        fault: !!data.orderFault || false,
        demand: !!data.demand || false,
        research: !!data.investigate || false,
        project: !!data.investigate || false,
        demandAnalysis: !!data?.demandAnalysis || false,
        technicalAnalysis: !!data?.technicalAnalysis || false,
        demandAssess: !!data?.demandAssess || false,
        demandReview: !!data?.demandReview || false,
        preliminaryLevel: !!data.firstGrading || false,

      };
    },
    shows_true_num() {
      const {
        answer,
        fault,
        demand,
        research,
        demandAnalysis,
        demandAssess,
        demandReview,
        preliminaryLevel, } = this.shows;
      const len = [answer,
        fault,
        demand,
        research,
        demandAnalysis,
        demandAssess,
        demandReview,
        preliminaryLevel];
      return len.filter(e => e).length || 1;
    },
  },
  updated() {
    this.$nextTick(() => {
      this.computedHeight();
    });
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

    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (35 * this.shows_true_num) - 16 * (this.shows_true_num - 1) - this.shows_answer_fault_num * 30 + 'px';
    },
    setDisabled() {
      this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });
    },
    setExpand() {
      this.SET_PANCEL_EXPAND({ name: 'demandAnalysis', expand: true, });
    },
    async  save() {
      try {
        this.saveButtonLoading = true;
        await this.$refs['technicalAnalysis'].onSave();
        this.$emit('done');
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.saveButtonLoading = false;
      }
    },
    async  submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['technicalAnalysis'].onSubmit();
        this.$emit('done');
      } catch (error) {
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
