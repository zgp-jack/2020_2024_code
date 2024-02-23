<!-- 评审 输入框 -->
<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="150px"
    size="mini"
    label-position="right"
    :rules="rule"
  >
    <el-form-item :label="title" prop="text">
      <el-input v-model="formData.text" type="textarea" rows="6" />
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';
export default {
  name: 'Content',
  components: {
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'reject',
    },
    isVote: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        text: '',
      },
      data: {
        itemCode: '',
        // rejectRemark: '',
        // nextRemark: '',
      },
      rule: {
        text: { required: true, trigger: 'blur', message: '请输入理由', },
      },
    };
  },
  computed: {
    ...mapState('project/index', ['itemCode', 'isSubmit', 'isDisabled']),
  },
  watch: {
    isSubmit(n, o) {
      if (n) {
        this.submit();
      }
    },
  },
  mounted() {
  },
  methods: {
    ...mapActions('project/index', ['FETCH_PERFORM_EVENT']),
    async submit() {
      if (this.isVote === false) {
        return this.$message.error('投票中，无法提交');
      }
      return new Promise((r, j) => {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.data.itemCode = this.itemCode;
            if (this.type === 'reject') {
              Object.assign(this.data, { rejectRemark: this.formData.text, });
            }
            if (this.type === 'next') {
              Object.assign(this.data, { nextRemark: this.formData.text, });
            }
            try {
              await ProjectAPI.demand.submitReview(this.data, this.type);
              this.$refs['form'].resetFields();
              this.$message.success('提交成功！');
              r(true);
            } catch (e) {
              j(e);
            }
          } else {
            j('表单校验未通过');
          }
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
