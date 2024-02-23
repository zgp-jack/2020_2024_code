<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-15 17:24:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-16 15:16:55
 * @Description:审批信息
-->
<template>
  <pure-card class="card">
    <div slot="header">
      审批信息
      <span class="title-desc">
        审批人:
        <span>{{ userInfo.name }}</span>
      </span>
      <span class="title-desc">
        审批时间:
        <span>{{ currentDateTime }}</span>
      </span>
    </div>
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="102px"
      size="mini"
    >
      <el-form-item label="审批结果">
        <el-radio-group v-model="formData.state">
          <el-radio label="pass">通过</el-radio>
          <el-radio label="reject">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </pure-card>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import moment from 'moment';
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        state: 'pass',
        remark: '',

      },
      currentDateTime: '',
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  async created() {
    this.currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },

  methods: {
    check() {
      return {
        id: this.id,
        ...this.formData,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  &::v-deep .pure-card__body {
    height: calc(100% - 71px)
  }
}
.title-desc {
  font-size: 12px;
  font-weight: 400;
  color: #879bba;
  line-height: 12px;
  margin-left: 24px;
  span {
    color: #2d405e;
  }
}
</style>
