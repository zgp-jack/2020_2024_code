<template>
  <el-popover placement="bottom" width="400" trigger="hover" :open-delay="1000">
    <div slot="reference" class="text-show" :style="showTextStyle">
      {{ content }}
    </div>
    <el-container class="text-wrapper">
      <el-main>
        {{ content }}
      </el-main>
      <el-footer class="text-wrapper-footer" height="auto">
        <el-button
          v-clipboard:copy="content"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
          size="mini"
          type="primary"
        >
          复制
        </el-button>
      </el-footer>
    </el-container>
  </el-popover>
</template>

<script>
export default {
  props: {
    textContent: {
      type: [String, Number, Array, Object],
      default: () => {
        return '';
      },
    },
    wrap: {
      type: [Number],
      default: 4,
    },
  },
  computed: {
    content() {
      const str = this.textContent.toString();
      return str;
    },
    showTextStyle() {
      return {
        '-webkit-line-clamp': this.wrap,
        'line-height': 1.3,
        'flex': 1,
      };
    },
  },
  methods: {
    copySuccess() {
      this.$notify({
        title: '提示',
        message: '复制成功',
        type: 'success',
      });
    },
    copyError() {
      this.$notify({
        title: '提示',
        message: '复制失败',
        type: 'error',
      });
    },
  },
};
</script>

<style lang="scss">
.text {
  width: 100%;
  font-size: 14px;
  &-show {
    // line-height: 18px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
  &-wrapper{
    height: auto;
    max-height: 380px;
    overflow:auto;
    &-footer{
      padding: 0 !important;
    text-align: right;
    }
  }
}
</style>
