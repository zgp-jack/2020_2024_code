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
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="20">
          <el-row>
            <el-col :span="24">
              <Info expand :height="height" :disabled="Disabled" :data="data" />
            </el-col>
            <el-col :span="24" class="M-T-16">
              <Summary ref="summary" :disabled="Disabled" expand :height="height" :data="data" />
            </el-col>
          </el-row>
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col" :span="4">
          <TimeLine :data="data" />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper">
      <!-- <el-button type="primary" size="mini" @click="submit">保存纪要</el-button> -->
      <el-button type="primary" size="mini" @click="clickClose">关闭</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { mapMutations, } from 'vuex';
import Summary from './panels/summary.vue';
import Info from './panels/info.vue';
import TimeLine from '../timeLine/index.vue';
export default {
  components: {
    Summary,
    Info,
    TimeLine,
  },
  mixins: [],
  props: {
    optionsCode: {
      type: String,
      // look  add  updated
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
    };
  },

  computed: {
    Disabled() {
      return this.optionsCode === 'look';
    },
  },
  mounted() {
    this.computedHeight();
  },
  async created() {
    // meetingInfo
    this.SET_PANCEL_EXPAND({ name: 'summary', expand: true, });
  },
  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND']),
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (34 * 2) - 20 + 'px';
    },
    clickMetting() {
      this.SET_PANCEL_EXPAND({ name: 'summary', expand: true, });
    },
    done() {
      this.$emit('done');
    },
    clickClose() {
      this.done();
    },
    async submit() {
      try {
        await this.$refs['summary'].submit();
        // this.done();
      } catch (error) {
        this.$message.error(error);
      } finally {
        //
      }
    },
    async  save() {
      this.done();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "~@/views/project/style/project.scss";

</style>
