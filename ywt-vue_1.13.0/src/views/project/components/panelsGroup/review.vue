<!-- 评审组合面板-->
<template>

  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title">{{ title }}</span>
      <span class="layout-panel-el-header-wrapper--code">{{ _itemCode }}</span>
    </el-header>
    <el-main ref="main" class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <ResearchReview ref="researchReview" />
        </el-col>
        <el-col :span="10" class="layout-panel-el-main-wrapper-col P-R-16">
          <el-row>
            <el-col :span="24">
              <NeedInfo ref="nInfo" expand :height="height" />
            </el-col>
            <el-col :span="24">
              <ResearchInfo ref="rInfo" expand :height="height" class="M-T-16" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4" class="layout-panel-el-main-wrapper-col">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper " :height="footerHeight">
      <template v-if="showFooter">
        <pure-button :disabled="IsITEM_AUDIT" label="提交" :loading="submitButtonLoading" @click="submit" />
      </template>
    </el-footer>
  </el-container>
</template>

<script>
import { mixins_base, } from '@/minxins/project';
import { mapMutations, mapState, } from 'vuex';
export default {
  components: {
    NeedInfo: () => import('../panels/needInfo.vue'),
    TimeLine: () => import('../timeLine/index.vue'),
    ResearchReview: () => import('../panels/researchReview.vue'),
    ResearchInfo: () => import('../panels/researchInfo.vue'),

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
  },

  data() {
    return {
      height: '',
      submitButtonLoading: false,
    };
  },

  computed: {
    ...mapState('login', {
      MyPerimissions: (v) => {
        return v.userInfo.permissions || [];
      },

    }),
    footerHeight() {
      return (this.showFooter ? 60 : 16) + 'px';
    },
    _itemCode() {
      if (this.itemCode) {
        return `需求编号:${this.itemCode}`;
      }
      return '';
    },
    // 是否是 itbp
    IsITEM_AUDIT() {
      return !this.MyPerimissions.includes('ITBP_MANAGER');
    },
  },
  updated() {
    // this.$nextTick(() => {
    //   this.computedHeight();
    // });
  },
  async created() {
    this.SET_PANCEL_EXPAND({ name: 'researchInfo', expand: true, });
  },
  mounted() {
    this.$nextTick(() => {
      this.computedHeight();
    });
  },
  methods: {
    ...mapMutations('project/index', ['SET_PANCEL_EXPAND']),
    computedHeight() {
      const mainClientHeight = this.$refs['main'].$el.clientHeight;
      this.height = mainClientHeight - (35 * 2) - 20 + 'px';
    },
    done() {
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['researchReview'].submit();
        this.submitButtonLoading = false;
        this.done();
      } catch (error) {
        this.submitButtonLoading = false;
        this.$message.error(error);
      }
    },

  },
};
</script>
<style lang='scss' scoped>
@import '../../style/project.scss'
</style>
