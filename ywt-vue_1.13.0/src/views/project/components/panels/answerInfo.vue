<!-- 接听信息 -->
<template>
  <JYWPanel
    :key="'answerInfo'"
    :p-k="'answerInfo'"
    title="接听信息"
    left-flag-title="接听人"
    :height="$attrs.height"
    :show-expand="$attrs.expand"
    :left-flag-value="formData.reception | member"
    :expand="expand"
    :disabled="true"
  >
    <template #bottom>
      <span v-if="formData.time">通话时间：<b>{{ formData.time | formatSeconds }}</b></span>
      <span v-if="formData.createTime">报修时间：<b>{{ formData.createTime }}</b></span>
    </template>
    <el-form
      ref="form"
      :model="formData"
      label-width="110px"
      size="mini"
      label-position="right"
      disabled
    >
      <el-form-item label="报修科室">
        <DepartmentCascader v-model="formData.deptId" class="w100" />
      </el-form-item>

      <el-form-item label="报修地址">
        <el-input v-model="formData.place" />

      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="报修人">
            <el-input v-model="formData.user" />

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修人电话">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="formData.recording" label="录音">
        <pure-audio :the-url="formData.recording" />
      </el-form-item>
    </el-form>
  </JYWPanel>
</template>

<script>
import { mapGetters, mapState, } from 'vuex';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import PureAudio from '@/components/audio/audio';

export default {
  name: 'AnswerInfo',
  components: {
    DepartmentCascader,
    PureAudio,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('project/index', {
      expand: (v) => {
        return v['pancelExpandOptions'].answerInfo;
      },
    }),
    ...mapGetters('project/index', ['getterPanelGroupData']),

    formData() {
      return this.getterPanelGroupData.orderInfo;
    },
  },
  mounted() {},
  created() {
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
