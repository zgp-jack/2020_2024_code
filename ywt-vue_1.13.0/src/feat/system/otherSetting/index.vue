<template>
  <el-container>
    <el-main class="setting-box">
      <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="报障" @change="handleTabChange" />
      <component :is="currentTabComponent" ref="tableComponent" :id-key="currentTabComponent" @update="updateRedData" />
    </el-main>
  </el-container>
</template>
<script>
import PureButtonGroup from '@/components/button/buttonGroup.vue';
import reportFault from './reportFault'; // 报障
import bigScreen from './bigScreen';
import project from './project';

export default {
  name: 'XtszQtsz',
  components: {
    PureButtonGroup,
    reportFault,
    bigScreen,
    project,
  },
  mixins: [],
  data() {
    return {
      groupBtnOptions: [
        {
          count: null,
          name: '报障',
        },
        {
          count: null,
          name: '项目',
        },
        {
          count: null,
          name: '大屏',
        }

      ],
      currentTabComponent: 'reportFault',
    };
  },
  computed: {
  },
  created() {

  },
  methods: {
    handleTabChange(val) {
      switch (val) {
        case '报障':
          this.currentTabComponent = 'reportFault';
          break;
        case '大屏':
          this.currentTabComponent = 'bigScreen';
          break;
        case '项目':
          this.currentTabComponent = 'project';
          break;
      }
    },
    updateRedData() {

    },
  },
};
</script>

<style lang="scss" scoped>
.setting-box{
  background: #fff;
  padding: 10px;
  overflow: scroll;
}
</style>
