<!--
分配调研 组合面板
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title ">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code ">{{ _itemCode }}</span>
    </el-header>
    <el-main class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <Assign ref="assign" />
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="10">
          <NeedInfo ref="demand" />
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col" :span="4">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper" :height="footerHeight">
      <template v-if="showFooter">
        <pure-button label="提交" :loading="submitButtonLoading" @click="submit" />
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
    Assign: () => import('../panels/assign.vue'),
  },
  mixins: [mixins_base],
  props: {
    title: {
      type: String,
      default: '调研成员分配',
    },
    hiddenSaveButton: {
      type: Boolean,
      default: true,
    },
    showFooter: {
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
    _itemCode() {
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
        await this.$refs['assign'].submit();
        this.submitButtonLoading = false;
        this.done();
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      } finally {
        this.submitButtonLoading = false;
      }
    },

  },
};
</script>
<style lang='scss' scoped>
@import '../../style/project.scss';

</style>
