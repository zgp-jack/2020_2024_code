<!--
  项目看板  编辑项目使用
 -->
<template>
  <el-container>
    <el-header height="auto" class="layout-panel-el-header-wrapper">
      <span class="layout-panel-el-header-wrapper--title "> 项目信息</span>
      <span class="layout-panel-el-header-wrapper--code ">需求编号:{{ itemCode }}</span>
    </el-header>
    <el-main class="layout-panel-el-main-wrapper">
      <el-row class="layout-panel-el-main-wrapper-row">
        <el-col class="layout-panel-el-main-wrapper-col P-R-16" :span="18">
          <ProjectInfo ref="project" :where="'projectBoard'" />
        </el-col>
        <el-col class="layout-panel-el-main-wrapper-col" :span="6">
          <TimeLine />
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="layout-panel-el-footer-wrapper" height="60px">
      <pure-button label="提交" :loading="submitButtonLoading" @click="submit" />

    </el-footer>
  </el-container>
</template>

<script>
import ProjectInfo from '../panels/projectInfo.vue';
import TimeLine from '../timeLine/index.vue';

export default {
  components: {
    ProjectInfo,
    TimeLine,
  },
  props: {
    itemCode: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      submitButtonLoading: false,
    };
  },
  mounted() {},
  methods: {
    done() {
      this.$emit('done');
    },
    async submit() {
      try {
        this.submitButtonLoading = true;
        await this.$refs['project'].submit('confirm');
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
@import '../../style/project.scss';

</style>
