<!--  -->
<template>
  <el-container>
    <Order ref="order" is-vote />
    <el-footer class="el-footer-tag">
      <el-button type="primary" size="mini" @click="submit">
        提交
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  components: {
    Order: () => import('../../components/panels/childComponents/researchInfo/order.vue'),
  },
  computed: {
  },
  methods: {
    async submit() {
      await this.$refs['order'].submit();

      this.$emit('done',);
    },
  },
};
</script>
<style lang='scss' scoped>
.el-footer-tag{
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: flex-end;
}
</style>
