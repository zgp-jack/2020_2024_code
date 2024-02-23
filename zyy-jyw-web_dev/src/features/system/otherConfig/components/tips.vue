<template>
  <div class="tips"><i class="el-icon-info" />{{ content }}</div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  background: #FFFCEF;
  font-size: 14px;
  color: #7C7546;
}
</style>
