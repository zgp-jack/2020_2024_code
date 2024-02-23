<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px" label-position="left">
    <el-form-item label="驳回原因" prop="desc">
      <el-input v-model="formData.desc" type="textarea" rows="4" />
    </el-form-item>
    <el-form-item class="t-r">
      <pure-button label="提交" @click="submit" />
    </el-form-item>
  </el-form>
</template>

<script>
import MeetingMangementApi from '@/apis/synthesize/mettingMangement/index';

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        desc: '',
      },
      rules: {
        desc: [{ required: true, message: '驳回原因不能为空', }],
      },
    };
  },
  methods: {
    submit() {
      try {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            await MeetingMangementApi.rejectOrPassMeeting({
              id: this.data.id,
              operState: 'meeting_not',
              remark: this.formData.desc,
            });
            this.$emit('done');
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.t-r{
  text-align: right;
}
</style>
