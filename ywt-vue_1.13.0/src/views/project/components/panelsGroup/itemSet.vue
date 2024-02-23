<!--
项目制定 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code">{{ ItemCode }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col :span="span.left" class="layout-panel-el-main-wrapper-col P-R-16">
          <ProjectInfo ref="project" />
        </el-col>
        <el-col v-if="shows_true" :span="span.center" class="layout-panel-el-main-wrapper-col P-R-16">
          <el-row>
            <el-col v-if="shows.answer " :span="24">
              <AnswerInfo :height="height" :expand="true" />
            </el-col>
            <el-col v-if="shows.fault " :span="24">
              <FaultInfo :height="height" class="M-T-16" :expand="true" />
            </el-col>
            <el-col v-if="shows.demand" :span="24">
              <NeedInfo :height="height" :class="shows.answer || shows.fault ? 'M-T-16':''" :expand="true" />
            </el-col>
            <el-col v-if="shows.research " :span="24">
              <ResearchInfo :height="height" class="M-T-16" :expand="true" />
            </el-col>
            <el-col v-if="shows.preliminaryLevel" :span="24">
              <PreliminaryLevel
                :height="height"
                :class="shows.preliminaryLevel ? 'M-T-16' : ''"
                :expand="true"
              />
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
          </el-row>
        </el-col>
        <el-col v-if="showTimeLine" :span="span.right" class="layout-panel-el-main-wrapper-col">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>

    <el-footer class="layout-panel-el-footer-wrapper " :height="footerHeight">

      <template v-if="showFooter">
        <template v-if="showButton">
          <pure-button v-if="showSubmitButton" label="提交" :loading="submitButtonLoading" @click="submit" />
        </template>
        <pure-button
          v-if="hiddenSaveButton || showSaveButton"
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
import { mixins_base, } from '@/minxins/project';
import { mapGetters, mapMutations, } from 'vuex';
import AnswerInfo from '../panels/answerInfo.vue';
import FaultInfo from '../panels/faultInfo.vue';
import NeedInfo from '../panels/needInfo.vue';
import ProjectInfo from '../panels/projectInfo.vue';
import ResearchInfo from '../panels/researchInfo.vue';
import TimeLine from '../timeLine/index.vue';

import TechnicalAnalysis from '../panels/technicalAnalysis.vue';
import DemandAssess from '../panels/demandAssess.vue';
import DemandAnalysis from '../panels/demandAnalysis.vue';
import DemandReview from '../panels/demandReview.vue';
import PreliminaryLevel from '../panels/preliminaryLevel.vue';

export default {
  name: 'ItemSet',
  components: {
    AnswerInfo,
    FaultInfo,
    NeedInfo,
    ProjectInfo,
    ResearchInfo,
    TimeLine,
    TechnicalAnalysis,
    DemandAssess,
    DemandAnalysis,
    DemandReview,
    PreliminaryLevel,
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
    showTimeLine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      height: '',
      submitButtonLoading: false,
      saveButtonLoading: false,

    };
  },

  computed: {
    ...mapGetters(['userInfo']),

    footerHeight() {
      return (this.showFooter ? 60 : 16) + 'px';
    },
    shows() {
      const data = this.getterPanelGroupData;
      return {
        answer: !!data.orderInfo || false,
        fault: !!data.orderFault || false,
        demand: !!data.demand || false,
        research: !!data.investigate || false,
        // project: !!data.info || false,
        demandAnalysis: !!data.demandAnalysis || false,
        technicalAnalysis: !!data.technicalAnalysis || false,
        demandAssess: !!data.demandAssess || false,
        demandReview: !!data?.demandReview || false,
        preliminaryLevel: !!data.firstGrading || false,

      };
    },
    shows_answer_fault_num() {
      const _is = [this.shows.answer, this.shows.fault];
      return _is.filter(e => e).length;
    },
    shows_true() {
      return !!(Object.values(this.shows).filter((e) => e)).length;
    },
    span() {
      if (!this.showTimeLine) {
        return {
          left: 24,
          center: 0,
          right: 0,
        };
      }
      const left = this.shows_true ? 10 : 18;
      const center = this.shows_true ? 10 : 18;
      const right = this.shows_true ? 4 : 6;
      return {
        left: left,
        center: center,
        right: right,
      };
    },
    shows_true_num() {
      const {
        answer,
        fault,
        demand,
        research,
        technicalAnalysis,
        demandAssess,
        demandAnalysis,
        demandReview,
        preliminaryLevel,
      } = this.shows;
      const len = [answer,
        fault,
        demand,
        research,
        technicalAnalysis,
        demandAssess,
        demandAnalysis,
        demandReview,
        preliminaryLevel
      ];
      return len.filter(e => e).length || 1;
    },
    ItemCode() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
    //  现在在方案制定阶段，任何人都可以提交项目，现改为，只有项目负责人能提交项目，其他参与人员只能修改和保存项目。
    showSubmitButton() {
      if (Object.values(this.researchInfo).length) {
        const data = this.researchInfo;
        const users = [data.principal, data.createUser];
        return users.includes(this.userInfo.id);
      }
      return true;
    },

    // 只有项目的参与人才可以做保存
    showSaveButton() {
      if (Object.values(this.researchInfo).length) {
        if (this.researchInfo?.joinUser) {
          const users = this.researchInfo?.joinUser;
          return users.includes(this.userInfo.id);
        }
        return true;
      }
      return true;
    },
    // 判断是否是未提交状态下 和 其他状态下 的编辑
    showButton() {
      return !this.researchInfo.showState || this.researchInfo.showState === 'program_review_reject' || ['新增项目', '方案制定'].includes(this.title);
    },

  },
  async  mounted() {
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
      if (this.shows.demandReview) {
        name = 'demandReview';
      } else if (this.shows.demandAssess) {
        name = 'demandAssess';
      } else if (this.shows.fault) {
        name = 'faultInfo';
      } else if (this.shows.demand) {
        name = 'needInfo';
      } else {
        name = 'researchInfo';
      }
      this.SET_PANCEL_EXPAND({ name: name, expand: true, });
    },
    setDisabled() {
      if (this.shows.technicalAnalysis || this.demandAnalysis || this.shows.demandAssess || this.shows.demandReview) {
        this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'preliminaryLevel', disabled: true, });
      }
    },
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (35 * this.shows_true_num) - 16 * (this.shows_true_num - 1) - this.shows_answer_fault_num * 30 + 'px';
    },
    done() {
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['project'].submit('confirm');
        this.FETCH_PERFORM_EVENT({ name: 'process', });
        this.submitButtonLoading = false;

        this.done();
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      } finally {
        this.submitButtonLoading = false;
      }
    },
    async save() {
      try {
        this.saveButtonLoading = true;
        const rs = await this.$refs['project'].submit('save');
        this.FETCH_PERFORM_EVENT({ name: 'process', });
        this.saveButtonLoading = false;
        if (rs.itemCode) {
          if (this.researchInfo.showState === 'item_establish') {
            this.$emit('save');
            this.done();
          } else {
            this.done();
          }
        } else {
          this.$emit('save');
        }
      } catch (error) {
        this.saveButtonLoading = false;
        this.$message.error(error);
      }
    },
  },

};
</script>
<style lang='scss' scoped>
@import '../../style/project.scss'
</style>
