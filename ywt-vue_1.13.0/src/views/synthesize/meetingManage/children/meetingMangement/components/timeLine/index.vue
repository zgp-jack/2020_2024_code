<!--  -->
<template>
  <JYWPanel :width="248" title="历史流程" disabled>
    <el-timeline style="padding:0">
      <el-timeline-item v-for="v in result" :key="v.id" :timestamp="v.createTime" placement="top">
        <div class="progress-container">
          <p>
            {{ v.createUserName }}
          </p>
          <p>
            {{ v.processState }}
          </p>
          <p v-if="v.processState ==='审核会议'" class="flag">{{ v.operState }}</p>

        </div>
      </el-timeline-item>
    </el-timeline>
  </JYWPanel>
</template>

<script>
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';

export default {
  name: 'TimeLine',
  components: {
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      result: [],
    };
  },
  computed: {
    progress() {
      const value = this.Data;
      if (value?.length) {
        return value.reverse();
      }
      return [];
    },
    Data() {
      return this.data;
    },
    MeetingId() {
      return this.Data.id;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.result = await MeetingMangementApi.getMeetingProcess({ id: this.MeetingId, });
    },
  },
};
</script>
<style lang='scss' scoped>
.progress-container{
  color: #2D405E;
}
.flag{
height: 28px;
background: #ecf0f7;
border-radius: 4px;
font-size: 14px;
line-height: 28px;
font-weight: 400;
text-align: center;
color: #409eff;
}
</style>
