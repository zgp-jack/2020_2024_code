<!-- 查看弹窗 -->
<template>
  <div style="height:100%;">
    <div style="display:flex;height:88%;">
      <informationPanel :isdisabled="true" />
      <history />
    </div>
    <el-button style="width:100px;margin:20px 0;" type="primary" size="mini">退出</el-button>
  </div>
</template>

<script>
import informationPanel from '@/views/inspection/components/panel/informationPanel';
import history from '@/views/inspection/components/panel/history';
export default {
  components: {
    informationPanel,
    history,
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },

};
</script>

<style lang="scss" scoped>
</style>
