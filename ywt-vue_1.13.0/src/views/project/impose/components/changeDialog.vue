<!-- 变更申请弹窗 -->
<template>
  <el-container class="wrapper">
    <el-main>
      <el-form label-position="right" label-width="100px">
        <el-form-item label="项目名称">
          <span>
            {{ data.title }}
          </span>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="申请人">
            <span>
              {{ userInfo.name }}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间">
            <span>
              {{ new Date() | date('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </el-form-item>
        </el-col>

        <el-form-item label="变更原因">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            :maxlength="255"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer class="tag-footer">
      <pure-button label="提交" :loading="submitButtonLoading" @click="onSubmit" />
    </el-footer>
  </el-container>

</template>

<script>
import { mapState, } from 'vuex';
import ProjectAPI from '@/apis/project';
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
        itemCode: '',
        remark: '',
      },
      submitButtonLoading: false,
    };
  },
  computed: {
    ...mapState('login', ['userInfo']),
  },
  mounted() {
  },

  methods: {

    async onSubmit() {
      try {
        this.submitButtonLoading = true;
        this.formData.itemCode = this.data.itemCode;
        await ProjectAPI.impose.changeApply(this.formData, 'apply');
        this.submitButtonLoading = false;
        this.$message.success('操作成功');
        this.$emit('done');
      } catch (e) {
        this.submitButtonLoading = false;
        this.$message.error(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex{
  display: flex;
   >span{
     flex: none !important;
     margin-right: 16px;
   }
}

.info {
  &-wrapper {
    span,
    small {
      font-size: 18px;
      font-weight: 400;
      display: inline-block;
    }
    span {
      color: #879bba;
    }
    small {
      color: #2d405e;
    }
  }
  &-col {
    margin-bottom: 16px;
  }
}
.tag {
  &-footer {
    padding: 0;
    margin: 0;
    text-align: right;
    line-height: 60px;
  }
}
</style>
