<!-- 调研组合面板-->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code ">{{ _itemCode }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="10">
          <template v-if="Shows.investigate">
            <ResearchInfo ref="research" />
          </template>
          <template v-if="!Shows.investigate && Shows.demand">
            <NeedInfo />
          </template>
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="10">
          <el-row>
            <el-col v-if="Shows.answer" :span="24">
              <AnswerInfo :height="height" :expand="true" />
            </el-col>
            <el-col v-if="Shows.fault" :span="24">
              <FaultInfo :height="height" class="M-T-16" :expand="true" />
            </el-col>
            <el-col v-if="Shows.investigate && Shows.demand" :span="24">
              <NeedInfo
                :height="height"
                :class="Shows.fault ? ' M-T-16' : ''"
                :expand="true"
              />
            </el-col>
          </el-row>
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col" :span="4">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper" :height="footerHeight">
      <template v-if="showFooter">
        <pure-button
          label="提交"
          :loading="submitButtonLoading"
          @click="submit"
        />

        <pure-button
          v-if="hiddenSaveButton"
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
import AnswerInfo from '../panels/answerInfo.vue';
import FaultInfo from '../panels/faultInfo.vue';
import NeedInfo from '../panels/needInfo.vue';
import ResearchInfo from '../panels/researchInfo.vue';
import TimeLine from '../timeLine/index.vue';
import { mapMutations, } from 'vuex';

export default {
  components: {
    AnswerInfo,
    FaultInfo,
    NeedInfo,
    ResearchInfo,
    TimeLine,
  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '',
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
    Shows() {
      const data = this.getterPanelGroupData;
      return {
        answer: !!data?.orderInfo || false,
        fault: !!data?.orderFault || false,
        demand: !!data?.demand || false,
        investigate: !!data.investigate || false,
      };
    },
    StateShows() {
      const { answer, fault, demand, investigate, } = this.Shows;
      let shows = [];
      if (investigate) {
        shows = [answer, fault, demand];
      } else {
        shows = [answer, fault];
      }
      return shows;
    },
    ShowsTrue() {
      const Shows = Object.values(this.StateShows);
      const trues = Shows.filter(e => e);
      const num = trues.length;
      return num;
    },
    ShowsAnswerFaultNum() {
      const { answer, fault, } = this.Shows;
      const val = [answer, fault];
      const trues = val.filter(e => e);
      const num = trues.length;
      return num;
    },
  },
  mounted() {
    this.setExpand();
    this.setDisabled();

    this.$nextTick(() => {
      this.computedHeight();
    });
  },
  methods: {
    ...mapMutations('project/index', [
      'SET_PANCEL_EXPAND',
      'SET_PANCEL_DISABLED'
    ]),
    setDisabled() {
      if (
        this.Shows.demandAnalysis ||
        this.Shows.technicalAnalysis ||
        this.Shows.DemandReview
      ) {
        this.SET_PANCEL_DISABLED({ name: 'demandAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'technicalAnalysis', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandAssess', disabled: true, });
        this.SET_PANCEL_DISABLED({ name: 'demandReview', disabled: true, });
      }
    },
    setExpand() {
      let name = '';
      if (this.Shows.investigate) {
        name = 'needInfo';
      } else if (this.Shows.demand) {
        name = 'faultInfo';
      }
      this.SET_PANCEL_EXPAND({ name: name, expand: true, });
    },
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height =
        mainClientHeight -
        35 * this.ShowsTrue -
        16 * (this.ShowsTrue - 1) -
        this.ShowsAnswerFaultNum * 30 +
        'px';
    },
    done() {
      this.FETCH_PERFORM_EVENT({ name: 'process', });
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['research'].submit('confirm');
        this.submitButtonLoading = false;
        this.done();
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      }
    },
    async save() {
      try {
        this.saveButtonLoading = true;
        await this.$refs['research'].submit('save');
        this.saveButtonLoading = false;
        this.done();
      } catch (error) {
        this.saveButtonLoading = false;
        this.$message.error(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../style/project.scss";
</style>
