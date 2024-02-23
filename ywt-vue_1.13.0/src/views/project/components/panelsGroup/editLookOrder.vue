<!-- 编辑 查看 转工单 -->
<template>
  <div class="dialog-panel">

    <NeedInfo />
    <div style="display:flex;flex-direction: column;">
      <AnswerInfo height="auto" />

      <FaultInfo height="auto" />
    </div>
    <TimeLine />
  </div>
</template>

<script>
export default {
  components: {
    NeedInfo: () => import('../panels/needInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
    AnswerInfo: () => import('../panels/answerInfo.vue'),
    FaultInfo: () => import('../panels/faultInfo.vue'),

  },
  data() {
    return {};
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang='scss' scoped>
</style>
