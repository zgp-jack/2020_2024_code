<!--
 预定会议 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title ">会议信息</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="24">
          <SummaryPanel ref="info" :disabled="disabled" :data="data" :height="height" />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper">

      <el-button v-if="!disabled" type="primary" :loading="submitButtongLoading" size="mini" @click="submit">提交纪要</el-button>
      <el-button
        size="mini"
        plain
        type="primary"
        class="layout-panel-el-footer-wrapper-save-button"
        @click="closeMeeting"
      >关闭</el-button>

    </el-footer>
  </el-container>
</template>

<script>
import SummaryPanel from './panels/summary.vue';
import moment from 'moment';

export default {
  name: 'ReservePanel',
  components: {
    SummaryPanel,
  },
  props: {
    optionsCode: {
      type: String,
      // add  updated  look
      default: 'add',
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      height: '',
      submitButtongLoading: false,
      disabled: false,
    };
  },

  computed: {

  },
  mounted() {
    this.computedHeight();
    this.ifCurrentTimeMoreItemEndTime();
  },
  methods: {
    ifCurrentTimeMoreItemEndTime() {
      if (this.optionsCode === 'updated') {
        const currentDate = moment().format('YYYY-MM-DD HH:mm');
        const data_currentDate = `${this.data.time} ${this.data.startTime}`;
        if (moment(currentDate).isSameOrBefore(data_currentDate, 'minute')) {
          //
        } else {
          this.disabled = true;
        }
      }
    },
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (34 * 1) - 20 + 'px';
    },
    closeMeeting() {
      this.$emit('done');
    },
    done() {
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtongLoading = true;
        await this.$refs['info'].submit();
        this.done();
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.submitButtongLoading = false;
      }
    },
    async  save() {
      await this.$refs['demand'].submit('save');
      this.done();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "~@/views/project/style/project.scss";

</style>
