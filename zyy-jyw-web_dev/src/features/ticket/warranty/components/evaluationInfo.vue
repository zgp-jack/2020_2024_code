<template>
  <div class="evaluation drawer">
    <pure-panel-card class="panel-card">
      <div slot="header">
        评价信息
      </div>
      <div slot="subHeader">
        <span
          class="createUser"
        >评价人:
          <span>
            {{ evaluate.createUserName }}
          </span>
        </span>
        <span class="createTime">
          评价时间:
          <span>{{ evaluate.createTime }}</span>
        </span>
      </div>
    </pure-panel-card>
    <el-form ref="evaluationRef" :model="evaluate" :rules="rules" class="evaluate-form body" label-position="right" label-width="122px">
      <el-form-item
        label="服务态度:"
        prop="serviceAttitude"
      >
        <el-rate
          v-model="evaluate.serviceAttitude"
          show-score
          text-color="#ff9900"
        />
      </el-form-item>
      <el-form-item
        label="服务质量:"
        prop="serviceQuality"
      >
        <el-rate
          v-model="evaluate.serviceQuality"
          show-score
          text-color="#ff9900"
        />
      </el-form-item>
      <el-form-item
        label="响应时效:"
        prop="responsePrescription"
      >
        <el-rate
          v-model="evaluate.responsePrescription"
          show-score
          text-color="#ff9900"
        />
      </el-form-item>
      <el-form-item label="意见与建议:">
        <el-input
          v-model="evaluate.commentSuggestion"
          :rows="4"
          maxlength="1000"
          placeholder="有什么需要改进的"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="附件:">
        <el-col :span="22">
          <upload v-model="evaluate.enclosureList" />
        </el-col>
      </el-form-item>
    </el-form>
    <div class="footer">
      <pure-button
        label="确定"
        class="submit"
        @click="onSubmit"
      />
      <pure-button
        label="取消"
        type="primary"
        @click="onCancel"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, } from 'vuex';
import WarrantyApi from '../api';

export default {
  components: {
    Upload: () => import('@/common/components/upload'),
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {
        };
      },
    },
  },
  data() {
    return {
      evaluate: {
        orderNum: '',
        createUserName: '',
        createTime: null,
        serviceAttitude: null,
        serviceQuality: null,
        responsePrescription: null,
        commentSuggestion: '',
        enclosureList: [],
      },
      rules: {
        serviceAttitude: [
          { required: true, message: '请打分', },
        ],
        serviceQuality: [
          { required: true, message: '请打分', },
        ],
        responsePrescription: [
          { required: true, message: '请打分', },
        ],
      },
    };
  },
  computed: {
    ...mapState('APP_LOGIN', [
      'userInfo',
    ]),
  },
  watch: {
    data: {
      handler: function (val) {
        this.evaluate = {
          ...this.evaluate,
          orderNum: val.orderNum,
          createUserName: this.userInfo.nickName,
          createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onSubmit() {
      this.evaluate.serviceAttitude = this.evaluate.serviceAttitude || null;
      this.evaluate.serviceQuality = this.evaluate.serviceQuality || null;
      this.evaluate.responsePrescription = this.evaluate.responsePrescription || null;
      this.$refs.evaluationRef.validate(valid => {
        if (valid) {
          WarrantyApi.updateEvaluate(this.evaluate).then(res => {
            this.$message.success('评价成功');
            this.$emit('done');
          });
        } else {
          this.evaluate.serviceAttitude = this.evaluate.serviceAttitude || 0;
          this.evaluate.serviceQuality = this.evaluate.serviceQuality || 0;
          this.evaluate.responsePrescription = this.evaluate.responsePrescription || 0;
        }
      });
    },
    onCancel() {
      this.$emit('done');
    },
  },
};
</script>

<style lang="scss" scoped>
.evaluation {
  position: relative;
  height: 100%;
}
.panel-card {
  ::v-deep .pure-card__body {
    padding: 0;
    // overflow: unset;
  }
}
.createUser,
.createTime {
  color: #879bba;
  margin-right: 10px;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
.evaluate-form {
  padding: 16px;
  & ::v-deep .el-rate{
    line-height: 2;
  }
}
.footer{
  padding: 16px;
  justify-content: center;
  .submit {
    margin-right: 20px;
  }
}
</style>
