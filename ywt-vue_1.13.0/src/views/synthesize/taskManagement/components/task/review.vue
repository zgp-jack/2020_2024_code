<!--  -->
<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item required :label="text">
      <el-input v-model="formData.reason" type="textarea" rows="4" />
    </el-form-item>
    <el-row>
      <el-col :span="24" class="t-r">
        <el-button type="primary" size="mini" @click="submit">
          确定
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  components: {
  },
  props: {

    states: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      formData: {
        reason: '',
      },
    };
  },
  computed: {
    text() {
      return (Number(this.states) === 1 ? '通过' : '驳回') + '原因';
    },
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$emit('done', this.formData);
    },
  },
};
</script>
<style lang='scss' scoped>
.t-r{
    text-align: right;
}
</style>
