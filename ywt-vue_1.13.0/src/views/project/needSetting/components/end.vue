<!-- 终止 -->
<template>
  <el-dialog :visible.sync="visible" width="544px" :close-on-click-modal="false">
    <el-form label-position="rigth" label-width="100px">
      <el-form-item label="终止原因">
        <el-radio-group v-model="formData.radio">
          <el-radio label="1">
            不需要处理
          </el-radio>
          <el-radio label="2">
            重复需求或任务
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="终止说明">
        <el-input type="textarea" rows="5" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        raido: '1',
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
