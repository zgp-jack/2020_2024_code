<!--  -->
<template>
  <div class="dialog-panel">
    <ProjectInfo />
    <TimeLine />
  </div>
</template>

<script>
export default {
  components: {
    ProjectInfo: () => import('../panels/projectInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
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
