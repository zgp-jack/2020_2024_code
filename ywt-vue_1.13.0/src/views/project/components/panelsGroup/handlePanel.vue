<!-- 评审弹窗 -->
<template>
  <div class="dialog-panel">
    <HandleInfo />
    <div>
      <AnswerInfo v-if="result.orderInfo && Object.values(result.orderInfo).length" :expand="true" />
      <FaultInfo v-if="result.orderFault && Object.values(result.orderFault).length" class="m-t-16" :expand="true" />
      <NeedInfo v-if="result.orderMake&& Object.values(result.orderMake).length" class="m-t-16" :expand="true" />
      <ResearchInfo v-if="result.demand&&Object.values(result.demand).length" class="m-t-16" :expand="true" />
      <ProjectInfo :class="result.demand&&Object.values(result.demand).length ? 'm-t-16':''" :expand="result.demand&&Object.values(result.demand).length" />

    </div>
    <TimeLine />
  </div>
</template>

<script>
import { mapMutations, } from 'vuex';
import { mixins_base, } from '@/minxins/project';
import ProjectAPI from '@/apis/project';
export default {
  name: 'HandlePanel',
  components: {
    HandleInfo: () => import('../panels/handleInfo.vue'),
    AnswerInfo: () => import('../panels/answerInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
    FaultInfo: () => import('../panels/faultInfo.vue'),
    NeedInfo: () => import('../panels/needInfo.vue'),
    ResearchInfo: () => import('../panels/researchInfo.vue'),
    ProjectInfo: () => import('../panels/projectInfo.vue'),
  },
  mixins: [mixins_base],
  data() {
    return {
      result: {},

    };
  },
  computed: {
  },
  async mounted() {
    this.result = await ProjectAPI.setUp.reviewInfo(this.itemCode);
    await this.FETCH_PANEL_DATA(this.result);
    this.SET_PANCEL_EXPAND({ name: 'projectInfo', expand: true, });
  },
  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND']),

  },
};
</script>
<style lang='scss' scoped>
.m-t-16 {
  margin-top: 16px;
}

</style>
