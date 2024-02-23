<!--
新增需求 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title ">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code ">{{ ItemCode }}</span>
    </el-header>
    <el-main class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="Span.left">
          <NeedInfo ref="demand" />
        </el-col>
        <el-col v-if="showTimeLine" class="layout-panel-el-main-wrapper-col" :span="Span.right">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper" :height="footerHeight">
      <template v-if="showFooter">
        <pure-button label="提交" :loading="submitButtonLoading" @click="submit" />
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
export default {
  components: {
    NeedInfo: () => import('../panels/needInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '需求信息',
    },
    hiddenSaveButton: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showTimeLine: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      submitButtonLoading: false,
      saveButtonLoading: false,
    };
  },

  computed: {
    footerHeight() {
      return (this.showFooter ? 60 : 16) + 'px';
    },
    Span() {
      return {
        left: this.showTimeLine ? 18 : 24,
        right: this.showTimeLine ? 6 : 0,

      };
    },
    ItemCode() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
  },
  mounted() {},
  methods: {
    done() {
      this.FETCH_PERFORM_EVENT({ name: 'process', });
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['demand'].submit('confirm');
        this.submitButtonLoading = false;
        this.done();
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      }
    },
    async  save() {
      try {
        this.saveButtonLoading = true;
        await this.$refs['demand'].submit('save');
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
<style lang='scss' scoped>
@import '../../style/project.scss';

</style>
