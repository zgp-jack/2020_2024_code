<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-02 10:11:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-10 11:42:05
 * @Description: 人员画像抽屉弹窗
-->
<template>
  <div
    class="drawer"
  >
    <div class="header">
      <div class="title">
        人员画像
      </div>
    </div>
    <div class="body">
      <base-info-panel v-bind="$attrs" v-on="$listeners" @createdBaseInfo="onCreatedBaseInfo" />
      <qualification-info-panel ref="qualificationInfoPanel" v-bind="$attrs" />
      <skill-info-panel ref="skillInfoPanel" v-bind="$attrs" />
      <work-experience-info-panel ref="workExperiencePanel" v-bind="$attrs" />
      <growth-plan-info-panel ref="growthPlanInfoPanel" v-bind="$attrs" />
      <research-project-info-panel ref="researchProjectInfoPanel" v-bind="$attrs" />
      <paper-info-panel ref="paperInfoPanel" v-bind="$attrs" />
    </div>
  </div>
</template>

<script>
import PersonaApi from '../api';
import BaseInfoPanel from '../panel/baseInfo';
import QualificationInfoPanel from '../panel/qualificationInfo';
import SkillInfoPanel from '../panel/skillInfo';
import WorkExperienceInfoPanel from '../panel/workExperienceInfo';
import GrowthPlanInfoPanel from '../panel/growthPlanInfo';
import ResearchProjectInfoPanel from '../panel/researchProjectInfo';
import PaperInfoPanel from '../panel/paperInfo';
export default {
  name: 'PersonaInfoDrawer',
  components: {
    BaseInfoPanel,
    QualificationInfoPanel,
    SkillInfoPanel,
    WorkExperienceInfoPanel,
    GrowthPlanInfoPanel,
    ResearchProjectInfoPanel,
    PaperInfoPanel,
  },
  data() {
    return {
      name: '人员画像',
      detailApi: PersonaApi.detail,
      needFetchDetail: false,
      baseInfoId: null,
    };
  },
  created() {
    this.baseInfoId = this.id;
  },
  methods: {
    onCreatedBaseInfo(id) {
      this.$refs.qualificationInfoPanel.tempPersonaId = id;
      this.$refs.skillInfoPanel.tempPersonaId = id;
      this.$refs.workExperiencePanel.tempPersonaId = id;
      this.$refs.growthPlanInfoPanel.tempPersonaId = id;
      this.$refs.researchProjectInfoPanel.tempPersonaId = id;
      this.$refs.paperInfoPanel.tempPersonaId = id;
    },
  },
};
</script>

<style lang="scss" scoped>
  .body {
    height: 100%;
    overflow: scroll;
    .card {
      height: 100%;
    }
     &::v-deep .pure-card__body {
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }

}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  // 面板统一样式
  .body ::v-deep .header {
      margin-bottom: 9px;
      margin-top: 9px;

      .title {
        font-size: 18px;
        color: #334266;
        width: 150px;
        padding-right: 0;
      }
  }

</style>
