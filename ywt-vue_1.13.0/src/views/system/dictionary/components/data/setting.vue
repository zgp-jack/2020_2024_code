<!--  -->
<template>
  <el-form label-position="right" label-width="60px" size="mini">
    <el-form-item label="名称">
      转移原因
    </el-form-item>
    <el-form-item label="编码">
      <el-radio-group>
        <el-radio>单选</el-radio>
        <el-radio>多选</el-radio>

      </el-radio-group>
    </el-form-item>
    <el-form-item class="t-r">
      <el-button size="mini" type="primary">确定</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {};
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
<style lang='scss' scoped>
.t-r{
    text-align: right;
}
</style>
